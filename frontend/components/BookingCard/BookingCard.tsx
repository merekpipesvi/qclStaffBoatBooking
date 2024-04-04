import { Button, ButtonProps, Flex, Group, Modal, Paper, Stack, Text } from '@mantine/core';
import { format } from 'date-fns';
import { useDisclosure } from '@mantine/hooks';
import React from 'react';
import { ISO_DATE_FORMAT, NUM_BOATS, STRING_DATE_FORMAT } from '@/utils/constants';
import { useDeleteMyBookingMutation, useGetUsersForBookingQuery, usePostMyBookingMutation } from '@/services/bookingsApi';
import { useAppSelector } from '@/utils/reduxHooks';
import { selectCurrentUser } from '@/state/authSelectors';
import { WeatherIcon } from '../WeatherIcon/WeatherIcon';
import styles from './BookingCard.module.css';
import { GetUserForBookingModel } from '@/models/user.model';
import { BookingTable } from '../BookingTable/BookingTable';
import { useGetBoatsUnavailableQuery } from '@/services/boatsApi';

type BookingCardType = { date: Date; isMorningBooking?: boolean };

const ModalTitle = ({ date, isMorningBooking } : BookingCardType) => {
    const { data } = useGetBoatsUnavailableQuery();
    const dateString = format(date, STRING_DATE_FORMAT);
    const ISODateString = format(date, ISO_DATE_FORMAT);
    const boatsAvailable = NUM_BOATS - (data?.[ISODateString]?.length ?? 0);
    return (
        <Group p={10} pl="2rem" pr="2rem" justify="space-between" w="100%">
            <Stack gap={0}>
                <Text fz="xl" fw={700}>{dateString}</Text>
                {isMorningBooking === undefined ? null :
                <Text size="md" fw={400} c="gray">{isMorningBooking ? '7am - 12pm' : '12pm - 5pm'}</Text>}
            </Stack>
            <Group gap={0}>
                <Text fw={700} fz="lg">{boatsAvailable}</Text>
                &nbsp;
                <Text fz="md">{`boat${boatsAvailable === 1 ? '' : 's'} available`}</Text>
            </Group>
        </Group>
    );
};

export const BookingCard = ({ date, isMorningBooking } : BookingCardType) => {
    const dateString = format(date, STRING_DATE_FORMAT);
    const ISODateString = format(date, ISO_DATE_FORMAT);
    const [createBooking, { status: createBookingStatus }] = usePostMyBookingMutation();
    const [deleteMyBooking, { status: deleteBookingStatus }] = useDeleteMyBookingMutation();

    const {
        points: myPoints,
        firstName: myFirstName,
        lastName: myLastName,
    } = useAppSelector(selectCurrentUser)!;

    const myPotentialObject: GetUserForBookingModel = {
        firstName: myFirstName,
        lastName: myLastName,
        points: myPoints,
        isPriority: false,
        timeBooked: new Date(),
        isMe: true,
    };

    const {
        totalOnWaitlist,
        usersWithFewerPoints,
        isSuccess: isGetUsersSuccessful,
        orderedList,
        hasCurrentUserBooked,
        isFetching: isGetUserFetching,
    } = useGetUsersForBookingQuery(
        { date: ISODateString, isMorningBooking },
        { selectFromResult: ({ data, isSuccess, isFetching }) => {
            // index of myBooking. -1 if I don't have one
            const myBookingIndex = data?.findIndex(({ isMe }) => isMe) ?? -1;
            // index of where I would fit.
            const myPotentialIndex = data?.findIndex(
                ({ points, isPriority }) => points > myPoints && !isPriority);
            // adjust index to accomodate if I should be last
            const adjustedMyPotentialIndex = myPotentialIndex === -1 ?
                (data?.length ?? 0) : myPotentialIndex;
            return ({
                totalOnWaitlist: data?.length ?? 0,
                usersWithFewerPoints: data?.filter(
                    ({ points, isPriority, isMe }) =>
                        points <= myPoints && !isPriority && !isMe
                ),
                isSuccess,
                isFetching,
                // if I already have a booking, return the response. Otherwise, add a dummy row to show where I would fit.
                orderedList: myBookingIndex > -1 ? data :
                    [
                        ...data?.slice(0, adjustedMyPotentialIndex) ?? [],
                        myPotentialObject,
                        ...data?.slice(adjustedMyPotentialIndex, data.length) ?? [],
                    ],
                hasCurrentUserBooked: myBookingIndex > -1,
            });
        },
        }
    );

    const DisplayContentsButton = (props: ButtonProps) => (<Button {...props} variant="default" onClick={open} />);
    const [opened, { open, close }] = useDisclosure(false);

    useGetBoatsUnavailableQuery();

    return (
        <>
            <Paper
              p="md"
              radius="xs"
              withBorder
              shadow="lg"
              w="14rem"
              h="16rem"
              component={DisplayContentsButton}
              key={`${dateString}-${isMorningBooking === false ? '2' : '1'}`}
              disabled={isGetUserFetching}
            >
                <Flex direction="column" justify="flex-start" h="100%">
                    <WeatherIcon dateString={ISODateString} className={styles.weatherIcon} />
                    <Stack gap={0}>
                        <Text size="lg" fw={500}>
                            {format(date, 'EEEE')}
                        </Text>
                        <Text size="lg" fw={500}>
                            {dateString}
                        </Text>
                        {isMorningBooking === undefined ?
                            null :
                            <Text size="lg" fw={400} c="gray">
                                {isMorningBooking ? '7am - 12pm' : '12pm - 5pm'}
                            </Text>
                        }
                    </Stack>
                    {isGetUsersSuccessful ?
                        <Stack gap={0} className={styles.waitlist}>
                            <Group gap={0}>
                                <Text size="md" fw={500}>
                                    {totalOnWaitlist}
                                </Text>
                                <Text size="sm" c="gray">
                                    &nbsp;{`${totalOnWaitlist === 1 ? 'person' : 'people'} signed up`}
                                </Text>
                            </Group>
                            <Group gap={0}>
                                <Text size="md" fw={500}>
                                    {usersWithFewerPoints?.length ?? 0}
                                </Text>
                                <Text size="sm" c="gray">
                                    &nbsp;{`${(usersWithFewerPoints?.length ?? 0) === 1 ? 'is' : 'are'} higher priority`}
                                </Text>
                            </Group>
                        </Stack>
                    : null}
                </Flex>
            </Paper>
            <Modal opened={opened} onClose={close} title={<ModalTitle isMorningBooking={isMorningBooking} date={date} />} size="auto" yOffset="15rem">
                <BookingTable data={orderedList} hasCurrentUserBooked={hasCurrentUserBooked} />
                <Group justify="flex-end" p="2rem 1rem 0.25rem 0">
                    <Button onClick={close} variant="default">
                        Cancel
                    </Button>
                    <Button
                      onClick={async () => {
                        if (hasCurrentUserBooked) {
                            await deleteMyBooking({
                                date: ISODateString,
                                isMorningBooking,
                            });
                        } else {
                            await createBooking({
                                date: ISODateString,
                                isMorningBooking,
                            });
                        }
                        close();
                      }
                    }
                      disabled={isGetUserFetching || createBookingStatus === 'pending' || deleteBookingStatus === 'pending'}
                    >
                        {hasCurrentUserBooked ? 'Remove me' : 'Sign up'}
                    </Button>
                </Group>
            </Modal>
        </>
    );
};

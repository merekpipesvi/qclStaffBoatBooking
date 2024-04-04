import { Button, Paper, Stack, Text } from '@mantine/core';
import { format, isAfter, isBefore, setHours, setMinutes, subDays } from 'date-fns';
import styles from './Confirmation.module.css';
import { useConfirmMyBookingMutation, useGetMyBookingsNeedingConfirmationQuery, useUnconfirmMyBookingMutation } from '@/services/bookingsApi';
import { STRING_DATE_FORMAT } from '@/utils/constants';

const NoConfirmationsAvailable = ({ isAfterCutOff, hasNoBookings }:
    { isAfterCutOff: boolean; hasNoBookings: boolean }) => (
        <Paper p="5rem">
            {hasNoBookings ?
            <Stack ta="center" w="22rem">
                <Text fw={700}>No bookings needing confirmation today.</Text>
                <Text>
                    If you&apos;ve already confirmed your booking,
                    you will get an email assigning you a boat at 10pm
                </Text>
            </Stack> :
            <Stack ta="center">
                <Text fw={700}>You&apos;ve missed the cutoff point!</Text>
                <Text>{`Boats have already been assigned for ${format(subDays(new Date(), isAfterCutOff ? 0 : 1), STRING_DATE_FORMAT)}.`}</Text>
            </Stack>}
        </Paper>
    );

export const ConfirmationPaper = () => {
    const currentDate = new Date();
    // Check if it's currently after 10pm
    const isAfterCutOff = isAfter(currentDate, setHours(setMinutes(new Date(), 0), 22));

    // Check if it's currently before 8pm
    const isBeforeConfirmation = isBefore(currentDate, setHours(setMinutes(new Date(), 0), 20));
    const { data, refetch: refetchBookings } = useGetMyBookingsNeedingConfirmationQuery(undefined, {
        skip: isAfterCutOff || isBeforeConfirmation,
    });
    const [confirmMyBooking] = useConfirmMyBookingMutation();
    const [unconfirmMyBooking] = useUnconfirmMyBookingMutation();

    return (
        <div className={styles.container}>
            {isAfterCutOff || isBeforeConfirmation || data?.length === 0 ?
            <NoConfirmationsAvailable
              isAfterCutOff={isAfterCutOff}
              hasNoBookings={data?.length === 0}
            /> :
            (data ?? []).map(({ isMorningBooking, date, bookingId, isConfirmed }) => (
                <Paper>
                    <Stack p="lg" gap={0} ta="center">
                        <Text size="lg">{format(date, STRING_DATE_FORMAT)}</Text>
                        {isMorningBooking === undefined ? null :
                            <Text size="lg" fw={400} c="gray">
                                {isMorningBooking ? '7am - 12pm' : '12pm - 5pm'}
                            </Text>
                        }
                    </Stack>
                    <Stack p="lg" gap={0}>
                        <Button
                          onClick={async () => {
                            if (isConfirmed) {
                                await unconfirmMyBooking({ bookingId });
                            } else {
                                await confirmMyBooking({ bookingId });
                            }
                            refetchBookings();
                        }}
                        >
                            {`${isConfirmed ? 'Unconfirm' : 'Confirm'} booking`}
                        </Button>
                        {isConfirmed ? null : <Text size="xs">Ignore this to keep it unconfirmed</Text>}
                    </Stack>
                </Paper>
            ))
           }
        </div>
    );
};

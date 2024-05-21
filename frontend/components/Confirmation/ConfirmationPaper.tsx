import { Button, Paper, Stack, Text } from '@mantine/core';
import { addDays, format, isAfter, isBefore, setHours, setMinutes, subDays } from 'date-fns';
import styles from './Confirmation.module.css';
import { useConfirmMyBookingMutation, useGetMyBookingsNeedingConfirmationQuery, useUnconfirmMyBookingMutation } from '@/services/bookingsApi';
import { STRING_DATE_FORMAT } from '@/utils/constants';
import { useCutOffTimes } from '@/utils/useCutoffDates';

const NoConfirmationsAvailable = ({ isAfterCutOff, hasNoBookings }:
    { isAfterCutOff: boolean; hasNoBookings: boolean }) => (
        <Paper p="5rem">
            {hasNoBookings ?
            <Stack ta="center" w="22rem">
                <Text fw={700}>No bookings needing confirmation today.</Text>
            </Stack> :
            <Stack ta="center">
                <Text fw={700}>You&apos;ve missed the confirmation cutoff point!</Text>
                <Text>{`Boats have already been assigned for ${format(addDays(new Date(), isAfterCutOff ? 1 : 0), STRING_DATE_FORMAT)}.`}</Text>
            </Stack>}
        </Paper>
    );

export const ConfirmationPaper = () => {
    const { isAfterConfirmCutOff, isAfterSignUpCutOff} = useCutOffTimes();
    const isOutOfConfirmationWindow = isAfterConfirmCutOff || !isAfterSignUpCutOff;
    const { data, refetch: refetchBookings } = useGetMyBookingsNeedingConfirmationQuery(undefined, {
        skip: isOutOfConfirmationWindow,
    });
    const [confirmMyBooking] = useConfirmMyBookingMutation();
    const [unconfirmMyBooking] = useUnconfirmMyBookingMutation();
    return (
        <div className={styles.container}>
            {isOutOfConfirmationWindow || data?.length === 0 ?
            <NoConfirmationsAvailable
              isAfterCutOff={isAfterConfirmCutOff}
              hasNoBookings={data?.length === 0}
            /> :
            (data ?? []).map(({ isMorningBooking, date, bookingId, isConfirmed }) => (
                <Paper key={`${isMorningBooking}-${date}`}>
                    <Stack p="lg" gap={0} ta="center">
                        <Text size="lg">{format(date, STRING_DATE_FORMAT)}</Text>
                        {isMorningBooking == null ? null :
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

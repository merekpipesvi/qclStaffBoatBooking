import { eachDayOfInterval, getDay, parseISO } from 'date-fns';
import { Group } from '@mantine/core';
import { useGetDaysQuery } from '@/services/daysApi';
import { useGetStartEndDate } from './useGetStartEndDate';
import { BookingCard, BookingCardUser } from '../BookingCard/BookingCard';
import styles from './BookingList.module.css';

export const BookingList = ({
    adminStartDateString,
    adminEndDateString,
    user,
} : {
    adminStartDateString?: string;
    adminEndDateString?: string;
    user?: BookingCardUser;
} = {}) => {
    const { startDateString, endDateString } = useGetStartEndDate();
    const { allDates } = useGetDaysQuery(
        undefined,
        { selectFromResult: ({ data }) => {
            if (data === undefined) {
                return {};
            }
            const datesArr = eachDayOfInterval(
                {
                    start: parseISO(adminStartDateString ?? startDateString),
                    end: parseISO(adminEndDateString ?? endDateString),
                }
            );
                return (
                    { allDates: datesArr.map(
                        (date) => ({ date, isHalfDay: data[getDay(date)].isHalfDay === 1 })),
                    }
                );
            } }
    );

    return (
        <div className={styles.container}>
            <Group gap="4rem">
                {allDates?.map(({ date, isHalfDay }) =>
                    isHalfDay ?
                    [<BookingCard date={date} isMorningBooking user={user} />,
                        <BookingCard date={date} isMorningBooking={false} user={user} />]
                    : <BookingCard date={date} user={user} />
                ).flat()}
            </Group>
        </div>
    );
};

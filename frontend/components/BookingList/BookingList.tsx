import { eachDayOfInterval, getDay, parseISO } from 'date-fns';
import { Group } from '@mantine/core';
import { useGetDaysQuery } from '@/services/daysApi';
import { useGetStartEndDate } from './useGetStartEndDate';
import { BookingCard } from '../BookingCard/BookingCard';
import styles from './BookingList.module.css';

export const BookingList = () => {
    const { startDateString, endDateString } = useGetStartEndDate();
    const { allDates } = useGetDaysQuery(
        undefined,
        { selectFromResult: ({ data }) => {
            if (data === undefined) {
                return {};
            }
            const datesArr = eachDayOfInterval(
                { start: parseISO(startDateString), end: parseISO(endDateString) }
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
                    [<BookingCard date={date} isMorningBooking />,
                        <BookingCard date={date} isMorningBooking={false} />]
                    : <BookingCard date={date} />
                ).flat()}
            </Group>
        </div>
    );
};

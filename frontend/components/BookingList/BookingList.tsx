import { eachDayOfInterval, format, parseISO } from 'date-fns';
import { Group } from '@mantine/core';
import { skipToken } from '@reduxjs/toolkit/query';
import { useGetHalfDaysQuery } from '@/services/halfDaysApi';
import { useGetStartEndDate } from './useGetStartEndDate';
import { BookingCard, BookingCardUser } from '../BookingCard/BookingCard';
import styles from './BookingList.module.css';
import { ISO_DATE_FORMAT } from '@/utils/constants';

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
    const { allDates } = useGetHalfDaysQuery(
        endDateString === '' ? skipToken : { endDate: endDateString },
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

            const halfDaysSet = new Set(data);
                return (
                    { allDates: datesArr.map(
                        (date) => (
                            { date, isHalfDay: halfDaysSet.has(format(date, ISO_DATE_FORMAT)) }
                        )),
                    }
                );
            } }
    );

    return (
        <div className={styles.container}>
            <Group gap="4rem">
                {allDates?.map(({ date, isHalfDay }, index) =>
                    isHalfDay ?
                    [<BookingCard date={date} isMorningBooking user={user} key={`${index}-morning`} />,
                        <BookingCard date={date} isMorningBooking={false} user={user} key={`${index}-evening`} />]
                    : <BookingCard date={date} user={user} key={index} />
                ).flat()}
            </Group>
        </div>
    );
};

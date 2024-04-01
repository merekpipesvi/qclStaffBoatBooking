import { Paper } from '@mantine/core';
import { DatePickerInput } from '@mantine/dates';
import React from 'react';
import { useRouter } from 'next/router';
import { addDays, format } from 'date-fns';
import styles from './BookingListSubHeader.module.css';
import { END_URL_ARG, ISO_DATE_FORMAT, NUM_DAYS_BOOKABLE, START_URL_ARG } from '@/utils/constants';

export const BookingListSubHeader = () => {
    const [value, setValue] = React.useState<[Date | null, Date | null]>([null, null]);
    const router = useRouter();

    React.useEffect(() => {
        if (value.every((date) => date != null)) {
            router.replace(`/bookingList/?${START_URL_ARG}=${format(value[0]!, ISO_DATE_FORMAT)}&${END_URL_ARG}=${format(value[1]!, ISO_DATE_FORMAT)}`);
            setValue([null, null]);
        }
    }, [router, value]);
    return (
        <Paper bg="qclRed" radius="0" className={styles.paper} p="0.5rem">
            <DatePickerInput
              type="range"
              placeholder="Change the date range your viewing..."
              value={value}
              w={500}
              radius="md"
              fw="100%"
              onChange={setValue}
              minDate={new Date()}
              maxDate={addDays(new Date(), NUM_DAYS_BOOKABLE)}
              popoverProps={{ position: 'bottom' }}
              weekendDays={[]}
              allowSingleDateInRange
            />
        </Paper>
);
};

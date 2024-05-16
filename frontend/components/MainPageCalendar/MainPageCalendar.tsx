import { Button, Group, Paper, PaperProps, Stack, Text } from '@mantine/core';
import { DatePicker, DatePickerInput } from '@mantine/dates';
import { addDays, format, isSameMonth, startOfToday, startOfTomorrow } from 'date-fns';
import React from 'react';
import { useRouter } from 'next/router';
import styles from './MainPageCalendar.module.css';
import { END_URL_ARG, ISO_DATE_FORMAT, NUM_DAYS_BOOKABLE, START_URL_ARG } from '@/utils/constants';
import { useCutOffTimes } from '@/utils/useCutoffDates';

export const MainPageCalendar = (props: PaperProps) => {
    const [value, setValue] = React.useState<[Date | null, Date | null]>([null, null]);
    const { isAfterSignUpCutOff } = useCutOffTimes();
    const minDate = isAfterSignUpCutOff ? startOfTomorrow() : startOfToday();
    const maxDate = addDays(new Date(), NUM_DAYS_BOOKABLE);
    const numColumns = isSameMonth(maxDate, minDate) ? 1 : 2;
    const router = useRouter();

    return (
        <div className={styles.container}>
            <Paper radius="md" p="xl" withBorder className={styles.paper} {...props}>
                <Stack align="center" gap={0}>
                    <Text size="" fw={600}>
                        Select a date range to view...
                    </Text>
                    <Text size="sm" fw={400} c="gray">
                        Boats are available 7 days in advance
                    </Text>
                </Stack>
                <DatePickerInput
                  type="range"
                  placeholder="Pick a date range to view"
                  value={value}
                  w={350}
                  readOnly
                  radius="xl"
                  fw={500}
                />
                <DatePicker
                  type="range"
                  allowSingleDateInRange
                  value={value}
                  onChange={setValue}
                  minDate={minDate}
                  maxDate={addDays(new Date(), NUM_DAYS_BOOKABLE)}
                  weekendDays={[]} // Weekend days are a different colour, we don't want that
                  numberOfColumns={numColumns}
                />
                <Group w="100%" justify="right" p="0.5rem 0 0 0">
                    <Button disabled={value.some((date) => date === null)} onClick={() => router.push(`/bookingList/?${START_URL_ARG}=${format(value[0]!, ISO_DATE_FORMAT)}&${END_URL_ARG}=${format(value[1]!, ISO_DATE_FORMAT)}`)}>
                        View days
                    </Button>
                </Group>
            </Paper>
        </div>
    );
};

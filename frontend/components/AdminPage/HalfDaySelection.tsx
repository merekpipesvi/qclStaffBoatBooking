import { Button, Checkbox, Divider, Group, Modal, Paper, Text } from '@mantine/core';
import { DataTable } from 'mantine-datatable';
import React from 'react';
import { addDays, format, getDay, parseISO } from 'date-fns';
import { DayOfWeek } from '@mantine/dates';
import { useGetFutureHalfDaysQuery, useSetFullDaysMutation, useSetHalfDaysMutation } from '@/services/halfDaysApi';
import { DAYS_OF_THE_WEEK, DaysOfWeek, ISO_DATE_FORMAT, NUM_DAYS_BOOKABLE } from '@/utils/constants';

export const HalfDaySelection = () => {
    const [setFullDays, fullDayFlags] = useSetFullDaysMutation();
    const [setHalfDays, halfDayFlags] = useSetHalfDaysMutation();
    const { daysArr } = useGetFutureHalfDaysQuery(undefined, {
        selectFromResult: ({ data }) => {
            if (data === undefined) {
                return {};
            }
            const futureHalfDaysSet = new Set(
                data.map((dateString) => getDay(parseISO(dateString)))
            );
            return {
                daysArr: DAYS_OF_THE_WEEK.map((day, index) => (
                    {
                        day,
                        isHalfDay: futureHalfDaysSet.has(index),
                    }
                )),
            };
        },
    });
    const [dayToChange, setDayToChange] = React.useState<
        { day: DayOfWeek, isHalfDay: boolean } | null
        >(null);
    const handleClose = () => {
        setDayToChange(null);
    };

    return (
        <>
            <Paper p="md">
                <DataTable
                  records={daysArr}
                  columns={[
                    { accessor: 'day', render: ({ day }) => <Text>{day}</Text> },
                    {
                        accessor: 'isHalfDay',
                        title: 'Is it a Half Day?',
                        render: ({ day, isHalfDay }) =>
                            <Checkbox
                              onClick={
                                () => setDayToChange({
                                    day: DaysOfWeek[day as keyof typeof DaysOfWeek],
                                    isHalfDay,
                                })
                              }
                              checked={isHalfDay}
                            />,
                    },
                ]}
                />
                <Divider />
                <Text fw={500} size="md" ta="center">
                    These checkboxes are for future dates
                </Text>
                <Text size="sm" ta="center">
                    Dates currently booked will be unaffected by changes made here.
                </Text>
            </Paper>
            <Modal
              title={<Text fw={700} size="lg">{`Change ${DaysOfWeek[dayToChange?.day ?? 0]} to a ${dayToChange?.isHalfDay ? 'Half' : 'Full'} Day`}</Text>}
              opened={dayToChange !== null}
              onClose={handleClose}
            >
                No changes will be made to days that have already been available to book.
                <Group justify="flex-end" mt="xl">
                    <Button onClick={handleClose} radius="xl" variant="default">
                        Cancel
                    </Button>
                    <Button
                      radius="xl"
                      disabled={fullDayFlags.status === 'pending' || halfDayFlags.status === 'pending'}
                      onClick={() => {
                        const startDate = format(
                            addDays(new Date(), NUM_DAYS_BOOKABLE + 1),
                            ISO_DATE_FORMAT
                        );
                        if (dayToChange?.isHalfDay) {
                            setFullDays({ dayOfTheWeek: dayToChange!.day, startDate });
                        } else {
                            setHalfDays({ dayOfTheWeek: dayToChange!.day, startDate });
                        }
                        handleClose();
                        }}>
                        Confirm
                    </Button>
                </Group>
            </Modal>
        </>
    );
};

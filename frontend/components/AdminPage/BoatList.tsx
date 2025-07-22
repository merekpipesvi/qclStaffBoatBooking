import { Button, Group, Modal, Paper, Stack, Text } from '@mantine/core';
import { DatePicker, DatePickerInput } from '@mantine/dates';
import { DataTable } from 'mantine-datatable';
import React from 'react';
import { addDays, addHours, addMonths, eachDayOfInterval, format } from 'date-fns';
import { skipToken } from '@reduxjs/toolkit/query';
import { useCreateBoatUnavailableMutation, useDeleteBoatUnavailableMutation, useGetDatesUnavailableByBoatQuery } from '@/services/boatsApi';
import { BOAT_IDS, ISO_DATE_FORMAT } from '@/utils/constants';

export const BoatList = () => {
    const [dateRange, setDateRange] = React.useState<[Date | null, Date | null]>([null, null]);
    const [boatId, setBoatId] = React.useState<number | null>(null);
    const [makeDatesUnavailable, makeDatesUnavailableFlag] = useCreateBoatUnavailableMutation();
    const [makeDatesAvailable, makeDatesAvailableFlag] = useDeleteBoatUnavailableMutation();
    const { datesUnavailableSet } = useGetDatesUnavailableByBoatQuery(
      boatId === null ? skipToken : { boatId }, {
        selectFromResult: ({ data }) => ({ datesUnavailableSet: new Set(data) }),
      }
    );

    const handleClose = () => {
      setBoatId(null);
      setDateRange([null, null]);
    };

    return (
        <>
          <Paper p="md">
              <DataTable
                records={BOAT_IDS}
                columns={[
                  { accessor: 'boatId', title: 'Boat', render: (value) => <Text>{value}</Text> },
                  {
                      accessor: 'changeAvailability',
                      title: 'Action',
                      render: (value) =>
                          <Button variant="subtle" onClick={() => setBoatId(value)}>Change Availability</Button>,
                  },
                ]}
              />
          </Paper>
          <Modal
            onClose={handleClose}
            opened={boatId !== null}
            title={<Text fw={700} size="lg">{`Boat ${boatId} Availability`}</Text>}
          >
            <Stack align="center">
                <DatePickerInput
                  type="range"
                  placeholder="Pick a date range to change boat availablility"
                  value={dateRange}
                  w={350}
                  readOnly
                  radius="xl"
                  fw={500}
                />
                <DatePicker
                  type="range"
                  allowSingleDateInRange
                  value={dateRange}
                  onChange={setDateRange}
                  // Shouldn't be able to make boats unavailable after 9:30pm the day before
                  minDate={addDays(addHours(new Date(), 2.5), 1)}
                  maxDate={addMonths(new Date(), 6)}
                  weekendDays={[]} // Weekend days are a different colour, we don't want that
                  getDayProps={(date) => {
                    if (datesUnavailableSet.has(format(date, ISO_DATE_FORMAT))) {
                      return {
                        style:
                        {
                          color: 'var(--mantine-color-qclRed-5)',
                          fontWeight: '700',
                        },
                      };
                    }
                      return {};
                  }}
                />
                <Text pt="md">Dates in red are currently unavailable.</Text>
            </Stack>
            <Group justify="flex-end" mt="xl">
                <Button onClick={() => setBoatId(null)} radius="xl" variant="default">
                    Cancel
                </Button>
                <Button
                  radius="xl"
                  disabled={
                    makeDatesAvailableFlag.status === 'pending' ||
                    makeDatesUnavailableFlag.status === 'pending' ||
                    dateRange.some((date) => date === null)
                }
                  onClick={() => {
                    makeDatesUnavailable({
                        boatId: boatId!, // All values have to be non-null to see / click this button
                        dates: eachDayOfInterval({
                            start: dateRange[0]!,
                            end: dateRange[1]!,
                        }).map((date) => format(date, ISO_DATE_FORMAT)),
                    });
                    handleClose();
                    }}>
                    {`Set ${boatId} unavailable`}
                </Button>
                <Button
                  radius="xl"
                  disabled={
                    makeDatesAvailableFlag.status === 'pending' ||
                    makeDatesUnavailableFlag.status === 'pending' ||
                    dateRange.some((date) => date === null)
                }
                  onClick={() => {
                    makeDatesAvailable({
                        boatId: boatId!, // All values have to be non-null to see / click this button
                        dates: eachDayOfInterval({
                            start: dateRange[0]!,
                            end: dateRange[1]!,
                        }).map((date) => format(date, ISO_DATE_FORMAT)),
                    });
                    handleClose();
                    }}>
                    {`Set ${boatId} available`}
                </Button>
            </Group>

          </Modal>
        </>

    );
};

import { Button, Modal, Stack, Text } from '@mantine/core';
import { upperFirst, useDisclosure } from '@mantine/hooks';
import React from 'react';
import { DatePicker } from '@mantine/dates';
import { addDays, format } from 'date-fns';
import { ISO_DATE_FORMAT, NUM_DAYS_BOOKABLE } from '@/utils/constants';
import { BookingCardUser } from '../BookingCard/BookingCard';
import { BookingList } from '../BookingList/BookingList';

export const PriorityBookingButton = (user : BookingCardUser) => {
    const [opened, { open, close }] = useDisclosure(false);
    const [value, setValue] = React.useState<Date | null>(null);
    const dateString = value === null ? '' : format(value, ISO_DATE_FORMAT);

    const handleClose = () => {
        setValue(null);
        close();
    };
    return (
        <>
            <Button radius="lg" onClick={open}>
                Edit bookings
            </Button>
            <Modal
              onClose={close}
              opened={opened}
              title={<Text fw={700} size="lg">{`Give ${upperFirst(user.firstName)} a priority booking`}</Text>}
            >

                {value === null ?
                    <Stack align="center" pt="1rem">
                        <Text fw={600} size="md">
                            Pick a date to book for this user
                        </Text>
                        <DatePicker
                          value={value}
                          onChange={setValue}
                          minDate={new Date()}
                          maxDate={addDays(new Date(), NUM_DAYS_BOOKABLE)}
                          weekendDays={[]}
                          pb="1rem"
                        />
                    </Stack> :
                    <BookingList
                      adminStartDateString={dateString}
                      adminEndDateString={dateString}
                      user={user}
                    />

                }
                <Button onClick={handleClose} radius="xl" variant="default">
                        Cancel
                </Button>
            </Modal>
        </>
    );
};

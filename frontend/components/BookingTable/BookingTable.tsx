import { Table, Text } from '@mantine/core';
import { upperFirst } from '@mantine/hooks';
import { format } from 'date-fns';
import { STRING_TIME_FORMAT, STRING_DATE_FORMAT } from '@/utils/constants';
import { GetUserForBookingModel } from '@/models/user.model';
import styles from './BookingTable.module.css';

export const BookingTable = ({ data, hasCurrentUserBooked }:
    {
        data?: GetUserForBookingModel[],
        hasCurrentUserBooked?: boolean
    }) => {
    const rows = data?.map(({
        firstName,
        lastName,
        isMe,
        timeBooked,
        points,
    }, rowNum) => (!isMe || hasCurrentUserBooked ?
        <Table.Tr key={`${firstName}-${lastName}`} className={isMe ? styles.myBooking : undefined}>
          <Table.Td>
            <Text fz="md">
                {`${rowNum + 1}.`}
            </Text>
          </Table.Td>
          <Table.Td>
            <Text fw={isMe ? 600 : undefined}>
                {`${upperFirst(firstName)} ${upperFirst(lastName)}`}
            </Text>
          </Table.Td>
          <Table.Td>
            <Text fw={isMe ? 600 : undefined}>
                {`${format(timeBooked, STRING_TIME_FORMAT)} on ${format(timeBooked, STRING_DATE_FORMAT)}`}
            </Text>
          </Table.Td>
          <Table.Td align="center">
            <Text fw={isMe ? 600 : undefined}>
                {points}
            </Text>
          </Table.Td>
        </Table.Tr>
        :
        <Table.Tr key={`${firstName}-${lastName}`} className={styles.myPotentialRow}>
          <Table.Td>
            <Text fw={700}>
                {`${rowNum + 1}.`}
            </Text>
          </Table.Td>
          <Table.Td colSpan={3}>
            <Text ta="center" fw={700} ml={-40}>
                Your booking would fit here
            </Text>
          </Table.Td>
        </Table.Tr>
      ));
      return (
        <Table w={500} striped>
          <Table.Thead>
            <Table.Tr>
              <Table.Th />
              <Table.Th>
                <Text fw={700}>Staff Member</Text>
              </Table.Th>
              <Table.Th>
                <Text fw={700}>Time of Booking</Text>
              </Table.Th>
              <Table.Th>
                <Text fw={700}>Points</Text>
              </Table.Th>
            </Table.Tr>
          </Table.Thead>
          <Table.Tbody>{rows}</Table.Tbody>
        </Table>
      );
};

import { Table, Text } from '@mantine/core';
import { upperFirst } from '@mantine/hooks';
import { format } from 'date-fns';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCheckCircle, faXmarkCircle } from '@fortawesome/free-regular-svg-icons';
import { STRING_TIME_FORMAT, STRING_DATE_FORMAT } from '@/utils/constants';
import { GetUserForBookingModel } from '@/models/user.model';
import styles from './BookingTable.module.css';
import { useAppSelector } from '@/utils/reduxHooks';
import { selectCurrentUser } from '@/state/authSelectors';
import type { BookingCardUser } from '../BookingCard/BookingCard';

export const BookingTable = ({ data, hasCurrentUserBooked, user }:
    {
      data?: GetUserForBookingModel[],
      hasCurrentUserBooked?: boolean
      user?: BookingCardUser;
    }) => {
      const { userId: myUserId } = useAppSelector(selectCurrentUser)!;
      const viewingUserId = user?.userId ?? myUserId;
      const rows = data?.map(({
          firstName,
          lastName,
          userId,
          timeBooked,
          points,
          isPriority,
      }, rowNum) => (!(userId === viewingUserId) || hasCurrentUserBooked ?
          <Table.Tr key={`${firstName}-${lastName}`} className={userId === viewingUserId ? styles.myBooking : undefined}>
            <Table.Td>
              <Text fz="md">
                  {`${rowNum + 1}.`}
              </Text>
            </Table.Td>
            <Table.Td>
              <Text fw={userId === viewingUserId ? 600 : undefined}>
                  {`${upperFirst(firstName)} ${upperFirst(lastName)}`}
              </Text>
            </Table.Td>
            <Table.Td>
              <Text fw={userId === viewingUserId ? 600 : undefined}>
                  {`${format(timeBooked, STRING_TIME_FORMAT)} on ${format(timeBooked, STRING_DATE_FORMAT)}`}
              </Text>
            </Table.Td>
            <Table.Td align="center">
              <Text fw={userId === viewingUserId ? 600 : undefined}>
                  {points}
              </Text>
            </Table.Td>
            {user !== undefined ?
              <Table.Td align="center">
                <FontAwesomeIcon icon={isPriority ? faCheckCircle : faXmarkCircle} size="lg" color={isPriority ? 'green' : 'red'} />
              </Table.Td> :
              null
            }
          </Table.Tr>
          :
          <Table.Tr key={`${firstName}-${lastName}`} className={styles.myPotentialRow}>
            <Table.Td>
              <Text fw={700}>
                  {`${rowNum + 1}.`}
              </Text>
            </Table.Td>
            <Table.Td colSpan={4}>
              <Text ta="center" fw={700} ml={-40}>
                  {`${upperFirst(user?.firstName ?? 'Your')} booking would fit here`}
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
              {user !== undefined ?
                <Table.Th>
                  <Text fw={700}>Priority</Text>
                </Table.Th>
                : null
              }
            </Table.Tr>
          </Table.Thead>
          <Table.Tbody>{rows}</Table.Tbody>
        </Table>
      );
};

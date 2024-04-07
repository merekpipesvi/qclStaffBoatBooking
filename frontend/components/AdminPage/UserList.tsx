import { Paper } from '@mantine/core';
import { DataTable } from 'mantine-datatable';
import { upperFirst } from '@mantine/hooks';
import styles from './UserList.module.css';
import { useGetUsersForAdminQuery } from '@/services/usersApi';
import { PointsIncrement } from './PointsIncrement';
import { ConfirmedUserButton } from './ConfirmedUserButton';
import { PriorityBookingButton } from './PriorityBookingButton';

export const UserList = () => {
    const { data } = useGetUsersForAdminQuery();
    return (
        <div className={styles.container}> {/** TODO change this container. Might not need it*/}
            <Paper p="md">
                <DataTable
                  striped
                  records={data}
                  columns={[
                    { accessor: 'name', render: ({ firstName, lastName }) => `${upperFirst(firstName)} ${upperFirst(lastName)}` },
                    {
                        accessor: 'points',
                        render: ({ points, firstName, lastName, userId }) =>
                        <PointsIncrement
                          points={points}
                          firstName={firstName}
                          lastName={lastName}
                          userId={userId} /> },
                    {
                        accessor: 'confirmed',
                        render: ({ isConfirmed, userId, firstName }) =>
                            <ConfirmedUserButton
                              userId={userId}
                              isConfirmed={isConfirmed}
                              firstName={firstName}
                            />,
                    },
                    {
                        accessor: 'priority',
                        title: 'Priority Bookings',
                        render: ({ userId, firstName, lastName, points }) =>
                            <PriorityBookingButton
                              userId={userId}
                              firstName={firstName}
                              lastName={lastName}
                              points={points}
                            />,
                    },
                  ]}
                />
            </Paper>
        </div>
    );
};

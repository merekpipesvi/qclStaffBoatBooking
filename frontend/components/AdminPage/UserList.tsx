import { Button, Paper } from '@mantine/core';
import { DataTable, DataTableSortStatus } from 'mantine-datatable';
import { upperFirst } from '@mantine/hooks';
import React from 'react';
import sortBy from 'lodash/sortBy';
import { useGetUsersForAdminQuery } from '@/services/usersApi';
import { PointsIncrement } from './PointsIncrement';
import { ConfirmedUserButton } from './ConfirmedUserButton';
import { PriorityBookingButton } from './PriorityBookingButton';
import { DeleteUserButton } from './DeleteUserButton';
import { GetUserModel } from '@/models/user.model';
import { ShowLicenceButton } from './ShowLicenceButton';

export const UserList = () => {
    const { data: users = [] } = useGetUsersForAdminQuery();
    const [sortStatus, setSortStatus] = React.useState<DataTableSortStatus<GetUserModel>>({
      columnAccessor: 'isConfirmed',
      direction: 'asc',
    });
    const [records, setRecords] = React.useState(sortBy(users, 'confirmed'));

    React.useEffect(() => {
      const data = sortBy(users, sortStatus.columnAccessor) as GetUserModel[];
      setRecords(sortStatus.direction === 'desc' ? data.reverse() : data);
    }, [sortStatus, users]);

    return (
        <div>
            <Paper p="md">
                <DataTable
                  striped
                  records={records}
                  columns={[
                    {
                      accessor: 'name',
                      render: ({ firstName, lastName }) => `${upperFirst(firstName)} ${upperFirst(lastName)}`,
                      sortable: true,
                    },
                    {
                      accessor: 'points',
                      render: ({ points, firstName, lastName, userId }) =>
                        <PointsIncrement
                          points={points}
                          firstName={firstName}
                          lastName={lastName}
                          userId={userId} />,
                      sortable: true,
                    },
                    {
                      accessor: 'isConfirmed',
                      title: "Confirmed",
                      render: ({ isConfirmed, userId, firstName }) =>
                          <ConfirmedUserButton
                            userId={userId}
                            isConfirmed={isConfirmed}
                            firstName={firstName}
                          />,
                      sortable: true,
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
                    {
                      accessor: 'fishingLicence',
                      title: 'Licenses',
                      render: ({pcoc, fishingLicence, firstName, lastName}) => 
                        <ShowLicenceButton 
                          pcoc={pcoc} 
                          fishingLicence={fishingLicence} 
                          firstName={firstName} 
                          lastName={lastName}
                        />
                    },
                    {
                      accessor: 'delete',
                      title: 'Delete User',
                      render: ({ userId, firstName, lastName }) =>
                        <DeleteUserButton
                          userId={userId}
                          firstName={firstName}
                          lastName={lastName}
                        />,
                    },
                  ]}
                  sortStatus={sortStatus}
                  onSortStatusChange={setSortStatus}
                  height={410}
                />
            </Paper>
        </div>
    );
};

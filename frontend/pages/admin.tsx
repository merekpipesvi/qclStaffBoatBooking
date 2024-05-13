import { Group } from '@mantine/core';
import { BoatList } from '@/components/AdminPage/BoatList';
import { UserList } from '@/components/AdminPage/UserList';
import { HalfDaySelection } from '@/components/AdminPage/HalfDaySelection';

const AdminPage = () => (
    <Group gap="4rem" justify="center" pt="5rem">
        <UserList />
        <HalfDaySelection />
        <BoatList />
    </Group>
);

export default AdminPage;

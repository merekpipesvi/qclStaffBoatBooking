import { faCheckCircle, faXmarkCircle } from '@fortawesome/free-regular-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { Button, Center, Group, Modal, Stack, Text } from '@mantine/core';
import { upperFirst, useDisclosure } from '@mantine/hooks';
import { GetUserModel } from '@/models/user.model';
import { usePatchUserForAdminMutation } from '@/services/usersApi';

export const ConfirmedUserButton = ({ isConfirmed, userId, firstName } : Pick<GetUserModel, 'userId' | 'isConfirmed' | 'firstName'>) => {
    const [opened, { open, close }] = useDisclosure(false);
    const [patchUser, patchFlags] = usePatchUserForAdminMutation();
    return (
        <>
            <Center>
                {isConfirmed ?
                    <FontAwesomeIcon icon={faCheckCircle} color="green" size="xl" /> :
                    <Button radius="lg" onClick={open}>
                        <FontAwesomeIcon icon={faXmarkCircle} size="lg" />
                    </Button>}
            </Center>
            <Modal
              onClose={close}
              opened={opened}
              title={<Text fw={700} size="lg">{`Confirm ${upperFirst(firstName)}'s registration`}</Text>}
            >
                <Stack gap="0.25rem" align="center" pt="1rem">
                    <Text>
                        Confirm this user&apos;s registration?
                    </Text>
                    <Text size="sm" c="gray">
                        Please ensure this user has not created another account.
                    </Text>
                </Stack>
                <Group justify="flex-end" mt="xl">
                    <Button onClick={close} radius="xl" variant="default">
                        Cancel
                    </Button>
                    <Button
                      radius="xl"
                      disabled={patchFlags.status === 'pending'}
                      onClick={() => {
                        patchUser({ userId, isConfirmed: true });
                        close();
                        }}>
                        Confirm User
                    </Button>
                </Group>
            </Modal>
        </>
    );
};

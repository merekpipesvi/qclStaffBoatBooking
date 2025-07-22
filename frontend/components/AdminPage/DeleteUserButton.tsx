import { faTrashCan } from '@fortawesome/free-regular-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { Button, Group, Modal, Stack, Text, TextInput } from '@mantine/core';
import { upperFirst, useDisclosure } from '@mantine/hooks';
import React from 'react';
import { useDeleteUserMutation } from '@/services/usersApi';
import { GetUserModel } from '@/models/user.model';

export const DeleteUserButton = ({ userId, firstName, lastName }: Pick<GetUserModel, 'userId' | 'firstName' | 'lastName'>) => {
    const [deleteUser, deleteUserFlags] = useDeleteUserMutation();
    const [opened, { open, close }] = useDisclosure(false);
    const [textInput, setTextInput] = React.useState('');
    return (
        <>
            <Button radius="lg" onClick={open} variant="outline">
                <FontAwesomeIcon icon={faTrashCan} />
            </Button>
            <Modal
              onClose={close}
              opened={opened}
              title={<Text fw={700} size="lg">{`Delete ${upperFirst(firstName)} ${upperFirst(lastName)}'s account`}</Text>}
            >
                <Text p="lg">
                    Deleting an account is a permanent action and cannot be undone.
                    Are you sure you want to proceed?
                </Text>
                <Stack align="center" gap={0}>
                    <Text fw={700}>Type DELETE to confirm</Text>
                    <TextInput
                      w={75}
                      onChange={(event) => setTextInput(event.currentTarget.value)}
                      placeholder="DELETE"
                    />
                </Stack>
                <Group justify="flex-end" mt="xl">
                    <Button onClick={close} radius="xl" variant="default">
                        Cancel
                    </Button>
                    <Button
                      radius="xl"
                      disabled={deleteUserFlags.status === 'pending' || !textInput.toLowerCase().includes('delete')}
                      onClick={() => {
                        deleteUser({ userId });
                        close();
                        }}>
                        Confirm
                    </Button>
                </Group>
            </Modal>
        </>
    );
};

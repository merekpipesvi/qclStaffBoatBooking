import { Button, Group, Modal, NumberInput, Text } from '@mantine/core';
import { upperFirst, useDisclosure } from '@mantine/hooks';
import { useForm } from '@mantine/form';
import { GetUserModel } from '@/models/user.model';
import { usePatchUserForAdminMutation } from '@/services/usersApi';

export const PointsIncrement = ({ points, firstName, lastName, userId }: Pick<GetUserModel, 'points' | 'firstName' | 'lastName' | 'userId'>) => {
    const [opened, { open, close }] = useDisclosure(false);
    const form = useForm({
        initialValues: {
          newPoints: points,
        },
    });
    const [patchUser, patchFlags] = usePatchUserForAdminMutation();

    return (
        <>
            <Button onClick={open} p="sm" w={48} radius="lg" variant="light">
                {points}
            </Button>
            <Modal
              onClose={close}
              opened={opened}
              title={<Text fw={700} size="lg">{`Edit ${upperFirst(firstName)} ${upperFirst(lastName)}'s points`}</Text>}
            >
                <form
                  onSubmit={form.onSubmit(
                    async () => {
                        await patchUser({ userId, points: form.values.newPoints });
                        close();
                    }
                  )}
                >
                    <Text>
                        {`Are you sure you want to change ${upperFirst(firstName)}'s points?`}
                    </Text>
                    <Text>
                        This action is permanent and cannot be undone.
                    </Text>
                    <Group gap={0} p="md">
                        <Text>
                            Change points from&nbsp;
                        </Text>
                        <Text fw={700}>{points}</Text>
                        <Text>&nbsp;to&nbsp;</Text>
                        <NumberInput
                          required
                          defaultValue={points}
                          placeholder={points.toString()}
                          value={form.values.newPoints}
                          onChange={(newPoints) => form.setFieldValue('newPoints', newPoints as number)}
                          radius="md"
                          p={0}
                          w={60}
                        />
                    </Group>
                    <Group justify="flex-end" mt="xl">
                        <Button onClick={close} radius="xl" variant="default">
                            Cancel
                        </Button>
                        <Button type="submit" radius="xl" disabled={patchFlags.status === 'pending'}>
                            Save changes
                        </Button>
                    </Group>
                </form>

            </Modal>
        </>
    );
};

import { useToggle, upperFirst } from '@mantine/hooks';
import { useForm } from '@mantine/form';
import {
  TextInput,
  PasswordInput,
  Text,
  Paper,
  Group,
  PaperProps,
  Button,
  Divider,
  Anchor,
  Stack,
} from '@mantine/core';
import { useLoginMutation, useMeQuery, useRegisterMutation } from '@/services/apiSlice';

export const LogIn = (props: PaperProps) => {
  const [type, toggle] = useToggle(['login', 'register']);
  const form = useForm({
    initialValues: {
      email: '',
      firstName: '',
      lastName: '',
      password: '',
      fishingLicence: '',
      pcoc: '',
    },

    validate: {
      email: (val: string) => (/^\S+@\S+$/.test(val) && val.includes('@fishqcl.com') ? null : 'Invalid email. Use your QCL email.'),
      password: (val: string) => (val.length < 6 ? 'Password should include at least 6 characters' : null),
    },
  });

  const [registerUser] = useRegisterMutation();
  const [loginUser] = useLoginMutation();
  useMeQuery();

  return (
    <Paper radius="md" p="xl" withBorder {...props}>
      <Text size="lg" fw={500}>
        Welcome to QCL Staff Boat Booking
      </Text>

      <Divider label={`Please ${type} below`} labelPosition="center" my="lg" />

      <form onSubmit={form.onSubmit(() => {
        loginUser(form.values);
      })}>
        <Stack>

            <TextInput
              required
              label="Email"
              placeholder="fish@qcl.com"
              value={form.values.email}
              onChange={(event) => form.setFieldValue('email', event.currentTarget.value)}
              error={form.errors.email}
              radius="md"
            />

            <PasswordInput
              required
              label="Password"
              placeholder="Your password"
              value={form.values.password}
              onChange={(event) => form.setFieldValue('password', event.currentTarget.value)}
              error={form.errors.password}
              radius="md"
            />

            {type === 'register' && (
                <TextInput
                  required={type === 'register'}
                  label="First name"
                  placeholder="Your first name"
                  value={form.values.firstName}
                  onChange={(event) => form.setFieldValue('firstName', event.currentTarget.value)}
                  radius="md"
                />
            )}
            {type === 'register' && (
                <TextInput
                  required={type === 'register'}
                  label="Last Name"
                  placeholder="Your last name"
                  value={form.values.lastName}
                  onChange={(event) => form.setFieldValue('lastName', event.currentTarget.value)}
                  radius="md"
                />
            )}

            {type === 'register' && (
                <TextInput
                  required={type === 'register'}
                  label="Fishing Licence"
                  placeholder="Your BC Fishing Licence"
                  value={form.values.fishingLicence}
                  onChange={(event) => form.setFieldValue('fishingLicence', event.currentTarget.value)}
                  radius="md"
                />
            )}
            {type === 'register' && (
                <TextInput
                  label="PCOC"
                  placeholder="Your Pleasure Craft Operating Licence"
                  value={form.values.pcoc}
                  onChange={(event) => form.setFieldValue('pcoc', event.currentTarget.value)}
                  radius="md"
                />
            )}
        </Stack>

        <Group justify="space-between" mt="xl">
          <Anchor component="button" type="button" c="dimmed" onClick={() => toggle()} size="xs">
            {type === 'register'
              ? 'Already have an account? Login'
              : "Don't have an account? Register"}
          </Anchor>
          <Button type="submit" radius="xl">
            {upperFirst(type)}
          </Button>
        </Group>
      </form>
    </Paper>
  );
};

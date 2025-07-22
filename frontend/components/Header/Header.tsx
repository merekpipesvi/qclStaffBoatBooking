import { Button, Container, Group } from '@mantine/core';
import { useRouter } from 'next/router';
import classes from './Header.module.css';
import { Logo } from '../Logo/Logo';
import { useAppSelector } from '@/utils/reduxHooks';
import { selectCurrentUser } from '@/state/authSelectors';

const links = [
  { link: '/admin', label: 'Admin Page' },
];

export const Header = () => {
  const user = useAppSelector(selectCurrentUser);
  const router = useRouter();
  const items = user?.role === 'admin' ? links.map(({ link, label }) => (
    <Button onClick={() => router.push(link)}>
      {label}
    </Button>
  )) : [];

  return (
    <header className={classes.header}>
      <div className={classes.decorationBar} />
      <Container size="md" className={classes.inner}>
        <Logo h={50} />
        <Group gap={5} visibleFrom="xs">
          {items}
        </Group>
      </Container>
    </header>
  );
};

import { useState } from 'react';
import { Container, Group } from '@mantine/core';
import classes from './Header.module.css';
import { Logo } from '../Logo/Logo';
import { useAppSelector } from '@/utils/reduxHooks';
import { selectCurrentUser } from '@/state/authSelectors';

const links = [
  { link: '/admin', label: 'Admin' },
];

export const Header = () => {
  const [active, setActive] = useState(links[0].link);
  const user = useAppSelector(selectCurrentUser);

  const items = user?.role === 'admin' ? links.map((link) => (
    <a
      key={link.label}
      href={link.link}
      className={classes.link}
      data-active={active === link.link || undefined}
      onClick={(event) => {
        event.preventDefault();
        setActive(link.link);
      }}
    >
      {link.label}
    </a>
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

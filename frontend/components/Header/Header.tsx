import { useState } from 'react';
import { Container, Group } from '@mantine/core';
import classes from './Header.module.css';
import { Logo } from '../Logo/Logo';

const links = [
  { link: '/admin', label: 'Admin' },
];

export const Header = () => {
  const [active, setActive] = useState(links[0].link);

  const items = links.map((link) => (
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
  ));

  return (
    <header className={classes.header}>
      <Container size="md" className={classes.inner}>
        <Logo h={50} />
        <Group gap={5} visibleFrom="xs">
          {items}
        </Group>
      </Container>
    </header>
  );
};

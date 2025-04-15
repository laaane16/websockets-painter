import { FC } from 'react';

import Toolbar from '../Toolbar/Toolbar';
import Settings from '../Settings/Settings';

import styles from './Header.module.scss';

interface Props {
  className?: string;
}

const Header: FC<Props> = () => {
  return (
    <header className={styles.header}>
      <Toolbar />
      <Settings />
    </header>
  );
};

export default Header;

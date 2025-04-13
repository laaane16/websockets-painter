import { FC, useState } from 'react';

import Container from '../Container/Container';

import styles from './Settings.module.scss';
import { useToolStore } from '../../store/toolState';

interface Props {
  className?: string;
}

const Settings: FC<Props> = (props) => {
  const { setStrokeWidth, setStrokeColor } = useToolStore((state) => state);

  return (
    <div className={styles.settings}>
      <Container className={styles.settingsContent}>
        <span className={styles.title}>Толщина линии</span>
        <input
          className={styles.input}
          min={1}
          max={50}
          defaultValue={1}
          onChange={(e) => setStrokeWidth(Number(e.target.value))}
          type="number"
        />

        <span className={styles.title}>Цвет обводки</span>
        <input
          className={styles.input}
          onChange={(e) => setStrokeColor(e.target.value)}
          type="color"
        />
      </Container>
    </div>
  );
};

export default Settings;

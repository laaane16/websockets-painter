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
        <label htmlFor="line-width" className={styles.title}>
          Line width
        </label>
        <input
          id="line-width"
          className={styles.input}
          min={1}
          max={50}
          defaultValue={1}
          onChange={(e) => setStrokeWidth(Number(e.target.value))}
          type="number"
          style={{ marginRight: '15px' }}
        />

        <label htmlFor="stroke-color" className={styles.title}>
          Stroke color
        </label>
        <input
          id="stroke-color"
          className={styles.input}
          onChange={(e) => setStrokeColor(e.target.value)}
          type="color"
        />
      </Container>
    </div>
  );
};

export default Settings;

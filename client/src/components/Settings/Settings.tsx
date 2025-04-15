import { ChangeEvent, FC } from 'react';
import { ColorPicker, Input } from 'antd';
import { AggregationColor } from 'antd/es/color-picker/color';

import Container from '../Container/Container';

import { useToolStore } from '../../store/toolState/toolState';
import { getSetStrokeWidth } from '../../store/toolState/selectors/getSetStrokeWidth';
import { getSetStrokeColor } from '../../store/toolState/selectors/getSetStrokeColor';

import styles from './Settings.module.scss';

interface Props {
  className?: string;
}

const Settings: FC<Props> = () => {
  const setStrokeWidth = useToolStore(getSetStrokeWidth);
  const setStrokeColor = useToolStore(getSetStrokeColor);

  const handleWidthChange = (e: ChangeEvent<HTMLInputElement>) =>
    setStrokeWidth(Number(e.target.value));

  const handleColorChange = (color: AggregationColor) => setStrokeColor(color.toHexString());

  return (
    <div className={styles.settings}>
      <Container className={styles.settingsContent}>
        <span className={styles.title}>Line width</span>
        <Input
          className={styles.input}
          min={1}
          max={50}
          defaultValue={1}
          onChange={handleWidthChange}
          type="number"
        />
        <span className={styles.title}>Stroke color</span>
        <ColorPicker
          className={styles.colorPicker}
          onChange={handleColorChange}
          defaultValue="black"
        />
      </Container>
    </div>
  );
};

export default Settings;

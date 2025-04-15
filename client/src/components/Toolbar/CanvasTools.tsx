import { FC } from 'react';
import { ColorPicker } from 'antd';
import { AggregationColor } from 'antd/es/color-picker/color';

import BrushSvg from '../../assets/brush.svg';
import RectSvg from '../../assets/rect.svg';
import CircleSvg from '../../assets/circle.svg';
import LineSvg from '../../assets/line.svg';
import EraserSvg from '../../assets/eraser.svg';

import { Brush } from '../../tools/Brush';
import { Rect } from '../../tools/Rect';
import { Circle } from '../../tools/Circle';
import { Line } from '../../tools/Line';
import { Eraser } from '../../tools/Eraser';

import { getSetTool } from '../../store/toolState/selectors/getSetTool';
import { useCanvasStore } from '../../store/canvasState/canvasState';
import { getCanvas } from '../../store/canvasState/selectors/getCanvas';
import { getSession } from '../../store/canvasState/selectors/getSession';
import { getSocket } from '../../store/canvasState/selectors/getSocket';
import { useToolStore } from '../../store/toolState/toolState';
import { getSetFill } from '../../store/toolState/selectors/getSetFill';

import styles from './Toolbar.module.scss';

interface Props {
  className?: string;
}

const CanvasTools: FC<Props> = () => {
  const canvas = useCanvasStore(getCanvas);
  const socket = useCanvasStore(getSocket);
  const session = useCanvasStore(getSession);
  const setTool = useToolStore(getSetTool);
  const setFill = useToolStore(getSetFill);

  const handleColorChange = (color: AggregationColor) => {
    setFill(color.toHexString());
  };

  return (
    socket &&
    session && (
      <ul className={styles.canvasTools}>
        <li
          className={styles.item}
          onClick={() => setTool(new Brush(canvas as HTMLCanvasElement, socket, session))}
        >
          <BrushSvg />
        </li>
        <li
          className={styles.item}
          onClick={() => setTool(new Rect(canvas as HTMLCanvasElement, socket, session))}
        >
          <RectSvg />
        </li>
        <li
          className={styles.item}
          onClick={() => setTool(new Circle(canvas as HTMLCanvasElement, socket, session))}
        >
          <CircleSvg />
        </li>
        <li
          className={styles.item}
          onClick={() => setTool(new Line(canvas as HTMLCanvasElement, socket, session))}
        >
          <LineSvg />
        </li>
        <li
          className={styles.item}
          onClick={() => setTool(new Eraser(canvas as HTMLCanvasElement, socket, session))}
        >
          <EraserSvg />
        </li>
        <li>
          <ColorPicker onChange={handleColorChange} defaultValue="black" />
        </li>
      </ul>
    )
  );
};

export default CanvasTools;

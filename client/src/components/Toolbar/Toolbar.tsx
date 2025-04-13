import { FC } from 'react';

import styles from './Toolbar.module.scss';
import Container from '../Container/Container';
import BrushSvg from '../../assets/brush.svg';
import RectSvg from '../../assets/rect.svg';
import CircleSvg from '../../assets/circle.svg';
import LineSvg from '../../assets/line.svg';
import EraserSvg from '../../assets/eraser.svg';
import UndoSvg from '../../assets/undo.svg';
import RedoSvg from '../../assets/redo.svg';
import SaveSvg from '../../assets/save.svg';

import { Brush } from '../../tools/Brush';
import { Rect } from '../../tools/Rect';
import { Circle } from '../../tools/Circle';

import { useToolStore } from '../../store/toolState';
import { useStore } from '../../store/canvasState';
import { Eraser } from '../../tools/Eraser';
import { Line } from '../../tools/Line';

interface Props {
  className?: string;
}

const Toolbar: FC<Props> = (props) => {
  const setNewTool = useToolStore((state) => state.setTool);
  const canvas = useStore((state) => state.canvas);
  const socket = useStore((state) => state.socket);
  const session = useStore((state) => state.session);

  const setFill = useToolStore((state) => state.setFill);
  const undo = useStore((state) => state.undo);
  const redo = useStore((state) => state.redo);

  return (
    <div className={styles.toolbar}>
      <Container className={styles.toolbarContent}>
        <ul className={styles.canvasTools}>
          <li onClick={() => setNewTool(new Brush(canvas as HTMLCanvasElement, socket, session))}>
            <BrushSvg />
          </li>
          <li onClick={() => setNewTool(new Rect(canvas as HTMLCanvasElement, socket, session))}>
            <RectSvg />
          </li>
          <li onClick={() => setNewTool(new Circle(canvas as HTMLCanvasElement))}>
            <CircleSvg />
          </li>
          <li onClick={() => setNewTool(new Line(canvas as HTMLCanvasElement))}>
            <LineSvg />
          </li>
          <li onClick={() => setNewTool(new Eraser(canvas as HTMLCanvasElement))}>
            <EraserSvg />
          </li>
          <li>
            <input onChange={(e) => setFill(e.target.value)} type="color" name="" id="" />
          </li>
        </ul>
        <ul className={styles.appTools}>
          <li onClick={undo}>
            <UndoSvg />
          </li>
          <li onClick={redo}>
            <RedoSvg />
          </li>
          <li>
            <SaveSvg />
          </li>
        </ul>
      </Container>
    </div>
  );
};

export default Toolbar;

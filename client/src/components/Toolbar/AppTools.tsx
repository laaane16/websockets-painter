import { FC } from 'react';

import UndoSvg from '../../assets/undo.svg';
import RedoSvg from '../../assets/redo.svg';
import SaveSvg from '../../assets/save.svg';

import { useCanvasStore } from '../../store/canvasState/canvasState';
import { getCanvas } from '../../store/canvasState/selectors/getCanvas';
import { getSession } from '../../store/canvasState/selectors/getSession';
import { getUndo } from '../../store/canvasState/selectors/getUndo';
import { getRedo } from '../../store/canvasState/selectors/getRedo';
import { MessageInstance } from 'antd/es/message/interface';

import styles from './Toolbar.module.scss';

interface Props {
  className?: string;
  messageApi: MessageInstance;
}

const AppTools: FC<Props> = ({ messageApi }) => {
  const canvas = useCanvasStore(getCanvas);
  const session = useCanvasStore(getSession);
  const undo = useCanvasStore(getUndo);
  const redo = useCanvasStore(getRedo);

  const info = () => {
    messageApi.open({
      type: 'success',
      content: 'Успешно загружено!',
      duration: 2,
    });
  };

  const saveHandler = () => {
    const src = canvas?.toDataURL() || '';
    const a = document.createElement('a');
    a.href = src;
    a.download = session + '.jpg';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    info();
  };

  return (
    <ul className={styles.appTools}>
      <li className={styles.item} onClick={undo}>
        <UndoSvg />
      </li>
      <li className={styles.item} onClick={redo}>
        <RedoSvg />
      </li>
      <li onClick={saveHandler} className={styles.item}>
        <SaveSvg />
      </li>
    </ul>
  );
};

export default AppTools;

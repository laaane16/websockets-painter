import { FC, useRef, useEffect } from 'react';

import styles from './Canvas.module.scss';
import { CanvasSchema, useStore } from '../../store/canvasState';
import { ToolSchema, useToolStore } from '../../store/toolState';
import { Tool } from '../../tools/Tool';
import { Brush } from '../../tools/Brush';

interface Props {
  className?: string;
}

const Canvas: FC<Props> = (props) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const getCanvasSetter = (state: CanvasSchema) => state.setCanvas;
  const setCanvas = useStore(getCanvasSetter);
  const getToolSetter = (state: ToolSchema) => state.setTool;
  const setTool = useToolStore(getToolSetter);
  const pushToUndo = useStore((state) => state.pushToUndo);
  const username = useStore((state) => state.username);
  const id = window.location.pathname.slice(1);

  const setSocket = useStore((state) => state.setSocket);
  const setSession = useStore((state) => state.setSession);
  const socket = useStore((state) => state.socket);
  const session = useStore((state) => state.session);

  useEffect(() => {
    const socket = new WebSocket('ws://localhost:5000');
    console.log(session);
    setTool(new Brush(canvasRef.current as HTMLCanvasElement, socket, session));
    setSocket(socket);
    setSession(id);
    if (username) {
      socket.onopen = () => {
        socket.send(
          JSON.stringify({
            id,
            username,
            method: 'connection',
          }),
        );
      };

      socket.onmessage = (msg) => {
        const preparedMsg = JSON.parse(msg.data);

        switch (preparedMsg.method) {
          case 'connection':
            console.log(`Пользователь ${preparedMsg.username} успешно подключился`);
            break;
          case 'draw':
            drawHandler(preparedMsg);
            break;
          case 'finish':
            canvasRef.current?.getContext('2d')?.beginPath();
            break;
        }
      };
    }
  }, [username]);

  const drawHandler = (preparedMsg: any) => {
    switch (preparedMsg.figure.tool) {
      case 'brush':
        Brush.draw(
          canvasRef.current?.getContext('2d') as CanvasRenderingContext2D,
          preparedMsg.figure.x,
          preparedMsg.figure.y,
        );
    }
  };

  useEffect(() => {
    if (canvasRef.current) {
      setCanvas(canvasRef.current);
    }
  }, []);
  return (
    <div className={styles.canvasContainer}>
      <canvas
        onMouseDown={() => pushToUndo(canvasRef.current?.toDataURL() || '')}
        ref={canvasRef}
        width={800}
        height={600}
        className={styles.canvas}
      />
    </div>
  );
};

export default Canvas;

import { FC, useRef, useEffect, useState } from 'react';

import { Brush } from '../../tools/Brush';
import { Rect } from '../../tools/Rect';
import { Circle } from '../../tools/Circle';
import { Eraser } from '../../tools/Eraser';
import { Line } from '../../tools/Line';
import { Cursor } from '../Cursor/Cursor';

import { useCanvasStore } from '../../store/canvasState/canvasState';
import { useToolStore } from '../../store/toolState/toolState';

import { getSetCanvas } from '../../store/canvasState/selectors/getSetCanvas';
import { getSetTool } from '../../store/toolState/selectors/getSetTool';
import { getPushToUndo } from '../../store/canvasState/selectors/getPushToUndo';
import { getUsername } from '../../store/canvasState/selectors/getUsername';
import { getSetSocket } from '../../store/canvasState/selectors/getSetSocket';
import { getSetSession } from '../../store/canvasState/selectors/getSetSession';
import { getSession } from '../../store/canvasState/selectors/getSession';

import styles from './Canvas.module.scss';

interface Props {
  className?: string;
}

interface CursorState {
  position: { x: number; y: number };
  author: string;
}

const Canvas: FC<Props> = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const setTool = useToolStore(getSetTool);
  const username = useCanvasStore(getUsername);
  const [cursors, setCursors] = useState<Record<string, CursorState>>({});
  const setCanvas = useCanvasStore(getSetCanvas);
  const pushToUndo = useCanvasStore(getPushToUndo);
  const setSocket = useCanvasStore(getSetSocket);
  const setSession = useCanvasStore(getSetSession);
  const session = useCanvasStore(getSession);

  const id = window.location.pathname.slice(1);

  useEffect(() => {
    const socket = new WebSocket('ws://localhost:5000');
    setTool(new Brush(canvasRef.current as HTMLCanvasElement, socket, session || ''));
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
        const author = preparedMsg.username;
        switch (preparedMsg.method) {
          case 'connection':
            if (username !== author) {
              setCursors({
                ...cursors,
                [author]: { author },
              });
            }
            break;
          case 'draw':
            drawHandler(preparedMsg);
            break;
          case 'finish':
            canvasRef.current?.getContext('2d')?.beginPath();
            break;
          case 'move':
            setCursors({
              ...cursors,
              [author]: {
                position: { x: preparedMsg.x, y: preparedMsg.y },
                author,
              },
            });
        }
      };
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [username]);

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const drawHandler = (preparedMsg: any) => {
    const ctx = canvasRef.current?.getContext('2d') as CanvasRenderingContext2D;
    const img = new Image();
    const { fillColor, strokeColor, lineWidth } = preparedMsg;
    const currentFill = ctx.fillStyle;
    const currentStrokeColor = ctx.strokeStyle;
    const currentStrokeWidth = ctx.lineWidth;
    if (fillColor) {
      ctx.fillStyle = fillColor;
    }
    if (strokeColor) {
      ctx.strokeStyle = strokeColor;
    }
    if (lineWidth) {
      ctx.lineWidth = lineWidth;
    }

    switch (preparedMsg.figure.tool) {
      case 'brush':
        Brush.draw(
          canvasRef.current?.getContext('2d') as CanvasRenderingContext2D,
          preparedMsg.figure.x,
          preparedMsg.figure.y,
        );
        break;
      case 'rect':
        Rect.staticDraw(
          canvasRef.current?.getContext('2d') as CanvasRenderingContext2D,
          preparedMsg.figure.x,
          preparedMsg.figure.y,
          preparedMsg.figure.width,
          preparedMsg.figure.height,
        );
        break;
      case 'circle':
        Circle.staticDraw(
          canvasRef.current?.getContext('2d') as CanvasRenderingContext2D,
          preparedMsg.figure.x,
          preparedMsg.figure.y,
          preparedMsg.figure.width,
          preparedMsg.figure.height,
        );
        break;
      case 'eraser':
        Eraser.draw(
          canvasRef.current?.getContext('2d') as CanvasRenderingContext2D,
          preparedMsg.figure.x,
          preparedMsg.figure.y,
        );
        break;
      case 'line':
        Line.staticDraw(
          canvasRef.current?.getContext('2d') as CanvasRenderingContext2D,
          preparedMsg.figure.startX,
          preparedMsg.figure.startY,
          preparedMsg.figure.x,
          preparedMsg.figure.y,
        );
        break;
      case 'undo':
        img.src = preparedMsg.figure.img.toString('base64');
        img.onload = () => {
          ctx?.clearRect(0, 0, canvasRef.current?.width || 0, canvasRef.current?.height || 0);
          ctx?.drawImage(img, 0, 0, canvasRef.current?.width || 0, canvasRef.current?.height || 0);
        };
        break;
      case 'redo':
        img.src = preparedMsg.figure.img.toString('base64');
        img.onload = () => {
          ctx?.clearRect(0, 0, canvasRef.current?.width || 0, canvasRef.current?.height || 0);
          ctx?.drawImage(img, 0, 0, canvasRef.current?.width || 0, canvasRef.current?.height || 0);
        };
    }

    ctx.fillStyle = currentFill;
    ctx.strokeStyle = currentStrokeColor;
    ctx.lineWidth = currentStrokeWidth;
  };

  useEffect(() => {
    if (canvasRef.current) {
      setCanvas(canvasRef.current);
      fetch(`http://localhost:5000/image?id=${id}`)
        .then((data) => data.json())
        .then((res) => {
          const image = new Image();
          image.src = res;
          image.onload = () => {
            canvasRef.current
              ?.getContext('2d')
              ?.clearRect(0, 0, canvasRef.current.width, canvasRef.current.height);
            canvasRef.current
              ?.getContext('2d')
              ?.drawImage(image, 0, 0, canvasRef.current.width, canvasRef.current.height);
          };
        });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const mouseDownHandler = async () => {
    pushToUndo(canvasRef.current?.toDataURL() || '');
  };

  const mouseUpHandler = async () => {
    const imageData = canvasRef.current?.toDataURL();
    try {
      const res = await fetch(`http://localhost:5000/image?id=${id}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          img: imageData || '',
        }),
      });
      if (!res.ok) {
        throw new Error('error');
      }
    } catch (e) {
      console.log(e);
    }
  };
  return (
    <>
      {Object.values(cursors).map(({ position, author }) => {
        return <Cursor x={position?.x || 0} y={position?.y || 0} username={author || ''} />;
      })}
      <div className={styles.canvasContainer}>
        <canvas
          onMouseUp={mouseUpHandler}
          onMouseDown={mouseDownHandler}
          ref={canvasRef}
          width={1200}
          height={700}
          className={styles.canvas}
        />
      </div>
    </>
  );
};

export default Canvas;

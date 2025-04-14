import { FC, useRef, useEffect } from 'react';

import styles from './Canvas.module.scss';
import { CanvasSchema, useStore } from '../../store/canvasState';
import { ToolSchema, useToolStore } from '../../store/toolState';
import { Tool } from '../../tools/Tool';
import { Brush } from '../../tools/Brush';
import { Rect } from '../../tools/Rect';
import { Circle } from '../../tools/Circle';
import { Eraser } from '../../tools/Eraser';
import { Line } from '../../tools/Line';

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
  );
};

export default Canvas;

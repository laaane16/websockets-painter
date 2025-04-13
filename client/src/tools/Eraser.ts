import { Tool } from './Tool';

export class Eraser extends Tool {
  mouseDown: boolean = false;

  constructor(canvas: HTMLCanvasElement, socket: WebSocket, session: string) {
    super(canvas, socket, session);
    this.listenEvents({
      mouseUpHandler: this.mouseUpHandler,
      mouseDownHandler: this.mouseDownHandler,
      mouseMoveHadler: this.mouseMoveHandler,
    });
  }

  mouseUpHandler(e: MouseEvent): void {
    this.mouseDown = false;
    this.socket.send(
      JSON.stringify({
        id: this.session,
        method: 'finish',
      }),
    );
  }

  mouseDownHandler(e: MouseEvent): void {
    this.mouseDown = true;
    this.ctx.beginPath();
    this.ctx.moveTo(e.offsetX, e.offsetY);
  }

  mouseMoveHandler(e: MouseEvent): void {
    if (this.mouseDown) {
      // this.draw(e.offsetX, e.offsetY);
      this.socket.send(
        JSON.stringify({
          id: this.session,
          method: 'draw',
          figure: {
            tool: 'eraser',
            x: e.offsetX,
            y: e.offsetY,
          },
        }),
      );
    }
  }

  static draw(ctx: CanvasRenderingContext2D, x: number, y: number) {
    ctx.strokeStyle = 'white';
    ctx.lineTo(x, y);
    ctx.stroke();
  }
}

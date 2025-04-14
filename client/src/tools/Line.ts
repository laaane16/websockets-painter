import { Tool } from './Tool';

export class Line extends Tool {
  mouseDown: boolean = false;
  startX: number = 0;
  startY: number = 0;
  saved: string = '';

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
        method: 'draw',
        figure: {
          tool: 'line',
          startX: this.startX,
          startY: this.startY,
          x: e.offsetX,
          y: e.offsetY,
        },
        ...this.getOptions(),
      }),
    );
  }

  mouseDownHandler(e: MouseEvent): void {
    this.mouseDown = true;
    this.ctx.beginPath();
    this.startX = e.offsetX;
    this.startY = e.offsetY;
    this.ctx.moveTo(e.offsetX, e.offsetY);
    this.saved = this.canvas.toDataURL();
  }

  mouseMoveHandler(e: MouseEvent): void {
    if (this.mouseDown) {
      this.draw(e.offsetX, e.offsetY);
    }
  }

  draw(x: number, y: number) {
    const img = new Image();
    img.src = this.saved;
    img.onload = () => {
      this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
      this.ctx.drawImage(img, 0, 0, this.canvas.width, this.canvas.height);

      this.ctx.beginPath();
      this.ctx.moveTo(this.startX, this.startY);
      this.ctx.lineTo(x, y);
      this.ctx.stroke();
    };
  }

  static staticDraw(
    ctx: CanvasRenderingContext2D,
    startX: number,
    startY: number,
    x: number,
    y: number,
  ) {
    ctx.beginPath();
    ctx.moveTo(startX, startY);
    ctx.lineTo(x, y);
    ctx.fill();
    ctx.stroke();
  }
}

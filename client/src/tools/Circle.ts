import { Tool } from './Tool';

export class Circle extends Tool {
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
    const width = e.offsetX - this.startX;
    const height = e.offsetY - this.startY;
    this.socket.send(
      JSON.stringify({
        id: this.session,
        method: 'draw',
        figure: {
          tool: 'circle',
          x: this.startX,
          y: this.startY,
          width,
          height,
        },
      }),
    );
  }

  mouseDownHandler(e: MouseEvent): void {
    this.mouseDown = true;
    this.ctx.beginPath();
    this.startX = e.offsetX;
    this.startY = e.offsetY;
    this.saved = this.canvas.toDataURL();
  }

  mouseMoveHandler(e: MouseEvent): void {
    if (this.mouseDown) {
      const width = e.offsetX - this.startX;
      const height = e.offsetY - this.startY;
      this.draw(this.startX, this.startY, width, height);
    }
  }

  draw(x: number, y: number, w: number, h: number) {
    const img = new Image();
    img.src = this.saved;
    img.onload = () => {
      this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
      this.ctx.drawImage(img, 0, 0, this.canvas.width, this.canvas.height);

      this.ctx.beginPath();
      this.ctx.arc(x, y, Math.sqrt(w * w), 0, 2 * Math.PI);
      this.ctx.fill();
      this.ctx.stroke();
    };
  }

  static staticDraw(ctx: CanvasRenderingContext2D, x: number, y: number, w: number, h: number) {
    ctx.beginPath();
    ctx.arc(x, y, Math.sqrt(w * w), 0, 2 * Math.PI);
    ctx.fill();
    ctx.stroke();
  }
}

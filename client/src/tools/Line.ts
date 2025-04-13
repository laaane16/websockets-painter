import { Tool } from './Tool';

export class Line extends Tool {
  mouseDown: boolean = false;
  startX: number = 0;
  startY: number = 0;
  saved: string = '';

  constructor(canvas: HTMLCanvasElement) {
    super(canvas);
    this.listenEvents({
      mouseUpHandler: this.mouseUpHandler,
      mouseDownHandler: this.mouseDownHandler,
      mouseMoveHadler: this.mouseMoveHandler,
    });
  }

  mouseUpHandler(e: MouseEvent): void {
    this.mouseDown = false;
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
}

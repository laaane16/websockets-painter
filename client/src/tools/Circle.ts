import { Tool } from './Tool';

export class Circle extends Tool {
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
    this.saved = this.canvas.toDataURL();
  }

  mouseMoveHandler(e: MouseEvent): void {
    if (this.mouseDown) {
      const width = e.offsetX - this.startX;
      const height = e.offsetY - this.startY;
      this.draw(e.offsetX, e.offsetY, width, height);
    }
  }

  draw(x: number, y: number, w: number, h: number) {
    const img = new Image();
    img.src = this.saved;
    img.onload = () => {
      this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
      this.ctx.drawImage(img, 0, 0, this.canvas.width, this.canvas.height);

      this.ctx.beginPath();
      this.ctx.arc(this.startX, this.startY, Math.sqrt(w * w), 0, 2 * Math.PI);
      // this.ctx.fill();
      this.ctx.stroke();
    };
  }
}

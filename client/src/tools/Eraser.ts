import { Tool } from './Tool';

export class Eraser extends Tool {
  mouseDown: boolean = false;

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
    this.ctx.moveTo(e.offsetX, e.offsetY);
  }

  mouseMoveHandler(e: MouseEvent): void {
    if (this.mouseDown) {
      this.draw(e.offsetX, e.offsetY);
    }
  }

  draw(x: number, y: number) {
    this.ctx.strokeStyle = 'white';
    this.ctx.lineTo(x, y);
    this.ctx.stroke();
  }
}

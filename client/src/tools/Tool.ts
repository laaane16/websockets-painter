type CanvasEventHandler = (event: MouseEvent) => void;

export class Tool {
  canvas: HTMLCanvasElement;
  ctx: CanvasRenderingContext2D;
  socket: WebSocket;
  session: string;

  constructor(canvas: HTMLCanvasElement, socket: WebSocket, session: string) {
    this.canvas = canvas;
    this.socket = socket;
    this.session = session;
    this.ctx = canvas.getContext('2d') as CanvasRenderingContext2D;
    this.ctx.strokeStyle = 'black';
    this.destroyEvents();
  }

  setStrokeWidth(width: number) {
    this.ctx.lineWidth = width;
  }

  setStrokeColor(color: string) {
    this.ctx.strokeStyle = color;
  }

  setFillColor(color: string) {
    this.ctx.fillStyle = color;
  }

  getOptions() {
    return {
      lineWidth: this.ctx.lineWidth,
      strokeColor: this.ctx.strokeStyle,
      fillColor: this.ctx.fillStyle,
    };
  }

  listenEvents({
    mouseMoveHadler,
    mouseDownHandler,
    mouseUpHandler,
  }: {
    mouseMoveHadler: CanvasEventHandler;
    mouseDownHandler: CanvasEventHandler;
    mouseUpHandler: CanvasEventHandler;
  }) {
    this.canvas.onmousemove = mouseMoveHadler.bind(this);
    this.canvas.onmousedown = mouseDownHandler.bind(this);
    this.canvas.onmouseup = mouseUpHandler.bind(this);
  }

  destroyEvents() {
    this.canvas.onmousemove = null;
    this.canvas.onmousedown = null;
    this.canvas.onmouseup = null;
  }
}

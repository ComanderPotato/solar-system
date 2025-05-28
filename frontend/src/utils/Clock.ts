export class Clock {
  private lastTime: number = performance.now();
  private _delta: number = 0;
  private _elapsedTime: number = 0;
  private _running: boolean = true;
  private _timeScale: number = 1;

  private _startDate: Date;
  private _simulatedDate: Date;

  constructor(startDate: Date = new Date()) {
    this._startDate = new Date(startDate);
    this._simulatedDate = new Date(startDate);
  }

  get delta(): number {
    return this._delta;
  }

  get elapsedTime(): number {
    return this._elapsedTime;
  }

  get timeScale(): number {
    return this._timeScale;
  }

  set timeScale(value: number) {
    this._timeScale = value;
  }

  get startDate(): Date {
    return this._startDate;
  }

  get simulatedDate(): Date {
    return this._simulatedDate;
  }

  pause(): void {
    this._running = false;
  }

  resume(): void {
    this._running = true;
    this.lastTime = performance.now();
  }

  togglePause(): void {
    this._running ? this.pause() : this.resume();
  }

  update(): void {
    const currentTime = performance.now();
    const rawDelta = (currentTime - this.lastTime) / 1000;
    this.lastTime = currentTime;

    if (this._running) {
      this._delta = rawDelta * this._timeScale;
      this._elapsedTime += this._delta;

      this._simulatedDate = new Date(
        this._simulatedDate.getTime() + this._delta * 1000
      );
    } else {
      this._delta = 0;
    }
  }

  reset(toDate: Date = new Date()): void {
    this._startDate = new Date(toDate);
    this._simulatedDate = new Date(toDate);
    this._elapsedTime = 0;
    this.lastTime = performance.now();
  }
  public formattedTime = (): string => {
    return this._simulatedDate.toLocaleTimeString("en-AU", {
      hour: "2-digit",
      minute: "2-digit",
      second: "2-digit",
    });
  };
  public formattedDate = (): string => {
    return this._simulatedDate.toLocaleDateString("en-AU", {
      month: "short",
      day: "2-digit",
      year: "numeric",
    });
  };
}

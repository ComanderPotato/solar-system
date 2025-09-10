export default class Clock {
	private lastTime: number = performance.now();
	private _delta: number = 0;
	private _elapsedTime: number = 0;
	private _running: boolean = true;
	private _startDate: Date;
	private _simulatedDate: Date;

	constructor(startDate: Date = new Date()) {
		this._startDate = new Date(startDate);
		this._simulatedDate = new Date(startDate);
	}
	get isRunning(): boolean {
		return this._running;
	}
	get delta(): number {
		return this._delta;
	}
	get elapsedTime(): number {
		return this._elapsedTime;
	}

	get startDate(): Date {
		return this._startDate;
	}

	get simulatedDate(): Date {
		return this._simulatedDate;
	}
	set simulatedDate(value: Date) {
		this._simulatedDate = value;
	}

	public pause = (): void => {
		this._running = false;
	};

	public resume = (): void => {
		this._running = true;
		this.lastTime = performance.now();
	};

	public togglePause = (): void => {
		this._running ? this.pause() : this.resume();
	};

	public update = (): void => {
		const currentTime = performance.now();
		const rawDelta = (currentTime - this.lastTime) / 1000;
		this.lastTime = currentTime;

		if (this._running) {
			this._delta = rawDelta;
			this._elapsedTime += this._delta;
			// AppContext.instance.UIManager.updateDateTime(this.formattedSimDate(), this.formattedSimTime());
		} else {
			this._delta = 0;
		}
	};

	public reset = (toDate: Date = new Date()): void => {
		this._startDate = new Date(toDate);
		this._simulatedDate = new Date(toDate);
		this._elapsedTime = 0;
		this.lastTime = performance.now();
	};
	public formattedSimISO = (): string => {
		return this._simulatedDate.toISOString();
	};
	public formattedSimTime = (): string => {
		return this._simulatedDate.toLocaleTimeString("en-AU", {
			hour: "2-digit",
			minute: "2-digit",
			second: "2-digit",
		});
	};
	public formattedSimDate = (): string => {
		return this._simulatedDate.toLocaleDateString("en-AU", {
			month: "short",
			day: "2-digit",
			year: "numeric",
		});
	};
}

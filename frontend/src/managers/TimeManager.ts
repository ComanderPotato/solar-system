import Clock from "../utils/Clock";
import ITimeManager from "../interfaces/managers/ITimeManager";
import Manager from "../core/Manager";

export default class TimeManager extends Manager implements ITimeManager {
	private _accumulator: number = 0.0;
	private _timeStep: number = 1 / 60;
	private _timeScales = [
		-86400, -3600, -1800, -1200, -600, -60, -30, -3, -1, 1, 3, 30, 60, 600, 1200, 1800, 3600, 86400,
	];
	private _timeScaleIndex = Math.ceil(this._timeScales.length / 2);
	private _clock: Clock = new Clock();
	public constructor() {
		super();
	}
	get clock(): Clock {
		return this._clock;
	}
	public incrementTimeScale() {
		if (this._timeScaleIndex >= this._timeScales.length - 1) return;
		this._timeScaleIndex++;
	}
	public decrementTimeScale() {
		if (this._timeScaleIndex <= 0) return;
		this._timeScaleIndex--;
	}
	get accumulator(): number {
		return this._accumulator;
	}
	set accumulator(value: number) {
		this._accumulator = value;
	}
	get timeStep(): number {
		return this._timeStep;
	}
	get scaledTimeStep(): number {
		return this._timeStep * this._timeScales[this._timeScaleIndex];
	}
	get absoluteDelta(): number {
		return Math.abs(this.delta);
	}
	public get delta(): number {
		return this._clock.delta;
	}
	public get elapsedTime(): number {
		return this._clock.elapsedTime;
	}
	public get simulatedDate(): Date {
		return this._clock.simulatedDate;
	}
	public updateClock() {
		this._clock.update();
	}
	public pause(): void {
		this._clock.pause();
	}

	public resume(): void {
		this._clock.resume();
	}
	public getSimISO(): string {
		return this._clock.formattedSimISO();
	}
	public togglePause(): void {
		this._clock.togglePause();
	}
	public isRunning() {
		return this._clock.isRunning;
	}
	public reset(toDate: Date = new Date()): void {
		this._clock.reset(toDate);
		this._accumulator = 0;
	}
	public advanceSimulatedDate(delta: number): void {
		const current = this._clock.simulatedDate.getTime();
		this._clock.simulatedDate = new Date(current + delta * 1000);
	}
}

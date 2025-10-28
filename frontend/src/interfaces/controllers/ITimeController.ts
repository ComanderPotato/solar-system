export enum TimeChange {
	Decrease = -1,
	TogglePlay = 0,
	Increase = 1,
}

export default interface ITimeController {
	resetTime(): void;
	isClockRunning(): boolean;
	updateClock(): void;
	get absoluteDelta(): number;
	get accumulator(): number;
	set accumulator(value: number);
	get timeStep(): number;
	get scaledTimeStep(): number;
	advanceSimulatedDate(): void;

	accumulateDelta(frameRate: number): void;
	handleTimeChange(timeChange: TimeChange): void;
}

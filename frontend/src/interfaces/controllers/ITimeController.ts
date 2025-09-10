import IController from "../IController";
import ITimeManager from "../managers/ITimeManager";
export enum TimeChange {
	Decrease = -1,
	Pause = 0,
	Increase = 1,
}

export default interface ITimeController extends IController<ITimeManager> {
	resetTime(): void;
	isClockRunning(): boolean;
	updateClock(): void;
	get absoluteDelta(): number;
	get accumulator(): number;
	set accumulator(value: number);
	get timeStep(): number;
	get scaledTimeStep(): number;
	advanceSimulatedDate(): void;

	handleTimeChange(timeChange: TimeChange): void;
}

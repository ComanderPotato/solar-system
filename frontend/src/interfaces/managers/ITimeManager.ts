import Clock from "../../utils/Clock";
import IManager from "../IManager";

export default interface ITimeManager extends IManager {
	get clock(): Clock;
	incrementTimeScale(): void;
	decrementTimeScale(): void;
	get accumulator(): number;
	set accumulator(value: number);
	get timeStep(): number;
	get scaledTimeStep(): number;
	get absoluteDelta(): number;
	get delta(): number;
	get elapsedTime(): number;
	get simulatedDate(): Date;
	updateClock(): void;
	pause(): void;
	resume(): void;

	getSimISO(): string;
	togglePause(): void;
	isRunning(): boolean;
	reset(toData: Date): void;
	advanceSimulatedDate(delta: number): void;
}

import ITimeController, { TimeChange } from "../interfaces/controllers/ITimeController";
import Clock from "../utils/Clock";
import Controller from "../core/Controller";
import ITimeManager from "../interfaces/managers/ITimeManager";
export default class TimeController extends Controller<ITimeManager> implements ITimeController {
	public constructor(manager: ITimeManager) {
		super(manager);
	}
	handleTimeChange(timeChange: TimeChange): void {
		switch (timeChange) {
			case TimeChange.Decrease:
				this.manager.decrementTimeScale();
				break;
			case TimeChange.Pause:
				this.manager.pause();
				break;
			case TimeChange.Increase:
				this.manager.incrementTimeScale();
				break;
		}
	}

	initialiseScene?(): void {
		throw new Error("Method not implemented.");
	}
	// init(controllers: Map<Function, IController>): void {}
	destroy(): void {
		throw new Error("Method not implemented.");
	}
	get absoluteDelta(): number {
		return this.manager.absoluteDelta;
	}
	get accumulator(): number {
		return this.manager.accumulator;
	}
	set accumulator(value: number) {
		this.manager.accumulator = value;
	}
	get timeStep(): number {
		return this.manager.timeStep;
	}
	get scaledTimeStep(): number {
		return this.manager.scaledTimeStep;
	}
	advanceSimulatedDate(): void {
		this.manager.advanceSimulatedDate(this.scaledTimeStep);
	}
	resetTime(): void {
		throw new Error("Method not implemented.");
	}
	isClockRunning(): boolean {
		return this.manager.isRunning();
	}
	updateClock(): void {
		this.manager.updateClock();
	}
	get clock(): Clock {
		return this.manager.clock;
	}
}

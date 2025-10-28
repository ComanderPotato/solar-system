import ITimeController, { TimeChange } from "../interfaces/controllers/ITimeController";
import Clock from "../utils/Clock";
import Controller from "../core/Controller";
import ITimeManager from "../interfaces/managers/ITimeManager";
import IInjectableController from "../interfaces/IInjectableController";
import IAppContext from "../interfaces/IAppContext";
export default class TimeController extends Controller<ITimeManager> implements ITimeController, IInjectableController {
	public constructor(manager: ITimeManager) {
		super(manager);
	}

	injectControllers(appContext: IAppContext): void {
		this.uiController = appContext.uiController;
	}
	handleTimeChange(timeChange: TimeChange): void {
		switch (timeChange) {
			case TimeChange.Decrease:
				this.manager.decrementTimeScale();
				break;
			case TimeChange.TogglePlay:
				this.clock.isRunning ? this.manager.pause() : this.manager.resume();
				break;
			case TimeChange.Increase:
				this.manager.incrementTimeScale();
				break;
		}
	}
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
		this.uiController.handleDateTimeUpdate(
			this.manager.clock.formattedSimDate(),
			this.manager.clock.formattedSimTime(),
		);
	}
	get clock(): Clock {
		return this.manager.clock;
	}
	accumulateDelta(frameRate: number): void {
		// let delta = this.timeController.absoluteDelta;
		// if (delta > this.manager.FRAME_RATE) delta = this.manager.FRAME_RATE;
		// this.timeController.accumulator += delta;
		this.accumulator += Math.min(frameRate, this.absoluteDelta);
	}
}

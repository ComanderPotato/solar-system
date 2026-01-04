import Controller from "../core/Controller";
import Debugger from "../core/Debugger";
import IEngineController from "../interfaces/controllers/IEngineController";
import IAppContext from "../interfaces/IAppContext";
import IInjectableController from "../interfaces/IInjectableController";
import IEngineManager from "../interfaces/managers/IEngineManager";
export default class EngineController
	extends Controller<IEngineManager>
	implements IEngineController, IInjectableController
{
	private _lastLogTime = 0;
	public constructor(manager: IEngineManager) {
		super(manager);
	}
	public injectControllers(appContext: IAppContext): void {
		this.timeController = appContext.timeController;
		this.dataController = appContext.dataController;
		this.sceneController = appContext.sceneController;
		this.solarSystemController = appContext.solarSystemController;
		this.rendererController = appContext.rendererController;
	}
	start(): void {
		this.sceneController.setRenderLoop(() => {
			this.handleRenderLoop();
		});
	}
	stop(): void {
		this.sceneController.setRenderLoop(null);
	}
	accumulateDelta(): void {
		let delta = this.timeController.absoluteDelta;
		if (delta > this.manager.FRAME_RATE) delta = this.manager.FRAME_RATE;
		this.timeController.accumulator += delta;
	}
	private handleSimulationLoop(): void {
		while (this.timeController.accumulator >= this.timeController.timeStep) {
			this.timeController.advanceSimulatedDate();
			this.sceneController.handleCameraMovement(this.timeController.scaledTimeStep);
			this.solarSystemController.handleSimulation(this.timeController.scaledTimeStep);
			this.timeController.accumulator -= this.timeController.timeStep;
		}
	}
	private handleRenderLoop(): void {
		this.sceneController.handleRender();
		Debugger.run();
		if (!this.timeController.isClockRunning()) {
			this.sceneController.handleCameraMovement();
			this.rendererController.updateRenderables();
			return;
		}
		this.timeController.updateClock();

		if (this.dataController.isLoading()) return;

		this.timeController.accumulateDelta(this.manager.FRAME_RATE);
		this.handleSimulationLoop();
	}
	debugger(callback: () => void): void {
		const now = performance.now();
		if (now - this._lastLogTime >= 3000) {
			callback();
			this._lastLogTime = now;
		}
	}
	destroy(): void {
		throw new Error("Method not implemented.");
	}
}

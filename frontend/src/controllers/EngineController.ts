import Controller from "../core/Controller";
import IEngineController from "../interfaces/controllers/IEngineController";
import IAppContext from "../interfaces/IAppContext";
import IEngineManager from "../interfaces/managers/IEngineManager";

export default class EngineController extends Controller<IEngineManager> implements IEngineController {
	public constructor(manager: IEngineManager) {
		super(manager);
	}
	protected injectControllers(appContext: IAppContext): void {
		this.timeController = appContext.timeController;
		this.dataController = appContext.dataController;
		this.sceneController = appContext.sceneController;
	}
	handleRenderLoop(): void {
		requestAnimationFrame(this.manager.animate);
		if (this.timeController.isClockRunning()) {
			this.timeController.updateClock();
			if (this.dataController.isLoading()) return;

			// Can probably refactor to function inside TimeController
			let delta = this.timeController.absoluteDelta;
			if (delta > this.manager.FRAME_RATE) delta = this.manager.FRAME_RATE;
			this.timeController.accumulator += delta;

			while (this.timeController.accumulator >= this.timeController.timeStep) {
				this.timeController.advanceSimulatedDate();
				// this.sceneController.moveCameraWithFocused(
				// 	this.solarSystemController.focusedCelestialBody,
				// 	this.timeController.scaledTimeStep,
				// );
				this.sceneController.handleCameraMovement(this.timeController.scaledTimeStep);
				// this.solarSystem.simulate(this.timeController.scaledTimeStep);
				this.solarSystemController.simulate(this.timeController.scaledTimeStep);
				this.timeController.accumulator -= this.timeController.timeStep;
			}
		} else {
			this.sceneController.handleCameraMovement();
			// this.solarSystem.updateDetail();
			this.solarSystemController.updateDetail();
		}
		this.sceneController.handleRender();
	}
	destroy(): void {
		throw new Error("Method not implemented.");
	}
}

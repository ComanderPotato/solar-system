import IAppController from "../interfaces/IAppController";
import Controller from "../core/Controller";
import IManager from "../interfaces/IManager";
import IAppContext from "../interfaces/IAppContext";
export default class AppController extends Controller<any> implements IAppController {
	// _celestialBodyController: CelestialBodyController = CelestialBodyController.instance;
	// _sceneController: SceneController = SceneController.instance;
	// _uiController: UIController = UIController.instance;
	// _timeController: TimeController = TimeController.instance;
	// _dataController: DataController = DataController.instance;
	// _solarSystemController: SolarSystemController = SolarSystemController.instance;
	// _assetController: AssetController = AssetController.instance;
	private _fps: number = 24;
	private FRAME_RATE: number = 1 / this._fps;

	// protected controllers: Map<Function, IController>;
	private constructor(manager: IManager) {
		super(manager);
	}

	public injectControllers(appContext: IAppContext): void {
		this.assetController = appContext.assetController;
		this.sceneController = appContext.sceneController;
	}
	// private _appContext: IAppContext;
	// injectManagers(appContext: IAppContext) {
	// 	this._appContext = appContext;
	// }
	initialise(): void {
		// Inject controllers into others that need it, remove what i don't need
		// this._celestialBodyController.injectControllers(BaseController.controllers);
		// this._sceneController.injectControllers(BaseController.controllers);
		// this._uiController.injectControllers(BaseController.controllers);
		// this._timeController.injectControllers(BaseController.controllers);
		// this._solarSystemController.injectControllers(BaseController.controllers);
		// this._solarSystemController.injectControllers(BaseController.controllers);
		// this._dataController.injectControllers(BaseController.controllers);
		// this._assetController.injectControllers(BaseController.controllers);
	}
	destroy(): void {
		throw new Error("Method not implemented.");
	}

	public renderLoop(): void {
		// const animate = () => {
		// 	requestAnimationFrame(animate);
		// 	if (this._timeController.isClockRunning()) {
		// 		this._timeController.updateClock();
		// 		if (this._dataController.isLoading()) return;
		// 		let delta = this._timeController.absoluteDelta;
		// 		if (delta > this.FRAME_RATE) delta = this.FRAME_RATE;
		// 		this._timeController.accumulator += delta;
		//
		// 		while (this._timeController.accumulator >= this._timeController.timeStep) {
		// 			this._timeController.advanceSimulatedDate();
		// 			this._sceneController.moveCameraWithFocused(
		// 				this._solarSystemController.focusedCelestialBody,
		// 				this._timeController.scaledTimeStep,
		// 			);
		// 			// this.solarSystem.simulate(this._timeController.scaledTimeStep);
		// 			this._solarSystemController.simulate(this._timeController.scaledTimeStep);
		// 			this._timeController.accumulator -= this._timeController.timeStep;
		// 		}
		// 	} else {
		// 		this._sceneController.moveCameraWithFocused(this._solarSystemController.focusedCelestialBody);
		// 		// this.solarSystem.updateDetail();
		// 		this._solarSystemController.updateDetail();
		// 	}
		// 	this._sceneController.render();
		// };
		// animate();
	}
}

import IAssetController from "../interfaces/controllers/IAssetController";
import ICelestialBodyController from "../interfaces/controllers/ICelestialBodyController";
import IDataController from "../interfaces/controllers/IDataController";
import IEngineController from "../interfaces/controllers/IEngineController";
import IRendererController from "../interfaces/controllers/IRendererController";
import ISceneController from "../interfaces/controllers/ISceneController";
import ISolarSystemController from "../interfaces/controllers/ISolarSystemController";
import ITimeController from "../interfaces/controllers/ITimeController";
import IUIController from "../interfaces/controllers/IUIController";
import IController from "../interfaces/IController";
import IManager from "../interfaces/IManager";
import IAppContext from "../interfaces/IAppContext";
import IViewController from "../interfaces/controllers/IViewController";
export default abstract class Controller<T extends IManager = IManager> implements IController<T> {
	// protected _context: IAppContext;
	protected _manager: T;
	private _assetController?: IAssetController;
	private _rendererController?: IRendererController;
	private _celestialBodyController?: ICelestialBodyController;
	private _dataController?: IDataController;
	private _engineController?: IEngineController;
	private _sceneController?: ISceneController;
	private _solarSystemController?: ISolarSystemController;
	private _timeController?: ITimeController;
	private _uiController?: IUIController;
	private _viewController?: IViewController;

	// get context(): IAppContext {
	// 	return this._context;
	// }
	get manager(): T {
		return this._manager;
	}

	// constructor(context: IAppContext, manager: T) {
	// 	this._context = context;
	// 	this._manager = manager;
	// }
	constructor(manager: T) {
		this._manager = manager;
	}

	// private context!: IAppContext;
	// injectControllers(appContext: IAppContext): void {
	// 	this.context = appContext;
	// }
	// protected get rendererController(): IRendererController {
	// 	return this.context.rendererController;
	// }
	// public injectControllers?(appContext: IAppContext): void;

	protected get viewController(): IViewController {
		return this.require(this._viewController, "View controller");
	}
	protected set viewController(controller: IViewController) {
		this._viewController = controller;
	}
	protected get rendererController(): IRendererController {
		return this.require(this._rendererController, "Renderer controller");
	}
	protected set rendererController(controller: IRendererController) {
		this._rendererController = controller;
	}
	protected get assetController(): IAssetController {
		return this.require(this._assetController, "Asset controller");
	}
	protected set assetController(controller: IAssetController) {
		this._assetController = controller;
	}
	protected get celestialBodyController(): ICelestialBodyController {
		return this.require(this._celestialBodyController, "Celestial body controller");
	}

	protected set celestialBodyController(controller: ICelestialBodyController) {
		this._celestialBodyController = controller;
	}
	protected get dataController(): IDataController {
		return this.require(this._dataController, "Data controller");
	}

	protected set dataController(controller: IDataController) {
		this._dataController = controller;
	}
	protected get engineController(): IEngineController {
		return this.require(this._engineController, "Engine controller");
	}
	protected set engineController(controller: IEngineController) {
		this._engineController = controller;
	}

	protected get sceneController(): ISceneController {
		return this.require(this._sceneController, "Scene controller");
	}

	protected set sceneController(controller: ISceneController) {
		this._sceneController = controller;
	}
	protected get solarSystemController(): ISolarSystemController {
		return this.require(this._solarSystemController, "Solar system controller");
	}
	protected set solarSystemController(controller: ISolarSystemController) {
		this._solarSystemController = controller;
	}
	protected get timeController(): ITimeController {
		return this.require(this._timeController, "Time controller");
	}
	protected set timeController(controller: ITimeController) {
		this._timeController = controller;
	}
	protected get uiController(): IUIController {
		return this.require(this._uiController, "UI controller");
	}
	protected set uiController(controller: IUIController) {
		this._uiController = controller;
	}
	private require<T>(value: T | undefined, name: string): T {
		if (!value) throw new Error(`${name} not set on ${this.constructor.name}`);
		return value;
	}
}

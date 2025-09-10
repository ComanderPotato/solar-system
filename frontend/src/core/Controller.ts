import IAssetController from "../interfaces/controllers/IAssetController";
import ICelestialBodyController from "../interfaces/controllers/ICelestialBodyController";
import IDataController from "../interfaces/controllers/IDataController";
import IEngineController from "../interfaces/controllers/IEngineController";
import ISceneController from "../interfaces/controllers/ISceneController";
import ISolarSystemController from "../interfaces/controllers/ISolarSystemController";
import ITimeController from "../interfaces/controllers/ITimeController";
import IUIController from "../interfaces/controllers/IUIController";
import IAppContext from "../interfaces/IAppContext";
import IController from "../interfaces/IController";
import IManager from "../interfaces/IManager";
export default abstract class Controller<T extends IManager> implements IController<T> {
	protected _manager: T;
	private _assetController?: IAssetController | undefined;
	private _celestialBodyController?: ICelestialBodyController;
	private _dataController?: IDataController | undefined;
	private _engineController?: IEngineController;
	private _sceneController?: ISceneController;
	private _solarSystemController?: ISolarSystemController;
	private _timeController?: ITimeController;
	private _uiController?: IUIController;

	get manager(): T {
		return this._manager;
	}

	constructor(manager: T) {
		this._manager = manager;
	}

	protected injectControllers?(appContext: IAppContext): void;

	get assetController(): IAssetController {
		return this.require(this._assetController, "Asset controller");
	}
	set assetController(controller: IAssetController) {
		this._assetController = controller;
	}
	get celestialBodyController(): ICelestialBodyController {
		return this.require(this._celestialBodyController, "Celestial body controller");
	}

	set celestialBodyController(controller: ICelestialBodyController) {
		this._celestialBodyController = controller;
	}
	get dataController(): IDataController {
		return this.require(this._dataController, "Data controller");
	}

	set dataController(controller: IDataController) {
		this._dataController = controller;
	}
	get engineController(): IEngineController {
		return this.require(this._engineController, "Engine controller");
	}
	set engineController(controller: IEngineController) {
		this._engineController = controller;
	}

	get sceneController(): ISceneController {
		return this.require(this._sceneController, "Scene controller");
	}

	set sceneController(controller: ISceneController) {
		this._sceneController = controller;
	}
	get solarSystemController(): ISolarSystemController {
		return this.require(this._solarSystemController, "Solar system controller");
	}
	set solarSystemController(controller: ISolarSystemController) {
		this._solarSystemController = controller;
	}
	get timeController(): ITimeController {
		return this.require(this._timeController, "Time controller");
	}
	set timeController(controller: ITimeController) {
		this._timeController = controller;
	}
	get uiController(): IUIController {
		return this.require(this._uiController, "UI controller");
	}
	set uiController(controller: IUIController) {
		this._uiController = controller;
	}
	private require<T>(value: T | undefined, name: string): T {
		if (!value) throw new Error(`${name} not set on ${this.constructor.name}`);
		return value;
	}
}

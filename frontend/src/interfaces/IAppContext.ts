import IAssetController from "./controllers/IAssetController";
import ICelestialBodyController from "./controllers/ICelestialBodyController";
import IDataController from "./controllers/IDataController";
import IEngineController from "./controllers/IEngineController";
import ISceneController from "./controllers/ISceneController";
import ISolarSystemController from "./controllers/ISolarSystemController";
import ITimeController from "./controllers/ITimeController";
import IUIController from "./controllers/IUIController";
import IAssetManager from "./managers/IAssetManager";
import ICelestialBodyManager from "./managers/ICelestialBodyManager";
import IDataManager from "./managers/IDataManager";
import IEngineManager from "./managers/IEngineManager";
import ISceneManager from "./managers/ISceneManager";
import ISolarSystemManager from "./managers/ISolarSystemManager";
import ITimeManager from "./managers/ITimeManager";
import IUIManager from "./managers/IUIManager";

export default interface IAppContext {
	dataManager: IDataManager;
	timeManager: ITimeManager;
	uiManager: IUIManager;
	assetManager: IAssetManager;
	engineManager: IEngineManager;
	celestialBodyManager: ICelestialBodyManager;
	solarSystemManager: ISolarSystemManager;
	sceneManager: ISceneManager;

	assetController: IAssetController;
	celestialBodyController: ICelestialBodyController;
	dataController: IDataController;
	sceneController: ISceneController;
	engineController: IEngineController;
	solarSystemController: ISolarSystemController;
	timeController: ITimeController;
	uiController: IUIController;

	initialiseContext(): void;
}

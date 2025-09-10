import Singleton from "./Singleton";
import IAppContext from "../interfaces/IAppContext";
import CelestialBodyController from "../controllers/CelestialBodyController";
import DataController from "../controllers/DataController";
import SolarSystemController from "../controllers/SolarSystemController";
import TimeController from "../controllers/TimeController";
import UIController from "../controllers/UIController";
import AssetController from "../controllers/AssetController";
import AssetManager from "../managers/AssetManager";
import CelestialBodyManager from "../managers/CelestialBodyManager";
import DataManager from "../managers/DataManager";
import SceneManager from "../managers/SceneManager";
import SolarSystemManager from "../managers/SolarSystemManager";
import TimeManager from "../managers/TimeManager";
import UIManager from "../managers/UIManager";
import ISceneController from "../interfaces/controllers/ISceneController";
import SceneController from "../controllers/SceneController";
import IEngineController from "../interfaces/controllers/IEngineController";
import IEngineManager from "../interfaces/managers/IEngineManager";
import EngineController from "../controllers/EngineController";
import EngineManager from "../managers/EngineManager";

export default class AppContext extends Singleton implements IAppContext {
	celestialBodyController!: CelestialBodyController;
	dataController!: DataController;
	solarSystemController!: SolarSystemController;
	timeController!: TimeController;
	assetController!: AssetController;
	sceneController!: ISceneController;
	uiController!: UIController;

	dataManager!: DataManager;
	timeManager!: TimeManager;
	uiManager!: UIManager;
	assetManager!: AssetManager;
	celestialBodyManager!: CelestialBodyManager;
	solarSystemManager!: SolarSystemManager;
	sceneManager!: SceneManager;
	private constructor() {
		super();
	}
	engineManager!: IEngineManager;
	engineController!: IEngineController;
	initialiseContext() {
		this.initialiseManagers();
		this.initialiseControllers();
	}
	private injectManagers() {}

	private initialiseControllers(): void {
		this.dataController = new DataController(this.dataManager);
		this.celestialBodyController = new CelestialBodyController(this.celestialBodyManager);
		this.timeController = new TimeController(this.timeManager);
		this.solarSystemController = new SolarSystemController(this.solarSystemManager);
		this.assetController = new AssetController(this.assetManager);
		this.sceneController = new SceneController(this.sceneManager);
		this.uiController = new UIController(this.uiManager);
		this.engineController = new EngineController(this.engineManager);
	}
	private initialiseManagers(): void {
		this.dataManager = new DataManager();
		this.celestialBodyManager = new CelestialBodyManager();
		this.timeManager = new TimeManager();
		this.solarSystemManager = new SolarSystemManager();
		this.assetManager = new AssetManager(
			() => {},
			() => {},
		);
		this.uiManager = new UIManager();
		this.engineManager = new EngineManager();
	}
	public static override get instance(): AppContext {
		return AppContext.getInstance(AppContext, () => new AppContext());
	}
}

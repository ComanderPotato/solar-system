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
import IRendererManager from "../interfaces/managers/IRendererManager";
import IRendererController from "../interfaces/controllers/IRendererController";
import RendererController from "../controllers/RendererController";
import RendererManager from "../managers/RendererManager";
import IManager from "../interfaces/IManager";
import IController from "../interfaces/IController";
import IInjectableController from "../interfaces/IInjectableController";
import EventBus from "./EventBus";
import RequestBus from "./RequestBus";
import IInitializable from "../interfaces/IInitializable";
import ViewController from "../controllers/ViewController";
import ViewManager from "../managers/ViewManager";

type RequestMap = {
	"planet:getInfo": { request: { id: string }; response: { name: string; mass: number } };
	"asset:getTexture": { request: { path: string }; response: { textureUrl: string } };
};
type EventMap = {
	"time:tick": { delta: number };
};
type ControllerKey =
	| "assetController"
	| "celestialBodyController"
	| "dataController"
	| "engineController"
	| "rendererController"
	| "sceneController"
	| "solarSystemController"
	| "timeController"
	| "uiController"
	| "viewController";

type ManagerKey =
	| "assetManager"
	| "celestialBodyManager"
	| "dataManager"
	| "engineManager"
	| "rendererManager"
	| "sceneManager"
	| "solarSystemManager"
	| "timeManager"
	| "uiManager"
	| "viewManager";
interface ControllerConfig<M extends IManager> {
	Controller: new (...args: any[]) => IController<M>;
	manager: () => M;
	key: ControllerKey;
}
interface ManagerConfig {
	Manager: new () => IManager;
	key: ManagerKey;
}
// type ControllerEntry<C extends IManager> = [new (...args: any[]) => IController<C>, () => C, string];
export default class AppContext extends Singleton implements IAppContext {
	private controllerConfigs: ControllerConfig<IManager>[] = [
		{ Controller: AssetController, manager: () => this.assetManager, key: "assetController" },
		{
			Controller: CelestialBodyController,
			manager: () => this.celestialBodyManager,
			key: "celestialBodyController",
		},
		{ Controller: DataController, manager: () => this.dataManager, key: "dataController" },
		{ Controller: EngineController, manager: () => this.engineManager, key: "engineController" },
		{ Controller: RendererController, manager: () => this.rendererManager, key: "rendererController" },
		{ Controller: SceneController, manager: () => this.sceneManager, key: "sceneController" },
		{ Controller: SolarSystemController, manager: () => this.solarSystemManager, key: "solarSystemController" },
		{ Controller: TimeController, manager: () => this.timeManager, key: "timeController" },
		{ Controller: UIController, manager: () => this.uiManager, key: "uiController" },
		{ Controller: ViewController, manager: () => this.viewController, key: "viewController" },
	];
	private managerConfigs: ManagerConfig[] = [
		{ Manager: AssetManager, key: "assetManager" },
		{
			Manager: CelestialBodyManager,
			key: "celestialBodyManager",
		},
		{ Manager: DataManager, key: "dataManager" },
		{ Manager: EngineManager, key: "engineManager" },
		{ Manager: RendererManager, key: "rendererManager" },
		{ Manager: SceneManager, key: "sceneManager" },
		{ Manager: SolarSystemManager, key: "solarSystemManager" },
		{ Manager: TimeManager, key: "timeManager" },
		{ Manager: UIManager, key: "uiManager" },
		{ Manager: ViewManager, key: "viewManager" },
	];
	eventBus: EventBus<EventMap> = new EventBus<EventMap>();
	requestBus: RequestBus<RequestMap> = new RequestBus<RequestMap>();

	// =================== Controllers ===================
	assetController!: AssetController;
	celestialBodyController!: CelestialBodyController;
	dataController!: DataController;
	engineController!: IEngineController;
	rendererController!: IRendererController;
	sceneController!: ISceneController;
	solarSystemController!: SolarSystemController;
	timeController!: TimeController;
	uiController!: UIController;
	viewController!: ViewController;

	// =================== Managers ===================
	assetManager!: AssetManager;
	celestialBodyManager!: CelestialBodyManager;
	dataManager!: DataManager;
	engineManager!: IEngineManager;
	rendererManager!: IRendererManager;
	sceneManager!: SceneManager;
	solarSystemManager!: SolarSystemManager;
	timeManager!: TimeManager;
	uiManager!: UIManager;
	viewManager!: ViewManager;
	private constructor() {
		super();
	}

	initialiseContext() {
		this.initialiseManagers();
		this.initialiseControllers();
	}

	private _controllers?: IController[];
	private get controllers(): IController[] {
		if (!this._controllers) {
			this._controllers = [];
			for (const [key, value] of Object.entries(this)) {
				if (this.isController(value)) {
					this._controllers.push(value);
				}
			}
		}
		return this._controllers;
	}
	private isController(controller: unknown): controller is IController {
		return typeof (controller as IController).injectControllers === "function";
	}
	private injectControllers(): void {
		for (const { key } of this.controllerConfigs) {
			const controller = (this as any)[key];
			if (this.isInjectable(controller)) controller.injectControllers(this);
		}
	}

	private hasMethod<T extends object>(obj: unknown, method: keyof T): obj is T {
		return typeof (obj as T)[method] === "function";
	}
	private isInjectable(controller: any): controller is IInjectableController {
		return typeof (controller as IInjectableController).injectControllers === "function";
	}
	private isInitializable(controller: any): controller is IInitializable {
		return typeof (controller as IInitializable).init === "function";
	}
	private initialiseControllers(): void {
		const injectionQueue: (() => void)[] = [];
		const initQueue: (() => void)[] = [];
		for (const { Controller, manager, key } of this.controllerConfigs) {
			const mgr = manager();
			const controller = new Controller(mgr);
			(this as any)[key] = controller;
			if (this.isInjectable(controller)) injectionQueue.push(() => controller.injectControllers(this));
			if (this.isInitializable(controller)) initQueue.push(() => controller.init());
		}
		injectionQueue.forEach((inject) => inject());
		initQueue.forEach((init) => init());
	}
	private initialiseManagers(): void {
		for (const { Manager, key } of this.managerConfigs) {
			const manager = new Manager();
			(this as any)[key] = manager;
			if (this.isInitializable(manager)) manager.init();
		}
	}
	public static override get instance(): AppContext {
		return AppContext.getInstance(AppContext, () => new AppContext());
	}
}

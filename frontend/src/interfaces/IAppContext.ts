import IAssetController from "./controllers/IAssetController";
import ICelestialBodyController from "./controllers/ICelestialBodyController";
import IDataController from "./controllers/IDataController";
import IEngineController from "./controllers/IEngineController";
import IRendererController from "./controllers/IRendererController";
import ISceneController from "./controllers/ISceneController";
import ISolarSystemController from "./controllers/ISolarSystemController";
import ITimeController from "./controllers/ITimeController";
import IUIController from "./controllers/IUIController";
import IAssetManager from "./managers/IAssetManager";
import ICelestialBodyManager from "./managers/ICelestialBodyManager";
import IDataManager from "./managers/IDataManager";
import IEngineManager from "./managers/IEngineManager";
import IRendererManager from "./managers/IRendererManager";
import ISceneManager from "./managers/ISceneManager";
import ISolarSystemManager from "./managers/ISolarSystemManager";
import ITimeManager from "./managers/ITimeManager";
import IUIManager from "./managers/IUIManager";

export default interface IAppContext {
	// eventBus: EventBus;
	// ==================== Managers ====================
	/*
	 * Responsible for caching and lifecycle of assets
	 * Loads raw asset data once
	 * handles memory cleanup and reuse
	 * works with AssetController for fetching
	 */
	assetManager: IAssetManager;
	/*
	 * Maintains the state and references for all celestial bodies in simulation
	 * keeps track of planets, moons, stars, etc
	 * updates orbital/physical properties over
	 * provides access to body instances for rendering and simulation
	 */
	celestialBodyManager: ICelestialBodyManager;
	/* Handles storage, retrieval, and updating of all data
	 * Manages single CelestialBody
	 * maintains simulation data
	 * provides efficient querying and caching
	 * interfaces with persistance
	 */
	dataManager: IDataManager;
	/*
	 * Orchestrates the core engine loop
	 * manages update cycles (physics, rendering, input)
	 * calls tick/update methods on managers/controllers
	 * provides hooks for starting, stopping, or reconfiguring the engine
	 */
	engineManager: IEngineManager;
	/*
	 * Responsible for creating, maintating, and updating renderers
	 * manages the rendering pipeline
	 * keeps track of active renderers for bodies, UI, scenes, etc
	 * provides references to renderers to controllers
	 */
	rendererManager: IRendererManager;
	/*
	 * Handles Three.js scenes
	 * Creates, switches, and maintains active scenes
	 * Adds/removes objects, lights cameras
	 * provides access for rendering pipeline
	 */
	sceneManager: ISceneManager;
	/* higher-level manager specifically for solar system structures
	 * groups celestial bodies into systems
	 * updates relative interactions between system components (orbits, gravity)
	 * acts as a container for CelestialBodyManager
	 */
	solarSystemManager: ISolarSystemManager;
	/*
	 * Central authority for simulation/game time
	 * tracks current simulation time, deltas, scaling
	 * coordinates with physics and rendering updates
	 * allows pause/resume/rewind
	 */
	timeManager: ITimeManager;
	/*
	 * Handles the low-level state of UI elements
	 * maintains visibility, positioning, and lifecycle of UI components
	 * provides hooks for UI controllers to update state
	 * abstracts the UI framework away from the core logic
	 */
	uiManager: IUIManager;

	// ==================== Controllers ====================
	/*
	 * On-demand access and preparation
	 * Provides methods like getTexture(path)
	 * resolves asset requests into usable GPU-ready objects
	 * relies on AssetManager for caching and storage
	 */
	assetController: IAssetController;
	/*
	 * Commands for creating/update celestial bodies
	 * builds meshes, applies textures, sets materails
	 * updates body states on request
	 * delegates persistenmt storage/state to CelestialBodyManager
	 */
	celestialBodyController: ICelestialBodyController;
	/*
	 * Interfaces with data
	 * Loads simulation configs
	 * saves user changes
	 * delegates persistance to DataManager
	 */
	dataController: IDataController;
	/*
	 * commands to control the engine lifecycle
	 * start/stop/restart engine
	 * change frame rate, update step logic
	 * delegates scheduling to EngineManager
	 */
	engineController: IEngineController;
	/*
	 * High-level commands for rendering
	 * applies textures/materials to objects
	 * configures rendering modes
	 * delegates low-level rendering work to rendererManager
	 */
	rendererController: IRendererController;
	/* High-level scene operations
	 * switch scenes, reset scene, add/remove body groups
	 * trigger camera changes
	 * delegates object lifecycle to SceneManager
	 */
	sceneController: ISceneController;
	/*
	 * commands related to solar system configuration
	 * add/remove planets from system
	 * switch active solar system
	 * delegates structure/state to SolarSystemManager
	 */
	solarSystemController: ISolarSystemController;
	/*
	 * Commands for manipulating time
	 * Pause, resume, speed up, rewind
	 * set absolute/relative time
	 * delegates to TimeManger
	 */
	timeController: ITimeController;
	/*
	 * Commands for interfacing with UI elements
	 * show/hide panels, update labels
	 * handle user input actions
	 * delegates state management to UIManager
	 */
	uiController: IUIController;

	initialiseContext(): void;
}

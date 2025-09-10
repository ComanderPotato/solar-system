import { CSS2DObject } from "three/examples/jsm/Addons.js";
import CelestialBody from "../../models/CelestialBody";
import IController from "../IController";
import IUIManager from "../managers/IUIManager";
export default interface IUIController extends IController<IUIManager> {
	// setLoadScreenState(state: LoadScreenState): void;
	handleLoadScreenStateChange(isLoading: boolean): void;
	handleRateChange(): void;
	// handleListenerInitialisation(): void;

	handleInformationPanel(body: CelestialBody, extract: string): void;

	updateParameterInformation(): void;

	updateUIPanel(body: CelestialBody, summary: string): void;
	initialiseCelestialBodyUI(body: CelestialBody): CSS2DObject;
	attachCelestialBodyListeners(body: CelestialBody): void;
	removeCelestialBodyListeners(body: CelestialBody): void;
	handleCelestialBodyUI(body: CelestialBody): void;
	// destroyCelestialBodyUI(body: CelestialBody): void;
}

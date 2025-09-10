import { CSS2DObject, LineMaterial } from "three/examples/jsm/Addons.js";
import IUIController from "../interfaces/controllers/IUIController";
import Controller from "../core/Controller";
import { TimeChange } from "../interfaces/controllers/ITimeController";
import CelestialBody from "../models/CelestialBody";
import { CelestialBodyColour, CelestialBodyColourHover } from "../utils/constants";
import IAppContext from "../interfaces/IAppContext";
import IUIManager from "../interfaces/managers/IUIManager";
import { BodyTypes } from "../types/CelestialBodyMetadata";

export default class UIController extends Controller<IUIManager> implements IUIController {
	public constructor(manager: IUIManager) {
		super(manager);
		this.handleListenerInitialisation();
	}
	updateParameterInformation(): void {
		throw new Error("Method not implemented.");
	}
	injectManager(manager: IUIManager): void {
		this._manager = manager;
	}
	injectControllers(appContext: IAppContext): void {
		this.timeController = appContext.timeController;
		this.sceneController = appContext.sceneController;
	}
	initialiseScene?(): void {
		throw new Error("Method not implemented.");
	}

	destroy(): void {
		throw new Error("Method not implemented.");
	}

	// IUIController Methods
	public handleLoadScreenStateChange(isLoading: boolean): void {
		this.manager.updateLoadScreenState(isLoading);
	}
	public handleRateChange(): void {
		if (!this.timeController.isClockRunning()) {
			this.manager.updateRateChange(0);
		} else {
			this.manager.updateRateChange(this.timeController.scaledTimeStep);
		}
	}
	public handleInformationPanel(body: CelestialBody, extract: string): void {
		throw new Error("Method not implemented.");
	}
	public updateUIPanel(body: CelestialBody, summary: string): void {
		this.manager.updateInformationPanel(body, summary);
	}
	public initialiseCelestialBodyUI(body: CelestialBody): CSS2DObject {
		const { EnglishName: englishName, BodyType: bodyType } = body.metadata;
		const containerElement = this.initialiseCelestialBodyContainer(bodyType);
		containerElement.append(
			this.initialiseCelestialBodyIcon(englishName, bodyType),
			this.initialiseCelestialBodyLabel(englishName),
		);
		return new CSS2DObject(containerElement);
	}
	attachCelestialBodyListeners(body: CelestialBody): void {
		body.container.element.addEventListener("click", () => this.handleClick(body));
		body.container.element.addEventListener("mouseover", () => this.handleHover(body));
		body.container.element.addEventListener("mouseleave", () => this.handleLeave(body));
	}
	removeCelestialBodyListeners(body: CelestialBody): void {
		body.container.element.removeEventListener("click", () => this.handleClick(body));
		body.container.element.removeEventListener("mouseover", () => this.handleHover(body));
		body.container.element.removeEventListener("mouseleave", () => this.handleLeave(body));
	}
	private initialiseCelestialBodyContainer(bodyType: BodyTypes): HTMLDivElement {
		const containerElement = document.createElement("div");
		containerElement.style.pointerEvents = "auto";
		containerElement.className = `celestial-body--label ${bodyType.toLowerCase()} clickable selection`;
		return containerElement;
	}
	private initialiseCelestialBodyLabel(englishName: string): HTMLSpanElement {
		const labelElement = document.createElement("span");
		labelElement.textContent = englishName;
		labelElement.className = `text`;
		return labelElement;
	}
	private initialiseCelestialBodyIcon(englishName: string, bodyType: BodyTypes): HTMLSpanElement {
		const iconElement = document.createElement("span");
		const suffix = bodyType === "Moon" ? "white" : englishName.toLowerCase();
		iconElement.className = `icon icon-circle--${suffix}`;
		return iconElement;
	}
	handleCelestialBodyUI(body: CelestialBody): CelestialBody {
		const container = this.initialiseCelestialBodyUI(body);
		container.visible = true;
		body.celestialBodyGroup.add(body.container);
		this.attachCelestialBodyListeners(body);
		return body;
	}
	private handleListenerInitialisation(): void {
		const { toggleButton, collapseButton, decreaseTimeButton, pauseTimeButton, increaseTimeButton } = this.manager;
		const { lerpDestination: isLerping } = this.sceneController.sceneResources;

		toggleButton.addEventListener("click", () => {
			if (isLerping) return;
			this.manager.updateSummary();
		});
		collapseButton.addEventListener("click", () => {
			if (isLerping) return;
			this.manager.updateInfoPanel();
		});
		decreaseTimeButton.addEventListener("click", () => {
			if (isLerping) return;
			this.timeController.handleTimeChange(TimeChange.Decrease);
			this.handleRateChange();
		});
		pauseTimeButton.addEventListener("click", () => {
			if (isLerping) return;
			this.timeController.handleTimeChange(TimeChange.Pause);
			this.manager.updateTimeButton();
		});
		increaseTimeButton.addEventListener("click", () => {
			if (isLerping) return;
			this.timeController.handleTimeChange(TimeChange.Increase);
			this.handleRateChange();
		});
	}

	protected handleClick(body: CelestialBody): void {
		if (this.sceneController.sceneResources.lerpDestination) return;
		this.solarSystemController.focusedCelestialBody = body;
		this.sceneController.sceneResources.controls.target = body.position;
	}
	private handleHover(body: CelestialBody): void {
		if (!body.primaryBody) return;
		const colour =
			CelestialBodyColourHover[body.metadata.EnglishName.toUpperCase()] ??
			CelestialBodyColourHover[body.primaryBody.metadata.EnglishName.toUpperCase()];

		(body.primaryBody.orbits.get(body.metadata.EnglishName)!.material as LineMaterial).color.set(colour);
	}
	private handleLeave(body: CelestialBody): void {
		if (!body.primaryBody) return;
		const colour =
			CelestialBodyColour[body.metadata.EnglishName.toUpperCase()] ??
			CelestialBodyColour[body.primaryBody.metadata.EnglishName.toUpperCase()];
		(body.primaryBody.orbits.get(body.metadata.EnglishName)!.material as LineMaterial).color.set(colour);
	}
}

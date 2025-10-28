import { CSS2DObject, LineMaterial } from "three/examples/jsm/Addons.js";
import IUIController from "../interfaces/controllers/IUIController";
import Controller from "../core/Controller";
import { TimeChange } from "../interfaces/controllers/ITimeController";
import CelestialBody from "../models/CelestialBody";
import IAppContext from "../interfaces/IAppContext";
import IUIManager from "../interfaces/managers/IUIManager";
import { BodyTypes } from "../types/CelestialBodyMetadata";
import IInjectableController from "../interfaces/IInjectableController";
import { getCelestialBodyColor } from "../utils/CelestialHelpers";
import IInitializable from "../interfaces/IInitializable";

export default class UIController
	extends Controller<IUIManager>
	implements IUIController, IInjectableController, IInitializable
{
	public constructor(manager: IUIManager) {
		super(manager);
	}
	init(): void {
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
		this.solarSystemController = appContext.solarSystemController;
		this.rendererController = appContext.rendererController;
		this.dataController = appContext.dataController;
	}
	destroy(): void {
		throw new Error("Method not implemented.");
	}

	// IUIController Methods
	public handleLoadScreenStateChange(isLoading: boolean): void {
		this.manager.updateLoadScreenState(isLoading);
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
		const {
			toggleButton,
			collapseButton,
			decreaseTimeButton,
			playbackButton,
			increaseTimeButton,
			dropdownElements,
		} = this.manager;
		const { lerpDestination: isLerping } = this.sceneController.sceneResources;

		toggleButton.addEventListener("click", () => {
			if (isLerping) return;
			this.manager.toggleSummary();
		});
		collapseButton.addEventListener("click", () => {
			if (isLerping) return;
			this.manager.toggleSidePanel();
		});
		decreaseTimeButton.addEventListener("click", () => {
			if (isLerping) return;
			this.handleUpdateTimeRateUI(TimeChange.Decrease);
		});
		playbackButton.addEventListener("click", () => {
			if (isLerping) return;
			this.handleUpdateTimeRateUI(TimeChange.TogglePlay);
			this.manager.togglePlaybackButton();
		});
		increaseTimeButton.addEventListener("click", () => {
			if (isLerping) return;
			this.handleUpdateTimeRateUI(TimeChange.Increase);
		});
		dropdownElements.forEach((dropdownElement) =>
			dropdownElement.addEventListener("click", () => {
				dropdownElement.classList.toggle("active");
			}),
		);
	}
	public handleUpdateTimeRateUI(timeChange: TimeChange): void {
		this.timeController.handleTimeChange(timeChange);
		const timeStep = this.timeController.isClockRunning() ? this.timeController.scaledTimeStep : 0;
		this.manager.updateTimeRateUI(timeStep);
	}
	protected handleClick(body: CelestialBody): void {
		if (this.sceneController.sceneResources.lerpDestination) return;
		this.solarSystemController.focusedCelestialBody = body;
		this.sceneController.sceneResources.controls.target = body.celestialBodyGroup.position;
		this.rendererController.preloadRenderable(body);
		this.sceneController.handleLerp();
		// this.dataController.handleFocusedElements(body);
		// this.dataController.getParameterSummaries();
		this.dataController.getFocusedSecondaries();
		this.handleInformationPanel();
	}
	// Make into one
	private handleHover(body: CelestialBody): void {
		if (!body.primaryBody) return;
		const color = getCelestialBodyColor(body);
		(body.primaryBody.orbits.get(body.metadata.EnglishName)!.material as LineMaterial).color.set(color);
	}
	private handleLeave(body: CelestialBody): void {
		if (!body.primaryBody) return;
		const color = getCelestialBodyColor(body);
		(body.primaryBody.orbits.get(body.metadata.EnglishName)!.material as LineMaterial).color.set(color);
	}

	public async handleInformationPanel(): Promise<void> {
		const body = this.solarSystemController.focusedCelestialBody;
		const summary = await this.dataController.getFocusedSummary();
		if (!body || !summary) return;
		this.removeInformationListeners();
		this.manager.updateInformationPanel(body, summary.summary);
		this.addInformationListeners();
	}
	private removeInformationListeners() {
		document.querySelectorAll(".information-btn").forEach((informationButton) => {
			informationButton.removeEventListener("mouseenter", (event) => this.handleInformationHover(event));
			informationButton.removeEventListener("mouseleave", (event) => this.handleInformationHover(event));
		});
	}

	public async handleInformationHover(event: Event): Promise<void> {
		const target = event.currentTarget as HTMLElement;
		const key = target.getAttribute("data-key") ?? "";
		const summary = await this.dataController.getParameterSummary(key);
		const eventType = event.type as keyof HTMLElementEventMap;

		this.manager.updateInformationHover(target, summary.summary, eventType);
	}
	private addInformationListeners() {
		document.querySelectorAll(".information-btn").forEach((informationButton) => {
			informationButton.addEventListener("mouseenter", (event) => this.handleInformationHover(event));
			informationButton.addEventListener("mouseleave", (event) => this.handleInformationHover(event));
		});
	}
	handleDateTimeUpdate(date: string, time: string): void {
		this.manager.updateDateTime(date, time);
	}
}

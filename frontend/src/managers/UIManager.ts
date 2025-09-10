import { FetchedSummary } from "../loaders/DataLoader";
import CelestialBody from "../models/CelestialBody";
import OrbitingBody from "../models/OrbitingBody";
import { fillDropdown } from "../utils/uiHelpers";
import IUIManager from "../interfaces/managers/IUIManager";
import Manager from "../core/Manager";
export enum LoadScreenState {
	Show,
	Hide,
}
export default class UIManager extends Manager implements IUIManager {
	// private static _instance: UIManager | null;
	// Loading screen/spinner elements
	private _initialLoadScreen!: HTMLElement;
	private _spinner!: HTMLElement;
	private _hasInitialLoaded: boolean = false;

	// Control/Time container elements
	private _time!: HTMLElement;
	private _date!: HTMLElement;
	private _timeRate!: HTMLElement;
	private _decreaseTimeButton!: HTMLElement;
	private _pauseTimeButton!: HTMLElement;
	private _increaseTimeButton!: HTMLElement;

	// Celestial body information elements
	private _infoPanel!: HTMLElement;
	private _summary!: HTMLElement;
	private _toggleButton!: HTMLElement;
	private _collapseBtn!: HTMLElement;
	private _physicalInfo!: HTMLElement;
	private _orbitalInfo!: HTMLElement;

	private _loadScreenState: LoadScreenState = LoadScreenState.Show;
	public constructor() {
		super();
		this.initialise();
		// this.decreaseTimeButton = document.getElementById("decreaseBtn") as HTMLElement;
		// this.pauseTimeButton = document.getElementById("pauseBtn") as HTMLElement;
		// this.increaseTimeButton = document.getElementById("increaseBtn") as HTMLElement;
		//
		// // Celestial body information elements
		// this.toggleButton = document.getElementById("toggleSummary") as HTMLElement;
		//
		// this.collapseButton = document.getElementById("collapseBtn") as HTMLElement;
	}

	get toggleButton(): HTMLElement {
		return this._toggleButton;
	}
	// headerElements: NodeListOf<HTMLElement>; what the fuck was this for?
	get decreaseTimeButton(): HTMLElement {
		return this._decreaseTimeButton;
	}
	get pauseTimeButton(): HTMLElement {
		return this._pauseTimeButton;
	}
	get increaseTimeButton(): HTMLElement {
		return this._increaseTimeButton;
	}
	get collapseButton(): HTMLElement {
		return this._collapseBtn;
	}
	private initialiseElements(): void {
		// Loading screen/spinner elements
		this._initialLoadScreen = document.getElementById("loading-screen") as HTMLElement;
		this._spinner = document.getElementById("spinner") as HTMLElement;
		// document.querySelectorAll;

		// Control/Time container elements
		this._time = document.getElementById("time") as HTMLElement;
		this._date = document.getElementById("date") as HTMLElement;
		this._timeRate = document.getElementById("timeRate") as HTMLElement;
		this._decreaseTimeButton = document.getElementById("decreaseBtn") as HTMLElement;
		this._pauseTimeButton = document.getElementById("pauseBtn") as HTMLElement;
		this._increaseTimeButton = document.getElementById("increaseBtn") as HTMLElement;

		// Celestial body information elements
		this._infoPanel = document.getElementById("infoPanel") as HTMLElement;
		this._summary = document.getElementById("summary") as HTMLElement;
		this._toggleButton = document.getElementById("toggleSummary") as HTMLElement;

		this._collapseBtn = document.getElementById("collapseBtn") as HTMLElement;
		this._physicalInfo = document.getElementById("physicalInfo") as HTMLElement;
		this._orbitalInfo = document.getElementById("orbitalInfo") as HTMLElement;
	}
	public updateLoadScreenState(isLoading: boolean): void {
		this._loadScreenState = isLoading ? LoadScreenState.Show : LoadScreenState.Hide;
		this.updateLoadScreen();
	}
	public updateRateChange(timeStep: number): void {
		if (timeStep === 0) {
			this._timeRate.textContent = "Paused";
		} else {
			const ratePerSecond = timeStep * 60;
			let denominator;
			if (Math.abs(ratePerSecond) < 60) {
				denominator = `${ratePerSecond} secs`;
			} else if (Math.abs(ratePerSecond) < 3600) {
				denominator = `${ratePerSecond / 60} mins`;
			} else {
				denominator = `${ratePerSecond / 3600} hrs`;
			}
			this._timeRate.textContent = ratePerSecond === 1 ? "Real Rate" : `${denominator}/s`;
		}
	}
	public updateSummary(): void {
		this._summary.classList.toggle("expanded");
		this._toggleButton.textContent = this._summary.classList.contains("expanded") ? "Read less" : "Read more";
	}
	public updateInfoPanel(): void {
		this._infoPanel.classList.toggle("collapsed");
		this._collapseBtn.textContent = this._infoPanel.classList.contains("collapsed") ? "⮞" : "⮜";
	}
	public updateTimeButton(): void {
		(this._pauseTimeButton.querySelector("span.icon") as HTMLSpanElement).classList.toggle("paused");
	}

	public initialise(): void {
		this.initialiseElements();
		// this.initialiseListeners();
	}

	// private initialiseListeners() {
	// 	this._toggleButton.addEventListener("click", () => {
	// 		// if (AppContext.instance.App.lerpDestination) return;
	// 		this._summary.classList.toggle("expanded");
	// 		this._toggleButton.textContent = this._summary.classList.contains("expanded") ? "Read less" : "Read more";
	// 	});
	// 	document.querySelectorAll(".dropdown-header").forEach((header) => {
	// 		header.addEventListener("click", () => {
	// 			// if (AppContext.instance.App.lerpDestination) return;
	// 			(header.parentElement as HTMLElement).classList.toggle("active");
	// 		});
	// 	});
	// 	this._collapseBtn.addEventListener("click", () => {
	// 		// if (AppContext.instance.App.lerpDestination) return;
	// 		this._infoPanel.classList.toggle("collapsed");
	// 		this._collapseBtn.textContent = this._infoPanel.classList.contains("collapsed") ? "⮞" : "⮜";
	// 	});
	// 	this._decreaseTimeButton.addEventListener("click", () => {
	// 		// if (AppContext.instance.App.lerpDestination) return;
	// 		AppContext.instance.TimeManager.decrementTimeScale();
	// 		this.updateRate();
	// 	});
	// 	this._pauseTimeButton.addEventListener("click", () => {
	// 		// if (AppContext.instance.App.lerpDestination) return;
	// 		AppContext.instance.TimeManager.togglePause();
	// 		(this._pauseTimeButton.querySelector("span.icon") as HTMLSpanElement).classList.toggle("paused");
	// 		this.updateRate();
	// 	});
	// 	this._increaseTimeButton.addEventListener("click", () => {
	// 		// if (AppContext.instance.App.lerpDestination) return;
	// 		AppContext.instance.TimeManager.incrementTimeScale();
	// 		this.updateRate();
	// 	});
	// }
	public resetSidePanel() {
		this._physicalInfo.classList.remove("active");
		this._orbitalInfo.classList.remove("active");
		this._summary.classList.remove("expanded");
		this._toggleButton.textContent = this._summary.classList.contains("expanded") ? "Read less" : "Read more";
	}
	// public updateRate() {
	// 	if (!AppContext.instance.TimeManager.isRunning()) {
	// 		this._timeRate.textContent = "Paused";
	// 		return;
	// 	}
	// 	const { scaledTimeStep } = AppContext.instance.TimeManager;
	//
	// 	const ratePerSecond = scaledTimeStep * 60;
	// 	let denominator;
	// 	if (Math.abs(ratePerSecond) < 60) {
	// 		denominator = `${ratePerSecond} secs`;
	// 	} else if (Math.abs(ratePerSecond) < 3600) {
	// 		denominator = `${ratePerSecond / 60} mins`;
	// 	} else {
	// 		denominator = `${ratePerSecond / 3600} hrs`;
	// 	}
	// 	this._timeRate.textContent = ratePerSecond === 1 ? "Real Rate" : `${denominator}/s`;
	// }

	public hideLoadScreen() {
		this._hasInitialLoaded
			? this._spinner.classList.add("hidden")
			: this._initialLoadScreen.classList.add("hidden");
		this._hasInitialLoaded = true;
	}

	public showLoadScreen() {
		this._hasInitialLoaded
			? this._spinner.classList.remove("hidden")
			: this._initialLoadScreen.classList.remove("hidden");
	}
	private updateLoadScreen(): void {
		switch (this._loadScreenState) {
			case LoadScreenState.Show:
				this.showLoadScreen();
				break;
			case LoadScreenState.Hide:
				this.hideLoadScreen();
				break;
		}
	}
	// Do i need this?
	public setLoadScreenState(state: LoadScreenState) {
		switch (state) {
			case LoadScreenState.Show:
				this.showLoadScreen();
				break;
			case LoadScreenState.Hide:
				this.hideLoadScreen();
				break;
		}
	}

	public showBodyInformation() {
		this._summary.classList.remove("hidden");
	}

	public hideBodyInformation() {
		this._summary.classList.add("hidden");
	}

	public updateInformationPanel(celestialBody: CelestialBody, extract?: string) {
		if (!extract) return;
		if (this._infoPanel.classList.contains("hidden")) {
			this._infoPanel.classList.remove("hidden");
			this._infoPanel.classList.remove("collapsed");
		}
		this.removeInformationListeners();
		this.resetSidePanel();
		const content = this._infoPanel.querySelector(".information-content") as HTMLElement;
		(content.querySelector(".title") as HTMLElement).textContent = celestialBody.metadata.EnglishName;
		this._summary.textContent = extract;
		if (celestialBody instanceof OrbitingBody) {
			this._orbitalInfo.classList.remove("hidden");
			fillDropdown(this._orbitalInfo, celestialBody.orbitingParameters);
		} else {
			this._orbitalInfo.classList.add("hidden");
		}
		fillDropdown(this._physicalInfo, celestialBody.physicalParameters);

		content.classList.remove("collapsed");
		// updateInformationPanel(celestialBody, extract);
		this.addInformationListeners();
	}
	private informationHoverHandler = async (event: Event): Promise<void> => {
		const target = event.currentTarget as HTMLElement;
		const key = target.getAttribute("data-key") ?? "";
		const tooltip = document.getElementById("global-tooltip") as HTMLDivElement;

		if (!tooltip) return;

		const summary: FetchedSummary = await AppContext.instance.DataManager.getParameterSummary(key);
		tooltip.textContent = summary.summary;

		const rect = target.getBoundingClientRect();
		const scrollY = window.scrollY;
		const scrollX = window.scrollX;

		tooltip.style.visibility = "hidden";
		tooltip.classList.remove("hidden");
		tooltip.classList.add("visible");

		tooltip.style.top = "0px";
		tooltip.style.left = "-9999px";

		requestAnimationFrame(() => {
			const tooltipHeight = tooltip.offsetHeight;
			let top = rect.top + scrollY;
			const bottomEdge = top + tooltipHeight;

			if (bottomEdge > window.innerHeight + scrollY) {
				top = window.innerHeight + scrollY - tooltipHeight - 10;
			}

			tooltip.style.top = `${top}px`;
			tooltip.style.left = `${rect.right + scrollX + 10}px`;
			tooltip.style.visibility = "visible";
		});
	};
	private informationLeaveHandler() {
		const tooltip = document.getElementById("global-tooltip") as HTMLDivElement;
		tooltip.classList.remove("visible");
		tooltip.classList.add("hidden");
	}

	private removeInformationListeners() {
		document.querySelectorAll(".information-btn").forEach((informationButton) => {
			informationButton.removeEventListener("mouseenter", this.informationHoverHandler);
			informationButton.removeEventListener("mouseleave", this.informationLeaveHandler);
		});
	}

	private addInformationListeners() {
		document.querySelectorAll(".information-btn").forEach((informationButton) => {
			informationButton.addEventListener("mouseenter", this.informationHoverHandler);
			informationButton.addEventListener("mouseleave", this.informationLeaveHandler);
		});
	}

	// Functions that aren't referenced (currently). Might be due to refactor.
	public isLoadScreenVisible() {
		return !(this._spinner.classList.contains("hidden") || this._initialLoadScreen.classList.contains("hidden"));
	}

	public updateDateTime(date: string, time: string): void {
		if (this._date.textContent !== date) {
			this._date.textContent = date;
		}

		if (this._time.textContent !== time) {
			this._time.textContent = time;
		}
	}
}

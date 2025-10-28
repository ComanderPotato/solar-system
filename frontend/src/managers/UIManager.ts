import CelestialBody from "../models/CelestialBody";
import OrbitingBody from "../models/OrbitingBody";
import { fillDropdown } from "../utils/uiHelpers";
import IUIManager from "../interfaces/managers/IUIManager";
import Manager from "../core/Manager";
import IInitializable from "../interfaces/IInitializable";
export enum LoadScreenState {
	Show,
	Hide,
}

export default class UIManager extends Manager implements IUIManager, IInitializable {
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
	private _playbackButton!: HTMLElement;
	private _increaseTimeButton!: HTMLElement;

	// Celestial body information elements
	private _sidePanel!: HTMLElement;
	private _summary!: HTMLElement;
	private _dropdownElements!: NodeListOf<HTMLElement>;
	private _summaryButton!: HTMLElement;
	private _collapseBtn!: HTMLElement;
	private _physicalInfo!: HTMLElement;
	private _orbitalInfo!: HTMLElement;

	private _loadScreenState: LoadScreenState = LoadScreenState.Show;
	public constructor() {
		super();
		// this.decreaseTimeButton = document.getElementById("decreaseBtn") as HTMLElement;
		// this.pauseTimeButton = document.getElementById("pauseBtn") as HTMLElement;
		// this.increaseTimeButton = document.getElementById("increaseBtn") as HTMLElement;
		//
		// // Celestial body information elements
		// this.toggleButton = document.getElementById("toggleSummary") as HTMLElement;
		//
		// this.collapseButton = document.getElementById("collapseBtn") as HTMLElement;
	}
	updateParameterInformation(): void {
		throw new Error("Method not implemented.");
	}

	get dropdownElements(): NodeListOf<HTMLElement> {
		return this._dropdownElements;
	}

	get toggleButton(): HTMLElement {
		return this._summaryButton;
	}
	// headerElements: NodeListOf<HTMLElement>; what the fuck was this for?
	get decreaseTimeButton(): HTMLElement {
		return this._decreaseTimeButton;
	}
	get playbackButton(): HTMLElement {
		return this._playbackButton;
	}
	get increaseTimeButton(): HTMLElement {
		return this._increaseTimeButton;
	}
	get collapseButton(): HTMLElement {
		return this._collapseBtn;
	}
	init(): void {
		this.initialiseElements();
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
		// Fix pauseBtn
		this._playbackButton = document.getElementById("pauseBtn") as HTMLElement;
		this._increaseTimeButton = document.getElementById("increaseBtn") as HTMLElement;

		// Celestial body information elements
		this._sidePanel = document.getElementById("sidePanel") as HTMLElement;
		this._dropdownElements = document.querySelectorAll(".dropdown") as NodeListOf<HTMLElement>;
		this._summary = document.getElementById("summary") as HTMLElement;
		this._summaryButton = document.getElementById("summaryButton") as HTMLElement;

		this._collapseBtn = document.getElementById("collapseBtn") as HTMLElement;
		this._physicalInfo = document.getElementById("physicalInfo") as HTMLElement;
		this._orbitalInfo = document.getElementById("orbitalInfo") as HTMLElement;
	}
	public updateLoadScreenState(isLoading: boolean): void {
		this._loadScreenState = isLoading ? LoadScreenState.Show : LoadScreenState.Hide;
		this.updateLoadScreen();
	}
	public updateTimeRateUI(timeStep: number = 0): void {
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
	public toggleSummary(): void {
		this._summary.classList.toggle("expanded");
		this._summaryButton.textContent = this._summary.classList.contains("expanded") ? "Read less" : "Read more";
	}
	public toggleSidePanel(): void {
		this._sidePanel.classList.toggle("collapsed");
		this._collapseBtn.textContent = this._sidePanel.classList.contains("collapsed") ? "⮞" : "⮜";
	}
	public togglePlaybackButton(): void {
		(this._playbackButton.querySelector("span.icon") as HTMLSpanElement).classList.toggle("paused");
	}

	public resetSidePanel() {
		this._physicalInfo.classList.remove("active");
		this._orbitalInfo.classList.remove("active");
		this._summary.classList.remove("expanded");
		this._summaryButton.textContent = this._summary.classList.contains("expanded") ? "Read less" : "Read more";
	}

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

	public updateInformationPanel(body: CelestialBody, extract?: string) {
		if (!extract) return;
		if (this._sidePanel.classList.contains("hidden")) {
			this._sidePanel.classList.remove("hidden");
			this._sidePanel.classList.remove("collapsed");
		}
		// this.removeInformationListeners();
		this.resetSidePanel();
		const content = this._sidePanel.querySelector(".information-content") as HTMLElement;
		(content.querySelector(".title") as HTMLElement).textContent = body.metadata.EnglishName;
		this._summary.textContent = extract;
		if (body instanceof OrbitingBody) {
			this._orbitalInfo.classList.remove("hidden");
			fillDropdown(this._orbitalInfo, body.orbitingParameters);
		} else {
			this._orbitalInfo.classList.add("hidden");
		}
		fillDropdown(this._physicalInfo, body.physicalParameters);

		content.classList.remove("collapsed");
		// updateInformationPanel(celestialBody, extract);
		// this.addInformationListeners();
	}
	updateInformationHover(target: HTMLElement, summary: string, eventType: keyof HTMLElementEventMap): void {
		const tooltip = document.getElementById("global-tooltip") as HTMLDivElement;
		if (!tooltip) return;
		if (eventType === "mouseenter") {
		}
		switch (eventType) {
			case "mouseenter":
				break;
			case "mouseleave":
				break;
		}
		tooltip.textContent = summary;
		const rect = target.getBoundingClientRect();
		const scrollY = window.scrollY;
		const scrollX = window.scrollX;

		tooltip.style.visibility = "hidden";
		tooltip.classList.remove("hidden");
		tooltip.classList.toggle("visible");

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
	}
	private informationLeaveHandler() {
		const tooltip = document.getElementById("global-tooltip") as HTMLDivElement;
		tooltip.classList.remove("visible");
		tooltip.classList.add("hidden");
	}

	// private removeInformationListeners() {
	// 	document.querySelectorAll(".information-btn").forEach((informationButton) => {
	// 		informationButton.removeEventListener("mouseenter", this.updateInformationHover);
	// 		informationButton.removeEventListener("mouseleave", this.updateInformationHover);
	// 	});
	// }
	//
	// private addInformationListeners() {
	// 	document.querySelectorAll(".information-btn").forEach((informationButton) => {
	// 		informationButton.addEventListener("mouseenter", this.updateInformationHover);
	// 		informationButton.addEventListener("mouseleave", this.updateInformationHover);
	// 	});
	// }

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

import { app, dataManager, timeManager } from "../core";
import { FetchedSummary } from "../loaders/DataLoader";
import { CelestialBody, OrbitingBody } from "../models";
import { fillDropdown } from "../utils";
export default class UIManager {
	// Loading screen/spinner elements
	private _initialLoadScreen: HTMLElement;
	private _spinner: HTMLElement;
	private _hasInitialLoaded: boolean = false;

	// Control/Time container elements
	private _time: HTMLElement;
	private _date: HTMLElement;
	private _timeRate: HTMLElement;
	private _decreaseTimeButton: HTMLElement;
	private _pauseTimeButton: HTMLElement;
	private _increaseTimeButton: HTMLElement;

	// Celestial body information elements
	private _infoPanel: HTMLElement;
	private _summary: HTMLElement;
	private _toggleButton: HTMLElement;
	private _collapseBtn: HTMLElement;
	private _physicalInfo: HTMLElement;
	private _orbitalInfo: HTMLElement;
	constructor() {
		// Loading screen/spinner elements
		this._initialLoadScreen = document.getElementById("loading-screen") as HTMLElement;
		this._spinner = document.getElementById("spinner") as HTMLElement;

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
		this.initialiseListeners();
	}
	public resetSidePanel = () => {
		this._physicalInfo.classList.remove("active");
		this._orbitalInfo.classList.remove("active");
		this._summary.classList.remove("expanded");
		this._toggleButton.textContent = this._summary.classList.contains("expanded") ? "Read less" : "Read more";
	};
	private initialiseListeners = () => {
		this._toggleButton.addEventListener("click", () => {
			if (app().lerpDestination) return;
			this._summary.classList.toggle("expanded");
			this._toggleButton.textContent = this._summary.classList.contains("expanded") ? "Read less" : "Read more";
		});
		document.querySelectorAll(".dropdown-header").forEach((header) => {
			header.addEventListener("click", () => {
				if (app().lerpDestination) return;
				(header.parentElement as HTMLElement).classList.toggle("active");
			});
		});
		this._collapseBtn.addEventListener("click", () => {
			if (app().lerpDestination) return;
			this._infoPanel.classList.toggle("collapsed");
			this._collapseBtn.textContent = this._infoPanel.classList.contains("collapsed") ? "⮞" : "⮜";
		});
		this._decreaseTimeButton.addEventListener("click", () => {
			if (app().lerpDestination) return;
			timeManager().decrementTimeScale();
			this.updateRate();
		});
		this._pauseTimeButton.addEventListener("click", () => {
			if (app().lerpDestination) return;
			timeManager().togglePause();
			(this._pauseTimeButton.querySelector("span.icon") as HTMLSpanElement).classList.toggle("paused");
			this.updateRate();
		});
		this._increaseTimeButton.addEventListener("click", () => {
			if (app().lerpDestination) return;
			timeManager().incrementTimeScale();
			this.updateRate();
		});
	};
	public updateRate = () => {
		if (!timeManager().isRunning()) {
			this._timeRate.textContent = "Paused";
			return;
		}
		const { scaledTimeStep } = timeManager();

		const ratePerSecond = scaledTimeStep * 60;
		let denominator;
		if (Math.abs(ratePerSecond) < 60) {
			denominator = `${ratePerSecond} secs`;
		} else if (Math.abs(ratePerSecond) < 3600) {
			denominator = `${ratePerSecond / 60} mins`;
		} else {
			denominator = `${ratePerSecond / 3600} hrs`;
		}
		this._timeRate.textContent = ratePerSecond === 1 ? "Real Rate" : `${denominator}/s`;
	};

	public hideLoadScreen = () => {
		this._hasInitialLoaded ? this._spinner.classList.add("hidden") : this._initialLoadScreen.classList.add("hidden");
		this._hasInitialLoaded = true
	};

	public showLoadScreen = () => (this._hasInitialLoaded ? this._spinner.classList.remove("hidden") : this._initialLoadScreen.classList.remove("hidden"));

	public showBodyInformation = () => this._summary.classList.remove("hidden");

	public hideBodyInformation = () => this._summary.classList.add("hidden");

	public updateInformationPanel = (celestialBody: CelestialBody, extract?: string) => {
		if(!extract) return
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
	};
	private informationHoverHandler = async (event: Event): Promise<void> => {
		const target = event.currentTarget as HTMLElement;
		const key = target.getAttribute("data-key") ?? "";
		const tooltip = document.getElementById("global-tooltip") as HTMLDivElement;

		if (!tooltip) return;

		const summary: FetchedSummary = await dataManager().getParameterSummary(key);
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
	private informationLeaveHandler = (event: Event) => {
		const tooltip = document.getElementById("global-tooltip") as HTMLDivElement;
		tooltip.classList.remove("visible");
		tooltip.classList.add("hidden");
	};

	private removeInformationListeners = () => {
		document.querySelectorAll(".information-btn").forEach((informationButton) => {
			informationButton.removeEventListener("mouseenter", this.informationHoverHandler);
			informationButton.removeEventListener("mouseleave", this.informationLeaveHandler);
		});
	};

	private addInformationListeners = () => {
		document.querySelectorAll(".information-btn").forEach((informationButton) => {
			informationButton.addEventListener("mouseenter", this.informationHoverHandler);
			informationButton.addEventListener("mouseleave", this.informationLeaveHandler);
		});
	};
	public isLoadScreenVisible = () => !(this._spinner.classList.contains("hidden") || this._initialLoadScreen.classList.contains("hidden"));

	public updateDateTime = (date: string, time: string): void => {
		if (this._date.textContent !== date) {
			this._date.textContent = date;
		}

		if (this._time.textContent !== time) {
			this._time.textContent = time;
		}
	};
}

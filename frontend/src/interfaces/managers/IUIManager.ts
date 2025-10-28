import CelestialBody from "../../models/CelestialBody";
import IManager from "../IManager";

export type EventType = "mouseenter" | "mouseleave";

export default interface IUIManager extends IManager {
	updateLoadScreenState(isLoading: boolean): void;
	updateTimeRateUI(timeStep?: number): void;
	updateDateTime(date: string, time: string): void;

	toggleSummary(): void;
	toggleSidePanel(): void;
	togglePlaybackButton(): void;

	updateInformationPanel(body: CelestialBody, summary: string): void;
	updateInformationHover(target: HTMLElement, summary: string, eventType: keyof HTMLElementEventMap): void;

	updateParameterInformation(): void;

	get toggleButton(): HTMLElement;
	get dropdownElements(): NodeListOf<HTMLElement>;
	get collapseButton(): HTMLElement;
	get decreaseTimeButton(): HTMLElement;
	get playbackButton(): HTMLElement;
	get increaseTimeButton(): HTMLElement;
}

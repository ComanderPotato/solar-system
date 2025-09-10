import CelestialBody from "../../models/CelestialBody";
import IManager from "../IManager";

export default interface IUIManager extends IManager {
	updateLoadScreenState(isLoading: boolean): void;
	updateRateChange(timeStep: number): void;

	updateSummary(): void;
	updateInfoPanel(): void;
	updateTimeButton(): void;

	updateInformationPanel(body: CelestialBody, extract: string): void;

	updateParameterInformation(): void;

	get toggleButton(): HTMLElement;
	get headerElements(): NodeListOf<HTMLElement>;
	get collapseButton(): HTMLElement;
	get decreaseTimeButton(): HTMLElement;
	get pauseTimeButton(): HTMLElement;
	get increaseTimeButton(): HTMLElement;
}

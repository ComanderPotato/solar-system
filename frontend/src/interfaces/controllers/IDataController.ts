// import IController from "../IController";
import CelestialBody from "../../models/CelestialBody";
import { FetchedSummary, TaskName } from "../managers/IDataManager";
export default interface IDataController {
	isLoading(): boolean;

	onLoad(): Promise<void>;
	handleTracking<T>(taskName: TaskName, callBack: () => Promise<T>): Promise<T>;

	handleFocusedElements(newFocusedBody: CelestialBody): Promise<void>;

	handleLoadingState(): void;

	getFocusedSummary(): Promise<FetchedSummary>;

	getParameterSummary(parameter: string): Promise<FetchedSummary>;

	getFocusedParamterSummary(): Promise<FetchedSummary>;

	getParameterSummaries(): Promise<void>; // Maybe fix return etc

	viewTasks(): Set<TaskName>;

	getFocusedSecondaries(): Promise<void>;
	// getFocusedSecondaries()
}

import { FetchedSummary } from "../../loaders/DataLoader";
import IController from "../IController";
import IDataManager, { TaskName } from "../managers/IDataManager";
export default interface IDataController extends IController<IDataManager> {
	handleTracking<T>(taskName: TaskName, callBack: () => Promise<T>): Promise<T>;

	handleLoadingState(): void;

	getFocusedSummary(): Promise<FetchedSummary>;

	getParameterSummary(parameter: string): Promise<FetchedSummary>;

	getFocusedParamterSummary(): Promise<FetchedSummary>;

	getParameterSummaries(parameters: string[]): Promise<void>; // Maybe fix return etc

	// getFocusedSecondaries()
}

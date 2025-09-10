import { DataTexture } from "three";
import IManager from "../IManager";
import CelestialBody from "../../models/CelestialBody";
import { FetchedSummary } from "../../loaders/DataLoader";
import { BodyTypes } from "../../types/CelestialBodyMetadata";
import { CelestialBodies } from "../../types/CelestialBodyParameters";
import { FetchedOrbitalParameters } from "../../types/OrbitalParameters";
import { FetchedPhysicalParameters } from "../../types/PhysicalParameters";

export enum FilterBy {
	ID = "id",
	EnglishName = "englishName",
}
export enum TaskName {
	InitialiseSolarSystem,
	FocusedElements,
	GetParameterSummary,
	GetParameterSummaries,
	GetFocusedSummary,
	GetFocusedParameterSummary,
	FetchParameterSummaries,
	InitialLoad,
	FocusedSecondaries,
	LoadTexture,
	LoadHDRI,
}
export default interface IDataManager extends IManager {
	get hasInitialDataLoaded(): boolean;

	get focusedSecondaries(): CelestialBodies | undefined;

	get isLoading(): boolean;

	get fetchedOrbitalParameters(): FetchedOrbitalParameters | undefined;

	get fetchedPhysicalParameters(): FetchedPhysicalParameters | undefined;

	get focusedSummary(): FetchedSummary | undefined;

	set focusedSummary(fetchedSummary: FetchedSummary);

	set hasInitialDataLoaded(hasInitialLoaded: boolean);

	addTask(taskName: TaskName): void;

	removeTask(taskName: TaskName): void;

	// trackProgress<T>(taskName: TaskName, task: (...parameters: any[]) => Promise<T>): Promise<T>;

	fetchFocusedSummary(name: string, bodyType: BodyTypes): Promise<FetchedSummary>;

	fetchParamaterSummary(parameter: string): Promise<FetchedSummary>;

	fetchParameterSummaries(body: CelestialBody): Promise<void>; // Maybe fix return etc

	fetchFocusedSecondaries(body: CelestialBody, secondaryNames?: string[]): Promise<CelestialBodies>;

	fetchParameters(
		primary: string,
		secondary: string[],
		requireOrbitalParameters: boolean,
		filterBy: FilterBy,
	): Promise<CelestialBodies>;
}

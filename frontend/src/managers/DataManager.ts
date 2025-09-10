import { CelestialBodies } from "../types/CelestialBodyParameters";
import { FetchedOrbitalParameters } from "../types/OrbitalParameters";
import { FetchedPhysicalParameters } from "../types/PhysicalParameters";
import CelestialBody from "../models/CelestialBody";
import DataProcessor from "../utils/DataProcessor";
import OrbitingBody from "../models/OrbitingBody";
import { parametersToIgnore } from "../types/ParameterCategories";
import IDataManager, { FilterBy, TaskName } from "../interfaces/managers/IDataManager";
import Manager from "../core/Manager";
import DataLoader, { FetchedSummary } from "../loaders/DataLoader";
import { BodyTypes } from "../types/CelestialBodyMetadata";

export default class DataManager extends Manager implements IDataManager {
	private _hasInitialDataLoaded: boolean = false;
	private _loadingTasks: Set<TaskName> = new Set();
	// private _tempLoadingTasks: Set<TaskName> = new Set();
	private _isLoading: boolean = true;
	private _dataProcessor: DataProcessor = new DataProcessor();
	// private _assetLoader: AssetLoader = new AssetLoader(
	// 	() => {},
	// 	() => {},
	// );
	private _dataLoader: DataLoader = new DataLoader();
	private _fetchedOrbitalParameters?: FetchedOrbitalParameters;
	private _fetchedPhysicalParameters?: FetchedPhysicalParameters;
	private _focusedSummary?: FetchedSummary;

	// Don't need
	private _focusedCelestialBody?: CelestialBody;
	private _focusedSecondaries?: CelestialBodies | undefined;
	// private _focusedSystem: FocusedSystem = {};
	public constructor() {
		super();
		// this.onLoad();
	}

	addTask(taskName: TaskName): void {
		this._loadingTasks.add(taskName);
	}
	removeTask(taskName: TaskName): void {
		this._loadingTasks.delete(taskName);
	}
	fetchParamaterSummary(parameter: string): Promise<FetchedSummary> {
		throw new Error("Method not implemented.");
	}
	fetchFocusedSecondaries(body: CelestialBody, secondaryNames?: string[]): Promise<CelestialBodies> {
		throw new Error("Method not implemented.");
	}

	get hasInitialDataLoaded(): boolean {
		return this._hasInitialDataLoaded;
	}
	get focusedSecondaries(): CelestialBodies | undefined {
		return this._focusedSecondaries;
	}

	// SolarSystem should be in SolarSystemController -> SolarSystemManager
	get isLoading(): boolean {
		return this._loadingTasks.size > 0;
	}
	get fetchedOrbitalParameters(): FetchedOrbitalParameters | undefined {
		return this._fetchedOrbitalParameters;
	}
	get fetchedPhysicalParameters(): FetchedPhysicalParameters | undefined {
		return this._fetchedPhysicalParameters;
	}
	// get focusedBarycenter(): CelestialBody | undefined {
	// 	return this._focusedSystem.Barycenter;
	// }

	get focusedSummary(): FetchedSummary | undefined {
		return this._focusedSummary;
	}
	// ====== SETTERS ======
	set focusedSummary(fetchedSummary: FetchedSummary) {
		this._focusedSummary = fetchedSummary;
	}
	set hasInitialDataLoaded(hasInitialLoaded: boolean) {
		this._hasInitialDataLoaded = hasInitialLoaded;
	}
	// set focusedBarycenter(focused: CelestialBody) {
	// 	this._focusedSystem.Barycenter = focused instanceof Planet ? focused : this._focusedSystem.Barycenter;
	// }

	/* FIX THIS
	public async getFocusedElements(focusedBody: CelestialBody, secondaryNames?: string[]): Promise<void> {
		return await this.trackLoading("focusedElements", async () => {
			const temp = this.focusedBarycenter;
			this.focusedBarycenter = focusedBody;
			this._focusedCelestialBody = focusedBody;

			if (temp && temp != this.focusedBarycenter && !(focusedBody instanceof Star)) {
				temp.destroySecondaries();
			}
			if (secondaryNames && !this.focusedBarycenter.secondaryBodies) {
				const newSecondaries = await this.getFocusedSecondaries(this._focusedCelestialBody, secondaryNames);
				this._focusedSecondaries = newSecondaries;
				this._focusedCelestialBody.initialiseSecondaryBodies(this._focusedSecondaries);
				this._solarSystem.focusedSecondaries = this._focusedCelestialBody.secondaryBodies;
			}
			this._focusedSummary = await this.fetchFocusedSummary(focusedBody);
			this._focusedCelestialBody.preLoadDetail();

			await this.getParameterSummaries(focusedBody);
			this.disposeOfFetched();
		});
	}
    */

	public async getParameterSummary(parameter: string): Promise<FetchedSummary> {
		return await this._dataLoader.fetchParameterSummary(parameter);
	}

	async fetchFocusedSummary(name: string, bodyType: BodyTypes): Promise<FetchedSummary> {
		return await this._dataLoader.fetchFocusedSummary(name, bodyType);
	}

	// May only need to have this private inside manager
	public async fetchParameterSummaries(body: CelestialBody): Promise<void> {
		const parameters = [
			...Object.keys(body.physicalParameters),
			...(body instanceof OrbitingBody ? Object.keys(body.orbitingParameters) : []),
		];
		parameters.forEach(
			(parameter) => !parametersToIgnore.includes(parameter) && this._dataLoader.fetchParameterSummary(parameter),
		);
	}

	private disposeOfFetched() {
		this._fetchedOrbitalParameters = undefined;
		this._fetchedPhysicalParameters = undefined;
	}
	public async fetchParameters(
		primaryName: string,
		secondaryNames: string[],
		requireOrbitalParameters: boolean = true,
		filterBy: FilterBy = FilterBy.ID,
	): Promise<CelestialBodies> {
		const bodyNames = requireOrbitalParameters ? secondaryNames : [primaryName, ...secondaryNames];
		this._fetchedPhysicalParameters = await this._dataLoader.fetchPhysicalParameters(bodyNames, filterBy);
		this._fetchedOrbitalParameters = await this._dataLoader.fetchOrbitalParameters(
			primaryName,
			Object.keys(this._fetchedPhysicalParameters),
		);
		const processedBodies = await this.processBodies(requireOrbitalParameters);
		this.disposeOfFetched();
		return processedBodies;
	}
	private async processBodies(requireOrbitalParameters: boolean = true): Promise<CelestialBodies> {
		if (!(this._fetchedOrbitalParameters && this._fetchedPhysicalParameters)) {
			throw new Error("Failed to process celestial body parameters.");
		}
		return this._dataProcessor.process(
			this._fetchedPhysicalParameters,
			this._fetchedOrbitalParameters,
			requireOrbitalParameters,
		);
	}

	// private async getParameterSummaries(focusedCelestialBody: CelestialBody): Promise<void> {
	// 	return await this.trackLoading("getParameterSummaries", async () => {
	// 		Object.keys(focusedCelestialBody.physicalParameters)
	// 			.filter((parameter) => !parametersToIgnore.includes(parameter))
	// 			.forEach((parameter) => this._dataLoader.fetchParameterSummary(parameter));
	//
	// 		if (focusedCelestialBody instanceof OrbitingBody) {
	// 			Object.keys(focusedCelestialBody.orbitingParameters)
	// 				.filter((parameter) => !parametersToIgnore.includes(parameter))
	// 				.forEach((parameter) => this._dataLoader.fetchParameterSummary(parameter));
	// 		}
	// 	});
	// }
	// private async getFocusedSummary(focusedBody: CelestialBody): Promise<FetchedSummary> {
	// 	return await this.trackLoading("focusedSecondaries", async () => {
	// 		return await this._dataLoader.fetchFocusedSummary(
	// 			focusedBody.metadata.EnglishName,
	// 			focusedBody.metadata.BodyType,
	// 		);
	// 	});
	// }

	// private async getFocusedSecondaries(
	// 	primaryBody: CelestialBody,
	// 	secondaryNames?: string[],
	// ): Promise<CelestialBodies> {
	// 	if (!secondaryNames) throw new Error("Secondary names must be provided.");
	// 	return await this.trackLoading("focusedSecondaries", async () => {
	// 		this._focusedCelestialBody = primaryBody;
	// 		this._fetchedPhysicalParameters = await this._dataLoader.fetchPhysicalParameters(secondaryNames, "id");
	// 		this._fetchedOrbitalParameters = await this._dataLoader.fetchOrbitalParameters(
	// 			this._focusedCelestialBody.metadata.EnglishName,
	// 			Object.keys(this._fetchedPhysicalParameters),
	// 		);
	// 		return await this.processBodies();
	// 	});
	// }
	// public async trackProgress<T>(taskName: TaskName, task: (...parameters: any[]) => Promise<T>): Promise<T> {
	// 	this.startLoading(taskName);
	// 	try {
	// 		return await task();
	// 	} finally {
	// 		this.finishLoading(taskName);
	// 	}
	// }

	// Maybe inject updateUILoading from controller
	// private startLoading(task: TaskName): void {
	// 	this._loadingTasks.add(task);
	// 	this.updateUILoading();
	// }
	// private finishLoading(task: TaskName): void {
	// 	this._loadingTasks.delete(task);
	// 	this.updateUILoading();
	// }
	// private updateUILoading(): void {
	// 	this._isLoading = this._loadingTasks.size > 0;
	// 	this._controller.setLoadScreenState(this._isLoading ? LoadScreenState.Show : LoadScreenState.Hide);
	//
	// 	if (!this._isLoading) {
	// 		if (this._focusedCelestialBody && this._focusedSummary)
	// 			this._controller.updateUIPanel(this._focusedCelestialBody, this._focusedSummary.summary);
	// 		if (!this._hasInitialDataLoaded) {
	// 			this._controller.resetTime();
	// 			this._hasInitialDataLoaded = true;
	// 		}
	// 	}
	// 	// if (this._isLoading) {
	// 	// 	this._controller.setLoadScreenState(LoadScreenState.Show);
	// 	// } else {
	// 	// 	this._controller.setLoadScreenState(LoadScreenState.Hide);
	// 	// 	if (this._focusedCelestialBody && this._focusedSummary)
	// 	// 		this._uiManager.updateInformationPanel(this._focusedCelestialBody, this._focusedSummary.summary);
	// 	// 	if (!this._hasInitialDataLoaded) {
	// 	// 		// AppContext.instance.TimeManager.reset();
	// 	// 		this._hasInitialDataLoaded = true;
	// 	// 	}
	// 	// }
	// 	// this._isLoading ? appContext.UIManager.showLoadScreen() : uiManager().hideLoadScreen();
	// }
	// private async onLoad(): Promise<void> {
	// 	// return await this.trackLoading("initialLoad", async () => {
	// 	// 	this._fetchedPhysicalParameters = await this._dataLoader.fetchPhysicalParameters([
	// 	// 		SOLAR_SYSTEM_PRIMARY,
	// 	// 		...SOLAR_SYSTEM_SECONDARIES,
	// 	// 	]);
	// 	// 	this._fetchedOrbitalParameters = await this._dataLoader.fetchOrbitalParameters(
	// 	// 		SOLAR_SYSTEM_PRIMARY,
	// 	// 		SOLAR_SYSTEM_SECONDARIES,
	// 	// 	);
	// 	// 	const processedBodies = await this.processBodies(false);
	// 	// 	this._solarSystem.initialiseSolarSystem(processedBodies);
	// 	// 	this.disposeOfFetched();
	// 	// });
	// }
}

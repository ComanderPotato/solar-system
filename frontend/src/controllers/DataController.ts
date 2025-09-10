import IDataController from "../interfaces/controllers/IDataController";
import Controller from "../core/Controller";
import IDataManager, { FilterBy, TaskName } from "../interfaces/managers/IDataManager";
import IAppContext from "../interfaces/IAppContext";
import CelestialBody from "../models/CelestialBody";
import Star from "../models/Star";
import { FetchedSummary } from "../loaders/DataLoader";

export default class DataController extends Controller<IDataManager> implements IDataController {
	public constructor(manager: IDataManager) {
		super(manager);
	}
	async getParameterSummary(parameter: string): Promise<FetchedSummary> {
		return await this.handleTracking(TaskName.GetParameterSummary, async () =>
			this.manager.fetchParamaterSummary(parameter),
		);
	}

	// Don't need
	async getFocusedParamterSummary(): Promise<FetchedSummary> {
		return await this.handleTracking(TaskName.GetFocusedParameterSummary, async () => {
			return { summary: "" };
		});
	}
	async getParameterSummaries(): Promise<void> {
		return await this.handleTracking(TaskName.GetParameterSummaries, async () =>
			this.manager.fetchParameterSummaries(this.focusedCelestialBody),
		);
	}

	async getFocusedSummary(): Promise<FetchedSummary> {
		const { Name, BodyType } = this.focusedCelestialBody.metadata;
		return await this.handleTracking(TaskName.GetFocusedParameterSummary, async () =>
			this.manager.fetchFocusedSummary(Name, BodyType),
		);
	}
	private get focusedCelestialBody(): CelestialBody {
		if (!this.solarSystemController.focusedCelestialBody)
			throw new Error("No celestial body is currently focused in SolarSystemController");
		return this.solarSystemController.focusedCelestialBody;
	}
	protected injectControllers(appContext: IAppContext): void {
		this.uiController = appContext.uiController;
		this.timeController = appContext.timeController;
		this.solarSystemController = appContext.solarSystemController;
		this.assetController = appContext.assetController;
	}
	destroy(): void {
		throw new Error("Method not implemented.");
	}

	async handleTracking<T>(taskName: TaskName, task: (...parameters: any[]) => Promise<T>): Promise<T> {
		this.startLoading(taskName);
		try {
			return await task();
		} catch (error) {
			throw new Error(`Task "${taskName}" failed: ${(error as Error).message}`);
		} finally {
			this.finishLoading(taskName);
		}
	}
	private startLoading(taskName: TaskName): void {
		this.manager.addTask(taskName);
		this.handleLoadingState();
	}
	private finishLoading(taskName: TaskName): void {
		this.manager.removeTask(taskName);
		this.handleLoadingState();
	}
	handleLoadingState(): void {
		const isLoading = this.manager.isLoading;
		this.uiController.handleLoadScreenStateChange(isLoading);

		if (!isLoading) {
			const focusedBody = this.solarSystemController.focusedCelestialBody;
			if (focusedBody && this.manager.focusedSummary) {
				// Fix summary
				this.uiController.updateUIPanel(focusedBody, this.manager.focusedSummary.summary);
			}
			if (this.manager.hasInitialDataLoaded) {
				this.timeController.resetTime();
				this.manager.hasInitialDataLoaded = true;
			}
		}
	}

	private async handleFocusedElements(): Promise<void> {
		const body = this.focusedCelestialBody;
		return await this.handleTracking(TaskName.FocusedElements, async () => {
			let temp = this.focusedCelestialBody;
			if (!(temp.primaryBody instanceof Star)) {
				while (temp.primaryBody) {
					if (temp == body || temp instanceof Star) {
						this.celestialBodyController.handleSecondaryDisposal(temp);
						// temp.destroySecondaries();
						break;
					}
					temp = temp.primaryBody;
				}
			}
			// Destroy secondaries if needed
			// Load secondaries if needed

			if (true /*old secondary != new secondary*/) {
				const focusedSecondaries = await this.manager.fetchFocusedSecondaries(
					temp,
					temp.secondaryBodyParameters,
				);
			}
			// get focused summary and pre load detail and parameter summaries
			const { Name: name, BodyType: bodyType } = body.metadata;
			this.manager.fetchFocusedSummary(name, bodyType);
			this.focusedCelestialBody.preLoadDetail();

			await this.manager.fetchParameterSummaries(body);
		});
	}
	// get focusedBarycenter(): CelestialBody | undefined {
	// 	return this.solarSystemController.focusedCelestialBody;
	// }
	// set focusedBarycenter(body: CelestialBody) {
	// 	this.solarSystemController.focusedCelestialBody = body;
	// }
	// async handleFocusedElements(body: CelestialBody, secondaryNames?: string[]): Promise<void> {
	// 	return await this.handleTracking("focusedElements", async () => {
	// 		const temp = this.focusedBarycenter;
	//            this.focusedBarycenter = body;
	//            this.solarSystemController.focusedCelestialBody = body;
	//
	//            if(temp && temp != this.focusedBarycenter && !(body instanceof Star)) {
	//                this.celestialBodyController.handleSecondaryDisposal(temp)
	//            }
	//            if(secondaryNames && !this.focusedBarycenter/*.secondaryBodies*/) {
	//                const newSecondaries = await this.manager/*.getFocusedSecondaries(this.focusedCelestialBody, secondaryNames)*/
	//
	//            }
	// 	});
	// }
	//
	// public async getFocusedElements(focusedBody: CelestialBody, secondaryNames?: string[]): Promise<void> {
	// 	return await this.trackLoading("focusedElements", async () => {
	// 		const temp = this.focusedBarycenter;
	// 		this.focusedBarycenter = focusedBody;
	// 		this._focusedCelestialBody = focusedBody;
	//
	// 		if (temp && temp != this.focusedBarycenter && !(focusedBody instanceof Star)) {
	// 			temp.destroySecondaries();
	// 		}
	// 		if (secondaryNames && !this.focusedBarycenter.secondaryBodies) {
	// 			const newSecondaries = await this.getFocusedSecondaries(this._focusedCelestialBody, secondaryNames);
	// 			this._focusedSecondaries = newSecondaries;
	// 			this._focusedCelestialBody.initialiseSecondaryBodies(this._focusedSecondaries);
	// 			this._solarSystem.focusedSecondaries = this._focusedCelestialBody.secondaryBodies;
	// 		}
	// 		this._focusedSummary = await this.getFocusedSummary(focusedBody);
	// 		this._focusedCelestialBody.preLoadDetail();
	//
	// 		await this.getParameterSummaries(focusedBody);
	// 		this.disposeOfFetched();
	// 	});
	// }
	private async onLoad(): Promise<void> {
		return this.handleTracking(TaskName.InitialiseSolarSystem, async () => {
			const initialData = this.solarSystemController.initialSolarSystemData;
			const solarSystemBodies = await this.manager.fetchParameters(
				initialData.primary,
				initialData.secondaries,
				false,
				FilterBy.EnglishName,
			);
			this.solarSystemController.handleSolarSystemInitialisation(solarSystemBodies);
		});
		// return await this.trackLoading("initialLoad", async () => {
		// 	this._fetchedOrbitalParameters = await this._dataLoader.fetchOrbitalParameters(
		// 		SOLAR_SYSTEM_PRIMARY,
		// 		SOLAR_SYSTEM_SECONDARIES,
		// 	);
		// 	this._fetchedPhysicalParameters = await this._dataLoader.fetchPhysicalParameters([
		// 		SOLAR_SYSTEM_PRIMARY,
		// 		...SOLAR_SYSTEM_SECONDARIES,
		// 	]);
		// 	const processedBodies = await this.processBodies(false);
		// 	this._solarSystem.initialiseSolarSystem(processedBodies);
		// 	this.disposeOfFetched();
		// });
	}
}

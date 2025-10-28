import IDataController from "../interfaces/controllers/IDataController";
import Controller from "../core/Controller";
import IDataManager, { FetchedSummary, FilterBy, TaskName } from "../interfaces/managers/IDataManager";
import IAppContext from "../interfaces/IAppContext";
import CelestialBody from "../models/CelestialBody";
import Star from "../models/Star";

export default class DataController extends Controller<IDataManager> implements IDataController {
	public constructor(manager: IDataManager) {
		super(manager);
	}
	async getParameterSummary(parameter: string): Promise<FetchedSummary> {
		return await this.handleTracking(TaskName.GetParameterSummary, async () =>
			this.manager.fetchParamaterSummary(parameter),
		);
	}

	isLoading(): boolean {
		return this.manager.isLoading;
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

	async getFocusedElements(): Promise<void> {
		return await this.handleTracking(TaskName.FocusedElements, async () => {
			this.getFocusedSummary().then((summary) =>
				this.uiController.updateUIPanel(this.focusedCelestialBody, summary.summary),
			);
			// const summary = await this.getFocusedSummary();
			// this.uiController.updateUIPanel(this.focusedCelestialBody, summary.summary);
		});
	}

	viewTasks(): Set<TaskName> {
		return this.manager.viewTasks();
	}
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
	async handleFocusedElements(newFocusedBody: CelestialBody): Promise<void> {
		const body = this.focusedCelestialBody;
		// const body = this.solarSystemController.focusedCelestialBody;
		return await this.handleTracking(TaskName.FocusedElements, async () => {
			let temp: CelestialBody | undefined = newFocusedBody;
			if (!temp.primaryBody && !(temp instanceof Star)) {
				while (temp) {
					if (temp == body || temp instanceof Star) {
						this.celestialBodyController.handleSecondaryDisposal(body);
						break;
					}
					temp = temp.primaryBody;
				}
			}

			// if (temp && temp != this.focusedBarycenter && !(focusedBody instanceof Star)) {
			// 	temp.destroySecondaries();
			// }
			// Destroy secondaries if needed
			// Load secondaries if needed

			if (newFocusedBody.secondaryBodyNames && !body.secondaryBodyNames) {
				const focusedSecondaries = await this.manager.fetchFocusedSecondaries(
					newFocusedBody,
					newFocusedBody.secondaryBodyNames,
				);
				this.celestialBodyController.handleSecondaryCreation(newFocusedBody, Object.values(focusedSecondaries));
			}
			// get focused summary and pre load detail and parameter summaries
			const { Name: name, BodyType: bodyType } = body.metadata;
			this.manager.fetchFocusedSummary(name, bodyType);

			// this.focusedCelestialBody.preLoadDetail();

			await this.manager.fetchParameterSummaries(body);
		});
	}

	async onLoad(): Promise<void> {
		return await this.handleTracking(TaskName.InitialiseSolarSystem, async () => {
			const initialData = this.solarSystemController.initialSolarSystemData;
			const solarSystemBodies = await this.manager.fetchParameters(
				initialData.primary,
				initialData.secondaries,
				false,
				FilterBy.EnglishName,
			);
			this.solarSystemController.handleSolarSystemInitialisation(solarSystemBodies);
		});
	}
	async getFocusedSecondaries(): Promise<void> {
		return await this.handleTracking(TaskName.TODO, async () => {
			const { EnglishName: name } = this.focusedCelestialBody.metadata;
			const { secondaryBodyNames: secondaryNames } = this.focusedCelestialBody;
			if (!secondaryNames) return;

			const secondaryParameters = await this.manager.fetchParameters(name, secondaryNames, true, FilterBy.ID);

			const secondaryBodies = this.celestialBodyController.handleSecondaryCreation(
				this.focusedCelestialBody,

				Object.values(secondaryParameters),
			);
			// this.engineController.debugger(() => {
			// 	console.log(secondaryParameters);
			// 	console.log(secondaryBodies);
			// });
		});
		// if (!secondaryNames) throw new Error("Secondary names must be provided.");
		// return await this.trackLoading("focusedSecondaries", async () => {
		// 	this._focusedCelestialBody = primaryBody;
		// 	this._fetchedPhysicalParameters = await this._dataLoader.fetchPhysicalParameters(secondaryNames, "id");
		// 	this._fetchedOrbitalParameters = await this._dataLoader.fetchOrbitalParameters(
		// 		this._focusedCelestialBody.metadata.EnglishName,
		// 		Object.keys(this._fetchedPhysicalParameters),
		// 	);
		// 	return await this.processBodies();
		// });
	}
	async getFocusedSummary(): Promise<FetchedSummary> {
		const { EnglishName, BodyType } = this.focusedCelestialBody.metadata;
		return await this.handleTracking(TaskName.GetFocusedParameterSummary, async () =>
			this.manager.fetchFocusedSummary(EnglishName, BodyType),
		);
	}
	private get focusedCelestialBody(): CelestialBody {
		if (!this.solarSystemController.focusedCelestialBody)
			throw new Error("No celestial body is currently focused in SolarSystemController");
		return this.solarSystemController.focusedCelestialBody;
	}
	public injectControllers(appContext: IAppContext): void {
		this.engineController = appContext.engineController;
		this.celestialBodyController = appContext.celestialBodyController;
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
			const err = error as Error;
			throw new Error(`Task "${TaskName[taskName]}" failed: ${err.message}\nOriginal stack:\n${err.stack}`);
			// throw new Error(
			// 	`Task "${TaskName[taskName]}" failed`,
			// 	{ cause: error }, // preserves original stack
			// );
			// throw new Error(`Task "${TaskName[taskName]}" failed: ${(error as Error).message}`);
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
}

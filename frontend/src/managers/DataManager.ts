import { DataLoader, AssetLoader } from "../loaders";
import { FetchedSummary } from "../loaders/DataLoader";
import { CelestialBodies, FetchedOrbitalParameters, FetchedPhysicalParameters, parametersToIgnore } from "../types";
import { DataProcessor } from "../utils";
import { DataTexture, Texture } from "three";
import SolarSystem, { SOLAR_SYSTEM_PRIMARY, SOLAR_SYSTEM_SECONDARIES } from "../models/Solarsystem";
import { timeManager, uiManager } from "../core";
import { CelestialBody, OrbitingBody, Planet, Star } from "../models";
interface FocusedSystem {
	Barycenter?: CelestialBody;
	Focused?: CelestialBody;
	Summary?: FetchedSummary;
}
export default class DataManager {
	private _hasInitialDataLoaded: boolean = false;
	private _loadingTasks: Set<string> = new Set();
	private _solarSystem: SolarSystem = new SolarSystem();
	private _isLoading: boolean = true;
	private _dataProcessor: DataProcessor = new DataProcessor();
	private _assetLoader: AssetLoader = new AssetLoader(
		() => {},
		() => {}
	);
	private _dataLoader: DataLoader = new DataLoader(); // Change to DataLoader
	private _fetchedOrbitalParameters?: FetchedOrbitalParameters;
	private _fetchedPhysicalParameters?: FetchedPhysicalParameters;
	private _focusedSummary?: FetchedSummary;
	private _focusedCelestialBody?: CelestialBody;
	private _focusedSecondaries?: CelestialBodies | undefined;
	private _focusedSystem: FocusedSystem = {};
	constructor() {
		this.onLoad();
	}

	get hasInitialDataLoaded(): boolean {
		return this._hasInitialDataLoaded;
	}
	get focusedSecondaries(): CelestialBodies | undefined {
		return this._focusedSecondaries;
	}
	set focusedSummary(focusedSummary: FetchedSummary) {
		this._focusedSummary = focusedSummary;
	}
	set focusedCelestialBody(focusedCelestialBody: CelestialBody) {
		this._focusedCelestialBody = focusedCelestialBody;
	}
	get focusedCelestialBody(): CelestialBody | undefined {
		return this._focusedCelestialBody;
	}
	get focusedSummary(): FetchedSummary | undefined {
		return this._focusedSummary;
	}
	get solarSystem(): SolarSystem {
		return this._solarSystem;
	}
	get isLoading(): boolean {
		return this._isLoading;
	}
	get fetchedOrbitalParameters(): FetchedOrbitalParameters | undefined {
		return this._fetchedOrbitalParameters;
	}
	get fetchedPhysicalParameters(): FetchedPhysicalParameters | undefined {
		return this._fetchedPhysicalParameters;
	}
	set focusedBarycenter(focused: CelestialBody) {
		this._focusedSystem.Barycenter = focused instanceof Planet ? focused : this._focusedSystem.Barycenter;
	}
	get focusedBarycenter(): CelestialBody | undefined {
		return this._focusedSystem.Barycenter;
	}
	public getFocusedElements = async (focusedBody: CelestialBody, secondaryNames?: string[]): Promise<void> => {
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
			this._focusedSummary = await this.getFocusedSummary(focusedBody);
			this._focusedCelestialBody.preLoadDetail();

			await this.getParameterSummaries(focusedBody);
			this.disposeOfFetched();
		});
	};

	public getParameterSummary = async (parameter: string): Promise<FetchedSummary> => {
		return await this._dataLoader.fetchParameterSummary(parameter);
	};
	private getParameterSummaries = async (focusedCelestialBody: CelestialBody): Promise<void> => {
		return await this.trackLoading("getParameterSummaries", async () => {
			Object.keys(focusedCelestialBody.physicalParameters)
				.filter((parameter) => !parametersToIgnore.includes(parameter))
				.forEach((parameter) => this._dataLoader.fetchParameterSummary(parameter));

			if (focusedCelestialBody instanceof OrbitingBody) {
				Object.keys(focusedCelestialBody.orbitingParameters)
					.filter((parameter) => !parametersToIgnore.includes(parameter))
					.forEach((parameter) => this._dataLoader.fetchParameterSummary(parameter));
			}
		});
	};
	private getFocusedSummary = async (focusedBody: CelestialBody): Promise<FetchedSummary> => {
		return await this.trackLoading("focusedSecondaries", async () => {
			return await this._dataLoader.fetchFocusedSummary(focusedBody.metadata.EnglishName, focusedBody.metadata.BodyType);
		});
	};
	private getFocusedSecondaries = async (primaryBody: CelestialBody, secondaryNames?: string[]): Promise<CelestialBodies> => {
		if (!secondaryNames) throw new Error("Secondary names must be provided.");
		return await this.trackLoading("focusedSecondaries", async () => {
			this._focusedCelestialBody = primaryBody;
			this._fetchedPhysicalParameters = await this._dataLoader.fetchPhysicalParameters(secondaryNames, "id");
			this._fetchedOrbitalParameters = await this._dataLoader.fetchOrbitalParameters(this._focusedCelestialBody.metadata.EnglishName, Object.keys(this._fetchedPhysicalParameters));
			return await this.processBodies();
		});
	};
	private disposeOfFetched = () => {
		this._fetchedOrbitalParameters = undefined;
		this._fetchedPhysicalParameters = undefined;
	};
	private onLoad = async (): Promise<void> => {
		return await this.trackLoading("initialLoad", async () => {
			this._fetchedOrbitalParameters = await this._dataLoader.fetchOrbitalParameters(SOLAR_SYSTEM_PRIMARY, SOLAR_SYSTEM_SECONDARIES);
			this._fetchedPhysicalParameters = await this._dataLoader.fetchPhysicalParameters([SOLAR_SYSTEM_PRIMARY, ...SOLAR_SYSTEM_SECONDARIES]);
			const processedBodies = await this.processBodies(false);
			this._solarSystem.initialiseSolarSystem(processedBodies);
			this.disposeOfFetched();
		});
	};
	private processBodies = async (requireOrbitalParameters: boolean = true): Promise<CelestialBodies> => {
		if (!(this._fetchedOrbitalParameters && this._fetchedPhysicalParameters)) {
			throw new Error("Failed to process celestial body parameters.");
		}
		return this._dataProcessor.process(this._fetchedPhysicalParameters, this._fetchedOrbitalParameters, requireOrbitalParameters);
	};
	public getTexture = async (url?: string): Promise<Texture | null> => {
		if (!url) return null;
		return await this.trackLoading(url, async () => {
			return await this._assetLoader.loadTexure(url);
		});
	};
	// public getTextureTemp = async (folder: string, texture: string, isGeneric: boolean = false, generic_number: number): Promise<Texture | null> => {
	// 	// if (!url) return null;
	// 	return await this.trackLoading(url, async () => {
	// 		return await this._assetLoader.loadTexure(url);
	// 	});
	// };
	public getHDRI = async (url?: string): Promise<DataTexture | null> => {
		if (!url) return null;
		return await this.trackLoading(url, async () => {
			return await this._assetLoader.loadHDRI(url);
		});
	};
	private trackLoading = async <T>(taskName: string, fn: () => Promise<T>): Promise<T> => {
		this.startLoading(taskName);
		try {
			return await fn();
		} finally {
			this.finishLoading(taskName);
		}
	};
	private startLoading = (task: string): void => {
		this._loadingTasks.add(task);
		this.updateUILoading();
	};
	private finishLoading = (task: string): void => {
		this._loadingTasks.delete(task);

		this.updateUILoading();
	};
	private updateUILoading = (): void => {
		this._isLoading = this._loadingTasks.size > 0;
		if (this._isLoading) {
			uiManager().showLoadScreen();
		} else {
			uiManager().hideLoadScreen();
			if (this._focusedCelestialBody && this._focusedSummary) uiManager().updateInformationPanel(this._focusedCelestialBody, this._focusedSummary.summary);
			if(!this._hasInitialDataLoaded) {
				timeManager().reset()
				this._hasInitialDataLoaded = true
			}
		}
		// this._isLoading ? uiManager().showLoadScreen() : uiManager().hideLoadScreen();
	};
}

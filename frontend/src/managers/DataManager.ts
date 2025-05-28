import { DataLoader, AssetLoader } from "../loaders";
import { OrbitalElements, OrbitalElementsResponse, SecondaryOrbitalElements, SolarSystemParameters } from "../types";

export type OrbitalBodies = {
	[secondaryName: string]: OrbitalElements | OrbitalElementsResponse;
};
import { FetchedOrbitalParameters, FetchedPhysicalParameters } from "../loaders/DataLoader";
import DataProcessor from "../utils/DataProcessor";
import { DataTexture, Texture } from "three";
import textures from "../data/textures.json";
const INITIAL_PRIMARY = "Sun";
const INITIAL_SECONDARY = ["Earth", "Mars", "Jupiter", "Saturn", "Mercury", "Uranus", "Pluto", "Venus", "Neptune"];
export default class DataManager {
	private _isLoading: boolean = true;
	private _dataProcessor: DataProcessor;
	private _assetLoader: AssetLoader;
	private _dataLoader: DataLoader; // Change to DataLoader

	// private _solarSystemParameters?: SolarSystemParameters;
	// private _focusedSecondaries?: SecondaryOrbitalElements;

	private _fetchedOrbitalParameters?: FetchedOrbitalParameters;
	private _fetchedPhysicalParameters?: FetchedPhysicalParameters;
	private _focusedSummary?: string;

	// HOLD THEM HERE AND JUST DELETE FUCKIGN ASIODBA
	private _focusedSecondaries?: SecondaryOrbitalElements | undefined;

	constructor() {
		this._dataProcessor = new DataProcessor();
		this._assetLoader = new AssetLoader(
			() => {},
			() => {}
		);
		this._dataLoader = new DataLoader();
	}

	get isLoading(): boolean {
		return this._isLoading;
	}
	public status = (): boolean => {
		return this.dataLoaderStatus() && this.assetLoaderStatus();
	};
	private dataLoaderStatus = (): boolean => {
		return this._dataLoader.hasLoaded;
	};
	private assetLoaderStatus = (): boolean => {
		return this._assetLoader.hasLoaded;
	};
	get fetchedOrbitalParameters(): FetchedOrbitalParameters | undefined {
		return this._fetchedOrbitalParameters;
	}
	get fetchedPhysicalParameters(): FetchedPhysicalParameters | undefined {
		return this._fetchedPhysicalParameters;
	}
	public onLoad = async () => {
		this._fetchedOrbitalParameters = await this._dataLoader.fetchOrbitalParameters(INITIAL_PRIMARY, INITIAL_SECONDARY);
		this._fetchedPhysicalParameters = await this._dataLoader.fetchPhysicalParameters([INITIAL_PRIMARY, ...INITIAL_SECONDARY]);
		this.processParameters();
	};
	private processParameters = () => {
		if (!(this._fetchedOrbitalParameters && this._fetchedPhysicalParameters)) return;
		// Process
		console.log("Hello");
		const bodies = this._dataProcessor.process(this._fetchedPhysicalParameters, this._fetchedOrbitalParameters);
		console.log(bodies);
	};
	set focusedSummary({ planetName, bodyType }: { planetName: string; bodyType: string }) {
		this._dataLoader
			.fetchFocusedSummary(planetName, bodyType)
			.then((data) => (this._focusedSummary = data.summary))
			.catch((error) => (this._focusedSummary = error));
	}
	public getFocusedSummary = (planetName: string, bodyType: string) => {
		return this._dataLoader.fetchFocusedSummary(planetName, bodyType);
	};
	get focusedSummary(): string | undefined {
		return this._focusedSummary;
	}
	public getTexture = async (url?: string): Promise<Texture | null> => {
		if (!url) return null;
		return await this._assetLoader.loadTexure(url);
	};
	public getHDRI = async (url?: string): Promise<DataTexture | null> => {
		if (!url) return null;
		return await this._assetLoader.loadHDRI(url);
	};
	public getPlanetaryData = async (primaryName: string, secondaryNames: string[]) => {
		this._fetchedOrbitalParameters = await this._dataLoader.fetchOrbitalParameters(primaryName, secondaryNames);
		// secondaryNames = includes_primary ? [primaryName, ...secondaryNames] : secondaryNames;
		this._fetchedPhysicalParameters = await this._dataLoader.fetchPhysicalParameters(secondaryNames);
		this.processParameters();
	};
	set focusedSecondaries({ primaryName, secondaryNames }: { primaryName: string; secondaryNames: string[] }) {
		// this._dataLoader.fetchMoonOrbitalParameters(primaryName, secondaryNames).then((data) => (this._focusedSecondaries = data));
	}
	get focusedSecondaries(): SecondaryOrbitalElements | undefined {
		return this._focusedSecondaries;
	}
}

import { DataLoader, AssetLoader } from "../loaders";
import { OrbitalElements, OrbitalElementsResponse, SecondaryOrbitalElements, SolarSystemParameters } from "../types";

export type OrbitalBodies = {
  [secondaryName: string]: OrbitalElements | OrbitalElementsResponse;
};
import { FetchedOrbitalParameters, FetchedPhysicalParameters } from "../loaders/DataLoader";
import DataProcessor from "../utils/DataProcessor";

const INITIAL_PRIMARY = "Sun"
const INITIAL_SECONDARY = ["Earth", "Mars", "Jupiter", "Saturn", "Mercury", "Uranus", "Pluto", "Venus", "Neptune"]
export default class DataManager {
  private _isLoading: boolean = true;
  private _dataProcessor: DataProcessor
  private _assetLoader: AssetLoader;
  private _dataLoader: DataLoader; // Change to DataLoader

  // private _solarSystemParameters?: SolarSystemParameters;
  // private _focusedSecondaries?: SecondaryOrbitalElements;

  private _fetchedOrbitalParameters?: FetchedOrbitalParameters
  private _fetchedPhysicalParameters?: FetchedPhysicalParameters
  private _focusedSummary?: string;
  private _focusedSecondaries?: SecondaryOrbitalElements | undefined
  constructor() {
    this._dataProcessor = new DataProcessor()
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
    return this.dataLoaderStatus() && this.assetLoaderStatus()
  }
  private dataLoaderStatus = (): boolean => {
    return true
  }
  private assetLoaderStatus = (): boolean => {
    return true
  }
  private onLoad = async () => {
    this.loadPlanetaryData(INITIAL_PRIMARY, INITIAL_SECONDARY)
    this.processParameters();
  }

  private processParameters = () => {
    if(!(this._fetchedOrbitalParameters && this._fetchedPhysicalParameters)) return
    // Process
    this._dataProcessor.process(this._fetchedPhysicalParameters, this._fetchedOrbitalParameters)
  }
  private initialiseSolarSystem = () => {};
  set focusedSummary({ planetName, bodyType }: { planetName: string; bodyType: string }) {
    this._dataLoader
      .fetchSummary(planetName, bodyType)
      .then((data) => (this._focusedSummary = data.extract))
      .catch((error) => (this._focusedSummary = error));
  }
  get focusedSummary(): string | undefined {
    return this._focusedSummary;
  }
  public loadPlanetaryData = async (primaryName: string, secondaryNames: string[]) => {
    this._fetchedOrbitalParameters = await this._dataLoader.fetchOrbitalParameters(primaryName, secondaryNames)
    this._fetchedPhysicalParameters = await this._dataLoader.fetchPhysicalParameters(secondaryNames)
    this.processParameters();
  }
  // public loadTexture = async 
  set focusedSecondaries({ primaryName, secondaryNames }: { primaryName: string; secondaryNames: string[] }) {
    // this._dataLoader.fetchMoonOrbitalParameters(primaryName, secondaryNames).then((data) => (this._focusedSecondaries = data));
    
  }
  get focusedSecondaries(): SecondaryOrbitalElements | undefined {
    return this._focusedSecondaries;
  }
}

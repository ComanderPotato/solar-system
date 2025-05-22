import { DataLoader, AssetLoader } from "../loaders"
import { SecondaryOrbitalElements, SolarSystemParameters } from "../types"

export default class DataManager {
    private _isLoading: boolean = true
    private _assetLoadingManager: AssetLoader
    private _dataLoader: DataLoader // Change to DataLoader

    private _solarSystemParameters?: SolarSystemParameters
    private _focusedSecondaries?: SecondaryOrbitalElements
    private _focusedSummary?: string
    constructor() {
        this._assetLoadingManager = new AssetLoader(() => {}, () => {})
        this._dataLoader = new DataLoader()
    }

    get isLoading(): boolean {
        return this._isLoading
    }
    private initialiseSolarSystem = () => {
        
    }
    set focusedSummary({planetName, bodyType}: {planetName: string, bodyType: string}) {
        this._dataLoader.fetchCelestialBodyExtract(planetName, bodyType)
        .then(data => this._focusedSummary = data.extract)
        .catch(error => this._focusedSummary = error)
    }
    get focusedSummary(): string | undefined {
        return this._focusedSummary
    }

    set focusedSecondaries({primaryName, secondaryNames}: {primaryName: string, secondaryNames: string[]}) {
        this._dataLoader.fetchMoonOrbitalParameters(primaryName, secondaryNames)
        .then(data => this._focusedSecondaries = data)
    }
    get focusedSecondaries(): SecondaryOrbitalElements | undefined {
        return this._focusedSecondaries
    }
}
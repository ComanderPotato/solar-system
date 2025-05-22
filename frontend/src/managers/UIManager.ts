import { CelestialBodyParameters } from "../types"

export default class UIManager {
    private _loadScreen: HTMLElement
    private _spinner: HTMLElement
    private bodyInformation: HTMLElement
    private _hasInitialLoaded: boolean = false
    constructor() {
        this._loadScreen = document.getElementById("loading-screen") as HTMLElement
        this._spinner = document.getElementById("spinner") as HTMLElement
        this.bodyInformation = document.getElementById("summary") as HTMLElement
    }


    // public showLoadScreen = () => this._loadScreen.classList.remove("hidden")

    public hideLoadScreen = () => {
        this._hasInitialLoaded ? this._spinner.classList.add("hidden") : this._loadScreen.classList.add("hidden")
        this._hasInitialLoaded = true
    }
    
    public showLoadScreen = () => this._spinner.classList.remove("hidden")

    // public hideSpinner = () => this._spinner.classList.add("hidden")

    public showBodyInformation = () => this.bodyInformation.classList.remove("hidden")

    public hideBodyInformation = () => this.bodyInformation.classList.add("hidden")

    public updateBodyInformation = (extract: string) => {
        // document.querySelector(".summary")!.textContent = extract
        console.log(extract)
        this.bodyInformation.textContent = extract
    }
    public isLoadScreenVisible = () => !(this._spinner.classList.contains("hidden") || this._loadScreen.classList.contains("hidden"))
}
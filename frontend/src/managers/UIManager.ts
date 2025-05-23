import { CelestialBodyParameters } from "../types";

export default class UIManager {
  private _loadScreen: HTMLElement;
  private _spinner: HTMLElement;
  private _bodyInformation: HTMLElement;
  private _hasInitialLoaded: boolean = false;

  private _controlPanel: HTMLElement;

  private _dateTimeContainer: HTMLElement;

  private _date: HTMLElement;
  private _time: HTMLElement;

  constructor() {
    //     document.addEventListener('DOMContentLoaded', function() {
    //   // Your DOM manipulation code goes here...
    //     })
    this._loadScreen = document.getElementById("loading-screen") as HTMLElement;
    this._spinner = document.getElementById("spinner") as HTMLElement;
    this._bodyInformation = document.getElementById("summary") as HTMLElement;
    this._controlPanel = document.getElementById("control-panel") as HTMLElement;

    this._dateTimeContainer = document.getElementById("datetime-container") as HTMLElement;

    this._time = document.getElementById("time") as HTMLElement;
    this._date = document.getElementById("date") as HTMLElement;
  }

  // public showLoadScreen = () => this._loadScreen.classList.remove("hidden")

  public hideLoadScreen = () => {
    this._hasInitialLoaded ? this._spinner.classList.add("hidden") : this._loadScreen.classList.add("hidden");
    this._hasInitialLoaded = true;
  };

  public showLoadScreen = () => this._spinner.classList.remove("hidden");

  // public hideSpinner = () => this._spinner.classList.add("hidden")

  public showBodyInformation = () => this._bodyInformation.classList.remove("hidden");

  public hideBodyInformation = () => this._bodyInformation.classList.add("hidden");

  public updateBodyInformation = (extract: string) => {
    // document.querySelector(".summary")!.textContent = extract
    // console.log(extract)
    this._bodyInformation.textContent = extract;
  };
  public isLoadScreenVisible = () => !(this._spinner.classList.contains("hidden") || this._loadScreen.classList.contains("hidden"));

  private initialiseDateTime = () => {};
  public updateDateTime = () => {};
}

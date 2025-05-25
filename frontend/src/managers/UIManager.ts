import { CelestialBody } from "../models";
import { CelestialBodyParameters } from "../types";
import { updateInformationPanel } from "../utils/uiHelpers";

export default class UIManager {
  private _loadScreen: HTMLElement;
  private _spinner: HTMLElement;
  private _bodyInformation: HTMLElement;
  private _hasInitialLoaded: boolean = false;

  private _controlPanel: HTMLElement;

  private _dateTimeContainer: HTMLElement;

  private _date: HTMLElement;
  private _time: HTMLElement;

  private _summary: HTMLElement;
  private _toggleButton: HTMLElement;
  private _infoPanel: HTMLElement;
  private _collapseBtn: HTMLElement;
  constructor() {
    // document.addEventListener("DOMContentLoaded", this.onLoad);
    this._loadScreen = document.getElementById("loading-screen") as HTMLElement;
    this._spinner = document.getElementById("spinner") as HTMLElement;
    this._bodyInformation = document.getElementById("summary") as HTMLElement;
    this._controlPanel = document.getElementById(
      "control-panel"
    ) as HTMLElement;

    this._dateTimeContainer = document.getElementById(
      "datetime-container"
    ) as HTMLElement;

    this._time = document.getElementById("time") as HTMLElement;
    this._date = document.getElementById("date") as HTMLElement;
    this._summary = document.getElementById("summary") as HTMLElement;
    this._toggleButton = document.getElementById(
      "toggleSummary"
    ) as HTMLElement;
    this._infoPanel = document.getElementById("infoPanel") as HTMLElement;
    this._collapseBtn = document.getElementById("collapseBtn") as HTMLElement;
    this.initialiseListeners();
  }

  private initialiseListeners = () => {
    this._toggleButton.addEventListener("click", () => {
      this._summary.classList.toggle("expanded");
      this._toggleButton.textContent = this._summary.classList.contains(
        "expanded"
      )
        ? "Read less"
        : "Read more";
    });
    document.querySelectorAll(".dropdown-header").forEach((header) => {
      header.addEventListener("click", () => {
        (header.parentElement as HTMLElement).classList.toggle("active");
      });
    });
    this._collapseBtn.addEventListener("click", () => {
      this._infoPanel.classList.toggle("collapsed");
      this._collapseBtn.textContent = this._infoPanel.classList.contains(
        "collapsed"
      )
        ? "⮞"
        : "⮜";
    });
  };
  // private onLoad = () => {

  // };
  // public showLoadScreen = () => this._loadScreen.classList.remove("hidden")

  public hideLoadScreen = () => {
    this._hasInitialLoaded
      ? this._spinner.classList.add("hidden")
      : this._loadScreen.classList.add("hidden");
    this._hasInitialLoaded = true;
  };

  public showLoadScreen = () => this._spinner.classList.remove("hidden");

  // public hideSpinner = () => this._spinner.classList.add("hidden")

  public showBodyInformation = () =>
    this._bodyInformation.classList.remove("hidden");

  public hideBodyInformation = () =>
    this._bodyInformation.classList.add("hidden");

  public updateBodyInformation = (
    celestialBody: CelestialBody,
    extract: string
  ) => {
    // document.querySelector(".summary")!.textContent = extract
    // console.log(extract)
    // this._bodyInformation.textContent = extract;
    updateInformationPanel(celestialBody, extract);
  };
  public isLoadScreenVisible = () =>
    !(
      this._spinner.classList.contains("hidden") ||
      this._loadScreen.classList.contains("hidden")
    );

  private initialiseDateTime = () => {};
  public updateDateTime = () => {};
}

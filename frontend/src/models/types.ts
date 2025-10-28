import CelestialBody from "./CelestialBody";
import IMeshProvider from "../interfaces/IMeshProvider";
import IModelProvider from "../interfaces/IModelProvider";

export type CelestialBodyMesh = CelestialBody & IMeshProvider;
export type CelestialBodyModel = CelestialBody & IModelProvider;
export type CelestialBodyProvider = CelestialBodyMesh | CelestialBodyModel;

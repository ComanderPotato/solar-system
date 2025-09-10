import { Vector3 } from "three";
import CelestialBody from "../../models/CelestialBody";
import IController from "../IController";
import ISolarSystemManager from "../managers/ISolarSystemManager";
import { InitialSolarSystem } from "../../models/Solarsystem";
import { CelestialBodies } from "../../types/CelestialBodyParameters";

export interface FocusedBodyInformation {
	body: CelestialBody;
	position: Vector3;
	radius: number;
	velocity: Vector3 | undefined;
	primaryPosition: Vector3 | undefined;
}
export default interface ISolarSystemController extends IController<ISolarSystemManager> {
	handleSimulation(dt: number): void;
	handleDetailUpdate(): void;
	handleSolarSystemInitialisation(initialBodies: CelestialBodies): void;
	set focusedCelestialBody(body: CelestialBody);
	get focusedCelestialBody(): CelestialBody | undefined;
	get focusedBodyInformation(): FocusedBodyInformation | undefined;
	get initialSolarSystemData(): InitialSolarSystem;
}

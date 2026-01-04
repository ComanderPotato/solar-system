import { Vector3 } from "three";
import CelestialBody from "../../models/CelestialBody";
import SolarSystem, { InitialSolarSystem } from "../../models/Solarsystem";
import { CelestialBodies } from "../../types/CelestialBodyParameters";

export interface FocusedBodyInformation {
	name: string;
	body: CelestialBody;
	position: Vector3;
	radius: number;
	velocity: Vector3 | undefined;
	primaryPosition: Vector3 | undefined;
}
export default interface ISolarSystemController {
	handleSimulation(dt: number): void;
	handleSolarSystemInitialisation(initialBodies: CelestialBodies): void;
	set focusedCelestialBody(body: CelestialBody);
	get focusedCelestialBody(): CelestialBody | undefined;
	get focusedBodyInformation(): FocusedBodyInformation | undefined;
	get initialSolarSystemData(): InitialSolarSystem;
	get solarSystem(): SolarSystem;
}

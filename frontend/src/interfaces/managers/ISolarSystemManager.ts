import IManager from "../IManager";
import CelestialBody from "../../models/CelestialBody";
import SolarSystem from "../../models/Solarsystem";

export default interface ISolarSystemManager extends IManager {
	// solarSystem?: SolarSystem;
	initialiseSolarSystem(primary: CelestialBody, secondaries: CelestialBody[]): void;
	get solarSystem(): SolarSystem;
	set focusedCelestialBody(body: CelestialBody);
	get focusedCelestialBody(): CelestialBody | undefined;
}

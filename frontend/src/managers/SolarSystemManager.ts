import SolarSystem from "../models/Solarsystem";
import ISolarSystemManager from "../interfaces/managers/ISolarSystemManager";
import Manager from "../core/Manager";
import CelestialBody from "../models/CelestialBody";
import { CelestialBodies } from "../types/CelestialBodyParameters";

interface FocusedSystem {
	Barycenter: CelestialBody;
	Focused: CelestialBody;
}
export default class SolarSystemManager extends Manager implements ISolarSystemManager {
	private _solarSystem!: SolarSystem;
	private _focusedCelestialBody?: CelestialBody;
	private _focusedSystem?: FocusedSystem;

	public constructor() {
		super();
	}
	initialiseSolarSystem(primary: CelestialBody, secondaries: CelestialBody[]): void {
		this._solarSystem = new SolarSystem(primary, secondaries);
	}

	get solarSystem(): SolarSystem {
		if (!this._solarSystem) throw new Error("Solar System not initialised");
		return this._solarSystem;
	}
	get focusedCelestialBody(): CelestialBody | undefined {
		return this._focusedCelestialBody;
	}
	set focusedCelestialBody(body: CelestialBody | undefined) {
		this._focusedCelestialBody = body;
	}
	get focusedSystem(): FocusedSystem | undefined {
		return this._focusedSystem;
	}
	set focusedSystem(focusedSystem: FocusedSystem) {
		this._focusedSystem = focusedSystem;
	}
}

import CelestialBody from "./CelestialBody";
import OrbitingBody from "./OrbitingBody";
import Star from "./Star";

import { CelestialBodies } from "../types/CelestialBodyParameters";

export const SOLAR_SYSTEM_PRIMARY = "Sun";
export const SOLAR_SYSTEM_SECONDARIES = [
	"Earth",
	"Mars",
	"Jupiter",
	"Saturn",
	"Mercury",
	"Uranus",
	"Pluto",
	"Venus",
	"Neptune",
];

export interface InitialSolarSystem {
	primary: string;
	secondaries: string[];
}
export default class SolarSystem {
	private _primaryBody!: Star;
	private _secondaryBodies!: OrbitingBody[];
	private _focusedSecondaries?: OrbitingBody[];

	constructor() {}
	get allBodies(): CelestialBody[] {
		return [this._primaryBody, ...(this._primaryBody.secondaryBodies ?? []), ...(this._focusedSecondaries ?? [])];
	}
	set focusedSecondaries(secondaries: OrbitingBody[] | undefined) {
		this._focusedSecondaries = secondaries;
	}
	get focusedSecondaries(): OrbitingBody[] | undefined {
		return this._focusedSecondaries;
	}
	get primaryBody(): Star {
		return this._primaryBody;
	}

	get initialData(): InitialSolarSystem {
		return {
			primary: SOLAR_SYSTEM_PRIMARY,
			secondaries: SOLAR_SYSTEM_SECONDARIES,
		};
	}
	public initialisePrimary(primary: CelestialBody) {
		if (!(primary instanceof Star)) throw new Error();
		this._primaryBody = primary;
	}
	public initialiseSecondaries(secondaries: CelestialBody[]) {
		if (!secondaries.every((secondary) => secondary instanceof OrbitingBody)) throw new Error();
		this._secondaryBodies = secondaries;
	}
	// public nBodySimulate(elapsedTime: number) {
	//   if (!this.secondaryBodies) return
	//     for(let current of this.secondaryBodies) {
	//       for(let other of this.secondaryBodies) {
	//         if(current == other) continue;
	//         current.updateVelocity(elapsedTime, other)
	//       }
	//     }
	//     this.secondaryBodies.forEach((secondaryBody) => {
	//       secondaryBody.updatePosition(elapsedTime);
	//     });
	// }
	// public stopSimulate() {}
}

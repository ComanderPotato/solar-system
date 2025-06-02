import { CelestialBody, CelestialBodyFactory, OrbitingBody, Star } from ".";
import { CelestialBodies } from "../types";

export const SOLAR_SYSTEM_PRIMARY = "Sun";
export const SOLAR_SYSTEM_SECONDARIES = ["Earth", "Mars", "Jupiter", "Saturn", "Mercury", "Uranus", "Pluto", "Venus", "Neptune"];
export default class SolarSystem {
	private _primaryBody!: Star;
	private _celestialBodies!: CelestialBodies;
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
		return this._primaryBody
	}
	public initialiseSolarSystem = (celestialBodies: CelestialBodies) => {
		this._celestialBodies = celestialBodies;
		this.initialisePrimaryBody();
		this.initialiseSecondaryBodies();
	};
	private initialisePrimaryBody = () => {
		this._primaryBody = CelestialBodyFactory.buildCelestialBody(this._celestialBodies[SOLAR_SYSTEM_PRIMARY]) as Star;
	};
	private initialiseSecondaryBodies = () => {
		SOLAR_SYSTEM_SECONDARIES.forEach((secondaryName) => {
			this._primaryBody.addSecondaryBody(CelestialBodyFactory.buildCelestialBody(this._celestialBodies[secondaryName], this._primaryBody) as OrbitingBody);
		});
	};
	public updateDetail = (): void => {
		if (!this._primaryBody || !this._primaryBody.secondaryBodies) return;
		this._primaryBody.updateDetail();
		this._primaryBody.secondaryBodies.forEach((secondaryBody) => {
			secondaryBody.updateMeshDetail();
		});
	};
	// public simulate = (elaspedTime: number): void => {
	// 	if (!this._primaryBody || !this._primaryBody.secondaryBodies) return;
	// 	const bodies: OrbitingBody[] = [...this._primaryBody.secondaryBodies, ...(this.focusedSecondaries ?? [])];
	// 	for (let body of bodies) {
	// 		body.updateVelocity(elaspedTime);
	// 	}
	// 	for (let body of bodies) {
	// 		body.updatePosition(elaspedTime);
	// 	}
	// };
	public simulate = (elapsedTime: number): void => {
		if (!this._primaryBody || !this._primaryBody.secondaryBodies) return;
		this._primaryBody.rotateOnAxis(elapsedTime);
		this._primaryBody.updateDetail();
		this._primaryBody.secondaryBodies.forEach((secondaryBody) => {
			secondaryBody.updateVelocity(elapsedTime);
		});
		this._primaryBody.secondaryBodies.forEach((secondaryBody) => {
			secondaryBody.updatePosition(elapsedTime);
		});
	};
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

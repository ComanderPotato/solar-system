import { Vector3 } from "three";
import { OrbitingBodyParameters } from "../types/CelestialBodyParameters";
import CelestialBody from "./CelestialBody";
import { OrbitalParameters } from "../types/OrbitalParameters";
export default abstract class OrbitingBody<
	T extends OrbitingBodyParameters = OrbitingBodyParameters,
> extends CelestialBody<T> {
	protected _primaryBody: CelestialBody;
	protected _orbitingBodyParameters: T["Orbital"];
	protected _currentVelocity: Vector3 = new Vector3(0, 0, 0);
	constructor(
		orbitingBodyParameters: OrbitingBodyParameters,
		primaryBody: CelestialBody,
		secondaryBodyNames?: string[],
	) {
		super(orbitingBodyParameters, secondaryBodyNames);
		this._primaryBody = primaryBody;
		this._currentVelocity = orbitingBodyParameters.Orbital.Velocity;
		this._orbitingBodyParameters = orbitingBodyParameters.Orbital;
	}
	get primaryBody(): CelestialBody {
		return this._primaryBody;
	}
	// Getters
	get currentVelocity(): Vector3 {
		return this._currentVelocity;
	}
	get orbitingParameters(): OrbitalParameters {
		return this._orbitingBodyParameters;
	}
	abstract initialiseOrbitalPlane(): void;
}

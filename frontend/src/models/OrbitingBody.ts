import { Color, EllipseCurve, Vector2, Vector3 } from "three";
// import { OrbitingBodyParameters } from "../types";
import { OrbitingBodyParameters } from "../types/CelestialBodyParameters";
// import {
// 	calculateAttractiveForce,
// 	calculateForceDirection,
// 	calculateSquaredDistance,
// 	calculateAcceleration,
// 	CelestialBodyColour,
// } from "../utils";
import {
	calculateAttractiveForce,
	calculateForceDirection,
	calculateSquaredDistance,
	calculateAcceleration,
} from "../utils/formulas";
import { CelestialBodyColour } from "../utils/constants";
import CelestialBody from "./CelestialBody";
import { Line2, LineGeometry, LineMaterial } from "three/examples/jsm/Addons.js";

export default abstract class OrbitingBody<
	T extends OrbitingBodyParameters = OrbitingBodyParameters,
> extends CelestialBody<T> {
	// Can probably put primaryBody in the root

	protected _primaryBody: CelestialBody;
	protected _orbitingBodyParameters: T["Orbital"];
	protected _currentVelocity!: Vector3;
	constructor(
		orbitingBodyParameters: OrbitingBodyParameters,
		primaryBody: CelestialBody,
		secondaryBodyNames?: string[],
	) {
		super(orbitingBodyParameters, secondaryBodyNames);
		this._primaryBody = primaryBody;
		this._orbitingBodyParameters = orbitingBodyParameters.Orbital;
		this.initialiseOrbit();
		this.drawOrbit();
	}

	// Getters
	get currentVelocity(): Vector3 {
		return this._currentVelocity;
	}
	get orbitingParameters(): T["Orbital"] {
		return this._orbitingBodyParameters;
	}
	public updateVelocity = (dt: number, other?: CelestialBody): void => {
		const acceleration = this.calculateAcceleration(other);
		this._currentVelocity.add(acceleration.multiplyScalar(dt));
		this.updateDetail();
		if (this._secondaryBodies) {
			this._secondaryBodies.forEach((secondaryBody) => secondaryBody.updateVelocity(dt));
		}
	};
	public updatePosition = (dt: number) => {
		this.rotateOnAxis(dt);
		const newVelocity = this._currentVelocity.clone().multiplyScalar(dt);
		this._celestialBodyGroup.position.add(newVelocity);
		this._orbitGroup.position.copy(this._celestialBodyGroup.position);
		this._position = this._celestialBodyGroup.position;
		if (this._secondaryBodies) {
			this._secondaryBodies.forEach((secondaryBody) => secondaryBody.updatePosition(dt));
		}
	};
	private calculateAcceleration(other?: CelestialBody, clonePrimary?: Vector3, cloneSecondary?: Vector3): Vector3 {
		let acceleration = new Vector3();
		// if (!this.primaryBody || !other) return acceleration;
		// if (!parentBody) return acceleration;
		if (!this.primaryBody) return acceleration;

		let [P, S] = [this.primaryBody.position.clone(), this._position.clone()];
		let [M, m] = [this._primaryBody.physicalParameters.PlanetaryMass, this._physicalParameters.PlanetaryMass];
		// let [P, S] = [this.primaryBody.position.clone(), this._position.clone()];
		// let [M, m] = [this.primaryBody.getParameter("Mass"), this.getParameter("Mass")];
		// if (other) {
		// 	[P, S] = [other.position.clone(), this._position.clone()];
		// 	[M, m] = [other.physicalParameters.Mass, this._physicalParameters.Mass];
		// } else if (clonePrimary && cloneSecondary) {
		// 	[P, S] = [clonePrimary, cloneSecondary];
		// }
		const sqrDist = calculateSquaredDistance(P, S);
		const forceDir = calculateForceDirection(P, S);
		const force = calculateAttractiveForce(forceDir, M, m, sqrDist);
		acceleration = calculateAcceleration(force, m);
		return acceleration;
	}

	protected drawOrbit = (): void => {
		const a = this._orbitingBodyParameters.SemiMajorAxis;
		const b = this._orbitingBodyParameters.SemiMinorAxis;
		const e = this._orbitingBodyParameters.OrbitalEccentricity;
		const c = e * a;
		const curve = new EllipseCurve(-c, 0, a, b, 0, 2 * Math.PI, false, 0);
		const points = curve.getPoints(180);

		const positions: number[] = [];
		for (const point of points) {
			positions.push(point.x, 0, point.y);
		}
		const colour = new Color(
			CelestialBodyColour[this._metadata.EnglishName.toUpperCase()] ??
				CelestialBodyColour[this._primaryBody.metadata.EnglishName.toUpperCase()],
		);
		const geometry = new LineGeometry();
		geometry.setPositions(positions);
		const material = new LineMaterial({
			color: colour,
			transparent: true,
			opacity: 0.4,
			linewidth: 2,
			resolution: new Vector2(window.innerWidth, window.innerHeight),
		});

		const orbit = new Line2(geometry, material);
		orbit.rotateOnAxis(new Vector3(1, 0, 0), this._orbitingBodyParameters.Inclination);
		orbit.rotateOnWorldAxis(new Vector3(0, 1, 0), this._orbitingBodyParameters.LongitudeOfAscendingNode);
		orbit.rotateOnAxis(new Vector3(0, 1, 0), this._orbitingBodyParameters.ArgumentOfPeriapsis);

		this._primaryBody.addOrbit(this._metadata.EnglishName, orbit);
	};

	private initialiseOrbit = (): void => {
		const { x, y, z } = this._orbitingBodyParameters.Velocity;
		const orbitalVelocity = new Vector3(x, y, z);
		if (this._primaryBody instanceof OrbitingBody) {
			this._position = this._orbitingBodyParameters.Position.add(this._primaryBody._position);
			this._currentVelocity = orbitalVelocity.add(this._primaryBody.currentVelocity);
		} else {
			this._position = this._orbitingBodyParameters.Position;
			this._currentVelocity = orbitalVelocity;
		}
		this._celestialBodyGroup.position.copy(this._position);
	};

	abstract initialiseOrbitalPlane(): void;
	// abstract updatePosition(dt: number): void;
}

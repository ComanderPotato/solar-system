import { Group, Vector3 } from "three";
import { CelestialBodyParameters } from "../types/CelestialBodyParameters";
import { CelestialMetadata } from "../types/CelestialBodyMetadata";
import { BaseCelestialBodyParameters } from "../types/CelestialBodyParameters";
import { CSS2DObject, Line2 } from "three/examples/jsm/Addons.js";
export default abstract class CelestialBody<T extends CelestialBodyParameters = CelestialBodyParameters> {
	protected _celestialBodyGroup: Group = new Group();
	protected _metadata: CelestialMetadata;
	protected _physicalParameters: T["Physical"];
	protected _secondaryBodyNames?: string[];
	// protected _secondaryBodies?: OrbitingBody[];
	protected _secondaryBodies?: CelestialBody[];
	protected _position: Vector3 = new Vector3();
	public _dummyLastDetailUpdateTime: number = 0;
	public _DUMMY_DETAIL_COOLDOWN: number = 0;
	protected readonly _updateCooldown: number = 500;
	protected _container!: CSS2DObject;
	protected _primaryBody?: CelestialBody;

	protected _orbitGroup: Group = new Group();
	protected _orbits: Map<string, Line2> = new Map();
	constructor(
		baseCelestialBodyParameters: BaseCelestialBodyParameters,
		secondaryBodyNames?: string[],
		primaryBody?: CelestialBody,
	) {
		this._primaryBody = primaryBody;
		this._metadata = baseCelestialBodyParameters.MetaData;
		this._physicalParameters = baseCelestialBodyParameters.Physical;
		this._secondaryBodyNames = baseCelestialBodyParameters.SecondaryNames;
		// this._secondaryBodyNames = secondaryBodyNames;
		this._celestialBodyGroup.name = this._metadata.EnglishName;
		// this._orbitGroup.name = `${this._metadata.EnglishName} Orbit`;
		// this._celestialBodyGroup.add(this._orbitGroup);
	}

	public addOrbit(bodyName: string, orbitLine: Line2): void {
		this._orbits.set(bodyName, orbitLine);
		this._orbitGroup.add(orbitLine);
	}
	// public removeOrbit(bodyName: string): void {
	// 	const orbitLine = this._orbits.get(bodyName);
	// 	if (orbitLine) {
	// 		this._orbitGroup.remove(orbitLine);
	// 		orbitLine.geometry.dispose();
	// 		orbitLine.material.dispose();
	// 		this._orbits.delete(bodyName);
	// 	}
	// }

	set position(position: Vector3) {
		const { x, y, z } = position;
		this._celestialBodyGroup.position.set(x, y, z);
		this._orbitGroup.position.set(x, y, z);
		this._position.set(x, y, z);
	}
	get position(): Vector3 {
		// return this._celestialBodyGroup.position;
		return this._position.clone();
	}
	get metadata(): CelestialMetadata {
		return this._metadata;
	}
	get container(): CSS2DObject {
		return this._container;
	}
	set container(value: CSS2DObject) {
		this._container = value;
	}
	get celestialBodyGroup(): Group {
		return this._celestialBodyGroup;
	}
	get orbitGroup(): Group {
		return this._orbitGroup;
	}
	get orbits(): Map<string, Line2> {
		return this._orbits;
	}
	get secondaryBodyNames(): string[] | undefined {
		return this._secondaryBodyNames;
	}
	get primaryBody(): CelestialBody | undefined {
		return this._primaryBody;
	}
	get secondaryBodies(): CelestialBody[] | undefined {
		return this._secondaryBodies;
	}
	set secondaryBodies(secondaryBodies: CelestialBody[]) {
		this._secondaryBodies = secondaryBodies;
	}
	public addSecondary(secondary: CelestialBody): void {
		if (!this._secondaryBodies) this._secondaryBodies = [];
		this._secondaryBodies.push(secondary);
	}

	abstract get physicalParameters(): T["Physical"];
}

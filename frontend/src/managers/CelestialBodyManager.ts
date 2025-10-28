import { Line2 } from "three/examples/jsm/Addons.js";
import { MoonCreator, PlanetCreator, StarCreator } from "../core/CelestialBodyFactory";
import CelestialBody from "../models/CelestialBody";
import { BufferGeometry, Mesh, Vector3 } from "three";
import { CelestialBodyParameters } from "../types/CelestialBodyParameters";
import ICelestialBodyManager from "../interfaces/managers/ICelestialBodyManager";
import Manager from "../core/Manager";
import { BodyTypes } from "../types/CelestialBodyMetadata";
import { CelestialBodyMesh } from "../models/types";
import { isMeshProvider } from "../utils/CelestialHelpers";

export default class CelestialBodyManager extends Manager implements ICelestialBodyManager {
	private _moonCreator: MoonCreator = new MoonCreator();
	private _planetCreator: PlanetCreator = new PlanetCreator();
	private _starCreator: StarCreator = new StarCreator();
	public constructor() {
		super();
	}
	public updateGeometryLOD(body: CelestialBodyMesh, geometry: BufferGeometry): void {
		body.mesh.geometry.dispose();
		body.geometry = geometry;
		body.mesh.scale.setScalar(body.physicalParameters.MeanRadius);
	}

	public createBody(bodyParameters: CelestialBodyParameters, primary?: CelestialBody): CelestialBody {
		let createdBody: CelestialBody;
		switch (bodyParameters.MetaData.BodyType) {
			case BodyTypes.Star:
				createdBody = this._starCreator.createCelestialBody(bodyParameters);
				break;
			case BodyTypes.Planet:
			case BodyTypes.DwarfPlanet:
				createdBody = this._planetCreator.createCelestialBody(bodyParameters, primary!);
				break;
			case BodyTypes.Moon:
				createdBody = this._moonCreator.createCelestialBody(bodyParameters, primary!);
				break;
		}
		return createdBody!;
	}
	public destroySecondaries(body: CelestialBody): void {
		if (!body.secondaryBodies) return;
		body.secondaryBodies.forEach((secondaryBody) => {
			this.removeOrbit(body, secondaryBody.metadata.EnglishName);
			// Change
			// secondaryBody.destroy();
		});
		// body.secondaryBodies = undefined;
	}
	// Is this for parent?
	public addOrbit(body: CelestialBody, orbitLine: Line2): void {
		if (!body.primaryBody) return;
		body.primaryBody.orbits.set(body.metadata.EnglishName, orbitLine);
		body.primaryBody.orbitGroup.add(orbitLine);
	}
	public destroyBody(body: CelestialBody): void {
		body.celestialBodyGroup.traverse((child) => {
			if ((child as Mesh).geometry) {
				(child as Mesh).geometry.dispose();
			}
			if ((child as Mesh).material) {
				const material = (child as Mesh).material;
				if (Array.isArray(material)) {
					material.forEach((mat) => mat.dispose());
				} else {
					material.dispose();
				}
			}
		});
		body.celestialBodyGroup.remove(body.container);
	}

	fetchUpdatedRotation(body: CelestialBody, dt: number): number {
		if (body.physicalParameters.SolarRotation === 0) return 0;
		const rotationSpeed = (2 * Math.PI) / body.physicalParameters.SolarRotation;
		return rotationSpeed * dt;

		// body.celestialBodyGroup.rotateOnAxis(yAxis, deltaRotation);

		// body.mesh?.rotateOnAxis(yAxis, deltaRotation);
		// body.glowMesh?.rotateOnAxis(yAxis, deltaRotation);
		// body.lightMesh?.rotateOnAxis(yAxis, deltaRotation);
		// body.cloudMesh?.rotateOnAxis(yAxis, deltaRotation * 1.1);
	}

	// Maybe in UI
	public removeOrbit(primaryBody: CelestialBody, secondaryName: string): void {
		const orbitLine = primaryBody.orbits.get(secondaryName);
		if (orbitLine) {
			primaryBody.orbitGroup.remove(orbitLine);
			orbitLine.geometry.dispose();
			orbitLine.material.dispose();
			primaryBody.orbits.delete(secondaryName);
		}
	}
}

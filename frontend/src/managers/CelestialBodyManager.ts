import { Line2 } from "three/examples/jsm/Addons.js";
import { MoonCreator, PlanetCreator, StarCreator } from "../core/CelestialBodyFactory";
import CelestialBody from "../models/CelestialBody";
import { BufferGeometry, IcosahedronGeometry, Mesh } from "three";
import { CelestialBodies, CelestialBodyParameters } from "../types/CelestialBodyParameters";
import ICelestialBodyManager from "../interfaces/managers/ICelestialBodyManager";
import Manager from "../core/Manager";
import IMeshProvider from "../interfaces/IMeshProvider";
import IModelProvider from "../interfaces/IModelProvider";
import { CelestialBodyDetail } from "../utils/constants";

export default class CelestialBodyManager extends Manager implements ICelestialBodyManager {
	private _geometryCache: Partial<Record<CelestialBodyDetail, BufferGeometry>> = {};
	private _moonCreator: MoonCreator = new MoonCreator();
	private _planetCreator: PlanetCreator = new PlanetCreator();
	private _starCreator: StarCreator = new StarCreator();
	public constructor() {
		super();
	}

	private isMeshProvider(body: IMeshProvider | IModelProvider): body is IMeshProvider {
		return (body as IMeshProvider).geometryCache !== undefined;
	}
	private getGeometryForDetail(detail: CelestialBodyDetail) {
		if (!this._geometryCache[detail]) {
			this._geometryCache[detail] = new IcosahedronGeometry(1, detail);
		}
		return this._geometryCache[detail];
	}
	public updateGeometryDetail(body: IMeshProvider | IModelProvider, detail: CelestialBodyDetail): void {
		if (this.isMeshProvider(body)) {
			const baseGeometry = this.getGeometryForDetail(detail);
			body.celestialBodyMesh.geometry.dispose();
			body.celestialBodyMesh.geometry = baseGeometry.clone();
			// Scale instead, less duplication
			// body.celestialBodyMesh.scale.setScalar(body.physicalParameters.MeanRadius);
		}
	}

	public createBody(bodyParameters: CelestialBodyParameters, primary?: CelestialBody): CelestialBody {
		let createdBody: CelestialBody;
		switch (bodyParameters.MetaData.BodyType) {
			case "Star":
				createdBody = this._starCreator.createCelestialBody(bodyParameters);
				break;
			case "Planet":
			case "DwarfPlanet":
				createdBody = this._planetCreator.createCelestialBody(bodyParameters, primary!);
				break;
			case "Moon":
				createdBody = this._moonCreator.createCelestialBody(bodyParameters, primary!);
				break;
		}
		return createdBody;
	}
	public destroySecondaries(body: CelestialBody): void {
		if (!body.secondaryBodies) return;
		body.secondaryBodies.forEach((secondaryBody) => {
			this.removeOrbit(body, secondaryBody.metadata.EnglishName);
			secondaryBody.destroy();
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

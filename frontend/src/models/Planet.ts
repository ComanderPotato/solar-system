import { BufferGeometry, MeshPhongMaterial, Mesh, IcosahedronGeometry, Vector3 } from "three";
import IMeshProvider from "../interfaces/IMeshProvider";
import { PlanetParameters } from "../types/CelestialBodyParameters";
import { PlanetPhysicalParameters } from "../types/PhysicalParameters";
import { TextureFlags } from "../types/TextureParameters";
import { CelestialBodyDetail, CelestialBodyDistance } from "../utils/constants";
import CelestialBody from "./CelestialBody";
import OrbitingBody from "./OrbitingBody";
export default class Planet extends OrbitingBody<PlanetParameters> implements IMeshProvider {
	public geometry!: BufferGeometry;
	public material!: MeshPhongMaterial;
	public mesh!: Mesh;
	public meshDetail: CelestialBodyDetail = CelestialBodyDetail.LOW;
	public textures: TextureFlags;
	public glowMesh!: Mesh;
	public lightMesh?: Mesh | undefined;
	public cloudMesh?: Mesh | undefined;
	public ringMesh?: Mesh | undefined;
	private _lastDetailUpdateTime = 0;
	private readonly DETAIL_COOLDOWN = 5;
	constructor(planetParameters: PlanetParameters, primaryBody: CelestialBody) {
		super(planetParameters, primaryBody, planetParameters.SecondaryNames);
		this.textures = planetParameters.Textures;
		this.initialiseOrbitalPlane();
	}

	get physicalParameters(): PlanetPhysicalParameters {
		return this._physicalParameters;
	}
	public rotateOnAxis = (dt: number): void => {
		if (!this.mesh) return;
		const rotationSpeed = (2 * Math.PI) / this._physicalParameters.SolarRotation;
		// const rotationSpeed = (2 * Math.PI) / (this.celestialBodyParameters.RotationPeriod * TIME_SCALE);
		const deltaRotation = rotationSpeed * dt;
		const yAxis = new Vector3(0, 1, 0);
		// this._celestialBodyGroup.rotateOnAxis(y, deltaRotation);
		this.mesh?.rotateOnAxis(yAxis, deltaRotation);
		this.glowMesh?.rotateOnAxis(yAxis, deltaRotation);
		this.lightMesh?.rotateOnAxis(yAxis, deltaRotation);
		this.cloudMesh?.rotateOnAxis(yAxis, deltaRotation * 1.1);
	};
	public initialiseOrbitalPlane = (): void => {
		this._celestialBodyGroup.rotateOnWorldAxis(new Vector3(-1, 0, 0), this._physicalParameters.AxialTilt);
	};
	// getGeometryForDetail(detail: CelestialBodyDetail): BufferGeometry {
	// 	if (!this.geometryCache[detail]) {
	// 		this.geometryCache[detail] = new IcosahedronGeometry(this._physicalParameters.MeanRadius, detail);
	// 	}
	// 	return this.geometryCache[detail];
	// }

	public updateMeshDetailLevel = (): void => {
		// const baseGeometry = this.getGeometryForDetail(this.meshDetail);
		// this.mesh.geometry.dispose();
		// this.mesh.geometry = baseGeometry.clone();
		// this.glowMesh.geometry.dispose();
		// this.glowMesh.geometry = baseGeometry.clone();
		// if (this.lightMesh) {
		// 	this.lightMesh.geometry.dispose();
		// 	this.lightMesh.geometry = baseGeometry.clone();
		// }
		// if (this.cloudMesh) {
		// 	this.cloudMesh.geometry.dispose();
		// 	this.cloudMesh.geometry = baseGeometry.clone();
		// }
	};
	public updateTextureDetail = async (): Promise<void> => {
		// (this._celestialBodyMesh.material as MeshBasicMaterial).map = await AppContext.instance.DataManager.getTexture(
		// 	this.createTexturePath("color"),
		// );
		// if (this._lightMesh) {
		// 	(this._lightMesh.material as MeshBasicMaterial).map!.dispose();
		// 	(this._lightMesh.material as MeshBasicMaterial).map = await AppContext.instance.DataManager.getTexture(
		// 		this.createTexturePath("lights"),
		// 	);
		// }
		// if (this._cloudMesh) {
		// 	(this._cloudMesh.material as MeshBasicMaterial).map!.dispose();
		// 	(this._cloudMesh.material as MeshBasicMaterial).map = await AppContext.instance.DataManager.getTexture(
		// 		this.createTexturePath("clouds"),
		// 	);
		// }
	};
	public calculateDetailLevel = (distance: number): CelestialBodyDetail => {
		if (distance < this._physicalParameters.MeanRadius * CelestialBodyDistance.CLOSE)
			return CelestialBodyDetail.HIGH;
		// if (distance < this._physicalParameters.MeanRadius * CelestialBodyDistance.MEDIUM) return CelestialBodyDetail.MEDIUM;
		if (distance < this._physicalParameters.MeanRadius * CelestialBodyDistance.FAR) return CelestialBodyDetail.LOW;
		return CelestialBodyDetail.NONE;
	};
	public updateVisibilityDetail = (): void => {
		// if (AppContext.instance.App.canSeeBody(this._celestialBodyMesh)) {
		// 	if (this._cloudMesh) this._cloudMesh.visible = true;
		// 	this._container.visible = this._meshDetail < CelestialBodyDetail.LOW;
		// } else {
		// 	if (this._cloudMesh) this._cloudMesh.visible = false;
		// 	this._container.visible = false;
		// }
		const orbitLine = this._primaryBody.orbits.get(this.metadata.EnglishName);
		if (orbitLine) orbitLine.visible = this.meshDetail < CelestialBodyDetail.LOW;

		this.mesh.visible = Boolean(this.meshDetail);
	};
	public updateDetail = (): void => {
		// if (!this._celestialBodyMesh) return;
		// const distance = AppContext.instance.App.camera.position.distanceTo(this._position);
		//
		// const newDetail = this.calculateDetailLevel(distance);
		// const oldDetail = this._meshDetail;
		// this._meshDetail = newDetail;
		// this.updateVisibilityDetail();
		// this._meshDetail =
		// 	AppContext.instance.App.focusedCelestialBody == this ? CelestialBodyDetail.HIGH : this._meshDetail;
		// const currentTime = AppContext.instance.TimeManager.elapsedTime;
		// if (currentTime - this._lastDetailUpdateTime < this.DETAIL_COOLDOWN) {
		// 	this._lastDetailUpdateTime = oldDetail == this._meshDetail ? currentTime : this._lastDetailUpdateTime;
		// 	return;
		// }
		// if (oldDetail != this._meshDetail) {
		// 	if (
		// 		this._meshDetail == CelestialBodyDetail.NONE ||
		// 		AppContext.instance.App.lerpDestination ||
		// 		AppContext.instance.App.focusedCelestialBody != this
		// 	)
		// 		return;
		// 	this.updateTextureDetail();
		// 	this.updateMeshDetailLevel();
		// 	this._lastDetailUpdateTime = currentTime;
		// }
	};
	public preLoadDetail = (): void => {
		this.meshDetail = CelestialBodyDetail.HIGH;
		this.updateTextureDetail();
		this.updateMeshDetailLevel();
	};
}

// public initialiseOrbit = (): void => {
//   // const { x, y, z } = this._orbitingBodyParameters.Position;
//   // this._celestialBodyGroup.position.set(x, y, z);
//   this._celestialBodyGroup.position.copy(this._orbitingBodyParameters.Position);
//   this._position = this._orbitingBodyParameters.Position;
//   const { x, y, z } = this._orbitingBodyParameters.Velocity;
//   const orbitalVelocity = new Vector3(x, z, y);
//   if (this._primaryBody instanceof OrbitingBody) {
//     this._currentVelocity = orbitalVelocity.add(this._primaryBody.currentVelocity);
//   } else {
//     this._currentVelocity = orbitalVelocity;
//   }
//   // this._currentVelocity = this._orbitingBodyParameters.Velocity;
//   this._currentVelocity = this._currentVelocity.applyQuaternion(this._celestialBodyGroup.quaternion);
// };

// public updatePosition = (dt: number): void => {
// 	this.rotateOnAxis(dt);
// 	const newVelocity = this._currentVelocity.clone().multiplyScalar(dt);
// 	this._celestialBodyGroup.position.add(newVelocity);
// 	this._orbitGroup.position.copy(this._celestialBodyGroup.position);
// 	this._position = this._celestialBodyGroup.position;
// 	if (this._secondaryBodies) {
// 		this._secondaryBodies.forEach((secondaryBody) => secondaryBody.updatePosition(dt));
// 	}
// 	// this.updateDetail();
// };

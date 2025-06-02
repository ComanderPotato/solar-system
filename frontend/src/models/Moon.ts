import { BufferGeometry, IcosahedronGeometry, Mesh, MeshBasicMaterial, MeshPhongMaterial, Vector3 } from "three";
import IMeshProvider from "../interfaces/IMeshProvider";
import { MoonParameters, MoonPhysicalParameters, TextureParameters } from "../types";
import { CelestialBody, OrbitingBody } from ".";
import { CelestialBodyDetail, CelestialBodyDistance } from "../utils";
import { app, dataManager, timeManager } from "../core";
export default class Moon extends OrbitingBody<MoonParameters> implements IMeshProvider {
	private _celestialBodyGeometry!: BufferGeometry;
	private _celestialBodyMaterial!: MeshPhongMaterial;
	private _celestialBodyMesh!: Mesh;
	private _meshDetail: CelestialBodyDetail = CelestialBodyDetail.LOW;
	private _textures: TextureParameters;
	private _lastDetailUpdateTime = 0;
	private readonly DETAIL_COOLDOWN = 5;
	constructor(moonParameters: MoonParameters, primaryBody: CelestialBody) {
		super(moonParameters, primaryBody, moonParameters.SecondaryBodyNames);
		this._textures = moonParameters.Textures;
		this.initialiseBaseMesh();
		// this.addGlowMesh();
		this.initialiseOrbitalPlane();
		// this.initialiseOrbit();
		this.addToScene();
	}

	// Getters

	get meshDetail(): CelestialBodyDetail {
		return this._meshDetail;
	}
	get celestialBodyGeometry(): BufferGeometry {
		return this._celestialBodyGeometry;
	}
	get celestialBodyMaterial(): MeshPhongMaterial {
		return this._celestialBodyMaterial;
	}
	get celestialBodyMesh(): Mesh {
		return this._celestialBodyMesh;
	}

	get textures(): TextureParameters {
		return this._textures;
	}
	get physicalParameters(): MoonPhysicalParameters {
		return this._physicalParameters;
	}
	get geometryCache(): Partial<Record<CelestialBodyDetail, BufferGeometry>> {
		return this._geometryCache;
	}
	public rotateOnAxis = (dt: number): void => {
		if (!this._celestialBodyMesh) return;
		const rotationSpeed = (2 * Math.PI) / this._physicalParameters.SolarRotation;
		const deltaRotation = rotationSpeed * dt;
		this._celestialBodyMesh.rotateOnAxis(new Vector3(0, 1, 0), deltaRotation);
	};
	initialiseOrbitalPlane(): void {
		this._celestialBodyGroup.rotateOnAxis(new Vector3(1, 0, 0), this._physicalParameters.AxialTilt);
	}
	private _isGeneric?: boolean;
	private _randomNumber?: number;
	public async initialiseBaseMesh(): Promise<void> {
		this._isGeneric = this._metadata.EnglishName.toLowerCase() == "moon" ? false : true;
		this._randomNumber = Math.floor(Math.random() * 4) + 1;
		this._celestialBodyGeometry = new IcosahedronGeometry(this._physicalParameters.MeanRadius, this._meshDetail);
		this._celestialBodyMaterial = new MeshPhongMaterial({
			map: await dataManager().getTexture(this.createTexturePath("color")),
		});
		// this.celestialBodyMaterial.specularMap = await dataManager().getTexture(this.createTexturePath("specular"));
		this._celestialBodyMesh = new Mesh(this._celestialBodyGeometry, this._celestialBodyMaterial);
		this._celestialBodyGroup.add(this._celestialBodyMesh);
	}

	private _geometryCache: Partial<Record<CelestialBodyDetail, BufferGeometry>> = {};
	private getGeometryForDetail(detail: CelestialBodyDetail) {
		if (!this._geometryCache[detail]) {
			this._geometryCache[detail] = new IcosahedronGeometry(this._physicalParameters.MeanRadius, detail);
		}
		return this._geometryCache[detail];
	}
	public updateMeshDetailLevel = (): void => {
		const baseGeometry = this.getGeometryForDetail(this._meshDetail);
		this._celestialBodyMesh.geometry.dispose();
		this._celestialBodyMesh.geometry = baseGeometry.clone();
	};
	public calculateDetailLevel = (distance: number): CelestialBodyDetail => {
		if (distance < this._physicalParameters.MeanRadius * CelestialBodyDistance.CLOSE) return CelestialBodyDetail.HIGH;
		// if (distance < this._physicalParameters.MeanRadius * CelestialBodyDistance.MEDIUM) return CelestialBodyDetail.MEDIUM;
		if (distance < this._physicalParameters.MeanRadius * CelestialBodyDistance.FAR) return CelestialBodyDetail.LOW;
		return CelestialBodyDetail.NONE;
	};
	public updateVisibilityDetail = (): void => {
		if (app().canSeeBody(this._celestialBodyMesh)) {
			this._container.visible = this._meshDetail < CelestialBodyDetail.LOW;
		} else {
			this._container.visible = false;
		}
		const orbitLine = this._primaryBody.orbits.get(this.metadata.EnglishName);
		if (orbitLine) orbitLine.visible = this._meshDetail < CelestialBodyDetail.LOW;

		this._celestialBodyMesh.visible = Boolean(this._meshDetail);
	};
	public updateDetail = (): void => {
		if (!this._celestialBodyMesh) return;
		const distance = app().camera.position.distanceTo(this._position);

		const newDetail = this.calculateDetailLevel(distance);
		const oldDetail = this._meshDetail;
		this._meshDetail = newDetail;
		this.updateVisibilityDetail();
		this._meshDetail = app().focusedCelestialBody == this ? CelestialBodyDetail.HIGH : this._meshDetail;
		const currentTime = timeManager().elapsedTime;
		if (currentTime - this._lastDetailUpdateTime < this.DETAIL_COOLDOWN) {
			this._lastDetailUpdateTime = oldDetail == this._meshDetail ? currentTime : this._lastDetailUpdateTime;
			return;
		}
		if (oldDetail != this._meshDetail) {
			if (this._meshDetail == CelestialBodyDetail.NONE || app().lerpDestination || app().focusedCelestialBody != this) return;
			this.updateTextureDetail();
			this.updateMeshDetailLevel();
			this._lastDetailUpdateTime = currentTime;
		}
	};
	public createTexturePath = (texture: string): string => {
		const folderName = this._isGeneric ? "generic" : "moon";
		return `./static/src/assets/maps/${folderName}/${texture.toLowerCase()}_${this._meshDetail > 0 ? this._meshDetail : 2}${
			this._isGeneric ? `_generic_${this._randomNumber}` : ""
		}.webp`;
	};
	public updateTextureDetail = async (): Promise<void> => {
		(this._celestialBodyMesh.material as MeshBasicMaterial).map = await dataManager().getTexture(this.createTexturePath("color"));
	};
	public preLoadDetail = (): void => {
		this._meshDetail = CelestialBodyDetail.HIGH;
		this.updateTextureDetail();
		this.updateMeshDetailLevel();
	};
}

// public updateDetail = (): void => {
// 	if (!this._celestialBodyMesh) return;
// 	// Add cooldown .. or add caching
// 	const distance = app().camera.position.distanceTo(this._position);
// 	const oldDetail = this._meshDetail;
// 	const radius = this._physicalParameters.MeanRadius;
// 	if (distance < radius * CelestialBodyDistance.CLOSE) {
// 		this._meshDetail = CelestialBodyDetail.HIGH;
// 	} else if (distance < radius * CelestialBodyDistance.MEDIUM) {
// 		this._meshDetail = CelestialBodyDetail.MEDIUM;
// 	} else if (distance < radius * CelestialBodyDistance.FAR) {
// 		this._meshDetail = CelestialBodyDetail.LOW;
// 	} else {
// 		this._meshDetail = CelestialBodyDetail.NONE;
// 	}
// 	if (oldDetail != this._meshDetail) {
// 		this._container.visible = this._meshDetail < CelestialBodyDetail.LOW;
// 		const orbitLine = this._primaryBody.orbits.get(this.metadata.EnglishName);
// 		if (orbitLine) orbitLine.visible = this._meshDetail < CelestialBodyDetail.LOW;

// 		this._celestialBodyMesh.visible = Boolean(this._meshDetail);

// 		if (this._meshDetail == CelestialBodyDetail.NONE || app().lerpDestination) return;
// 		const baseGeometry = this.getGeometryForDetail(this._meshDetail);
// 		this._celestialBodyMesh.geometry.dispose();
// 		this._celestialBodyMesh.geometry = baseGeometry.clone();
// 	}
// };
// initialiseOrbit(): void {
//   const { x, y, z } = this._orbitingBodyParameters.Position;
//   this._celestialBodyGroup.position.set(x, y, z);
//   this._position = this._orbitingBodyParameters.Position;
//   this._currentVelocity = this._orbitingBodyParameters.Velocity;
//   // this._currentVelocity = this._currentVelocity.applyQuaternion(this._celestialBodyGroup.quaternion);
// }
// updatePosition(dt: number): void {
//   this.rotateOnAxis(dt);
//   const newVelocity = this._currentVelocity.clone().multiplyScalar(dt);
//   const quaternion = new Quaternion().setFromEuler(this._celestialBodyGroup.rotation);

//   newVelocity.applyQuaternion(quaternion);
//   this._celestialBodyGroup.position.add(newVelocity);
//   this._position = this._celestialBodyGroup.position;
// }
// public updatePosition = (dt: number): void => {
// 	this.rotateOnAxis(dt);
// 	const newVelocity = this._currentVelocity.clone().multiplyScalar(dt);
// 	this._celestialBodyGroup.position.add(newVelocity);
// 	this._position = this._celestialBodyGroup.position;
// 	if (this._secondaryBodies) {
// 		this._secondaryBodies.forEach((secondaryBody) => secondaryBody.updatePosition(dt));
// 	}
// };

// rotateOnAxis(dt: number): void {
//   // const rotationSpeed = (2 * Math.PI) / this._physicalParameters.SideralRotation;
//   // // const rotationSpeed = (2 * Math.PI) / (this.celestialBodyParameters.RotationPeriod * TIME_SCALE);
//   // const deltaRotation = rotationSpeed * dt;
//   // this._celestialBodyGroup.rotation.y += deltaRotation;
//   // if (this.secondaryBodies) {
//   //   this.secondaryBodies.forEach((secondaryBody) => {
//   //     secondaryBody.orbit(elapsedTime);
//   //   });
//   // }
// }

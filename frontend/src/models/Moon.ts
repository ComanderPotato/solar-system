import { BufferGeometry, Mesh, MeshPhongMaterial, Vector3 } from "three";
import IMeshProvider from "../interfaces/IMeshProvider";
import { MoonParameters } from "../types/CelestialBodyParameters";
import { MoonPhysicalParameters } from "../types/PhysicalParameters";
import { TextureFlags } from "../types/TextureParameters";
import CelestialBody from "./CelestialBody";
import OrbitingBody from "./OrbitingBody";
import { CelestialBodyDetail } from "../utils/constants";
import { CelestialShader } from "../types/Materials";

export default class Moon extends OrbitingBody<MoonParameters> implements IMeshProvider {
	public geometry!: BufferGeometry;
	public shaderMaterial!: CelestialShader;
	public material!: MeshPhongMaterial;
	public mesh!: Mesh;
	public meshDetail: CelestialBodyDetail = CelestialBodyDetail.LOW;
	public textures: TextureFlags;
	private _lastDetailUpdateTime = 0;
	private readonly DETAIL_COOLDOWN = 5;
	constructor(moonParameters: MoonParameters, primaryBody: CelestialBody) {
		super(moonParameters, primaryBody, moonParameters.SecondaryNames);
		this.textures = moonParameters.Textures;
		this.initialiseOrbitalPlane();
		this.generateRandomTexture();
	}

	// Getters

	get physicalParameters(): MoonPhysicalParameters {
		return this._physicalParameters;
	}
	// get geometryCache(): Partial<Record<CelestialBodyDetail, BufferGeometry>> {
	// 	return this._geometryCache;
	// }
	initialiseOrbitalPlane(): void {
		this._celestialBodyGroup.rotateOnAxis(new Vector3(1, 0, 0), this._physicalParameters.AxialTilt);
	}
	private _isGeneric?: boolean;
	private _randomNumber?: number;

	get isGeneric(): boolean | undefined {
		return this._isGeneric;
	}
	get randomNumber(): number | undefined {
		return this._randomNumber;
	}
	private generateRandomTexture(): void {
		this._isGeneric = this._metadata.EnglishName.toLowerCase() == "moon" ? false : true;
		this._randomNumber = Math.floor(Math.random() * 4) + 1;
	}

	// private _geometryCache: Partial<Record<CelestialBodyDetail, BufferGeometry>> = {};
	// private getGeometryForDetail(detail: CelestialBodyDetail) {
	// 	if (!this._geometryCache[detail]) {
	// 		this._geometryCache[detail] = new IcosahedronGeometry(this._physicalParameters.MeanRadius, detail);
	// 	}
	// 	return this._geometryCache[detail];
	// }
}

// public updateDetail = (): void => {
// 	if (!this._celestialBodyMesh) return;
// 	// Add cooldown .. or add caching
// 	const distance = appContext.App.camera.position.distanceTo(this._position);
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

// 		if (this._meshDetail == CelestialBodyDetail.NONE || appContext.App.lerpDestination) return;
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

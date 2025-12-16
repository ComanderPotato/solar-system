import { BufferGeometry, MeshPhongMaterial, Mesh, IcosahedronGeometry, Vector3 } from "three";
import IMeshProvider from "../interfaces/IMeshProvider";
import { PlanetParameters } from "../types/CelestialBodyParameters";
import { PlanetPhysicalParameters } from "../types/PhysicalParameters";
import { TextureFlags } from "../types/TextureParameters";
import { CelestialBodyDetail, CelestialBodyDistance } from "../utils/constants";
import CelestialBody from "./CelestialBody";
import OrbitingBody from "./OrbitingBody";
import { PlanetMaterial } from "../types/Materials";
export default class Planet extends OrbitingBody<PlanetParameters> implements IMeshProvider {
	public geometry!: BufferGeometry;
	public material!: MeshPhongMaterial;
	public shaderMaterial!: PlanetMaterial;
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
		// this.initialiseOrbitalPlane();
	}

	get physicalParameters(): PlanetPhysicalParameters {
		return this._physicalParameters;
	}
	public initialiseOrbitalPlane = (): void => {
		// this.celestialBodyGroup.rotateOnAxis(new Vector3(1, 0, 0), -this.physicalParameters.AxialTilt);
		this._celestialBodyGroup.rotateOnWorldAxis(new Vector3(-1, 0, 0), this._physicalParameters.AxialTilt);
	};
	// getGeometryForDetail(detail: CelestialBodyDetail): BufferGeometry {
	// 	if (!this.geometryCache[detail]) {
	// 		this.geometryCache[detail] = new IcosahedronGeometry(this._physicalParameters.MeanRadius, detail);
	// 	}
	// 	return this.geometryCache[detail];
	// }
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

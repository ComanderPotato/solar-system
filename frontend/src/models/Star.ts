import { BufferGeometry, Mesh, MeshPhongMaterial, PointLight, Vector3 } from "three";
import IMeshProvider from "../interfaces/IMeshProvider";
import { StarParameters } from "../types/CelestialBodyParameters";
import { StarPhysicalParameters } from "../types/PhysicalParameters";
import { TextureFlags } from "../types/TextureParameters";
import CelestialBody from "./CelestialBody";
import { CelestialBodyDetail } from "../utils/constants";
import { PlanetMaterial } from "../types/Materials";
export default class Star extends CelestialBody<StarParameters> implements IMeshProvider {
	public geometry!: BufferGeometry;
	public shaderMaterial!: PlanetMaterial;
	public material!: MeshPhongMaterial;
	public meshDetail: CelestialBodyDetail = CelestialBodyDetail.HIGH;
	public textures: TextureFlags;

	public mesh!: Mesh;

	private _primaryLight!: PointLight;
	public get primaryLight(): PointLight {
		return this._primaryLight;
	}
	public set primaryLight(value: PointLight) {
		this._primaryLight = value;
	}
	constructor(starParameters: StarParameters, secondaryBodyParameters?: string[]) {
		super(starParameters, secondaryBodyParameters);
		this.textures = starParameters.Textures;
		this.initialiseOrbitalPlane();
	}

	// Getters
	get physicalParameters(): StarPhysicalParameters {
		return this._physicalParameters;
	}

	public initialiseOrbitalPlane = (): void => {
		this._celestialBodyGroup.rotateOnAxis(new Vector3(1, 0, 0), this._physicalParameters.AxialTilt);

		// this._celestialBodyGroup.rotation.x = this._physicalParameters.AxialTilt;
	};
	private _lastDetailUpdateTime = 0;
	private readonly DETAIL_COOLDOWN = 5;
	// public updateDetail = (): void => {
	// 	// Add cooldown .. or add caching
	// 	const distance = appContext.App.camera.position.distanceTo(this._position);
	// 	const oldDetail = this._meshDetail;
	// 	const radius = this._physicalParameters.MeanRadius;
	// 	if (distance < radius * CelestialBodyDistance.CLOSE) {
	// 		this._meshDetail = CelestialBodyDetail.HIGH;
	// 	} else if (distance < radius * CelestialBodyDistance.MEDIUM) {
	// 		this._meshDetail = CelestialBodyDetail.MEDIUM;
	// 	} else {
	// 		this._meshDetail = CelestialBodyDetail.LOW;
	// 	}
	// 	if (oldDetail != this._meshDetail) {
	// 		const baseGeometry = this.getGeometryForDetail(this._meshDetail);
	// 		this._celestialBodyMesh.geometry.dispose();
	// 		this._celestialBodyMesh.geometry = baseGeometry.clone();
	// 	}
	// };

	// // Fix this
	// private addLight = async (): Promise<void> => {
	// 	if (!this.material) return;
	// 	const surfaceEmission = this._physicalParameters.Emissivity ?? 1;

	// 	// const rawLightRange = Math.cbrt(surfaceEmission) * SCALE;
	// 	// const scaledLightRange = rawLightRange;

	// 	this._primaryLight = new PointLight(0xffffff, 2, 1000000000, 0);
	// 	this._primaryLight.position.set(0, 0, 0);
	// 	this._celestialBodyGroup.add(this._primaryLight);

	// 	this.material.emissive = new Color(0xffffcc);
	// 	this.material.emissiveIntensity = 2;

	// 	const emissiveMap = await AppContext.instance.DataManager.getTexture(this.createTexturePath("color"));
	// 	if (emissiveMap) {
	// 		this.material.emissiveMap = emissiveMap;
	// 		this.material.needsUpdate = true;
	// 	}
	// };
}

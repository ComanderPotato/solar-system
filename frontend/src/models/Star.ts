import {
	BufferGeometry,
	Color,
	IcosahedronGeometry,
	Mesh,
	MeshBasicMaterial,
	MeshPhongMaterial,
	PointLight,
	Vector3,
} from "three";
import IMeshProvider from "../interfaces/IMeshProvider";
import { StarParameters } from "../types/CelestialBodyParameters";
import { StarPhysicalParameters } from "../types/PhysicalParameters";
import { TextureFlags } from "../types/TextureParameters";
import CelestialBody from "./CelestialBody";
import { CelestialBodyDetail, CelestialBodyDistance } from "../utils/constants";
export default class Star extends CelestialBody<StarParameters> implements IMeshProvider {
	public geometry!: BufferGeometry;
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
		// this.initialiseBaseMesh();
		this.initialiseOrbitalPlane();
		// this.addToScene();
	}

	// Getters

	// get geometryCache(): Partial<Record<CelestialBodyDetail, BufferGeometry>> {
	// 	return this._geometryCache;
	// }
	get physicalParameters(): StarPhysicalParameters {
		return this._physicalParameters;
	}

	public rotateOnAxis = (dt: number): void => {
		// const rotationSpeed = (2 * Math.PI) / this._physicalParameters.SideralRotation;
		// // const rotationSpeed = (2 * Math.PI) / (this.celestialBodyParameters.RotationPeriod * TIME_SCALE);
		// const deltaRotation = rotationSpeed * dt;
		// this._celestialBodyGroup.rotation.y += deltaRotation;
		// if (this.secondaryBodyParameters) {
		//   this.secondaryBodyParameters.forEach((secondaryBody) => {
		//     secondaryBody.orbit(elapsedTime);
		//   });
		// }
	};
	public initialiseOrbitalPlane = (): void => {
		this._celestialBodyGroup.rotateOnAxis(new Vector3(1, 0, 0), this._physicalParameters.AxialTilt);

		// this._celestialBodyGroup.rotation.x = this._physicalParameters.AxialTilt;
	};
	// public initialiseBaseMesh = async (): Promise<void> => {
	// 	this.geometry = new IcosahedronGeometry(this._physicalParameters.MeanRadius, this.meshDetail);
	// 	this.material = new MeshPhongMaterial({
	// 		map: await AppContext.instance.DataManager.getTexture(this.createTexturePath("color")),
	// 		emissiveMap: await AppContext.instance.DataManager.getTexture(this.createTexturePath("color")),
	// 	});
	// 	// this.celestialBodyMaterial.specularMap = await appContext.DataManager.getTexture(this.createTexturePath("specular"));
	// 	this.material.emissiveIntensity = this._physicalParameters.Emissivity;
	// 	this.mesh = new Mesh(this.geometry, this.material);
	// 	this._celestialBodyGroup.add(this.mesh);
	// 	await this.addLight();
	// };

	// private _geometryCache: Partial<Record<CelestialBodyDetail, BufferGeometry>> = {};
	// private getGeometryForDetail(detail: CelestialBodyDetail) {
	// 	if (!this._geometryCache[detail]) {
	// 		this._geometryCache[detail] = new IcosahedronGeometry(this._physicalParameters.MeanRadius, detail);
	// 	}
	// 	return this._geometryCache[detail];
	// }

	public updateMeshDetailLevel = (): void => {
		// const baseGeometry = this.getGeometryForDetail(this.meshDetail);
		// this.mesh.geometry.dispose();
		// this.mesh.geometry = baseGeometry.clone();
	};
	public calculateDetailLevel = (distance: number): CelestialBodyDetail => {
		if (distance < this._physicalParameters.MeanRadius * CelestialBodyDistance.CLOSE * 20)
			return CelestialBodyDetail.HIGH;
		// if (distance < this._physicalParameters.MeanRadius * CelestialBodyDistance.MEDIUM) return CelestialBodyDetail.MEDIUM;
		return CelestialBodyDetail.LOW;
	};

	public updateVisibilityDetail = (): void => {
		// if (!AppContext.instance.App.canSeeBody(this._celestialBodyMesh)) {
		// 	this._container.visible = false;
		// } else {
		// 	this._container.visible = this._meshDetail <= CelestialBodyDetail.LOW;
		// }
	};
	private _lastDetailUpdateTime = 0;
	private readonly DETAIL_COOLDOWN = 5;
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

	public updateTextureDetail = async (): Promise<void> => {
		// (this.mesh.material as MeshBasicMaterial).map = await AppContext.instance.DataManager.getTexture(
		// 	this.createTexturePath("color")
		// );
	};

	// Handle in data manager?
	public createTexturePath = (texture: string): string => {
		return `./static/src/assets/maps/${this._metadata.EnglishName.toLowerCase()}/${texture.toLowerCase()}_${
			this.meshDetail > 0 ? this.meshDetail : 2
		}.webp`;
	};
	public preLoadDetail = (): void => {
		if (!this.mesh) return;
		this.meshDetail = CelestialBodyDetail.HIGH;
		this.updateTextureDetail();
		this.updateMeshDetailLevel();
	};
}

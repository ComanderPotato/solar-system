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
// import { StarParameters, StarPhysicalParameters, TextureParameters } from "../types";
import { StarParameters } from "../types/CelestialBodyParameters";
import { StarPhysicalParameters } from "../types/PhysicalParameters";
import { TextureParameters } from "../types/TextureParameters";
import CelestialBody from "./CelestialBody";
// import { CelestialBodyDetail, CelestialBodyDistance } from "../utils";
import { CelestialBodyDetail, CelestialBodyDistance } from "../utils/constants";
// import { AppContext } from "../core";
export default class Star extends CelestialBody<StarParameters> implements IMeshProvider {
	private _celestialBodyGeometry!: BufferGeometry;
	private _celestialBodyMaterial!: MeshPhongMaterial;
	private _meshDetail: CelestialBodyDetail = CelestialBodyDetail.HIGH;
	private _textures: TextureParameters;

	private _celestialBodyMesh!: Mesh;

	private _primaryLight!: PointLight;
	constructor(starParameters: StarParameters, secondaryBodyParameters?: string[]) {
		super(starParameters, secondaryBodyParameters);
		this._textures = starParameters.Textures;
		this.initialiseBaseMesh();
		this.initialiseOrbitalPlane();
		this.addToScene();
	}

	// Getters

	get geometryCache(): Partial<Record<CelestialBodyDetail, BufferGeometry>> {
		return this._geometryCache;
	}
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
	public initialiseBaseMesh = async (): Promise<void> => {
		this._celestialBodyGeometry = new IcosahedronGeometry(this._physicalParameters.MeanRadius, this._meshDetail);
		this._celestialBodyMaterial = new MeshPhongMaterial({
			map: await AppContext.instance.DataManager.getTexture(this.createTexturePath("color")),
			emissiveMap: await AppContext.instance.DataManager.getTexture(this.createTexturePath("color")),
		});
		// this.celestialBodyMaterial.specularMap = await appContext.DataManager.getTexture(this.createTexturePath("specular"));
		this._celestialBodyMaterial.emissiveIntensity = this._physicalParameters.Emissivity;
		this._celestialBodyMesh = new Mesh(this._celestialBodyGeometry, this._celestialBodyMaterial);
		this._celestialBodyGroup.add(this._celestialBodyMesh);
		await this.addLight();
	};

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

	// Fix this
	private addLight = async (): Promise<void> => {
		if (!this._celestialBodyMaterial) return;
		const surfaceEmission = this._physicalParameters.Emissivity ?? 1;

		// const rawLightRange = Math.cbrt(surfaceEmission) * SCALE;
		// const scaledLightRange = rawLightRange;

		this._primaryLight = new PointLight(0xffffff, 2, 1000000000, 0);
		this._primaryLight.position.set(0, 0, 0);
		this._celestialBodyGroup.add(this._primaryLight);

		this._celestialBodyMaterial.emissive = new Color(0xffffcc);
		this._celestialBodyMaterial.emissiveIntensity = 2;

		const emissiveMap = await AppContext.instance.DataManager.getTexture(this.createTexturePath("color"));
		if (emissiveMap) {
			this._celestialBodyMaterial.emissiveMap = emissiveMap;
			this._celestialBodyMaterial.needsUpdate = true;
		}
	};

	public updateTextureDetail = async (): Promise<void> => {
		(this._celestialBodyMesh.material as MeshBasicMaterial).map = await AppContext.instance.DataManager.getTexture(
			this.createTexturePath("color"),
		);
	};

	// Handle in data manager?
	public createTexturePath = (texture: string): string => {
		return `./static/src/assets/maps/${this._metadata.EnglishName.toLowerCase()}/${texture.toLowerCase()}_${this._meshDetail > 0 ? this._meshDetail : 2}.webp`;
	};
	public preLoadDetail = (): void => {
		if (!this._celestialBodyMesh) return;
		this._meshDetail = CelestialBodyDetail.HIGH;
		this.updateTextureDetail();
		this.updateMeshDetailLevel();
	};
}

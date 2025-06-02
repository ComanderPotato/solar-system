import {
	BufferGeometry,
	MeshPhongMaterial,
	Mesh,
	IcosahedronGeometry,
	MeshStandardMaterial,
	AdditiveBlending,
	MeshBasicMaterial,
	RingGeometry,
	Vector3,
	ArrowHelper,
	Color,
} from "three";
import IMeshProvider from "../interfaces/IMeshProvider";
import { PlanetParameters, PlanetPhysicalParameters, TextureParameters } from "../types";
import { CelestialBodyColour, CelestialBodyDetail, CelestialBodyDistance, KM_TO_M, SCALE } from "../utils";
import { CelestialBody, OrbitingBody } from ".";
import { app, dataManager, timeManager } from "../core";
import { getAtmosphericGlowMat, getRingMat } from "../shaders";
export default class Planet extends OrbitingBody<PlanetParameters> implements IMeshProvider {
	private _geometryCache: Partial<Record<CelestialBodyDetail, BufferGeometry>> = {};
	private _celestialBodyGeometry!: BufferGeometry;
	private _celestialBodyMaterial!: MeshPhongMaterial;
	private _meshDetail: CelestialBodyDetail = CelestialBodyDetail.LOW;
	private _textures: TextureParameters;
	private _celestialBodyMesh!: Mesh;
	private _glowMesh!: Mesh;
	private _lightMesh?: Mesh;
	private _cloudMesh?: Mesh;
	private _lastDetailUpdateTime = 0;
	private readonly DETAIL_COOLDOWN = 5;
	constructor(planetParameters: PlanetParameters, primaryBody: CelestialBody) {
		super(planetParameters, primaryBody, planetParameters.SecondaryBodyNames);
		this._textures = planetParameters.Textures;
		this.initialiseBaseMesh();
		this.addGlowMesh();
		this.addCloudMesh();
		this.addLightingMesh();
		this.initialiseRing();
		this.initialiseOrbitalPlane();
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
	get glowMesh(): Mesh {
		return this._glowMesh;
	}
	get lightMesh(): Mesh | undefined {
		return this._lightMesh;
	}
	get cloudMesh(): Mesh | undefined {
		return this._cloudMesh;
	}
	get textures(): TextureParameters {
		return this._textures;
	}
	get physicalParameters(): PlanetPhysicalParameters {
		return this._physicalParameters;
	}
	get geometryCache(): Partial<Record<CelestialBodyDetail, BufferGeometry>> {
		return this._geometryCache;
	}
	public initialiseRing = async (): Promise<void> => {
		if (!this._physicalParameters.RingSystem) return;
		const inner = this._physicalParameters.InnerRingRadius! * KM_TO_M * SCALE;
		const outer = this._physicalParameters.OuterRingRadius! * KM_TO_M * SCALE;
		const [ringTexture, alphaTexture] = await Promise.all([dataManager().getTexture(this.createTexturePath("ring")), dataManager().getTexture(this.createTexturePath("ring_alpha"))]);
		const geometry = new RingGeometry(inner, outer, 64);
		geometry.rotateX(-Math.PI / 2);
		const material = getRingMat(ringTexture, alphaTexture, inner, outer);
		const mesh = new Mesh(geometry, material);
		this._celestialBodyGroup.add(mesh);
	};

	public rotateOnAxis = (dt: number): void => {
		if (!this._celestialBodyMesh) return;
		const rotationSpeed = (2 * Math.PI) / this._physicalParameters.SolarRotation;
		// const rotationSpeed = (2 * Math.PI) / (this.celestialBodyParameters.RotationPeriod * TIME_SCALE);
		const deltaRotation = rotationSpeed * dt;
		const yAxis = new Vector3(0, 1, 0);
		// this._celestialBodyGroup.rotateOnAxis(y, deltaRotation);
		this._celestialBodyMesh?.rotateOnAxis(yAxis, deltaRotation);
		this._glowMesh?.rotateOnAxis(yAxis, deltaRotation);
		this._lightMesh?.rotateOnAxis(yAxis, deltaRotation);
		this._cloudMesh?.rotateOnAxis(yAxis, deltaRotation * 1.1);
	};
	public initialiseOrbitalPlane = (): void => {
		this._celestialBodyGroup.rotateOnWorldAxis(new Vector3(-1, 0, 0), this._physicalParameters.AxialTilt);
	};
	public initialiseBaseMesh = async (): Promise<void> => {
		const colour = new Color(CelestialBodyColour[this._metadata.EnglishName.toUpperCase()] ?? CelestialBodyColour[this._primaryBody.metadata.EnglishName.toUpperCase()]);
		const arrowHelper = new ArrowHelper(new Vector3(0, 1, 0), new Vector3(0, 0, 0), this._physicalParameters.MeanRadius * 1.5, colour);
		this._celestialBodyGroup.add(arrowHelper);
		this._celestialBodyGeometry = new IcosahedronGeometry(this._physicalParameters.MeanRadius, this._meshDetail);
		this._celestialBodyMaterial = new MeshPhongMaterial({
			map: await dataManager().getTexture(this.createTexturePath("color")),
		});
		if (this._textures.Specular) this.celestialBodyMaterial.specularMap = await dataManager().getTexture(this.createTexturePath("specular"));
		this._celestialBodyMesh = new Mesh(this._celestialBodyGeometry, this._celestialBodyMaterial);
		this._celestialBodyGroup.add(this._celestialBodyMesh);
	};
	public addGlowMesh = (): void => {
		this._glowMesh = new Mesh(this._celestialBodyGeometry, getAtmosphericGlowMat());
		this._glowMesh.scale.setScalar(1.01);
		this._celestialBodyGroup.add(this._glowMesh);
	};
	public addLightingMesh = async (): Promise<void> => {
		if (!this.textures.Light) return;
		const lightMaterial = new MeshBasicMaterial({
			map: await dataManager().getTexture(this.createTexturePath("lights")),
			blending: AdditiveBlending,
			transparent: true,
			depthTest: false,
			opacity: 0.6,
		});
		this._lightMesh = new Mesh(this.celestialBodyGeometry, lightMaterial);
		this._celestialBodyGroup.add(this._lightMesh);
	};
	public addCloudMesh = async (): Promise<void> => {
		if (!this.textures.Cloud) return;
		const cloudMaterial = new MeshStandardMaterial({
			map: await dataManager().getTexture(this.createTexturePath("clouds")),
			transparent: true,
			opacity: 0.5,
			blending: AdditiveBlending,
		});
		this._cloudMesh = new Mesh(this.celestialBodyGeometry, cloudMaterial);
		this._cloudMesh.scale.setScalar(1.005);
		this._celestialBodyGroup.add(this._cloudMesh);
	};

	private getGeometryForDetail = (detail: CelestialBodyDetail): BufferGeometry => {
		if (!this._geometryCache[detail]) {
			this._geometryCache[detail] = new IcosahedronGeometry(this._physicalParameters.MeanRadius, detail);
		}
		return this._geometryCache[detail];
	};

	public updateMeshDetailLevel = (): void => {
		const baseGeometry = this.getGeometryForDetail(this._meshDetail);
		this._celestialBodyMesh.geometry.dispose();
		this._celestialBodyMesh.geometry = baseGeometry.clone();
		this._glowMesh.geometry.dispose();
		this._glowMesh.geometry = baseGeometry.clone();
		if (this._lightMesh) {
			this._lightMesh.geometry.dispose();
			this._lightMesh.geometry = baseGeometry.clone();
		}
		if (this._cloudMesh) {
			this._cloudMesh.geometry.dispose();
			this._cloudMesh.geometry = baseGeometry.clone();
		}
	};
	public updateTextureDetail = async (): Promise<void> => {
		(this._celestialBodyMesh.material as MeshBasicMaterial).map = await dataManager().getTexture(this.createTexturePath("color"));
		if (this._lightMesh) {
			(this._lightMesh.material as MeshBasicMaterial).map!.dispose();
			(this._lightMesh.material as MeshBasicMaterial).map = await dataManager().getTexture(this.createTexturePath("lights"));
		}
		if (this._cloudMesh) {
			(this._cloudMesh.material as MeshBasicMaterial).map!.dispose();
			(this._cloudMesh.material as MeshBasicMaterial).map = await dataManager().getTexture(this.createTexturePath("clouds"));
		}
	};
	public createTexturePath = (texture: string): string => {
		return `./static/src/assets/maps/${this._metadata.EnglishName.toLowerCase()}/${texture.toLowerCase()}_${this._meshDetail > 0 ? this._meshDetail : 2}.webp`;
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
	public preLoadDetail = (): void => {
		this._meshDetail = CelestialBodyDetail.HIGH;
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

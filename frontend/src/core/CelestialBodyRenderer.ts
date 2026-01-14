import {
	ArrowHelper,
	BufferGeometry,
	Color,
	EllipseCurve,
	IcosahedronGeometry,
	Mesh,
	PointLight,
	RingGeometry,
	Vector2,
	Vector3,
} from "three";
import { getRingMat } from "../shaders";
import { KM_TO_M, SCALE } from "../utils/constants";
import Planet from "../models/Planet";
import Moon from "../models/Moon";
import Star from "../models/Star";
import { CelestialBodyMesh, CelestialBodyModel, CelestialBodyProvider } from "../models/types";
import { Line2, LineGeometry, LineMaterial } from "three/examples/jsm/Addons.js";
import OrbitingBody from "../models/OrbitingBody";
import { getCelestialBodyColor } from "../utils/CelestialHelpers";
import { TextureFlags } from "../types/AssetParameters";
import { CelestialBodyUniforms, CelestialShader, MoonUniforms, PlanetUniforms, StarUniforms } from "../types/Materials";
import { getCelestialShader } from "../shaders/celestialShader";

export default abstract class CelestialBodyRenderer {
	abstract _currentBody?: CelestialBodyMesh | CelestialBodyModel | undefined;
	abstract get currentBody(): CelestialBodyMesh | CelestialBodyModel;

	constructor() {}

	abstract getAssetPath(asset: string): string;
	abstract getAssetPaths(): string[];
	abstract dispose(): void;
	abstract update(geometry?: BufferGeometry): void;
	abstract build(): void;
	abstract reset(body: CelestialBodyProvider): void;
	abstract rotate(deltaRotation: number): void;
	raiseError(type: string): never {
		throw new Error(`${type} not initialized. Call reset() first.`);
	}
}

export abstract class ModelRenderer extends CelestialBodyRenderer {
	abstract get currentBody(): CelestialBodyModel;
	reset(body: CelestialBodyModel): void {
		throw new Error("Method not implemented.");
	}
}
export class SpaceshipRenderer extends ModelRenderer {
	rotate(deltaRotation: number): void {
		throw new Error("Method not implemented.");
	}
	getAssetPath(): string {
		throw new Error("Method not implemented.");
	}
	getAssetPaths(): string[] {
		throw new Error("Method not implemented.");
	}
	_currentBody?: CelestialBodyModel | undefined;
	update(): void {
		throw new Error("Method not implemented.");
	}
	dispose(): void {
		throw new Error("Method not implemented.");
	}
	get currentBody(): CelestialBodyModel {
		throw new Error("Method not implemented.");
	}
	build(): void {
		throw new Error("Method not implemented.");
	}
}

export abstract class MeshRenderer extends CelestialBodyRenderer {
	abstract get currentBody(): CelestialBodyMesh;
	abstract get uniforms(): CelestialBodyUniforms;
	private initialiseArrow(): ArrowHelper {
		const color = getCelestialBodyColor(this.currentBody);
		return new ArrowHelper(
			new Vector3(0, 1, 0),
			new Vector3(0, 0, 0),
			this.currentBody.physicalParameters.MeanRadius * 1.5,
			color,
		);
	}
	protected initialiseOrbitLine(): this {
		if (this.currentBody instanceof OrbitingBody) {
			const { SemiMajorAxis: a, SemiMinorAxis: b, OrbitalEccentricity: e } = this.currentBody.orbitingParameters;
			const c = e * a;
			const curve = new EllipseCurve(-c, 0, a, b, 0, 2 * Math.PI, false, 0);
			const points = curve.getPoints(180);

			const positions: number[] = [];
			for (const point of points) {
				positions.push(point.x, 0, point.y);
			}
			const color = getCelestialBodyColor(this.currentBody);
			const geometry = new LineGeometry();
			geometry.setPositions(positions);
			const material = new LineMaterial({
				color: color,
				transparent: true,
				opacity: 0.4,
				linewidth: 2,
				resolution: new Vector2(window.innerWidth, window.innerHeight),
			});

			const orbit = new Line2(geometry, material);
			orbit.rotateOnAxis(new Vector3(1, 0, 0), this.currentBody.orbitingParameters.Inclination);
			orbit.rotateOnWorldAxis(new Vector3(0, 1, 0), this.currentBody.orbitingParameters.LongitudeOfAscendingNode);
			orbit.rotateOnAxis(new Vector3(0, 1, 0), this.currentBody.orbitingParameters.ArgumentOfPeriapsis);
			this.currentBody.primaryBody.addOrbit(this.currentBody.metadata.EnglishName, orbit);
		}
		return this;
	}
	getAssetPaths(): string[] {
		// returne getEnabledTextures(this.currentBody.textures)
		return (Object.keys(this.currentBody.textures) as (keyof TextureFlags)[]).map((baseTexture) =>
			this.getAssetPath(baseTexture),
		);
	}
	private initialiseGeometry(): IcosahedronGeometry {
		const {
			physicalParameters: { MeanRadius: radius },
			meshDetail,
		} = this.currentBody;

		return new IcosahedronGeometry(radius, meshDetail);
	}

	update(geometry: BufferGeometry): void {
		const radius = this.currentBody.physicalParameters.MeanRadius;
		geometry.scale(radius, radius, radius);
		this.updateOptionalGeometry(geometry, this.currentBody.mesh);
		// this.updateOptionalGeometry(geometry, this.currentBody.glowMesh);
		// this.updateOptionalGeometry(geometry, this.currentBody.lightMesh);
		// this.updateOptionalGeometry(geometry, this.currentBody.cloudMesh);
		// this.currentBody.celestialBodyGroup.scale.multiplyScalar(radius);
	}
	rotate(deltaRotation: number): void {
		const yAxis = new Vector3(0, 1, 0);
		// this.currentBody.shaderMaterial.uniforms.uTime.value = deltaRotation;
		this.currentBody.celestialBodyGroup.rotateOnAxis(yAxis, deltaRotation);
		// this.rotateOptionalMesh(deltaRotation * 0.1, this.currentBody.cloudMesh);
	}
	private rotateOptionalMesh(dt: number, mesh?: Mesh): void {
		if (!mesh) return;
		mesh.rotateOnAxis(new Vector3(0, 1, 0), dt);
	}
	private updateOptionalGeometry(geometry: BufferGeometry, mesh?: Mesh) {
		if (!mesh) return;
		mesh.geometry.dispose();
		mesh.geometry = geometry;
	}
	updateGeometryDetail(geometry: BufferGeometry): void {
		this.updateOptionalGeometry(geometry, this.currentBody.mesh);
		// this.updateOptionalGeometry(geometry, this.currentBody.glowMesh);
		// this.updateOptionalGeometry(geometry, this.currentBody.lightMesh);
		// this.updateOptionalGeometry(geometry, this.currentBody.cloudMesh);
		const radius = this.currentBody.physicalParameters.MeanRadius;
		this.currentBody.celestialBodyGroup.scale.multiplyScalar(radius);
	}
	initialiseShader(): CelestialShader {
		const uniforms = this.uniforms;
		const shader = getCelestialShader(uniforms);
		return shader;
	}
	initialiseBaseMesh(): this {
		this.currentBody.celestialBodyGroup.add(this.initialiseArrow());
		this.currentBody.geometry = this.initialiseGeometry();
		this.currentBody.shaderMaterial = this.initialiseShader();

		this.currentBody.mesh = new Mesh(this.currentBody.geometry, this.currentBody.shaderMaterial);
		this.currentBody.celestialBodyGroup.add(this.currentBody.mesh);
		return this;
	}
	dispose(): void {
		this.currentBody.celestialBodyGroup.traverse((child) => {
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
		this.currentBody.celestialBodyGroup.remove(this.currentBody.container);
	}
	public getAssetPath(texture: string): string {
		const {
			metadata: { EnglishName: englishName },
			meshDetail,
		} = this.currentBody;

		return `../assets/maps/${englishName.toLowerCase()}/${pascalToSnakeCase(texture)}_${meshDetail > 0 ? meshDetail : 2}.webp`;
	}
	reset(body: CelestialBodyMesh): void {
		this._currentBody = body;
	}
	initialiseOrbitalPlane(): this {
		// Re-look at
		this.currentBody.celestialBodyGroup.rotateOnWorldAxis(
			new Vector3(-1, 0, 0),
			this.currentBody.physicalParameters.AxialTilt,
		);
		return this;
	}
	buildCommon(): this {
		this.initialiseBaseMesh().initialiseOrbitLine().initialiseOrbitalPlane();
		return this;
	}
}
export class PlanetRenderer extends MeshRenderer {
	private static TYPE = "Planet";
	_currentBody?: Planet;

	get uniforms(): PlanetUniforms {
		if (!this._currentBody) this.raiseError(PlanetRenderer.TYPE);
		return {
			uColor: { value: null },
			uNight: { value: null },
			uSpecular: { value: null },
			uClouds: { value: null },
			uNormal: { value: null },
			uBump: { value: null },
			uSunPosition: { value: new Vector3(0, 0, 0) },
			uRotation: { value: this.currentBody.physicalParameters.SolarRotation },
			uTime: { value: 0.0 },
			uAtmosphericPrimary: { value: new Color(0x0d4de6) },
			uAtmosphericSecondary: { value: new Color(0xff0000) },
			uResolution: { value: new Vector2(0, 0) },
			uHasAtmosphere: { value: true },
		};
	}
	get currentBody(): Planet {
		if (!this._currentBody) throw new Error("Planet not initialized. Call reset() first.");
		return this._currentBody;
	}
	build(): void {
		this.buildCommon().initialiseRing();
		// this.buildCommon().initialiseGlowMesh().initialiseCloudMesh().initialiseLightMesh().initialiseRing();
	}
	// initialiseGlowMesh(): this {
	// 	const mesh = new Mesh(this.currentBody.geometry, getAtmosphericGlowMat());
	// 	mesh.scale.setScalar(GLOW_MESH_SCALE_FACTOR);
	// 	this.currentBody.glowMesh = mesh;
	// 	this.currentBody.celestialBodyGroup.add(mesh);
	// 	return this;
	// }
	// initialiseCloudMesh(): this {
	// 	if (!this.currentBody.textures.Cloud) return this;
	// 	const cloudMesh = this.initialiseOptional(CLOUD_OPACITY);
	// 	this.currentBody.cloudMesh = cloudMesh;
	// 	this.currentBody.celestialBodyGroup.add(cloudMesh);
	// 	return this;
	// }
	// initialiseLightMesh(): this {
	// 	if (!this.currentBody.textures.Light) return this;
	// 	const lightMesh = this.initialiseOptional(LIGHT_OPACITY);
	// 	this.currentBody.lightMesh = lightMesh;
	// 	this.currentBody.celestialBodyGroup.add(lightMesh);
	// 	return this;
	// }
	initialiseRing(): this {
		if (!this.currentBody.physicalParameters.RingSystem) return this;
		let { InnerRingRadius: innerRadius, OuterRingRadius: outerRadius } = this.currentBody.physicalParameters;
		if (!innerRadius || !outerRadius) return this;
		[innerRadius, outerRadius] = [innerRadius, outerRadius].map((radius) => radius * KM_TO_M * SCALE);
		const ringGeometry = new RingGeometry(innerRadius, outerRadius, 64);
		ringGeometry.rotateX(-Math.PI / 2);
		const material = getRingMat(null, null, innerRadius, outerRadius);
		this.currentBody.ringMesh = new Mesh(ringGeometry, material);
		this.currentBody.celestialBodyGroup.add(this.currentBody.ringMesh);
		return this;
	}
	// initialiseOptional(opacity: number) {
	// 	const material = new MeshStandardMaterial({
	// 		transparent: true,
	// 		depthTest: true,
	// 		opacity: opacity,
	// 		blending: AdditiveBlending,
	// 	});
	// 	const mesh = new Mesh(this.currentBody.geometry, material);
	// 	mesh.scale.setScalar(OPTIONAL_MESH_SCALE_FACTOR);
	// 	return mesh;
	// }
}
export class MoonRenderer extends MeshRenderer {
	private static TYPE = "Moon";
	_currentBody?: Moon;

	get uniforms(): MoonUniforms {
		if (!this._currentBody) this.raiseError(MoonRenderer.TYPE);
		return {
			uColor: { value: null },
			uSunPosition: { value: new Vector3(0, 0, 0) },
			uHasAtmosphere: { value: false },
			// uRotation: { value: this.currentBody.physicalParameters.SolarRotation },
			uRotation: { value: 0.0 },
		};
	}

	get currentBody(): Moon {
		if (!this._currentBody) this.raiseError(MoonRenderer.TYPE);
		return this._currentBody;
	}
	build(): void {
		this.buildCommon();
	}
	public override getAssetPath(texture: string): string {
		const { isGeneric, randomNumber, meshDetail } = this.currentBody;
		const folderName = isGeneric ? "generic" : "moon";
		return `../assets/maps/${folderName}/${texture.toLowerCase()}_${meshDetail > 0 ? meshDetail : 2}${
			isGeneric ? `_generic_${randomNumber}` : ""
		}.webp`;
	}
}
export class StarRenderer extends MeshRenderer {
	private static TYPE = "Star";
	_currentBody?: Star;

	get uniforms(): StarUniforms {
		if (!this._currentBody) this.raiseError(StarRenderer.TYPE);
		return {
			uColor: { value: null },
			uEmissive: { value: null },
			uHasAtmosphere: { value: false },
			uRotation: { value: this.currentBody.physicalParameters.SolarRotation },
		};
	}
	get currentBody(): Star {
		if (!this._currentBody) this.raiseError(StarRenderer.TYPE);
		return this._currentBody;
	}
	build(): void {
		this.buildCommon().initialiseLight();
	}
	initialiseLight(): this {
		if (!this.currentBody.material) return this;
		const surfaceEmission = this.currentBody.physicalParameters.Emissivity ?? 1;

		// const rawLightRange = Math.cbrt(surfaceEmission) * SCALE;
		// const scaledLightRange = rawLightRange;

		this.currentBody.primaryLight = new PointLight(0xffffff, 2, 1000000000, 0);
		this.currentBody.primaryLight.position.set(10, 10, 10);
		this.currentBody.celestialBodyGroup.add(this.currentBody.primaryLight);

		this.currentBody.material.emissive = new Color(0xffffcc);
		this.currentBody.material.emissiveIntensity = 2;

		// const emissiveMap = this.lazyLoader[this.getAssetPath(TextureType.Color)];
		this.currentBody.material.emissiveMap = this.currentBody.material.map;
		this.currentBody.material.needsUpdate = true;
		// if (emissiveMap) {
		// 	this.currentBody.material.emissiveMap = emissiveMap;
		// 	this.currentBody.material.needsUpdate = true;
		// }

		return this;
	}
}
function pascalToSnakeCase(key: string): string {
	return key
		.replace(/([a-z0-9])([A-Z])/g, "$1_$2")
		.replace(/([A-Z])([A-Z][a-z])/g, "$1_$2")
		.toLowerCase();
}

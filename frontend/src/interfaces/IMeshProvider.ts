import { BufferGeometry, MeshPhongMaterial, Mesh } from "three";
import { CelestialBodyDetail } from "../utils/constants";
import { TextureParameters } from "../types/TextureParameters";
export default interface IMeshProvider {
	readonly textures: TextureParameters;
	readonly meshDetail: CelestialBodyDetail;
	readonly celestialBodyGeometry: BufferGeometry;
	readonly celestialBodyMaterial: MeshPhongMaterial;
	readonly celestialBodyMesh: Mesh;
	readonly glowMesh?: Mesh;
	readonly lightMesh?: Mesh;
	readonly cloudMesh?: Mesh;
	readonly geometryCache: Partial<Record<CelestialBodyDetail, BufferGeometry>>;
	rotateOnAxis(dt: number): void;

	initialiseOrbitalPlane(): void;
	// initialiseOrbit?(): void;

	initialiseBaseMesh(): void;
	addGlowMesh?(): void;

	addLightingMesh?(): void;

	addCloudMesh?(): void;

	preLoadDetail(): void;
	updateDetail(): void;
	updateMeshDetailLevel(): void;
	calculateDetailLevel(distance: number): CelestialBodyDetail;
	updateVisibilityDetail(): void;
}

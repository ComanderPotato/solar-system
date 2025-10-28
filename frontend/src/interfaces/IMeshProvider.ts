import { BufferGeometry, MeshPhongMaterial, Mesh, Group } from "three";
import { CelestialBodyDetail } from "../utils/constants";
import { TextureFlags } from "../types/TextureParameters";
export default interface IMeshProvider {
	textures: TextureFlags;
	meshDetail: CelestialBodyDetail;
	geometry: BufferGeometry;
	material: MeshPhongMaterial;
	mesh: Mesh;
	glowMesh?: Mesh;
	lightMesh?: Mesh;
	cloudMesh?: Mesh;
	ringMesh?: Mesh;
	// geometryCache: Partial<Record<CelestialBodyDetail, BufferGeometry>>;

	rotateOnAxis(dt: number): void;

	initialiseOrbitalPlane(): void;
	preLoadDetail(): void;
	updateDetail(): void;
	updateMeshDetailLevel(): void;
	calculateDetailLevel(distance: number): CelestialBodyDetail;
	updateVisibilityDetail(): void;
}

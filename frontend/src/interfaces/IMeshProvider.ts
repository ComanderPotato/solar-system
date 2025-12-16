import { BufferGeometry, MeshPhongMaterial, Mesh, Group } from "three";
import { CelestialBodyDetail } from "../utils/constants";
import { TextureFlags } from "../types/TextureParameters";
import { PlanetMaterial } from "../types/Materials";
export default interface IMeshProvider {
	textures: TextureFlags;
	meshDetail: CelestialBodyDetail;
	geometry: BufferGeometry;
	material: MeshPhongMaterial;
	shaderMaterial: PlanetMaterial;
	mesh: Mesh;
	glowMesh?: Mesh;
	lightMesh?: Mesh;
	cloudMesh?: Mesh;
	ringMesh?: Mesh;
	// geometryCache: Partial<Record<CelestialBodyDetail, BufferGeometry>>;

	initialiseOrbitalPlane(): void;
}

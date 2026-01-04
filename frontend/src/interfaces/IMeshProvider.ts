import { BufferGeometry, MeshPhongMaterial, Mesh, Group } from "three";
import { CelestialBodyDetail } from "../utils/constants";
import { TextureFlags } from "../types/TextureParameters";
import { CelestialShader } from "../types/Materials";
export default interface IMeshProvider {
	textures: TextureFlags;
	meshDetail: CelestialBodyDetail;
	geometry: BufferGeometry;
	material: MeshPhongMaterial;
	shaderMaterial: CelestialShader;
	mesh: Mesh;
	// glowMesh?: Mesh;
	// lightMesh?: Mesh;
	// cloudMesh?: Mesh;
	ringMesh?: Mesh;
	// geometryCache: Partial<Record<CelestialBodyDetail, BufferGeometry>>;

	initialiseOrbitalPlane(): void;
}

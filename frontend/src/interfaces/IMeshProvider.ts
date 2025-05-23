import { TextureLoader, BufferGeometry, MeshPhongMaterial, Group, Mesh, Camera } from "three";
import { CelestialBodyDetail } from "../utils/constants";
import { TextureParameters } from "../types";
// Maybe Mesh, Model and Orbit (Mesh and Model provide general geometry, and Orbit provides rotation orbital plane and orbit)
export default interface IMeshProvider {
  readonly loader: TextureLoader;
  readonly textures: TextureParameters;
  readonly meshDetail: CelestialBodyDetail;
  readonly celestialBodyGeometry: BufferGeometry;
  readonly celestialBodyMaterial: MeshPhongMaterial;
  readonly celestialBodyMesh: Mesh;
  readonly glowMesh?: Mesh;
  readonly lightMesh?: Mesh;
  readonly cloudMesh?: Mesh;
  // readonly geometryCache: Partial<Record<CelestialBodyDetail, BufferGeometry>>;
  rotateOnAxis(dt: number): void;

  initialiseOrbitalPlane(): void;
  // initialiseOrbit?(): void;

  initialiseBaseMesh(): void;
  addGlowMesh?(): void;

  addLightingMesh?(): void;

  addCloudMesh?(): void;

  updateDetail(): void;
}

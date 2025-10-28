import { BufferGeometry, DataTexture, Texture } from "three";
import { CelestialBodyDetail } from "../../utils/constants";
import { GLTF } from "three/examples/jsm/Addons.js";

export default interface IAssetController {
	getTexture(url: string): Promise<Texture>;
	getHDRI(url: string): Promise<DataTexture>;
	getModel(url: string): Promise<GLTF>;
	getGeometryLOD(detail: CelestialBodyDetail): BufferGeometry;
	lazyLoadAllAssets(paths: string[]): Promise<void>;

	loadAssetsForBody(paths: string[]): void;
}

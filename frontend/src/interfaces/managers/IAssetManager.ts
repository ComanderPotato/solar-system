import { BufferGeometry, DataTexture, Texture } from "three";
import IManager from "../IManager";
import { IAssetLoaderType } from "../IAssetLoader";
import { CelestialBodyDetail } from "../../utils/constants";
import { GLTF } from "three/examples/jsm/Addons.js";

export enum AssetType {
	Texture,
	HDRI,
	Model,
	Geometry,
}
export enum LoaderType {
	Texture,
	HDRI,
	Model,
	Geometry,
}
export enum AssetOperation {
	Initialise,
	Update,
}
export type LoaderReturnMap = {
	[LoaderType.Texture]: Texture;
	[LoaderType.HDRI]: DataTexture;
	[LoaderType.Model]: GLTF;
	[LoaderType.Geometry]: BufferGeometry; // or whatever you use
};
export default interface IAssetManager extends IManager {
	loadAsset(url: string, type: LoaderType): Promise<IAssetLoaderType>;
	loadGeometryLOD(detail: CelestialBodyDetail): BufferGeometry;
}

import { BufferGeometry, DataTexture, Group, Object3D, Texture } from "three";
import { GLTF } from "three/examples/jsm/Addons.js";

export default interface IAssetLoader<T = IAssetLoaderType> {
	load(url?: string): Promise<T>;
	has(url: string): boolean;
	get(url: string): T | undefined;
	dispose(url?: string): void;
}

export type IAssetLoaderType = Texture | DataTexture | BufferGeometry | GLTF;

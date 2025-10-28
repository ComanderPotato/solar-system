import { DataTexture, Loader } from "three";
import IAssetLoader, { IAssetLoaderType } from "../interfaces/IAssetLoader";
import { Object3D, Mesh, BufferGeometry, Texture } from "three";
import type { GLTF } from "three/examples/jsm/loaders/GLTFLoader.js";
export default abstract class AssetLoader<T extends IAssetLoaderType> implements IAssetLoader {
	protected _cache = new Map<string, T>();
	protected _pending = new Map<string, Promise<T>>();
	protected _loader: Loader<T>;

	constructor(loader: Loader<T>) {
		this._loader = loader;
	}
	public async load(url: string): Promise<T> {
		if (this.has(url)) return this.get(url)!;

		if (this._pending.has(url)) return this._pending.get(url)!;

		const promise = new Promise<T>((resolve, reject) => {
			this._loader.load(
				url,
				(asset) => {
					this._cache.set(url, asset);
					this._pending.delete(url);
					resolve(asset);
				},
				undefined,
				(error) => {
					this._pending.delete(url);
					reject(error);
				},
			);
		});

		this._pending.set(url, promise);
		return promise;
	}
	has(url: string): boolean {
		return this._cache.has(url);
	}
	get(url: string): T | undefined {
		return this._cache.get(url);
	}
	dispose(url?: string): void {
		if (url && this.has(url)) {
			this.disposeAsset(this._cache.get(url));
			// this._cache.get(url)!.dispose();
			this._cache.delete(url);
		} else {
			for (const value of this._cache.values()) {
				this.disposeAsset(value);
				// value.dispose();
			}
			this._cache.clear();
		}
	}

	disposeAsset(asset: any): void {
		if (asset instanceof Texture || asset instanceof DataTexture || asset instanceof BufferGeometry) {
			asset.dispose();
			return;
		}

		if ((asset as GLTF).scene) {
			this.disposeModel((asset as GLTF).scene);
			return;
		}

		if (asset instanceof Object3D) {
			this.disposeModel(asset);
			return;
		}
	}

	disposeModel(object: Object3D): void {
		object.traverse((child) => {
			if (child instanceof Mesh) {
				if (child.geometry) child.geometry.dispose();
				const material = child.material;
				if (Array.isArray(material)) {
					material.forEach((m) => m.dispose?.());
				} else {
					material?.dispose?.();
				}
			}
		});
	}
}

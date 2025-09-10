import { RGBELoader } from "three/examples/jsm/loaders/RGBELoader.js";
import { DataTexture, LoadingManager } from "three";
export default class HDRILoader {
	private _loader: RGBELoader;
	private _cache: Map<string, DataTexture> = new Map();
	private _pendingLoads: Map<string, Promise<DataTexture>> = new Map();
	constructor(manager: LoadingManager) {
		this._loader = new RGBELoader(manager);
	}
	public async load(url: string): Promise<DataTexture> {
		if (this._cache.has(url)) return this._cache.get(url)!;

		if (this._pendingLoads.has(url)) return this._pendingLoads.get(url)!;

		const promise = new Promise<DataTexture>((resolve, reject) => {
			this._loader.load(
				url,
				(texture) => {
					this._cache.set(url, texture);
					this._pendingLoads.delete(url);
					resolve(texture);
				},
				undefined,
				(error) => {
					this._pendingLoads.delete(url);
					reject(error);
				},
			);
		});

		this._pendingLoads.set(url, promise);
		return promise;
	}
}

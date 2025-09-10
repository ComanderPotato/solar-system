import { TextureLoader as ThreeTextureLoader, LoadingManager, Texture, DataTexture } from "three";

export default class TextureLoader {
	private _loader: ThreeTextureLoader;
	private _cache: Map<string, Texture> = new Map();
	private _pendingLoads: Map<string, Promise<Texture>> = new Map();
	constructor(manager: LoadingManager) {
		this._loader = new ThreeTextureLoader(manager);
	}
	get textureCache(): Map<string, Texture> {
		return this._cache;
	}

	public async load(url: string): Promise<Texture> {
		if (this._cache.has(url)) return this._cache.get(url)!;

		if (this._pendingLoads.has(url)) return this._pendingLoads.get(url)!;

		const promise = new Promise<Texture>((resolve, reject) => {
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

// class Loader<TextureType, T extends Loader> {
// 	private _loader: T;
// 	private _cache: Map<string, TextureType> = new Map();
// 	private _pendingLoads: Map<string, Promise<TextureType>> = new Map();
//
// 	constructor(baseLoader: T) {
// 		this._loader = baseLoader;
// 	}
//
// 	get cache(): Map<string, TextureType> {
// 		return this._cache;
// 	}
// 	public async load(url: string): Promise<TextureType> {
// 		if (this._cache.has(url)) return this._cache.get(url)!;
//
// 		if (this._pendingLoads.has(url)) return this._pendingLoads.get(url)!;
//
// 		const promise = new Promise<TextureType>((resolve, reject) => {
// 			this._loader.load(
// 				url,
// 				(texture) => {
// 					this._cache.set(url, texture);
// 					this._pendingLoads.delete(url);
// 					resolve(texture);
// 				},
// 				undefined,
// 				(error) => {
// 					this._pendingLoads.delete(url);
// 					reject(error);
// 				},
// 			);
// 		});
//
// 		this._pendingLoads.set(url, promise);
// 		return promise;
// 	}
// }

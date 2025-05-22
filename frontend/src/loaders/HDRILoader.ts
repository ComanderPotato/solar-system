import { RGBELoader } from "three/examples/jsm/loaders/RGBELoader.js";
import { DataTexture, LoadingManager } from "three";
export default class HDRILoader {
  private _loader: RGBELoader;
  private _cache: Map<string, DataTexture> = new Map()
  constructor(manager: LoadingManager) {
    this._loader = new RGBELoader(manager);
  }

  async load(url: string): Promise<DataTexture> {
    if(this._cache.has(url)) return this._cache.get(url)!
    return new Promise((resolve, reject) => {
      this._loader.load(
        url,
        (texture) => resolve(texture),
        undefined,
        (error) => reject(error)
      );
    });
  }
}

import { TextureLoader as ThreeTextureLoader, LoadingManager, Texture } from "three";

export default class TextureLoader {
  private _loader: ThreeTextureLoader;
  // private _lazyLoader: ThreeTextureLoader;
  private _cache: Map<string, Texture> = new Map();
  private _pendingLoads: Map<string, Promise<Texture>> = new Map();
  constructor(manager: LoadingManager) {
    this._loader = new ThreeTextureLoader(manager);
  }
  get textureCache(): Map<string, Texture> {
    // this.lazyLoad([]);
    return this._cache;
  }

  // private lazyLoad = async (url: string[]): Promise<Texture> => {};
  async load(url: string): Promise<Texture> {
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
        }
      );
    });

    this._pendingLoads.set(url, promise);
    return promise;
  }
}

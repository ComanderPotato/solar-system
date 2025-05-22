import { DataTexture, LoadingManager, Texture } from "three";
// import { ModelLoader } from './ModelLoader';
import { HDRILoader, TextureLoader } from "../loaders";
type ProgressCallback = (url: string, progressRatio: number) => void;
type LoadCompleteCallback = () => void;


export default class AssetLoader {
  private _manager: LoadingManager;
  //   private _modelLoader: ModelLoader;
  private _textureLoader: TextureLoader;
  private _hdriLoader: HDRILoader;
  private _isLoaded: boolean = false;
  //   private onProgress: ProgressCallback;
  //   private onLoadComplete: LoadCompleteCallback;
  private _progress: number = 0;
  constructor(private _onProgress: ProgressCallback, private _onLoadComplete: LoadCompleteCallback) {
    this._onProgress = _onProgress;
    this._onLoadComplete = _onLoadComplete;

    this._manager = new LoadingManager(
      () => {
        this._onLoadComplete();
      },
      (url, itemsLoaded, itemsTotal) => {
        const progress = itemsTotal > 0 ? itemsLoaded / itemsTotal : 1;
        this._progress = progress;
        this._onProgress(url, progress);
      },
      (url) => console.log("Failed: ", url)
    );

    // this._modelLoader = new ModelLoader(this._manager);
    this._textureLoader = new TextureLoader(this._manager);
    this._hdriLoader = new HDRILoader(this._manager);
  }
  get progress(): number {
    return this._progress;
  }
  get isLoaded(): boolean {
    return this._isLoaded;
  }
  async loadTexure(url?: string): Promise<Texture | null> {
    if (!url) return null;
    this._isLoaded = false;
    return await this._textureLoader.load(url);
  }
  async loadHDRI(url?: string): Promise<DataTexture | null> {
    if (!url) return null;
    this._isLoaded = false;
    return await this._hdriLoader.load(url);
  }
  async loadAssets(): Promise<{ textures: Texture[]; hdris: Texture[] }> {
    const modelUrls = ["/models/solarSystem.glb", "/models/moon.glb"];
    const textureUrls = ["/textures/earth_diffuse.jpg", "/textures/moon_diffuse.jpg"];
    const hdriUrls = ["/hdris/space.hdr"];

    // const models = await Promise.all(modelUrls.map(url => this._modelLoader.load(url)));
    const textures = await Promise.all(textureUrls.map((url) => this._textureLoader.load(url)));
    const hdris = await Promise.all(hdriUrls.map((url) => this._hdriLoader.load(url)));

    return { textures, hdris };
  }
}

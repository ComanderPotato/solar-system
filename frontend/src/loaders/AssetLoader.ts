// import { DataTexture, LinearMipMapLinearFilter, LoadingManager, Texture } from "three";
// // import { ModelLoader } from './ModelLoader';
// import TextureLoader from "./TextureLoader";
// import HDRILoader from "./HDRILoader";
// type ProgressCallback = (url: string, progressRatio: number) => void;
// type LoadCompleteCallback = () => void;
//
// export default class AssetLoader {
// 	private _manager: LoadingManager;
// 	//   private _modelLoader: ModelLoader;
// 	private _textureLoader: TextureLoader;
// 	private _hdriLoader: HDRILoader;
// 	//   private onProgress: ProgressCallback;
// 	//   private onLoadComplete: LoadCompleteCallback;
// 	constructor(
// 		private _onProgress: ProgressCallback,
// 		private _onLoadComplete: LoadCompleteCallback,
// 	) {
// 		this._onProgress = _onProgress;
// 		this._onLoadComplete = _onLoadComplete;
//
// 		this._manager = new LoadingManager(
// 			() => {
// 				this._onLoadComplete();
// 			},
// 			(url, itemsLoaded, itemsTotal) => {
// 				const progress = itemsTotal > 0 ? itemsLoaded / itemsTotal : 1;
// 				this._onProgress(url, progress);
// 			},
// 			(url) => console.log("Failed: ", url),
// 		);
//
// 		this._textureLoader = new TextureLoader(this._manager);
// 		this._hdriLoader = new HDRILoader(this._manager);
// 	}
// 	public async loadTexure(url?: string): Promise<Texture | null> {
// 		if (!url) return null;
// 		const texture = await this._textureLoader.load(url);
// 		texture.generateMipmaps = true;
// 		texture.minFilter = LinearMipMapLinearFilter;
// 		return await this._textureLoader.load(url);
// 	}
// 	public async loadHDRI(url?: string): Promise<DataTexture | null> {
// 		if (!url) return null;
// 		return await this._hdriLoader.load(url);
// 	}
//
// 	public loadTextures = async (urls?: string[]): Promise<void> => {
// 		if (!urls) return;
// 		await Promise.all(urls?.map((url) => {}));
// 	};
// }

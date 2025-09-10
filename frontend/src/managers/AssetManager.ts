import { DataTexture, LinearMipMapLinearFilter, LoadingManager, Texture } from "three";
import TextureLoader from "../loaders/TextureLoader";
import HDRILoader from "../loaders/HDRILoader";
import IAssetManager from "../interfaces/managers/IAssetManager";
import Manager from "../core/Manager";
type ProgressCallback = (url: string, progressRatio: number) => void;
type LoadCompleteCallback = () => void;

export default class AssetManager extends Manager implements IAssetManager {
	private _loadingManager: LoadingManager;
	// Can maybe make Loaders generic
	private _textureLoader: TextureLoader;
	private _hdriLoader: HDRILoader;
	public constructor(
		private _onProgress: ProgressCallback = () => {},
		private _onLoadComplete: LoadCompleteCallback = () => {},
	) {
		super();
		this._onProgress = _onProgress;
		this._onLoadComplete = _onLoadComplete;

		this._loadingManager = new LoadingManager(
			() => {
				this._onLoadComplete();
			},
			(url, itemsLoaded, itemsTotal) => {
				const progress = itemsTotal > 0 ? itemsLoaded / itemsTotal : 1;
				this._onProgress(url, progress);
			},
			(url) => console.log("Failed: ", url),
		);

		this._textureLoader = new TextureLoader(this._loadingManager);
		this._hdriLoader = new HDRILoader(this._loadingManager);
	}
	public async loadTexture(url: string): Promise<Texture | null> {
		if (!url) return null;
		const texture = await this._textureLoader.load(url);
		texture.generateMipmaps = true;
		texture.minFilter = LinearMipMapLinearFilter;
		return await this._textureLoader.load(url);
	}

	public async loadHDRI(url?: string): Promise<DataTexture | null> {
		if (!url) return null;
		return await this._hdriLoader.load(url);
	}

	public loadTextures = async (urls?: string[]): Promise<void> => {
		if (!urls) return;
		await Promise.all(urls?.map((url) => {}));
	};
}

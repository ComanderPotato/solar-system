import {
	BufferGeometry,
	DataTexture,
	IcosahedronGeometry,
	LinearMipMapLinearFilter,
	LoadingManager,
	Texture,
} from "three";
import TextureLoader from "../loaders/TextureLoader";
import HDRILoader from "../loaders/HDRILoader";
import IAssetManager, { LoaderType } from "../interfaces/managers/IAssetManager";
import Manager from "../core/Manager";
import IAssetLoader, { IAssetLoaderType } from "../interfaces/IAssetLoader";
import { CelestialBodyDetail } from "../utils/constants";
import ModelLoader from "../loaders/ModelLoader";
import { GLTF } from "three/examples/jsm/Addons.js";
import AssetLoader from "../core/AssetLoader";
import { GeometryLoader } from "../loaders/GeometryLoader";
type ProgressCallback = (url: string, progressRatio: number) => void;
type LoadCompleteCallback = () => void;

export default class AssetManager extends Manager implements IAssetManager {
	private _loadingManager: LoadingManager;
	private _geometryCache: Partial<Record<CelestialBodyDetail, BufferGeometry>> = {};

	// Can maybe make Loaders generic
	private _textureLoader: AssetLoader<Texture>;
	private _hdriLoader: AssetLoader<DataTexture>;
	private _modelLoader: AssetLoader<GLTF>;
	private _geometryLoader: AssetLoader<BufferGeometry>;
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
			(url) => console.log("Failed loading: ", url),
		);

		this._textureLoader = new TextureLoader(this._loadingManager);
		this._hdriLoader = new HDRILoader(this._loadingManager);
		this._modelLoader = new ModelLoader(this._loadingManager);
		this._geometryLoader = new GeometryLoader(this._loadingManager);
	}
	public loadGeometryLOD(detail: CelestialBodyDetail): BufferGeometry {
		if (!this._geometryCache[detail]) {
			this._geometryCache[detail] = new IcosahedronGeometry(1, detail);
		}
		return this._geometryCache[detail];
	}
	// Maybe okay?
	public async loadAsset<T extends LoaderType>(url: string, loaderType: T): Promise<IAssetLoaderType> {
		try {
			return await this.getLoader(loaderType)
				.load(url)
				.then((asset) => this.processAsset(asset));
		} catch (error: any) {
			throw new Error(error.message);
		}
	}

	private getLoader(loaderType: LoaderType): IAssetLoader {
		switch (loaderType) {
			case LoaderType.Texture:
				return this._textureLoader;
			case LoaderType.HDRI:
				return this._hdriLoader;
			case LoaderType.Model:
				return this._modelLoader;
			case LoaderType.Geometry:
				return this._geometryLoader;
		}
	}
	private processAsset(asset: IAssetLoaderType): IAssetLoaderType {
		if (asset instanceof Texture) {
			this.processTexture(asset);
		}
		return asset;
	}
	private processTexture(texture: Texture): void {
		texture.generateMipmaps = true;
		texture.minFilter = LinearMipMapLinearFilter;
	}
}

import { BufferGeometry, DataTexture, Texture } from "three";
import IAssetController from "../interfaces/controllers/IAssetController";
import Controller from "../core/Controller";
import IAssetManager, { LoaderType } from "../interfaces/managers/IAssetManager";
import IAppContext from "../interfaces/IAppContext";
import { TaskName } from "../interfaces/managers/IDataManager";
import { CelestialBodyDetail } from "../utils/constants";
import { GLTF } from "three/examples/jsm/Addons.js";
import IInjectableController from "../interfaces/IInjectableController";

export default class AssetController
	extends Controller<IAssetManager>
	implements IAssetController, IInjectableController
{
	public constructor(manager: IAssetManager) {
		super(manager);
	}
	async loadAssetsForBody(paths: string[]): Promise<void> {
		await this.dataController.handleTracking(TaskName.TODO, async () => {
			Promise.all(paths.map(async (assetPath) => await this.getTexture(assetPath)));
		});
	}
	public injectControllers(appContext: IAppContext): void {
		this.dataController = appContext.dataController;
	}
	destroy(): void {
		throw new Error("Method not implemented.");
	}
	// async getAsset(url: string, assetType: LoaderType): Promise<IAssetLoaderType> {
	// 	return await this.dataController.handleTracking(
	// 		TaskName.TODO,
	// 		async () => await this.manager.loadAsset(url, assetType),
	// 	);
	// }
	async getTexture(url: string): Promise<Texture> {
		return await this.dataController.handleTracking(
			TaskName.LoadTexture,
			// async () => await this.manager.load(url, AssetType.Texture),
			async () => (await this.manager.loadAsset(url, LoaderType.Texture)) as Texture,
		);
	}
	async getHDRI(url: string): Promise<DataTexture> {
		return await this.dataController.handleTracking(
			TaskName.LoadHDRI,
			async () => (await this.manager.loadAsset(url, LoaderType.HDRI)) as DataTexture,
			// async () => await this.manager.loadHDRI(url),
		);
	}
	async getModel(url: string): Promise<GLTF> {
		return await this.dataController.handleTracking(
			TaskName.TODO,
			async () => (await this.manager.loadAsset(url, LoaderType.Model)) as GLTF,
		);
	}
	getGeometryLOD(detail: CelestialBodyDetail): BufferGeometry {
		return this.manager.loadGeometryLOD(detail).clone();
	}
	async lazyLoad(urls: string[]): Promise<void> {
		await Promise.all(urls.map((texturePath) => this.getTexture(texturePath)));
	}
	async lazyLoadTextures(urls: string[]): Promise<void> {
		await this.dataController.handleTracking(TaskName.TODO, async () =>
			Promise.all(urls.map(async (texturePath) => await this.getTexture(texturePath))),
		);
	}

	async lazyLoadAllAssets(paths: string[]): Promise<void> {
		await this.dataController.handleTracking(TaskName.TODO, async () => {
			Promise.all(paths.map(async (texturePath) => await this.getTexture(texturePath)));
		});
	}
}

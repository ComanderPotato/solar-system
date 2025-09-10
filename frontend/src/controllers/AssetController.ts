import { Texture, DataTexture } from "three";
import IAssetController from "../interfaces/controllers/IAssetController";
import Controller from "../core/Controller";
import IAssetManager from "../interfaces/managers/IAssetManager";
import IAppContext from "../interfaces/IAppContext";
import { TaskName } from "../interfaces/managers/IDataManager";

export default class AssetController extends Controller<IAssetManager> implements IAssetController {
	public constructor(manager: IAssetManager) {
		super(manager);
	}
	protected injectControllers(appContext: IAppContext): void {
		this.dataController = appContext.dataController;
	}
	destroy(): void {
		throw new Error("Method not implemented.");
	}
	async getTexture(url: string): Promise<Texture | null> {
		return await this.dataController.handleTracking(
			TaskName.LoadTexture,
			async () => await this.manager.loadTexture(url),
		);
	}
	async getHDRI(url: string): Promise<DataTexture | null> {
		return await this.dataController.handleTracking(
			TaskName.LoadHDRI,
			async () => await this.manager.loadHDRI(url),
		);
	}
}

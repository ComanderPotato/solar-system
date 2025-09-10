import { DataTexture, Texture } from "three";
import IController from "../IController";
import IAssetManager from "../managers/IAssetManager";
export default interface IAssetController extends IController<IAssetManager> {
	getTexture(url: string): Promise<Texture | null>;
	getHDRI(url: string): Promise<DataTexture | null>;
}

import { DataTexture, Texture } from "three";
import IManager from "../IManager";

export default interface IAssetManager extends IManager {
	loadTexture(url: string): Promise<Texture | null>;
	loadHDRI(url: string): Promise<DataTexture | null>;
}

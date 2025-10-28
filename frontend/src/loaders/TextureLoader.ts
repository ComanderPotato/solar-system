import { TextureLoader as ThreeTextureLoader, LoadingManager, Texture } from "three";
import AssetLoader from "../core/AssetLoader";

export default class TextureLoader extends AssetLoader<Texture> {
	constructor(manager: LoadingManager) {
		super(new ThreeTextureLoader(manager));
	}
}

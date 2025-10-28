import { RGBELoader } from "three/examples/jsm/loaders/RGBELoader.js";
import { DataTexture, LoadingManager } from "three";
import AssetLoader from "../core/AssetLoader";

export default class HDRILoader extends AssetLoader<DataTexture> {
	constructor(manager: LoadingManager) {
		super(new RGBELoader(manager));
	}
}

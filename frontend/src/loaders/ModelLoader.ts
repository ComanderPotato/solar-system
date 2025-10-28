import { GLTFLoader } from "three/examples/jsm/Addons.js";
import type { GLTF } from "three/examples/jsm/Addons.js";
import { LoadingManager } from "three";
import AssetLoader from "../core/AssetLoader";

export default class ModelLoader extends AssetLoader<GLTF> {
	constructor(manager: LoadingManager) {
		super(new GLTFLoader(manager));
	}
}

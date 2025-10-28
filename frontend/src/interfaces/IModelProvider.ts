import { GLTF } from "three/examples/jsm/Addons.js";

export default interface IModelProvider {
	model: GLTF;
	initaliseModel(): void;
}

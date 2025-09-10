import { DataTexture, Object3D, Vector3, PerspectiveCamera, Scene, WebGLRenderer, Frustum, Raycaster } from "three";
import IController from "../IController";
import ISceneManager from "../managers/ISceneManager";
import { CSS2DRenderer, OrbitControls } from "three/examples/jsm/Addons.js";
export interface SceneResources {
	scene: Scene;
	camera: PerspectiveCamera;
	renderer: WebGLRenderer;
	labelRenderer: CSS2DRenderer;
	controls: OrbitControls;
	lerpDestination: Vector3 | undefined;
	frustum: Frustum;
	raycaster: Raycaster;
}
export default interface ISceneController extends IController<ISceneManager> {
	setHDRI(hdri: DataTexture | null): void;
	handleCameraMovement(dt?: number): void;
	handleLerp(): void;
	addToScene(...object: Object3D[]): void;
	removeFromScene(...object: Object3D[]): void;
	handleRender(): void;

	get sceneResources(): SceneResources;
}

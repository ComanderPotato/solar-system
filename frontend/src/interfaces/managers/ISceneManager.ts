import { Frustum, PerspectiveCamera, Raycaster, Scene, Vector3, WebGLRenderer } from "three";
import IManager from "../IManager";
import { CSS2DRenderer, OrbitControls } from "three/examples/jsm/Addons.js";
import { FocusedBodyInformation } from "../controllers/ISolarSystemController";

export default interface ISceneManager extends IManager {
	initialiseScene(): void;
	updateCameraPosition(focusedBodyInformation: FocusedBodyInformation, dt: number): void;
	calculateLerpDestination(focusedBodyInformation: FocusedBodyInformation): void;
	get scene(): Scene;
	get camera(): PerspectiveCamera;
	get renderer(): WebGLRenderer;
	get labelRenderer(): CSS2DRenderer;
	get controls(): OrbitControls;
	get lerpDestination(): Vector3 | undefined;
	get frustum(): Frustum;
	get raycaster(): Raycaster;
}

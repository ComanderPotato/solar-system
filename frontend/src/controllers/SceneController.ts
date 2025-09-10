import { DataTexture, EquirectangularReflectionMapping, Object3D } from "three";
import ISceneController, { SceneResources } from "../interfaces/controllers/ISceneController";
import Controller from "../core/Controller";
import CelestialBody from "../models/CelestialBody";
import ISceneManager from "../interfaces/managers/ISceneManager";
import IAppContext from "../interfaces/IAppContext";
// interface CameraParameters {
// 	fov: number;
// 	aspectRatio: number;
// 	near: number;
// 	far: number;
// }
// const cameraParameters: CameraParameters = {
// 	fov: 75,
// 	aspectRatio: window.innerWidth / window.innerHeight,
// 	near: 0.000001,
// 	far: Number.MAX_SAFE_INTEGER,
// };
export default class SceneController extends Controller<ISceneManager> implements ISceneController {
	public constructor(manager: ISceneManager) {
		super(manager);
	}
	setHDRI(hdri: DataTexture | null): void {
		if (hdri) hdri.mapping = EquirectangularReflectionMapping;
		this.manager.scene.environment = hdri;
		this.manager.scene.background = hdri;
	}
	destroy(): void {
		throw new Error("Method not implemented.");
	}
	get sceneResources(): SceneResources {
		return {
			scene: this.manager.scene,
			camera: this.manager.camera,
			renderer: this.manager.renderer,
			labelRenderer: this.manager.labelRenderer,
			controls: this.manager.controls,
			lerpDestination: this.manager.lerpDestination,
			frustum: this.manager.frustum,
			raycaster: this.manager.raycaster,
		};
	}
	protected injectControllers(appContext: IAppContext): void {
		this.solarSystemController = appContext.solarSystemController;
	}
	public handleRender(): void {
		this.manager.controls.update();
		this.manager.labelRenderer.render(this.manager.scene, this.manager.camera);
		this.manager.renderer.render(this.manager.scene, this.manager.camera);
	}
	handleCameraMovement(dt: number = 0): void {
		if (!this.solarSystemController.focusedBodyInformation) return;
		this.manager.updateCameraPosition(this.solarSystemController.focusedBodyInformation, dt);
	}
	handleLerp(): void {
		if (!this.solarSystemController.focusedBodyInformation) return;
		this.manager.calculateLerpDestination(this.solarSystemController.focusedBodyInformation);
	}
	public addToScene(...object: Object3D[]): void {
		this.manager.scene.add(...object);
	}
	public removeFromScene(...objects: Object3D[]): void {
		this.manager.scene.remove(...objects);
	}
}

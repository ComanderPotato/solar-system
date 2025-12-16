import { DataTexture, EquirectangularReflectionMapping, Object3D, Texture } from "three";
import ISceneController, { SceneResources } from "../interfaces/controllers/ISceneController";
import Controller from "../core/Controller";
import ISceneManager from "../interfaces/managers/ISceneManager";
import IAppContext from "../interfaces/IAppContext";
import IInitializable from "../interfaces/IInitializable";
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
export default class SceneController extends Controller<ISceneManager> implements ISceneController, IInitializable {
	public constructor(manager: ISceneManager) {
		super(manager);
	}
	init(): void {
		this.assetController.getHDRI("../assets/HDR_multi_nebulae.hdr").then((hdri) => this.setHDRI(hdri));
	}
	setHDRI(hdri: DataTexture): void {
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
	setRenderLoop(renderLoop: any): void {
		this._manager.renderer.setAnimationLoop(renderLoop);
	}
	public injectControllers(appContext: IAppContext): void {
		this.assetController = appContext.assetController;
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
		this.manager.controls.minDistance =
			this.solarSystemController.focusedCelestialBody!.physicalParameters.MeanRadius * 1.05;
		this.manager.calculateLerpDestination(this.solarSystemController.focusedBodyInformation);
	}
	public addToScene(...object: Object3D[]): void {
		this.manager.scene.add(...object);
	}
	public removeFromScene(...objects: Object3D[]): void {
		this.manager.scene.remove(...objects);
	}
}

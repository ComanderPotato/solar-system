import { Frustum, Matrix4, Object3D, PerspectiveCamera, Raycaster, Scene, Vector3, WebGLRenderer } from "three";
import CelestialBody from "../models/CelestialBody";
import OrbitingBody from "../models/OrbitingBody";
import { CelestialBodyDistance } from "../utils/constants";
import Star from "../models/Star";
import Moon from "../models/Moon";
import Planet from "../models/Planet";
import { CSS2DRenderer, OrbitControls } from "three/examples/jsm/Addons.js";
import ISceneManager from "../interfaces/managers/ISceneManager";
import Manager from "../core/Manager";
import { FocusedBodyInformation } from "../interfaces/controllers/ISolarSystemController";
interface CameraParameters {
	fov: number;
	aspectRatio: number;
	near: number;
	far: number;
}
const cameraParameters: CameraParameters = {
	fov: 75,
	aspectRatio: window.innerWidth / window.innerHeight,
	near: 0.000001,
	far: Number.MAX_SAFE_INTEGER,
};
export default class SceneManager extends Manager implements ISceneManager {
	private _scene!: Scene;
	private _camera!: PerspectiveCamera;
	private _renderer!: WebGLRenderer;
	private _labelRenderer!: CSS2DRenderer;
	private _controls!: OrbitControls;
	private _lerpDestination: Vector3 | undefined = undefined;
	private _frustum: Frustum = new Frustum();
	private _raycaster: Raycaster = new Raycaster();
	public get scene(): Scene {
		return this._scene;
	}
	public get camera(): PerspectiveCamera {
		return this._camera;
	}
	public get renderer(): WebGLRenderer {
		return this._renderer;
	}
	public get labelRenderer(): CSS2DRenderer {
		return this._labelRenderer;
	}
	public get controls(): OrbitControls {
		return this._controls;
	}
	get lerpDestination(): Vector3 | undefined {
		return this._lerpDestination;
	}
	set lerpDestination(value: Vector3 | undefined) {
		this._lerpDestination = value;
	}
	get frustum(): Frustum {
		return this._frustum;
	}
	set frustum(value: Frustum) {
		this._frustum = value;
	}
	get raycaster(): Raycaster {
		return this._raycaster;
	}
	set raycaster(value: Raycaster) {
		this._raycaster = value;
	}
	public constructor() {
		super();
	}
	initialiseScene() {
		this._scene = new Scene();
		this.initialiseCamera();
		this.initialiseRenderer();
		this.initialiseLabelRenderer();
		this.initialiseOrbitControls();
		window.addEventListener("resize", this.resize);
	}

	private initialiseCamera(): this {
		const { fov, aspectRatio, near, far } = cameraParameters;
		this._camera = new PerspectiveCamera(fov, aspectRatio, near, far);
		this._camera.position.z = 1000;
		return this;
	}
	private initialiseRenderer(): this {
		this._renderer = new WebGLRenderer();
		this._renderer.setSize(window.innerWidth, window.innerHeight);
		document.body.appendChild(this._renderer.domElement);
		return this;
	}
	private initialiseLabelRenderer(): this {
		this._labelRenderer = new CSS2DRenderer();
		this._labelRenderer.setSize(window.innerWidth, window.innerHeight);
		this._labelRenderer.domElement.style.position = "absolute";
		this._labelRenderer.domElement.style.top = "0px";
		this._labelRenderer.domElement.style.pointerEvents = "none";
		document.body.appendChild(this._labelRenderer.domElement);
		return this;
	}
	private initialiseOrbitControls(): this {
		this._controls = new OrbitControls(this._camera, this._renderer.domElement);
		this._controls.enablePan = false;
		this._controls.dampingFactor = 0.4;
		this._controls.enableDamping = true;
		this._controls.update();
		this._controls.target.set(0, 0, 0);
		return this;
	}
	private resize = () => {
		this._camera.aspect = window.innerWidth / window.innerHeight;
		this._camera.updateProjectionMatrix();
		this._renderer.setSize(window.innerWidth, window.innerHeight);
		this._labelRenderer.setSize(window.innerWidth, window.innerHeight);
	};

	// Fix controller
	public moveCameraWithFocused1(position?: Vector3, velocity?: Vector3, radius: number = 0, dt: number = 0): void {
		if (!position || !velocity) return;
		if (!this._lerpDestination) {
			if (velocity) {
				// this.controller.camera.position.add(velocity.multiplyScalar(dt));
			}
		} else {
			// this.controller.controls.disconnect();
			if (velocity) {
				this._lerpDestination.add(velocity.multiplyScalar(dt));
				// this.controller.camera.position.add(velocity.multiplyScalar(dt));
			}
			// this.controller.camera.position.lerp(this._lerpDestination, 0.05);
			// if (this.controller.camera.position.distanceTo(this._lerpDestination) <= radius * 0.01) {
			// 	this._lerpDestination = undefined;
			// 	this.controller.controls.connect(this.controller.renderer.domElement);
			// }
		}
	}
	// updateCameraPosition(focusedBody: CelestialBody, dt: number): void {
	// 	if (!this._lerpDestination) {
	// 		if (focusedBody instanceof OrbitingBody) {
	// 			this.camera.position.add(focusedBody.currentVelocity.clone().multiplyScalar(dt));
	// 		}
	// 	} else {
	// 		this.controls.disconnect();
	// 		if (focusedBody instanceof OrbitingBody) {
	// 			this._lerpDestination.add(focusedBody.currentVelocity.clone().multiplyScalar(dt));
	// 			this.camera.position.add(focusedBody.currentVelocity.clone().multiplyScalar(dt));
	// 		}
	// 		this.camera.position.lerp(this._lerpDestination, 0.05);
	// 		if (
	// 			this.camera.position.distanceTo(this._lerpDestination) <=
	// 			focusedBody.physicalParameters.MeanRadius * 0.01
	// 		) {
	// 			this._lerpDestination = undefined;
	// 			this.controls.connect(this.renderer.domElement);
	// 		}
	// 	}
	// }
	updateCameraPosition(focusedBodyInformation: FocusedBodyInformation, dt: number) {
		const { velocity, radius } = focusedBodyInformation;
		if (velocity) {
			this.camera.position.add(velocity.clone().multiplyScalar(dt));
		}
		if (this._lerpDestination) {
			this.controls.disconnect();
			if (velocity) {
				this._lerpDestination.add(velocity.clone().multiplyScalar(dt));
			}
			this.camera.position.lerp(this._lerpDestination, 0.05);
			if (this.camera.position.distanceTo(this._lerpDestination) <= radius * 0.01) {
				this._lerpDestination = undefined;
				this.controls.connect(this.renderer.domElement);
			}
		}
	}
	calculateLerpDestination(focusedBodyInformation: FocusedBodyInformation): void {
		const { position, velocity, radius, primaryPosition } = focusedBodyInformation;
		let lerpDestination;
		if (velocity && primaryPosition) {
			lerpDestination = primaryPosition
				.sub(position)
				.normalize()
				.multiplyScalar(radius * CelestialBodyDistance.CLOSE);
		} else {
			lerpDestination = position.setZ(position.z + radius * CelestialBodyDistance.CLOSE);
		}
		this._lerpDestination = position.add(lerpDestination);
	}
	// public calculateLerpDestination(focusedCelestialBody: CelestialBody): void {
	// 	let lerpDestination;
	// 	const focused = focusedCelestialBody;
	// 	if (focused instanceof OrbitingBody) {
	// 		lerpDestination = focused
	// 			.primaryBody!.position.clone()
	// 			.sub(focused.position.clone())
	// 			.normalize()
	// 			.multiplyScalar(
	// 				focused.physicalParameters.MeanRadius * CelestialBodyDistance.CLOSE,
	// 			);
	// 	} else {
	// 		lerpDestination = focused.position
	// 			.clone()
	// 			.setZ(
	// 				focused.position.clone().z +
	// 					focused.physicalParameters.MeanRadius * CelestialBodyDistance.CLOSE,
	// 			);
	// 	}
	// 	this._lerpDestination = focused.position.clone().add(lerpDestination);
	// }
	public canSeeBody = (renderedBodies: CelestialBody[], celestialBodyMesh: Object3D): boolean => {
		const allBodies: Object3D[] = renderedBodies
			.filter(
				(body): body is Star | Planet | Moon =>
					body instanceof Star || body instanceof Planet || body instanceof Moon,
			)
			.map((body) => body.celestialBodyMesh);
		// this.controller.camera.updateMatrixWorld();
		// this._frustum.setFromProjectionMatrix(
		// 	new Matrix4().multiplyMatrices(
		// 		this.controller.camera.projectionMatrix,
		// 		this.controller.camera.matrixWorldInverse,
		// 	),
		// );

		const worldTargetPosition = celestialBodyMesh.getWorldPosition(new Vector3());
		if (!this._frustum.containsPoint(worldTargetPosition)) return false;

		const cameraPosition = new Vector3();
		// this.controller.camera.getWorldPosition(cameraPosition);

		const direction = new Vector3().subVectors(worldTargetPosition, cameraPosition).normalize();

		this._raycaster.set(cameraPosition, direction);
		this._raycaster.far = cameraPosition.distanceTo(worldTargetPosition);

		const intersections = this._raycaster.intersectObjects(allBodies, true);
		if (intersections.length === 0) return true;

		const firstHit = intersections[0].object;

		let obj: Object3D | null = firstHit;
		while (obj) {
			if (obj === celestialBodyMesh) {
				return true;
			}
			obj = obj.parent;
		}

		return false;
	};
}

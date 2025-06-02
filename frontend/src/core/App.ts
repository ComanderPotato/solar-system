import { Scene, WebGLRenderer, PerspectiveCamera, Vector3, EquirectangularReflectionMapping, Frustum, Matrix4, Raycaster, Object3D } from "three";
import { OrbitControls, CSS2DRenderer } from "three/examples/jsm/Addons.js";
import { CelestialBodyDistance } from "../utils";
import { SolarSystem, CelestialBody, OrbitingBody, Star, Planet, Moon } from "../models";
interface CameraParameters {
	fov: number;
	aspectRatio: number;
	near: number;
	far: number;
}
import { dataManager, uiManager, timeManager } from ".";
import { DataManager, UIManager, TimeManager } from "../managers";

export default class App {
	// Managers
	private _dataManager: DataManager;
	private _timeManager: TimeManager;
	private _uiManager: UIManager;
	// Variable to hold SolarSystem from Data Manager
	private _solarSystem: SolarSystem;

	// Core threejs variables
	private _scene: Scene = new Scene();
	private _camera!: PerspectiveCamera;
	private _renderer!: WebGLRenderer;
	private _labelRenderer!: CSS2DRenderer;
	private _controls!: OrbitControls;
	private _frustum: Frustum = new Frustum();
	private _raycaster: Raycaster = new Raycaster();

	private _lerpDestination?: Vector3;
	private _fps: number = 24;
	private FRAME_RATE: number = 1 / this._fps;

	private cameraParameters: CameraParameters = {
		fov: 75,
		aspectRatio: window.innerWidth / window.innerHeight,
		near: 0.000001,
		far: Number.MAX_SAFE_INTEGER,
	};
	constructor(cameraParameters?: CameraParameters) {
		this._dataManager = dataManager();
		this._timeManager = timeManager();
		this._uiManager = uiManager();
		this._solarSystem = this._dataManager.solarSystem;
		this.cameraParameters = cameraParameters ? cameraParameters : this.cameraParameters;
		this.initialise();
	}
	// ====== INITIALISATION-START ======
	private initialise = (): void => {
		const initialiseCamera = (): void => {
			const { fov, aspectRatio, near, far } = this.cameraParameters;
			this._camera = new PerspectiveCamera(fov, aspectRatio, near, far);
			this._camera.position.z = 1000;
		};
		const initialiseRenderer = (): void => {
			this._renderer = new WebGLRenderer();
			this._renderer.setSize(window.innerWidth, window.innerHeight);
			document.body.appendChild(this._renderer.domElement);
		};
		const initialiseLabelRenderer = (): void => {
			this._labelRenderer = new CSS2DRenderer();
			this.labelRenderer.setSize(window.innerWidth, window.innerHeight);
			this.labelRenderer.domElement.style.position = "absolute";
			this.labelRenderer.domElement.style.top = "0px";
			this.labelRenderer.domElement.style.pointerEvents = "none";
			document.body.appendChild(this.labelRenderer.domElement);
		};
		const initialiseOrbitControls = (): void => {
			this._controls = new OrbitControls(this.camera, this._renderer.domElement);
			this._controls.enablePan = false;
			this._controls.dampingFactor = 0.4;
			this._controls.enableDamping = true;
			this._controls.update();
			this._controls.target.set(0, 0, 0);
		};
		const initialiseHDRI = (): void => {
			this._dataManager.getHDRI("./static/src/assets/HDR_multi_nebulae.hdr").then((hdri) => {
				if (hdri) hdri.mapping = EquirectangularReflectionMapping;
				this._scene.environment = hdri;
				this._scene.background = hdri;
			});
		};
		initialiseCamera();
		initialiseRenderer();
		initialiseLabelRenderer();
		initialiseOrbitControls();
		initialiseHDRI();
		// this.initialiseCamera();
		// this.initialiseRenderer();
		// this.initialiseLabelRenderer();
		// this.initialiseOrbitControls();
		// initialisedHelpers && this.initialisedHelpers()
	};
	// ====== INITIALISATION-END ======

	// ====== RENDER LOOP-START ======
	public render = (): void => {
		const animate = () => {
			requestAnimationFrame(animate);
			if (this._timeManager.isRunning()) {
				this._timeManager.updateClock();
				if (this._dataManager.isLoading) return;
				let delta = this._timeManager.absoluteDelta;

				if (delta > this.FRAME_RATE) delta = this.FRAME_RATE;
				this._timeManager.accumulator += delta;
				while (this._timeManager.accumulator >= this._timeManager.timeStep) {
					this._timeManager.advanceSimulatedDate(this._timeManager.scaledTimeStep);
					this.moveCameraWithFocused(this._timeManager.scaledTimeStep);
					this._solarSystem.simulate(this._timeManager.scaledTimeStep);
					this._timeManager.accumulator -= this._timeManager.timeStep;
				}
			} else {
				this.moveCameraWithFocused();
				this._solarSystem.updateDetail();
			}
			this.controls.update();
			this.labelRenderer.render(this.scene, this.camera);
			this._renderer.render(this.scene, this.camera);
		};

		window.addEventListener("resize", this.resize);
		animate();
	};
	// ====== RENDER LOOP-END ======

	set lerpDestination(lerpDistination: Vector3 | undefined) {
		this._lerpDestination = lerpDistination;
	}
	private moveCameraWithFocused = (dt: number = 0) => {
		if (!this.focusedCelestialBody) return;
		if (!this._lerpDestination) {
			if (this.focusedCelestialBody instanceof OrbitingBody) {
				this._camera.position.add(this.focusedCelestialBody.currentVelocity.clone().multiplyScalar(dt));
			}
		} else {
			this.controls.disconnect();
			if (this.focusedCelestialBody instanceof OrbitingBody) {
				this._lerpDestination.add(this.focusedCelestialBody.currentVelocity.clone().multiplyScalar(dt));
				this._camera.position.add(this.focusedCelestialBody.currentVelocity.clone().multiplyScalar(dt));
			}
			this._camera.position.lerp(this._lerpDestination, 0.05);
			if (this.camera.position.distanceTo(this._lerpDestination) <= this.focusedCelestialBody.physicalParameters.MeanRadius * 0.01) {
				this._lerpDestination = undefined;
				this.controls.connect(this._renderer.domElement);
			}
		}
	};
	private calculateLerpDestination = () => {
		let lerpDestination;
		if (!this.focusedCelestialBody) return;
		const focused = this.focusedCelestialBody;
		if (focused instanceof OrbitingBody) {
			lerpDestination = focused
				.primaryBody!.position.clone()
				.sub(focused.position.clone())
				.normalize()
				.multiplyScalar(focused.physicalParameters.MeanRadius * CelestialBodyDistance.CLOSE);
		} else {
			lerpDestination = focused.position.clone().setZ(focused.position.clone().z + focused.physicalParameters.MeanRadius * CelestialBodyDistance.CLOSE);
		}
		this.lerpDestination = focused.position.clone().add(lerpDestination);
	};

	set focusedCelestialBody(focusedCelestialBody: CelestialBody) {
		this._dataManager.getFocusedElements(focusedCelestialBody, focusedCelestialBody.secondaryBodyParameters);
		this.calculateLerpDestination();
	}
	get focusedCelestialBody(): CelestialBody | undefined {
		return this._dataManager.focusedCelestialBody;
	}
	get scene(): Scene {
		return this._scene;
	}
	get renderer(): WebGLRenderer {
		return this._renderer;
	}
	get controls(): OrbitControls {
		return this._controls;
	}
	get camera(): PerspectiveCamera {
		return this._camera;
	}
	get labelRenderer(): CSS2DRenderer {
		return this._labelRenderer;
	}
	get lerpDestination(): Vector3 | undefined {
		return this._lerpDestination;
	}
	private resize = () => {
		this._camera.aspect = window.innerWidth / window.innerHeight;
		this._camera.updateProjectionMatrix();
		this._renderer.setSize(window.innerWidth, window.innerHeight);
		this._labelRenderer.setSize(window.innerWidth, window.innerHeight);
	};
	public canSeeBody = (celestialBodyMesh: Object3D): boolean => {
		const allBodies: Object3D[] = this._solarSystem.allBodies
			.filter((body): body is Star | Planet | Moon => body instanceof Star || body instanceof Planet || body instanceof Moon)
			.map((body) => body.celestialBodyMesh);
		this._camera.updateMatrixWorld();
		this._frustum.setFromProjectionMatrix(new Matrix4().multiplyMatrices(this._camera.projectionMatrix, this._camera.matrixWorldInverse));

		const worldTargetPosition = celestialBodyMesh.getWorldPosition(new Vector3());
		if (!this._frustum.containsPoint(worldTargetPosition)) return false;

		const cameraPosition = new Vector3();
		this._camera.getWorldPosition(cameraPosition);

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

// private handleMouseDown = (event: MouseEvent) => {
//   this.mouseUpPosition.setX(event.clientX)
//   this.mouseUpPosition.setY(event.clientY)

// }
// private handleMouseUp = (event: MouseEvent) => {
//   this.mouseDownPosition.setX(event.clientX)
//   this.mouseDownPosition.setY(event.clientY)
//   console.log(this.mouseDownPosition.distanceTo(this.mouseUpPosition))
// }

// INITIALISERS
// private initialiseCamera = (): void => {
//   const { fov, aspectRatio, near, far } = this.cameraParameters;
//   this._camera = new PerspectiveCamera(fov, aspectRatio, near, far);
//   this._camera.position.z = 1000
// };
// private initialiseRenderer = (): void => {
//   this._renderer = new WebGLRenderer();
//   this._renderer.setSize(window.innerWidth, window.innerHeight);
//   document.body.appendChild(this._renderer.domElement)
// };
// private initialiseLabelRenderer = (): void => {
//   this._labelRenderer = new CSS2DRenderer();
//   this.labelRenderer.setSize(window.innerWidth, window.innerHeight);
//   this.labelRenderer.domElement.style.position = 'absolute';
//   this.labelRenderer.domElement.style.top = '0px'
//   this.labelRenderer.domElement.style.pointerEvents = 'none'
//   document.body.appendChild(this.labelRenderer.domElement)
// }
// private initialiseOrbitControls = (): void => {
//   this._controls = new OrbitControls(this.camera, this._renderer.domElement);
//   this.controls.dampingFactor = 0.04;
//   this.controls.enableDamping = true;
//   this.controls.update();
// };
// private initialisedHelpers = (): void => {
//   const size = 10000;
//   const divisions = 100;
//   const gridHelper = new GridHelper(size, divisions);
//   this.scene.add(gridHelper);
// };

// Need to fix/refactor render
// public render = (): void => {
// 	// const solarSystem = new SolarSystem();
// 	const currentClock = new Clock();
// 	const fps = 24;
// 	const FRAME_RATE = 1 / fps;
// 	// In game time
// 	let t = 0.0;
// 	let deltaTime = 0.0;
// 	const TIME_STEP = 0.1;
// 	const SCALED_TIME_STEP = TIME_STEP * TIME_SCALES[4];
// 	let accumulator = 0.0;
// 	let currentTime = performance.now() / 1000;
// 	// balls().timeScale = TIME_SCALES;
// 	const animate = () => {
// 		requestAnimationFrame(animate);
// 		if (this._dataManager.isLoading) return;
// 		let newTime = performance.now() / 1000;
// 		let frameTime = newTime - currentTime;
// 		if (frameTime >= FRAME_RATE) frameTime = FRAME_RATE;
// 		currentTime = newTime;
// 		accumulator += frameTime;
// 		deltaTime += currentClock.getDelta();
// 		if (deltaTime >= FRAME_RATE) {
// 			while (accumulator >= TIME_STEP) {
// 				this.moveCameraWithFocused(SCALED_TIME_STEP);
// 				this._solarSystem.simulate(SCALED_TIME_STEP);

// 				t += SCALED_TIME_STEP;
// 				accumulator -= TIME_STEP;
// 			}
// 			deltaTime -= FRAME_RATE;
// 		}
// 		this.controls.update();
// 		this.labelRenderer.render(this.scene, this.camera);
// 		this._renderer.render(this.scene, this.camera);
// 	};
// 	window.addEventListener("resize", this.resize);

// 	animate();
// };

// if (!hasHandledSolarSystemLoad) {
//   solarSystem.initialiseSolarSystem(this._data.solarSystemParameters);
//   hasHandledSolarSystemLoad = true;
//   uiManager().hideLoadScreen();
//   // uiManager().hideSpinner();
// }
// if (
//   this._focusedCelestialBody &&
//   this._data._focusedPlanetsMoons &&
//   !this.hasHandledFocusedBodyMoonLoad
// ) {
//   this._focusedCelestialBody.initialiseSecondaryBodies(
//     undefined,
//     this._data._focusedPlanetsMoons
//   );
//   this._data._focusedPlanetsMoons = undefined;
//   this.hasHandledFocusedBodyMoonLoad = true;
// }

import {
  Scene,
  WebGLRenderer,
  PerspectiveCamera,
  Clock,
  Vector3,
  Vector2,
  GridHelper,
  AxesHelper,
  Object3D,
  EquirectangularReflectionMapping,
} from "three";
import {
  OrbitControls,
  CSS2DRenderer,
  CSS2DObject,
} from "three/examples/jsm/Addons.js";
import { TIME_SCALE, CelestialBodyDistance } from "../utils/constants";
import DataService from "../services/DataService";
import {
  SolarSystem,
  CelestialBody,
  OrbitingBody,
  Star,
  Planet,
  Moon,
} from "../models";
interface CameraParameters {
  fov: number;
  aspectRatio: number;
  near: number;
  far: number;
}
import { dataManager, uiManager, clock as balls } from ".";

interface GridParameters {
  size: number;
  divisions: number;
}
interface OrbitControlsParameters {
  dampingFactor: number;
  enableDamping: boolean;
}
export default class App {
  // Replace with a DataManager!!
  private _data: DataService = new DataService();

  // Core threejs variables
  private _scene!: Scene;
  private _camera!: PerspectiveCamera;
  private _renderer!: WebGLRenderer;
  private _labelRenderer!: CSS2DRenderer;
  private _controls!: OrbitControls;

  // Lerp destination
  private _lerpDestination?: Vector3;

  // Variables for focused body
  private _focusedCelestialBody?: CelestialBody;
  private _focusedBodyInformation!: CSS2DObject;
  // Do i need this?
  private cameraParameters: CameraParameters = {
    fov: 75,
    aspectRatio: window.innerWidth / window.innerHeight,
    near: 0.00001,
    far: Number.MAX_SAFE_INTEGER,
  };
  constructor(
    initialisedHelpers: boolean = true,
    cameraParameters?: CameraParameters
  ) {
    this.cameraParameters = cameraParameters
      ? cameraParameters
      : this.cameraParameters;
    this.initialise(initialisedHelpers);
    // this.initialiseFocusedBodyCSS();
    dataManager()
      .onLoad()
      .then(() => {
        console.log(dataManager().fetchedOrbitalParameters);
        console.log(dataManager().fetchedPhysicalParameters);
      });
  }

  // ====== INITIALISATION-START ======
  private initialise = (initialisedHelpers: boolean): void => {
    this._scene = new Scene();
    // Object3D.DEFAULT_UP = new Vector3(0, 0, 1);
    const initialiseCamera = (): void => {
      const { fov, aspectRatio, near, far } = this.cameraParameters;
      this._camera = new PerspectiveCamera(fov, aspectRatio, near, far);
      // this._camera.up.set(0, 0, 1)
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
      this._controls = new OrbitControls(
        this.camera,
        this._renderer.domElement
      );
      this._controls.enablePan = false;
      this._controls.dampingFactor = 0.4;
      this._controls.enableDamping = true;
      this._controls.update();
      this._controls.target.set(0, 0, 0);
    };
    const initialiseHelpers = (): void => {
      // const axes = new AxesHelper(10);
      // const size = 100000;
      // const divisions = 10000;
      // const gridHelper = new GridHelper(size, divisions);
      // this.scene.add(gridHelper);
      // this.scene.add(axes);
    };
    const initialiseHDRI = (): void => {
      dataManager()
        .getHDRI("./static/src/assets/HDR_multi_nebulae.hdr")
        .then((hdri) => {
          if (hdri) hdri.mapping = EquirectangularReflectionMapping;
          this._scene.environment = hdri;
          this._scene.background = hdri;
        });
      // if (hdri) hdri.mapping = EquirectangularReflectionMapping;
      // this._scene.environment = hdri;
      // this._scene.background = hdri;
    };
    initialiseHelpers();
    initialiseCamera();
    initialiseRenderer();
    initialiseLabelRenderer();
    initialiseOrbitControls();
    initialiseHDRI();
    initialisedHelpers && initialiseHelpers();
    // this.initialiseCamera();
    // this.initialiseRenderer();
    // this.initialiseLabelRenderer();
    // this.initialiseOrbitControls();
    // initialisedHelpers && this.initialisedHelpers()
  };
  // ====== INITIALISATION-END ======

  // ====== RENDER LOOP-START ======
  private hasHandledFocusedBodyMoonLoad = false;

  // Need to fix/refactor render
  public render = (): void => {
    const solarSystem = new SolarSystem();
    const currentClock = new Clock();
    const fps = 24;
    const FRAME_RATE = 1 / fps;
    // In game time
    let t = 0.0;
    let deltaTime = 0.0;
    const TIME_STEP = 0.1;
    const SCALED_TIME_STEP = TIME_STEP * TIME_SCALE;
    let accumulator = 0.0;
    let currentTime = performance.now() / 1000;
    let hasHandledSolarSystemLoad = false;
    balls().timeScale = TIME_SCALE;
    const time = document.querySelector(".time") as HTMLElement;
    const date = document.querySelector(".date") as HTMLElement;
    const animate = () => {
      // If loading Showing loading screen (initial or spinner and halt animation/simulation)
      // Else animate
      requestAnimationFrame(animate);

      if (!this._data.hasFinishedLoading()) {
        this._data.loadingStatus();
        console.log("Loading screen");
      } else if (this._data.hasFinishedLoading()) {
        if (!hasHandledSolarSystemLoad) {
          solarSystem.initialiseSolarSystem(this._data.solarSystemParameters);
          hasHandledSolarSystemLoad = true;
          uiManager().hideLoadScreen();
          // uiManager().hideSpinner();
        }
        if (
          this._focusedCelestialBody &&
          this._data._focusedPlanetsMoons &&
          !this.hasHandledFocusedBodyMoonLoad
        ) {
          this._focusedCelestialBody.initialiseSecondaryBodies(
            undefined,
            this._data._focusedPlanetsMoons
          );
          this._data._focusedPlanetsMoons = undefined;
          this.hasHandledFocusedBodyMoonLoad = true;
        }

        let newTime = performance.now() / 1000;
        let frameTime = newTime - currentTime;
        if (frameTime >= FRAME_RATE) frameTime = FRAME_RATE;
        currentTime = newTime;
        accumulator += frameTime;
        deltaTime += currentClock.getDelta();
        if (deltaTime >= FRAME_RATE) {
          while (accumulator >= TIME_STEP) {
            // console.log(t);
            balls().update();
            // time.textContent = balls().formattedTime();
            // date.textContent = balls().formattedDate();
            // console.log(balls().simulatedDate);
            this.moveCameraWithFocused(SCALED_TIME_STEP);
            solarSystem.simulate(SCALED_TIME_STEP);

            t += SCALED_TIME_STEP;
            accumulator -= TIME_STEP;
          }
          deltaTime -= FRAME_RATE;
        }
        this.controls.update();
        this.labelRenderer.render(this.scene, this.camera);
      }
      this._renderer.render(this.scene, this.camera);
    };
    window.addEventListener("resize", this.resize);

    animate();
  };
  // ====== RENDER LOOP-END ======

  set lerpDestination(lerpDistination: Vector3 | undefined) {
    this._lerpDestination = lerpDistination;
  }
  private moveCameraWithFocused = (dt: number) => {
    if (!this._focusedCelestialBody) return;
    if (!this._lerpDestination) {
      if (this._focusedCelestialBody instanceof OrbitingBody) {
        this._camera.position.add(
          this._focusedCelestialBody.currentVelocity.clone().multiplyScalar(dt)
        );
      }
    } else {
      this.controls.disconnect();
      if (this._focusedCelestialBody instanceof OrbitingBody) {
        this._lerpDestination.add(
          this._focusedCelestialBody.currentVelocity.clone().multiplyScalar(dt)
        );
        this._camera.position.add(
          this._focusedCelestialBody.currentVelocity.clone().multiplyScalar(dt)
        );
      }
      this._camera.position.lerp(this._lerpDestination, 0.1); // Maybe use radius and Distance
      if (
        this.camera.position.distanceTo(this._lerpDestination) <=
        this._focusedCelestialBody.physicalParameters.MeanRadius * 0.01
      ) {
        this._lerpDestination = undefined;
        this.controls.connect(this._renderer.domElement);
      }
    }
  };
  private calculateLerpDestination = () => {
    let lerpDestination;
    if (!this._focusedCelestialBody) return;
    const focused = this._focusedCelestialBody;
    if (focused instanceof OrbitingBody) {
      lerpDestination = focused
        .primaryBody!.position.clone()
        .sub(focused.position.clone())
        .normalize()
        .multiplyScalar(
          focused.physicalParameters.MeanRadius * CelestialBodyDistance.CLOSE
        );
    } else {
      lerpDestination = focused.position
        .clone()
        .setZ(
          focused.position.clone().z +
            focused.physicalParameters.MeanRadius * CelestialBodyDistance.CLOSE
        );
    }
    this.lerpDestination = focused.position.clone().add(lerpDestination);
  };

  // FIX
  set focusedCelestialBody(focusedCelestialBody: CelestialBody) {
    if (this._focusedCelestialBody == focusedCelestialBody) return;
    let shouldDestroy = false;
    let shouldLoad = this._focusedCelestialBody ? false : true;
    if (this._focusedCelestialBody) {
      if (focusedCelestialBody instanceof Star) {
        if (this._focusedCelestialBody instanceof Star) {
          // Not possible
        } else if (this._focusedCelestialBody instanceof Planet) {
          shouldLoad = true;
          // Load moons
        } else if (this._focusedCelestialBody instanceof Moon) {
          // Not possible
        }
      } else if (focusedCelestialBody instanceof Planet) {
        if (this._focusedCelestialBody instanceof Star) {
          // Remove current planets moons
          shouldLoad = true;
        } else if (this._focusedCelestialBody instanceof Planet) {
          shouldDestroy = true;
          shouldLoad = true;
          // Remove current planets moons, load other planets moons
        } else if (this._focusedCelestialBody instanceof Moon) {
          shouldDestroy = true;
          shouldLoad = true;
          // Remove current primarys moons, load other planets moons
        }
      } else if (focusedCelestialBody instanceof Moon) {
        if (this._focusedCelestialBody instanceof Star) {
          shouldDestroy = true;
          // Remove parent planets moons
        } else if (this._focusedCelestialBody instanceof Planet) {
          // Do nothing
        } else if (this._focusedCelestialBody instanceof Moon) {
          // Do nothing
        }
      }
    }
    if (shouldDestroy) {
      if (this._focusedCelestialBody) {
        if (this._focusedCelestialBody.secondaryBodies) {
          console.log(this._focusedCelestialBody.secondaryBodies);
          this._focusedCelestialBody.destroySecondaries();
        }
      }
    }
    if (shouldLoad) {
      const secondaryBodyNames =
        focusedCelestialBody.secondaryBodyParameters?.map(
          (secondaryBodyParameter) =>
            secondaryBodyParameter.MetaData.EnglishName
        );
      if (secondaryBodyNames) {
        this._data.fetchFocusedPlanetsMoonData(
          focusedCelestialBody.metadata.EnglishName,
          secondaryBodyNames
        );
        console.log(
          `Loading ${secondaryBodyNames.length} moons for ${focusedCelestialBody.metadata.EnglishName}`
        );
      }
    }
    // if (focusedCelestialBody.primaryBody) {
    //   // focusedCelestialBody.destroySecondaries();
    //   // Maybe pass entire array to DataService to process everything
    // }
    this._focusedCelestialBody = focusedCelestialBody;
    this._controls.target = this._focusedCelestialBody.position;
    // const secondaryBodyNames = focusedCelestialBody.secondaryBodyParameters?.map((secondaryBodyParameter) => secondaryBodyParameter.MetaData.EnglishName);
    // if (secondaryBodyNames) {
    //   this._data.fetchFocusedPlanetsMoonData(focusedCelestialBody.metadata.EnglishName, secondaryBodyNames);
    // }
    this.hasHandledFocusedBodyMoonLoad = false;
    this._data
      .fetchCelestialBodyExtract(
        this._focusedCelestialBody.metadata.EnglishName,
        this._focusedCelestialBody.metadata.BodyType
      )
      .then((value) =>
        uiManager().updateBodyInformation(
          this._focusedCelestialBody!,
          value.summary
        )
      );
    this.calculateLerpDestination();
    // this.hideFocusedInformation();
  }

  get focusedCelestialBody(): CelestialBody | undefined {
    return this._focusedCelestialBody;
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
  get data() {
    return this._data;
  }
  private resize = () => {
    this._camera.aspect = window.innerWidth / window.innerHeight;
    this._camera.updateProjectionMatrix();
    this._renderer.setSize(window.innerWidth, window.innerHeight);
    this._labelRenderer.setSize(window.innerWidth, window.innerHeight);
  };

  // Maybe don't need
  // private initialiseFocusedBodyCSS = () => {
  //   const containerElement = document.createElement("div");
  //   containerElement.className = `orbital-information orbital-information--hidden`;
  //   this._focusedBodyVelocityElement = document.createElement("span");
  //   this._focusedBodyDistanceElement = document.createElement("span");
  //   containerElement.append(this._focusedBodyVelocityElement, this._focusedBodyDistanceElement);
  //   this._focusedBodyInformation = new CSS2DObject(containerElement);
  //   document.body.append(containerElement);
  // };

  // // FIgure this out
  // private showFocusedInformation = () => {
  //   if (!this._focusedBodyInformation.element.classList.contains("orbital-information--hidden")) return;
  //   this._focusedBodyInformation.element.classList.remove("orbital-information--hidden");
  // };
  // private hideFocusedInformation = () => {
  //   if (this._focusedBodyInformation.element.classList.contains("orbital-information--hidden")) return;
  //   this._focusedBodyInformation.element.classList.add("orbital-information--hidden");
  // };
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

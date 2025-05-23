import {
  TextureLoader,
  BufferGeometry,
  MeshPhongMaterial,
  Mesh,
  IcosahedronGeometry,
  MeshStandardMaterial,
  AdditiveBlending,
  MeshBasicMaterial,
  RingGeometry,
  DoubleSide,
  Vector3,
  ShaderMaterial,
} from "three";
import IMeshProvider from "../interfaces/IMeshProvider";
import { PlanetParameters, PlanetPhysicalParameters, TextureParameters } from "../types";
import { CelestialBodyDetail, CelestialBodyDistance, SCALE } from "../utils/constants";
import { CelestialBody, OrbitingBody } from ".";
import { app, assetManager } from "../core";
import { getFresnelMat, getRingMat } from "../shaders";
export default class Planet extends OrbitingBody<PlanetParameters> implements IMeshProvider {
  private _loader: TextureLoader = new TextureLoader();
  private _celestialBodyGeometry!: BufferGeometry;
  private _celestialBodyMaterial!: MeshPhongMaterial;
  private _meshDetail: CelestialBodyDetail = CelestialBodyDetail.LOW;
  private _textures: TextureParameters;

  private _celestialBodyMesh!: Mesh;
  private _glowMesh!: Mesh;
  private _lightMesh?: Mesh;
  private _cloudMesh?: Mesh;

  constructor(planetParameters: PlanetParameters, primaryBody: CelestialBody) {
    super(planetParameters, primaryBody, planetParameters.SecondaryBodyParameters);
    this._textures = planetParameters.Texture;
    this.initialiseBaseMesh();
    this.addGlowMesh();
    this.addCloudMesh();
    this.addLightingMesh();
    this.initialiseRing();
    this.initialiseOrbitalPlane();
    // this.initialiseOrbit();

    this.addToScene();
  }

  // Getters

  get loader(): TextureLoader {
    return this._loader;
  }
  get meshDetail(): CelestialBodyDetail {
    return this._meshDetail;
  }
  get celestialBodyGeometry(): BufferGeometry {
    return this._celestialBodyGeometry;
  }
  get celestialBodyMaterial(): MeshPhongMaterial {
    return this._celestialBodyMaterial;
  }
  get celestialBodyMesh(): Mesh {
    return this._celestialBodyMesh;
  }
  get glowMesh(): Mesh {
    return this._glowMesh;
  }
  get lightMesh(): Mesh | undefined {
    return this._lightMesh;
  }
  get cloudMesh(): Mesh | undefined {
    return this._cloudMesh;
  }
  get textures(): TextureParameters {
    return this._textures;
  }
  get physicalParameters(): PlanetPhysicalParameters {
    return this._physicalParameters;
  }
  async initialiseRing() {
    // Move the vertex and fragment shaders to separate .glsl.ts or .ts files and import them to clean up initialiseRing().
    if (!this._physicalParameters.RingSystem) return;
    const inner = this._physicalParameters.InnerRingRadius! * 1000 * SCALE;
    const outer = this._physicalParameters.OuterRingRadius! * 1000 * SCALE;
    const [ringTexture, alphaTexture] = await Promise.all([
      assetManager().loadTexure(this._textures.Ring),
      assetManager().loadTexure(this._textures.RingAlpha),
    ]);
    const geometry = new RingGeometry(inner, outer, 64);
    geometry.rotateX(-Math.PI / 2);
    const material = getRingMat(ringTexture, alphaTexture, inner, outer);
    const mesh = new Mesh(geometry, material);
    this._celestialBodyGroup.add(mesh);
  }
  public updatePosition = (dt: number): void => {
    this.rotateOnAxis(dt);
    const newVelocity = this._currentVelocity.clone().multiplyScalar(dt);
    this._celestialBodyGroup.position.add(newVelocity);
    this._orbitGroup.position.copy(this._celestialBodyGroup.position);
    // this._orbitGroup.position.add(newVelocity)
    this._position = this._celestialBodyGroup.position;
    if (this._secondaryBodies) {
      this._secondaryBodies.forEach((secondaryBody) => secondaryBody.updatePosition(dt));
    }
    this.updateDetail();
  };

  // MeshProvider interface functions
  public rotateOnAxis = (dt: number): void => {
    if (!this._celestialBodyMesh) return;
    const rotationSpeed = (2 * Math.PI) / this._physicalParameters.SideralRotation;
    // const rotationSpeed = (2 * Math.PI) / (this.celestialBodyParameters.RotationPeriod * TIME_SCALE);
    const deltaRotation = rotationSpeed * dt;
    const y = new Vector3(0, 1, 0);
    // this._celestialBodyGroup.rotateOnAxis(y, deltaRotation);
    this._celestialBodyMesh?.rotateOnAxis(y, deltaRotation);
    this._glowMesh?.rotateOnAxis(y, deltaRotation);
    this._lightMesh?.rotateOnAxis(y, deltaRotation);
    this._cloudMesh?.rotateOnAxis(y, deltaRotation * 1.001);
    this._cloudMesh?.rotateOnAxis(y, deltaRotation * 1.001);

    // this._celestialBodyGroup.rotation.y += deltaRotation;
    // if (this._lightMesh) this._lightMesh.rotateOnAxis(y, deltaRotation);
    // if (this._cloudMesh) this._cloudMesh.rotateOnAxis(y, deltaRotation * 1.001);
    // if (this.secondaryBodies) {
    //   this.secondaryBodies.forEach((secondaryBody) => {
    //     secondaryBody.orbit(elapsedTime);
    //   });
    // }
  };
  public initialiseOrbitalPlane = (): void => {
    this._celestialBodyGroup.rotateOnAxis(new Vector3(-1, 0, 0), this._physicalParameters.AxialTilt);
  };
  // public initialiseOrbit = (): void => {
  //   // const { x, y, z } = this._orbitingBodyParameters.Position;
  //   // this._celestialBodyGroup.position.set(x, y, z);
  //   this._celestialBodyGroup.position.copy(this._orbitingBodyParameters.Position);
  //   this._position = this._orbitingBodyParameters.Position;
  //   const { x, y, z } = this._orbitingBodyParameters.Velocity;
  //   const orbitalVelocity = new Vector3(x, z, y);
  //   if (this._primaryBody instanceof OrbitingBody) {
  //     this._currentVelocity = orbitalVelocity.add(this._primaryBody.currentVelocity);
  //   } else {
  //     this._currentVelocity = orbitalVelocity;
  //   }
  //   // this._currentVelocity = this._orbitingBodyParameters.Velocity;
  //   this._currentVelocity = this._currentVelocity.applyQuaternion(this._celestialBodyGroup.quaternion);
  // };
  public initialiseBaseMesh = async (): Promise<void> => {
    this._celestialBodyGeometry = new IcosahedronGeometry(this._physicalParameters.MeanRadius, this._meshDetail);
    this._celestialBodyMaterial = new MeshPhongMaterial({
      // map: this.loader.load(this._textures.Map),
      map: await assetManager().loadTexure(this._textures.Map),
    });
    this.celestialBodyMaterial.specularMap = await assetManager().loadTexure(this._textures.Specular);
    this._celestialBodyMesh = new Mesh(this._celestialBodyGeometry, this._celestialBodyMaterial);
    this._celestialBodyGroup.add(this._celestialBodyMesh);
  };
  private initialiseTextures = async (): Promise<void> => {
    (this.celestialBodyMaterial.map = await assetManager().loadTexure(this._textures.Map)),
      (this.celestialBodyMaterial.specularMap = await assetManager().loadTexure(this._textures.Specular));
  };
  public addGlowMesh = (): void => {
    this._glowMesh = new Mesh(this._celestialBodyGeometry, getFresnelMat());
    this._glowMesh.scale.setScalar(1.01);
    this._celestialBodyGroup.add(this._glowMesh);
  };
  public addLightingMesh = async (): Promise<void> => {
    if (!this.textures.Light) return;
    const lightMaterial = new MeshBasicMaterial({
      map: await assetManager().loadTexure(this.textures.Light),
      blending: AdditiveBlending,
      transparent: true,
      opacity: 0.6,
    });
    this._lightMesh = new Mesh(this.celestialBodyGeometry, lightMaterial);
    this._celestialBodyGroup.add(this._lightMesh);
  };
  public addCloudMesh = async (): Promise<void> => {
    if (!this.textures.Cloud) return;
    const cloudMaterial = new MeshStandardMaterial({
      map: await assetManager().loadTexure(this.textures.Cloud),
      // transparent: true,
      // opacity: 0.8,
      blending: AdditiveBlending,
    });
    this._cloudMesh = new Mesh(this.celestialBodyGeometry, cloudMaterial);
    this._cloudMesh.scale.setScalar(1.005);
    this._celestialBodyGroup.add(this._cloudMesh);
  };

  // Test
  private _geometryCache: Partial<Record<CelestialBodyDetail, BufferGeometry>> = {};
  private getGeometryForDetail(detail: CelestialBodyDetail) {
    if (!this._geometryCache[detail]) {
      this._geometryCache[detail] = new IcosahedronGeometry(this._physicalParameters.MeanRadius, detail);
    }
    return this._geometryCache[detail];
  }
  public updateDetail = (): void => {
    if (!this._celestialBodyMesh) return;
    // Add cooldown .. or add caching
    const distance = app().camera.position.distanceTo(this._position);
    const oldDetail = this._meshDetail;
    const radius = this._physicalParameters.MeanRadius;
    if (distance < radius * CelestialBodyDistance.CLOSE) {
      this._meshDetail = CelestialBodyDetail.HIGH;
    } else if (distance < radius * CelestialBodyDistance.MEDIUM) {
      this._meshDetail = CelestialBodyDetail.MEDIUM;
    } else if (distance < radius * CelestialBodyDistance.FAR) {
      this._meshDetail = CelestialBodyDetail.LOW;
    } else {
      this._meshDetail = CelestialBodyDetail.NONE;
    }
    if (oldDetail != this._meshDetail) {
      this._celestialBodyMesh.visible = Boolean(this._meshDetail);
      if (this._meshDetail == CelestialBodyDetail.NONE) return;
      const baseGeometry = this.getGeometryForDetail(this._meshDetail);
      this._celestialBodyMesh.geometry.dispose();
      this._celestialBodyMesh.geometry = baseGeometry.clone();
      this._glowMesh.geometry.dispose();
      this._glowMesh.geometry = baseGeometry.clone();
      if (this._lightMesh) {
        this._lightMesh.geometry.dispose();
        this._lightMesh.geometry = baseGeometry.clone();
      }
      if (this._cloudMesh) {
        this._cloudMesh.geometry.dispose();
        this._cloudMesh.geometry = baseGeometry.clone();
      }
    }
  };
}

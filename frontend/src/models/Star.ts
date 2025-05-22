import {
  BufferGeometry,
  Camera,
  Color,
  DoubleSide,
  IcosahedronGeometry,
  Mesh,
  MeshBasicMaterial,
  MeshPhongMaterial,
  PointLight,
  RingGeometry,
  TextureLoader,
  Vector3,
} from "three";
import IMeshProvider from "../interfaces/IMeshProvider";
import { OrbitingBodyParameters, StarParameters, StarPhysicalParameters, TextureParameters } from "../types";
import { CelestialBody } from ".";
import { CelestialBodyDetail, CelestialBodyDistance } from "../utils/constants";
import { getFresnelMat } from "../shaders";
import { app, assetManager } from "../core";

// NEED TO FIX TEXTURING
export default class Star extends CelestialBody<StarParameters> implements IMeshProvider {
  private _loader: TextureLoader = new TextureLoader();
  private _celestialBodyGeometry!: BufferGeometry;
  private _celestialBodyMaterial!: MeshPhongMaterial;
  private _meshDetail: CelestialBodyDetail = CelestialBodyDetail.LOW;
  private _textures: TextureParameters;

  private _celestialBodyMesh!: Mesh;
  private _glowMesh!: Mesh;

  private _primaryLight!: PointLight;
  constructor(starParameters: StarParameters, secondaryBodyParameters?: OrbitingBodyParameters[]) {
    super(starParameters, secondaryBodyParameters);
    this._textures = starParameters.Texture;
    this.initialiseBaseMesh();
    this.addGlowMesh();
    this.initialiseOrbitalPlane();
    this.addLight();
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
  get textures(): TextureParameters {
    return this._textures;
  }
  get physicalParameters(): StarPhysicalParameters {
    return this._physicalParameters;
  }

  public rotateOnAxis = (dt: number): void => {
    // const rotationSpeed = (2 * Math.PI) / this._physicalParameters.SideralRotation;
    // // const rotationSpeed = (2 * Math.PI) / (this.celestialBodyParameters.RotationPeriod * TIME_SCALE);
    // const deltaRotation = rotationSpeed * dt;
    // this._celestialBodyGroup.rotation.y += deltaRotation;
    // if (this.secondaryBodyParameters) {
    //   this.secondaryBodyParameters.forEach((secondaryBody) => {
    //     secondaryBody.orbit(elapsedTime);
    //   });
    // }
  };
  public initialiseOrbitalPlane = (): void => {
    this._celestialBodyGroup.rotateOnAxis(new Vector3(1, 0, 0), this._physicalParameters.AxialTilt);

    // this._celestialBodyGroup.rotation.x = this._physicalParameters.AxialTilt;
  };
  public initialiseBaseMesh = (): void => {
    // this._celestialBodyGeometry = new IcosahedronGeometry(this._physicalParameters.MeanRadius * 150, this._meshDetail);
    // this._celestialBodyMaterial = new MeshPhongMaterial({ map: this._loader.load(this._textures.Map)})
    // this._celestialBodyMaterial.specularMap = this._textures.Specular ? this._loader.load(this._textures.Specular) : null
    // this._celestialBodyMaterial.bumpMap =  this._textures.Bump ? this._loader.load(this._textures.Bump) : null
    // this._celestialBodyMaterial.displacementMap = this._textures.Bump ? this._loader.load(this._textures.Bump) : null
    // this._celestialBodyMaterial.bumpScale =  0.04
    // this._celestialBodyMaterial.displacementScale =  0.004
    // this.initialiseOrbitalPlane();
    this._celestialBodyGeometry = new IcosahedronGeometry(this._physicalParameters.MeanRadius, this._meshDetail);
    this._celestialBodyMaterial = new MeshPhongMaterial({
      map: this.loader.load(this._textures.Map),
    });
    this.celestialBodyMaterial.specularMap = this._textures.Specular ? this.loader.load(this._textures.Specular) : null;
    // this._celestialBodyMaterial.bumpMap =  this._textures.Bump ? this._loader.load(this._textures.Bump) : null
    // this._celestialBodyMaterial.displacementMap = this._textures.Bump ? this._loader.load(this._textures.Bump) : null
    // this._celestialBodyMaterial.bumpScale =  0.04
    // this._celestialBodyMaterial.displacementScale =  0.004
    this._celestialBodyMesh = new Mesh(this._celestialBodyGeometry, this._celestialBodyMaterial);
    this._celestialBodyGroup.add(this._celestialBodyMesh);
  };
  public addGlowMesh = (): void => {
    this._glowMesh = new Mesh(this._celestialBodyGeometry, getFresnelMat());
    this._glowMesh.scale.setScalar(1.01);
    this._celestialBodyGroup.add(this._glowMesh);
  };
  private _geometryCache: Partial<Record<CelestialBodyDetail, BufferGeometry>> = {};
  private getGeometryForDetail(detail: CelestialBodyDetail) {
    if (!this._geometryCache[detail]) {
      this._geometryCache[detail] = new IcosahedronGeometry(this._physicalParameters.MeanRadius, detail);
    }
    return this._geometryCache[detail];
  }
  public updateDetail = (): void => {
    // Add cooldown .. or add caching
    const distance = app().camera.position.distanceTo(this._position);
    const oldDetail = this._meshDetail;
    const radius = this._physicalParameters.MeanRadius;
    if (distance < radius * CelestialBodyDistance.CLOSE) {
      this._meshDetail = CelestialBodyDetail.HIGH;
    } else if (distance < radius * CelestialBodyDistance.MEDIUM) {
      this._meshDetail = CelestialBodyDetail.MEDIUM;
    } else {
      this._meshDetail = CelestialBodyDetail.LOW;
    }
    if (oldDetail != this._meshDetail) {
      const baseGeometry = this.getGeometryForDetail(this._meshDetail);
      this._celestialBodyMesh.geometry.dispose();
      this._celestialBodyMesh.geometry = baseGeometry.clone();
    }
  };
  private addLight = () => {
    // this.primaryLight = new PointLight(0xffffff, 2, this.sunParameters.SurfaceEmission, 0);
    this._primaryLight = new PointLight(0xffffff, 2, 1000000000000, 0);
    this._celestialBodyMaterial.emissiveMap = this.loader.load(this._textures.Map);
    this._celestialBodyMaterial.emissiveIntensity = this._physicalParameters.SurfaceEmission;
    // this.primaryLight = new PointLight(0xffffff, 2, 10000000000000, 0);
    // this.primaryLight.position.copy(
    //   this.primaryBody.celestialBodyGroup.position
    // );
    this._celestialBodyMaterial.emissiveMap = this.loader.load(this.textures.Map);
    this._celestialBodyMaterial.emissive = new Color(0xffff00);
    this._celestialBodyMaterial.emissiveIntensity = 1;
    this._celestialBodyGroup.add(this._primaryLight);
  };
}

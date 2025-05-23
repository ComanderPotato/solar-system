import { BufferGeometry, Camera, IcosahedronGeometry, Mesh, MeshPhongMaterial, TextureLoader, Vector3 } from "three";
import IMeshProvider from "../interfaces/IMeshProvider";
import { MoonParameters, MoonPhysicalParameters, TextureParameters } from "../types";
import { CelestialBody, OrbitingBody } from ".";
import { CelestialBodyDetail, CelestialBodyDistance } from "../utils/constants";
import { getFresnelMat } from "../shaders";
import { app, assetManager } from "../core";
export default class Moon extends OrbitingBody<MoonParameters> implements IMeshProvider {
  private _loader: TextureLoader = new TextureLoader();
  private _celestialBodyGeometry!: BufferGeometry;
  private _celestialBodyMaterial!: MeshPhongMaterial;
  private _celestialBodyMesh!: Mesh;
  private _meshDetail: CelestialBodyDetail = CelestialBodyDetail.LOW;
  // private _glowMesh!: Mesh;
  private _textures: TextureParameters;
  constructor(moonParameters: MoonParameters, primaryBody: CelestialBody) {
    super(moonParameters, primaryBody, moonParameters.SecondaryBodyParameters);
    this._textures = moonParameters.Texture;
    this.initialiseBaseMesh();
    // this.addGlowMesh();
    this.initialiseOrbitalPlane();
    // this.initialiseOrbit();
    this.addToScene();
    // console.log(this);
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
  // get glowMesh(): Mesh {
  //   return this._glowMesh;
  // }
  get textures(): TextureParameters {
    return this._textures;
  }
  get physicalParameters(): MoonPhysicalParameters {
    return this._physicalParameters;
  }

  // rotateOnAxis(dt: number): void {
  //   // const rotationSpeed = (2 * Math.PI) / this._physicalParameters.SideralRotation;
  //   // // const rotationSpeed = (2 * Math.PI) / (this.celestialBodyParameters.RotationPeriod * TIME_SCALE);
  //   // const deltaRotation = rotationSpeed * dt;
  //   // this._celestialBodyGroup.rotation.y += deltaRotation;
  //   // if (this.secondaryBodies) {
  //   //   this.secondaryBodies.forEach((secondaryBody) => {
  //   //     secondaryBody.orbit(elapsedTime);
  //   //   });
  //   // }
  // }
  public rotateOnAxis = (dt: number): void => {
    if (!this._celestialBodyMesh) return;
    const rotationSpeed = (2 * Math.PI) / this._physicalParameters.SideralRotation;
    // const rotationSpeed = (2 * Math.PI) / (this.celestialBodyParameters.RotationPeriod * TIME_SCALE);
    const deltaRotation = rotationSpeed * dt;
    const y = new Vector3(0, 1, 0);
    // this._celestialBodyGroup.rotateOnAxis(y, deltaRotation);
    this._celestialBodyMesh?.rotateOnAxis(y, deltaRotation);
    // this._glowMesh?.rotateOnAxis(y, deltaRotation);
    // this._lightMesh?.rotateOnAxis(y, deltaRotation);
    // this._cloudMesh?.rotateOnAxis(y, deltaRotation * 1.001);
    // this._cloudMesh?.rotateOnAxis(y, deltaRotation * 1.001);

    // this._celestialBodyGroup.rotation.y += deltaRotation;
    // if (this._lightMesh) this._lightMesh.rotateOnAxis(y, deltaRotation);
    // if (this._cloudMesh) this._cloudMesh.rotateOnAxis(y, deltaRotation * 1.001);
    // if (this.secondaryBodies) {
    //   this.secondaryBodies.forEach((secondaryBody) => {
    //     secondaryBody.orbit(elapsedTime);
    //   });
    // }
  };
  initialiseOrbitalPlane(): void {
    this._celestialBodyGroup.rotateOnAxis(new Vector3(1, 0, 0), this._physicalParameters.AxialTilt);
  }
  // initialiseOrbit(): void {
  //   const { x, y, z } = this._orbitingBodyParameters.Position;
  //   this._celestialBodyGroup.position.set(x, y, z);
  //   this._position = this._orbitingBodyParameters.Position;
  //   this._currentVelocity = this._orbitingBodyParameters.Velocity;
  //   // this._currentVelocity = this._currentVelocity.applyQuaternion(this._celestialBodyGroup.quaternion);
  // }
  // updatePosition(dt: number): void {
  //   this.rotateOnAxis(dt);
  //   const newVelocity = this._currentVelocity.clone().multiplyScalar(dt);
  //   const quaternion = new Quaternion().setFromEuler(this._celestialBodyGroup.rotation);

  //   newVelocity.applyQuaternion(quaternion);
  //   this._celestialBodyGroup.position.add(newVelocity);
  //   this._position = this._celestialBodyGroup.position;
  // }
  public updatePosition = (dt: number): void => {
    // return
    this.rotateOnAxis(dt);
    const newVelocity = this._currentVelocity.clone().multiplyScalar(dt);
    this._celestialBodyGroup.position.add(newVelocity);
    this._position = this._celestialBodyGroup.position;
    if (this._secondaryBodies) {
      this._secondaryBodies.forEach((secondaryBody) => secondaryBody.updatePosition(dt));
    }
    this.updateDetail();
  };
  public async initialiseBaseMesh(): Promise<void> {
    // if (this._physicalParameters.MeanRadius == 0) {
    //   console.log(this._metadata.EnglishName);
    // }
    this._celestialBodyGeometry = new IcosahedronGeometry(this._physicalParameters.MeanRadius, this._meshDetail);
    this._celestialBodyMaterial = new MeshPhongMaterial({
      map: await assetManager().loadTexure(this._textures.Map),
    });
    this.celestialBodyMaterial.specularMap = await assetManager().loadTexure(this._textures.Specular);
    this._celestialBodyMesh = new Mesh(this._celestialBodyGeometry, this._celestialBodyMaterial);
    this._celestialBodyGroup.add(this._celestialBodyMesh);
  }
  // addGlowMesh(): void {
  //   this._glowMesh = new Mesh(this._celestialBodyGeometry, getFresnelMat());
  //   this._glowMesh.scale.setScalar(1.03);
  //   this._celestialBodyGroup.add(this._glowMesh);
  // }
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
      // this._glowMesh.geometry.dispose();
      // this._glowMesh.geometry = baseGeometry.clone();
    }
  };
}

// 70668 SideralRotation
// 0.8132188755462876 Period

// factor ^ 0.00001150759

// 163123.19999999998
// 1.8918300457800243
// factor ^ 0.00001159756

// 118368.00000000001
// 1.3744215929468013

// factor ^ 0.00001161142

// 2755.08
// 0.3190949149106648
// factor ^ 0.00011582056

// 109074.81599999999
// 1.2623272505041023

// factor ^ 0.00001157304

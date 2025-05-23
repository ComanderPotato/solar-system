import {
  AxesHelper,
  BufferGeometry,
  Color,
  EllipseCurve,
  Line,
  LineBasicMaterial,
  Object3D,
  Vector2,
  Vector3,
} from "three";
import { OrbitingBodyParameters } from "../types";
import {
  calculateAttractiveForce,
  calculateForceDirection,
  calculateSquaredDistance,
  calculateAcceleration,
  calculateOrbitPosition,
} from "../utils/formulas";
import { CelestialBody, Moon } from ".";
import {
  CSS2DObject,
  Line2,
  LineGeometry,
  LineMaterial,
} from "three/examples/jsm/Addons.js";
import { SCALE } from "../utils/constants";
import { app } from "../core";
import { CelestialBodyColour } from "../utils/constants";

export default abstract class OrbitingBody<
  T extends OrbitingBodyParameters = OrbitingBodyParameters,
> extends CelestialBody<T> {
  protected _primaryBody: CelestialBody;
  protected _orbitingBodyParameters: T["Orbital"];
  protected _currentVelocity!: Vector3;
  protected static totalFactor: number = 0;
  protected static totalDistance: number = 0;
  protected static count: number = 0;
  // Helpers
  public printParameters = () => {
    console.log(this._metadata.EnglishName);
    console.log(this._physicalParameters);

    if (this instanceof OrbitingBody) {
      console.log(this.orbitingParameters);
    }
  };
  constructor(
    orbitingBodyParameters: OrbitingBodyParameters,
    primaryBody: CelestialBody,
    secondaryBodyParameters?: OrbitingBodyParameters[],
  ) {
    super(orbitingBodyParameters, secondaryBodyParameters);
    this._primaryBody = primaryBody;
    this._orbitingBodyParameters = orbitingBodyParameters.Orbital;
    this.initialiseOrbit();
    this.drawOrbit();
    // Move somewhere else (maybe in data loader etc idfk)
    if (this._physicalParameters.SideralRotation != 0) {
      OrbitingBody.totalFactor += Math.abs(
        this._orbitingBodyParameters.PeriodInDays /
          this._physicalParameters.SideralRotation,
      );
      OrbitingBody.totalDistance +=
        this._orbitingBodyParameters.DistanceFromPrimary;
      OrbitingBody.count += 1;
    } else {
      const averageFactor = OrbitingBody.totalFactor / OrbitingBody.count;
      const averageDistance = OrbitingBody.totalDistance / OrbitingBody.count;
      const adjustedFactor =
        averageFactor *
        (this._orbitingBodyParameters.DistanceFromPrimary / averageDistance);
      this._physicalParameters.SideralRotation =
        this._orbitingBodyParameters.PeriodInDays / adjustedFactor;
    }
  }

  // Getters
  get currentVelocity(): Vector3 {
    return this._currentVelocity;
  }
  get orbitingParameters(): T["Orbital"] {
    return this._orbitingBodyParameters;
  }
  public updateVelocity(dt: number, other?: CelestialBody): void {
    const acceleration = this.calculateAcceleration(other);
    this._currentVelocity.add(acceleration.multiplyScalar(dt));

    if (this._secondaryBodies) {
      this._secondaryBodies.forEach((secondaryBody) => {
        // secondaryBody._currentVelocity.add(this.currentVelocity.clone());
        secondaryBody.updateVelocity(dt);
      });
    }
  }
  private calculateAcceleration(
    other?: CelestialBody,
    clonePrimary?: Vector3,
    cloneSecondary?: Vector3,
  ): Vector3 {
    let acceleration = new Vector3();
    // if (!this.primaryBody || !other) return acceleration;
    // if (!parentBody) return acceleration;
    if (!this.primaryBody) return acceleration;

    let [P, S] = [this.primaryBody.position.clone(), this._position.clone()];
    let [M, m] = [
      this._primaryBody.physicalParameters.Mass,
      this._physicalParameters.Mass,
    ];
    // let [P, S] = [this.primaryBody.position.clone(), this._position.clone()];
    // let [M, m] = [this.primaryBody.getParameter("Mass"), this.getParameter("Mass")];
    if (other) {
      [P, S] = [other.position.clone(), this._position.clone()];
      [M, m] = [other.physicalParameters.Mass, this._physicalParameters.Mass];
    } else if (clonePrimary && cloneSecondary) {
      [P, S] = [clonePrimary, cloneSecondary];
    }
    const sqrDist = calculateSquaredDistance(P, S);
    const forceDir = calculateForceDirection(P, S);
    const force = calculateAttractiveForce(forceDir, M, m, sqrDist);
    acceleration = calculateAcceleration(force, m);
    return acceleration;
  }

  public getFormattedVelocity = (): string => {
    const { x, y, z } = this.currentVelocity
      .clone()
      .divideScalar(SCALE)
      .divideScalar(1000);
    return `${Math.sqrt(x * x + y * y + z * z).toFixed(2)} km/s`;
  };
  public getFormattedDistance = (): string => {
    // const { x, y, z } = this.currentVelocity.clone();
    if (!this._primaryBody) return "";
    return this._position
      .clone()
      .distanceTo(this._primaryBody.position)
      .toFixed(2);
    // return Math.sqrt(x * x + y * y + z * z).toString();
  };
  private drawOrbit = (): void => {
    const a = this._orbitingBodyParameters.SemiMajorAxis;
    const b = this._orbitingBodyParameters.SemiMinorAxis;
    const e = this._orbitingBodyParameters.Eccentricity;
    const c = e * a;
    const curve = new EllipseCurve(-c, 0, a, b, 0, 2 * Math.PI, false, 0);
    const points = curve.getPoints(180);

    const positions: number[] = [];
    const colours: number[] = [];
    const startColor = new Color(0xffffff);
    const endColour = new Color(
      CelestialBodyColour[this._metadata.EnglishName.toUpperCase()] ??
        CelestialBodyColour[
          this._primaryBody.metadata.EnglishName.toUpperCase()
        ],
    );
    for (let i = 0; i < points.length; i++) {
      const point = points[i];
      positions.push(point.x, 0, point.y);
      const t = i / (points.length - 1);
      const color = startColor.clone().lerp(endColour, t);
      colours.push(color.r, color.g, color.b);
    }
    const geometry = new LineGeometry();
    geometry.setPositions(positions);
    geometry.setColors(colours);

    const material = new LineMaterial({
      vertexColors: true,
      transparent: this instanceof Moon,
      opacity: 0.6,
      linewidth: 2,
      resolution: new Vector2(window.innerWidth, window.innerHeight), // MUST be updated on resize
    });

    const orbit = new Line2(geometry, material);
    orbit.computeLineDistances();
    //orbit.rotateOnWorldAxis(new Vector3(1, 0, 0), Math.PI / 2);
    orbit.rotateOnAxis(
      new Vector3(1, 0, 0),
      this._orbitingBodyParameters.Inclination,
    );
    orbit.rotateOnWorldAxis(
      new Vector3(0, 1, 0),
      this._orbitingBodyParameters.LongitudeOfAscendingNode,
    );
    orbit.rotateOnAxis(
      new Vector3(0, 1, 0),
      this._orbitingBodyParameters.ArgumentOfPeriapsis,
    );

    this._primaryBody.addOrbit(this._metadata.EnglishName, orbit);
  };
  // private drawOrbit = (): void => {
  //   const a = this._orbitingBodyParameters.SemiMajorAxis;
  //   const b = this._orbitingBodyParameters.SemiMinorAxis;
  //   const e = this._orbitingBodyParameters.Eccentricity;
  //   const c = e * a;
  //   const curve = new EllipseCurve(-c, 0, a, b, 0, 2 * Math.PI, false, 0);
  //   const points = curve.getPoints(180);
  //   const geometry = new BufferGeometry().setFromPoints(points);
  //   const colour = CelestialBodyColour[this._metadata.EnglishName.toUpperCase()] ?? CelestialBodyColour[this._primaryBody.metadata.EnglishName.toUpperCase()];
  //   const orbit = new Line(
  //     geometry,
  //     new LineBasicMaterial({
  //       color: colour,
  //       transparent: this instanceof Moon ? true : false,
  //       opacity: 0.4,
  //     })
  //   );
  //   const orbitGroup = new Object3D();

  //   // orbitGroup.add(ellipse);

  //   // ellipse.rotateOnWorldAxis(new Vector3(1, 0, 0), Math.PI / 2);
  //   // orbitGroup.rotateOnAxis(new Vector3(1, 0, 0), this._orbitingBodyParameters.Inclination);
  //   // orbitGroup.rotateOnWorldAxis(new Vector3(0, 1, 0), this._orbitingBodyParameters.LongitudeOfAscendingNode);
  //   // orbitGroup.rotateOnAxis(new Vector3(0, 1, 0), this._orbitingBodyParameters.ArgumentOfPeriapsis);
  //   // orbitGroup.position.copy(this._primaryBody!.position);
  //   // ellipse.rotateOnAxis(new Vector3(1, 0, 0), Math.PI / 2);
  //   // ellipse.rotateOnAxis(new Vector3(0, 0, 1), this._orbitingBodyParameters.LongitudeOfAscendingNode);
  //   // ellipse.rotateOnAxis(new Vector3(1, 0, 0), this._orbitingBodyParameters.Inclination);
  //   // ellipse.rotateOnAxis(new Vector3(0, 0, 1), this._orbitingBodyParameters.ArgumentOfPeriapsis);
  //   orbit.rotateOnWorldAxis(new Vector3(1, 0, 0), Math.PI / 2);
  //   orbit.rotateOnAxis(new Vector3(1, 0, 0), this._orbitingBodyParameters.Inclination);
  //   orbit.rotateOnWorldAxis(new Vector3(0, 1, 0), this._orbitingBodyParameters.LongitudeOfAscendingNode);
  //   orbit.rotateOnAxis(new Vector3(0, 0, -1), this._orbitingBodyParameters.ArgumentOfPeriapsis);
  //   // orbit.position.copy(this._primaryBody.position);
  //   // this._primaryBody

  //   // app().scene.add(orbitGroup);
  //   this._primaryBody.addOrbit(this._metadata.EnglishName, orbit);
  // };
  private initialiseOrbit = (): void => {
    this._celestialBodyGroup.position.copy(
      this._orbitingBodyParameters.Position,
    );
    this._position = this._orbitingBodyParameters.Position;
    const { x, y, z } = this._orbitingBodyParameters.Velocity;
    const orbitalVelocity = new Vector3(x, y, z);
    // if (this._primaryBody instanceof OrbitingBody) {
    //   console.log("Yes");
    //   this._currentVelocity = orbitalVelocity.add(this._primaryBody.currentVelocity);
    // } else {
    // }
    this._currentVelocity = orbitalVelocity;
    this._currentVelocity =
      this._primaryBody instanceof OrbitingBody ? (this._currentVelocity = orbitalVelocity.add(this._primaryBody.currentVelocity)) : orbitalVelocity;

    
  };

  // // Remove
  // protected velocityElement!: HTMLSpanElement;
  // protected distanceElement!: CSS2DObject;

  // protected updateVelocityElement = () => {
  //   this.velocityElement.textContent = this.getFormattedVelocity();
  // };
  // protected initialiseVelocityElement = (): HTMLSpanElement => {
  //   const velocityElement = document.createElement("span");
  //   velocityElement.textContent = this.getFormattedVelocity();
  //   return velocityElement;
  // };
  // abstract initialiseOrbit(): void;
  abstract initialiseOrbitalPlane(): void;
  abstract updatePosition(dt: number): void;
}

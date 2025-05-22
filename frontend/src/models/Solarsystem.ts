import { SolarSystemParameters } from "../types";
import { CelestialBodyFactory, CelestialBody, OrbitingBody, Star } from ".";

export default class SolarSystem {
  // public primaryBody: Star<StarParameters, StarSecondaryParameters>;
  // public secondaryBodies?: Array<Planet<PlanetParameters, PlanetSecondaryParameters, StarParameters>>;
  private _primaryBody!: Star;
  private _secondaryBodies?: OrbitingBody[];
  private _solarSystemParameters!: SolarSystemParameters;
  constructor() {}

  public initialiseSolarSystem = (solarSystemParameters: SolarSystemParameters) => {
    this._solarSystemParameters = solarSystemParameters;
    this.initialisePrimaryBody();
    this.initialiseSecondaryBodies();
  };
  private initialisePrimaryBody = () => {
    this._primaryBody = CelestialBodyFactory.buildCelestialBody(this._solarSystemParameters.Primary) as Star;
  };
  private initialiseSecondaryBodies = () => {
    const { Secondary } = this._solarSystemParameters;
    // const earth = Secondary.find((planet) => planet.MetaData.EnglishName.toLowerCase() == "earth");
    // this._secondaryBodies = [CelestialBodyFactory.buildCelestialBody(this.app, earth!) as OrbitingBody];
    this._primaryBody.initialiseSecondaryBodies(Secondary);
    // this._secondaryBodies = [
    //   ...Secondary.map((secondaryParameters) => CelestialBodyFactory.buildCelestialBody(secondaryParameters, this._primaryBody) as OrbitingBody),
    // ];
  };
  public simulate(elapsedTime: number) {
    if (!this._primaryBody.secondaryBodies) return;
    this._primaryBody.rotateOnAxis(elapsedTime);
    this._primaryBody.updateDetail();
    this._primaryBody.secondaryBodies.forEach((secondaryBody) => {
      secondaryBody.updateVelocity(elapsedTime);
    });
    this._primaryBody.secondaryBodies.forEach((secondaryBody) => {
      secondaryBody.updatePosition(elapsedTime);
    });
    // this._primaryBody.rotateOnAxis(elapsedTime);
    // if (this.secondaryBodies) {
    //   this.secondaryBodies.forEach((secondaryBody) => {
    //     secondaryBody.updateVelocity(elapsedTime);
    //   });
    //   this.secondaryBodies.forEach((secondaryBody) => {
    //     secondaryBody.updatePosition(elapsedTime);
    //   });
    // }
    // this.primaryBody.position.copy(this.primaryBody.celestialBodyMeshGroup.position);
  }
  // public nBodySimulate(elapsedTime: number) {
  //   if (!this.secondaryBodies) return
  //     for(let current of this.secondaryBodies) {
  //       for(let other of this.secondaryBodies) {
  //         if(current == other) continue;
  //         current.updateVelocity(elapsedTime, other)
  //       }
  //     }
  //     this.secondaryBodies.forEach((secondaryBody) => {
  //       secondaryBody.updatePosition(elapsedTime);
  //     });
  // }
  // public stopSimulate() {}
}

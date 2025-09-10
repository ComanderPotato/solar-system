// import { CelestialBodyParameters, StarParameters, PlanetParameters, MoonParameters } from "../types";
// import CelestialBody from "./CelestialBody";
// import Star from "./Star";
// import Planet from "./Planet";
// import Moon from "./Moon";
// export default class CelestialBodyFactory {
// 	static buildCelestialBody = (
// 		celestialBodyParameters: CelestialBodyParameters,
// 		primaryBody?: CelestialBody,
// 	): CelestialBody => {
// 		switch (celestialBodyParameters.MetaData.BodyType) {
// 			case "Star":
// 				return new Star(celestialBodyParameters as StarParameters);
// 			case "Planet":
// 			case "DwarfPlanet":
// 				return new Planet(celestialBodyParameters as PlanetParameters, primaryBody!);
// 			case "Moon":
// 				return new Moon(celestialBodyParameters as MoonParameters, primaryBody!);
// 		}
// 	};
// }
//
// abstract class CelestialBodyCreator {
// 	abstract createCelestialBody(
// 		celestialBodyParameters: CelestialBodyParameters,
// 		primaryBody?: CelestialBody,
// 	): CelestialBody;
// }
//
// class MoonCreator extends CelestialBodyCreator {
// 	createCelestialBody(celestialBodyParameters: CelestialBodyParameters, primaryBody: CelestialBody): Moon {
// 		return new Moon(celestialBodyParameters as MoonParameters, primaryBody);
// 	}
// }
//
// class PlanetCreator extends CelestialBodyCreator {
// 	createCelestialBody(celestialBodyParameters: CelestialBodyParameters, primaryBody: CelestialBody): Planet {
// 		return new Planet(celestialBodyParameters as PlanetParameters, primaryBody);
// 	}
// }
// class StarCreator extends CelestialBodyCreator {
// 	createCelestialBody(celestialBodyParameters: CelestialBodyParameters): Star {
// 		return new Star(celestialBodyParameters as StarParameters);
// 	}
// }

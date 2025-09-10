// import { Moon, Planet, Star, CelestialBody } from "../models";
import Moon from "../models/Moon";
import Planet from "../models/Planet";
import Star from "../models/Star";
import CelestialBody from "../models/CelestialBody";

// import {
// 	CelestialBodyParameters,
// 	MoonParameters,
// 	OrbitingBodyParameters,
// 	PlanetParameters,
// 	StarParameters,
// } from "../types";
import OrbitingBody from "../models/OrbitingBody";
import {
	CelestialBodyParameters,
	MoonParameters,
	PlanetParameters,
	StarParameters,
} from "../types/CelestialBodyParameters";

// abstract class OrbitingBodyCreator {
// 	abstract createOrbitingBody(
// 		orbitingBodyParameters: OrbitingBodyParameters,
// 		primaryBody: CelestialBody,
// 	): OrbitingBody;
// }
abstract class CelestialBodyCreator {
	abstract createCelestialBody(
		celestialBodyParameters: CelestialBodyParameters,
		primaryBody?: CelestialBody,
	): CelestialBody;
}

export class MoonCreator extends CelestialBodyCreator {
	createCelestialBody(celestialBodyParameters: CelestialBodyParameters, primaryBody: CelestialBody): Moon {
		return new Moon(celestialBodyParameters as MoonParameters, primaryBody);
	}
}

export class PlanetCreator extends CelestialBodyCreator {
	createCelestialBody(celestialBodyParameters: CelestialBodyParameters, primaryBody: CelestialBody): Planet {
		return new Planet(celestialBodyParameters as PlanetParameters, primaryBody);
	}
}
export class StarCreator extends CelestialBodyCreator {
	createCelestialBody(celestialBodyParameters: CelestialBodyParameters): Star {
		return new Star(celestialBodyParameters as StarParameters);
	}
}

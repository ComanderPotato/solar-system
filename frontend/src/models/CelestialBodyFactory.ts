import { CelestialBodyParameters, StarParameters, PlanetParameters, MoonParameters } from "../types";
import { CelestialBody, Star, Planet, Moon } from ".";
export default class CelestialBodyFactory {
	static buildCelestialBody = (celestialBodyParameters: CelestialBodyParameters, primaryBody?: CelestialBody): CelestialBody => {
		
		switch (celestialBodyParameters.MetaData.BodyType) {
			case "Star":
				return new Star(celestialBodyParameters as StarParameters);
			case "Planet":
			case "DwarfPlanet":
				return new Planet(celestialBodyParameters as PlanetParameters, primaryBody!);
			case "Moon":
				return new Moon(celestialBodyParameters as MoonParameters, primaryBody!);
		}
	};
}

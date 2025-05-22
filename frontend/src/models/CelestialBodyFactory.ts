import { StarParameters, PlanetParameters, MoonParameters, CelestialBodyParameters } from "../types";
import textures from "../data/textures.json";
import { CelestialBody, Star, Planet, Moon } from ".";
export default class CelestialBodyFactory {
  static buildCelestialBody = (celestialBodyParameters: CelestialBodyParameters, primaryBody?: CelestialBody): CelestialBody => {
    switch (celestialBodyParameters.MetaData.BodyType) {
      case "Star":
        return new Star(celestialBodyParameters as StarParameters);
      case "Planet":
      case "Dwarf Planet":
        return new Planet(celestialBodyParameters as PlanetParameters, primaryBody!);
      case "Moon":
        celestialBodyParameters = celestialBodyParameters as MoonParameters;
        if (celestialBodyParameters.MetaData.EnglishName == "Moon") {
          celestialBodyParameters.Texture = textures["Moons"][celestialBodyParameters.MetaData.EnglishName];
        } else {
          const moonTextures = Object.entries(textures["Moons"]);
          const randomTexture = moonTextures[Math.floor(Math.random() * moonTextures.length)][1];
          celestialBodyParameters.Texture = randomTexture;
        }
        return new Moon(celestialBodyParameters as MoonParameters, primaryBody!);
    }
  };
}

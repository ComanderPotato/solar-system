import { Vector3 } from "three";
import {
  FetchedOrbitalParameters,
  FetchedPhysicalParameters,
  PhysicalParametersResponse,
} from "../loaders/DataLoader";
import {
  BasePhysicalParameters,
  BodyTypes,
  CelestialBodyParameters,
  CelestialMetadata,
  CelestialTextures,
  distanceKeys,
  MoonPhysicalParameters,
  OrbitalElementsResponse,
  OrbitalParameters,
  PhysicalParameters,
  PlanetPhysicalParameters,
  RequiredMoonPhysicalParameters,
  RequiredPlanetPhysicalParameters,
  RequiredStarPhysicalParameters,
  SolarSystemOpenDataResponse,
  StarPhysicalParameters,
  TextureParameters,
} from "../types";
import { KM_TO_M, SCALE } from "./constants";
import optionalPhysicalData from "../data/optionalPhysicalData.json";
import textures from "../data/textures.json";

export default class DataProcessor {
  private _textures: CelestialTextures = textures;
  constructor() {
    // this._optionalPhysicalParameters = optionalPhysicalData
    this._textures;
  }
  private _fetchedOrbitalParameters?: FetchedOrbitalParameters;
  private _fetchedPhysicalParameters?: FetchedPhysicalParameters;
  public process = (
    fetchedPhysicalParameters: FetchedPhysicalParameters,
    fetchedOrbitalParameters: FetchedOrbitalParameters
  ): CelestialBodyParameters[] => {
    const processedParameters: CelestialBodyParameters[] = [];
    for (const secondaryName of Object.keys(fetchedOrbitalParameters)) {
      const physicalParameters: PhysicalParametersResponse =
        fetchedPhysicalParameters[secondaryName];
      const orbitalParameters: OrbitalElementsResponse | null =
        fetchedOrbitalParameters[secondaryName];

      const processedMetaData = this.processMetaData(physicalParameters);
      // const processedPhysicalParameters = this.processPhysicalData(
      //   physicalParameters,
      //   processedMetaData.BodyType
      // );
      const processedOrbitalParameters =
        this.processOrbitalParameters(orbitalParameters);
      const processedSecondaryBodies =
        this.processSecondaryBodies(physicalParameters);

      // const body: CelestialBodyParameters = {
      //   MetaData: processedMetaData,
      //   Physical: this.processPhysicalData(physicalParameters, processedMetaData.BodyType),
      //   Orbital: processedOrbitalParameters,
      //   Texture: this._textures?[processedMetaData.EnglishName]
      // }
      // const concatenatedParameters = this.concatenateParameters(
      //   processedMetaData,
      //   fetchedPhysicalParameters,
      //   processedOrbitalParameters,
      //   processedSecondaryBodies,
      //   this._textures
      // );
      processedParameters.push();
    }
    return processedParameters;
  };
  private concatenateParameters = () => {};
  private processSecondaryBodies = (
    physicalParameters: PhysicalParametersResponse
  ): string[] => {
    return physicalParameters.moons.map((key) => key.moon);
  };
  private processMetaData = (
    physicalParameters: PhysicalParametersResponse
  ): CelestialMetadata => {
    return {
      Id: physicalParameters.id,
      Name: physicalParameters.name,
      EnglishName: physicalParameters.englishName,
      BodyType: physicalParameters.bodyType,
    };
  };

  // private concatenateParameters = (
  //   metaData: CelestialMetadata,
  //   physical: PhysicalParametersResponse,
  //   orbital: OrbitalParameters,
  //   secondary: string[],
  //   textures: TextureParameters
  // ): CelestialBodyParameters => {
  //   return {
  //     MetaData: metaData,
  //     Physical: this.processPhysicalData(physical, metaData.BodyType),
  //     Orbital: orbital,
  //     SecondaryBodyParameters: secondary,
  //     Texture: textures[],
  //   };
  // };
  // private concatenateParamaters = (physicalParameters: FetchedPhysicalParameters, orbitalParameters: FetchedOrbitalParameters): CelestialBodyParameters => {
  //   const orbitalParameters: OrbitalParameters | null = this._orbitalParameters![parameters.englishName];
  //     const bodyType = physicalParametes.bodyType as BodyTypes;
  //     const parentBody = parameters.aroundPlanet ? parameters.aroundPlanet.planet : "soleil";

  //     const secondaryBodies = physicalParameters.
  //     return {
  //       MetaData: {
  //         Id:
  //       }
  //     }
  //       ? await Promise.all(
  //           parameters.moons.map(async (m) => {
  //             const data = await this.getPlanetaryPhysicalData(`name,eq,${m.moon}`);
  //             return data[0];
  //           })
  //         )
  //       : null;

  //     return {
  //       MetaData: {
  //         Id: physicalParameters.id,
  //         Name: physicalParameters.name,
  //         EnglishName: physicalParameters.englishName,
  //         BodyType: bodyType,
  //       },
  //       Physical: this.processPhysicalData(parameters, bodyType),
  //       Orbital: {
  //         ...orbitalParameters,
  //         ParentBody: parentBody,
  //       },
  //       SecondaryBodyParameters: secondaryBodies,
  //       Texture: this._textureData[parameters.englishName],
  //     } as CelestialBodyParameters;
  //   })
  // }
  private processOrbitalParameters = (
    orbitalParameters: OrbitalElementsResponse
  ): OrbitalParameters => {
    distanceKeys.map(
      (distanceKey) =>
        (orbitalParameters[distanceKey] =
          orbitalParameters[distanceKey] * SCALE)
    );
    return {
      ...orbitalParameters,
      Position: new Vector3(...orbitalParameters.Position).multiplyScalar(
        SCALE
      ),
      Velocity: new Vector3(...orbitalParameters.Velocity).multiplyScalar(
        SCALE
      ),
    };
  };
  private processPhysicalData = (
    physicalParameters: PhysicalParametersResponse,
    bodyType: BodyTypes
  ): PhysicalParameters => {
    switch (bodyType) {
      case "Star":
        return {
          ...this.processBasePhysicalData(physicalParameters),
          ...(optionalPhysicalData[
            physicalParameters.englishName
          ] as RequiredStarPhysicalParameters),
        } as StarPhysicalParameters;
      case "Planet":
      case "Dwarf Planet":
        return {
          ...this.processBasePhysicalData(physicalParameters),
          ...(optionalPhysicalData[
            physicalParameters.englishName
          ] as RequiredPlanetPhysicalParameters),
        } as PlanetPhysicalParameters;
      case "Moon":
        return {
          ...this.processBasePhysicalData(physicalParameters),
          ...(optionalPhysicalData[
            physicalParameters.englishName
          ] as RequiredMoonPhysicalParameters),
        } as MoonPhysicalParameters;
    }
  };
  public static processBasePhysicalData = () => {};

  public processBasePhysicalData = (
    basePhysicalParameters: SolarSystemOpenDataResponse
  ): BasePhysicalParameters => {
    return {
      Mass: this.processMass(basePhysicalParameters) * SCALE,
      Volume: this.processVolume(basePhysicalParameters) * SCALE,
      Density: basePhysicalParameters.density * 1000 /* Fix */,
      Gravity: basePhysicalParameters.gravity,
      Escape: basePhysicalParameters.escape,
      MeanRadius: basePhysicalParameters.meanRadius * KM_TO_M * SCALE,
      EquaRadius: basePhysicalParameters.equaRadius * KM_TO_M * SCALE,
      PolarRadius: basePhysicalParameters.polarRadius * KM_TO_M * SCALE,
      Flattening: basePhysicalParameters.flattening,
      AxialTilt: basePhysicalParameters.axialTilt * (Math.PI / 180),
      SideralRotation: basePhysicalParameters.sideralRotation * 3600,
      AverageTemperature: basePhysicalParameters.avgTemp,
    };
  };
  public processMass = (
    basePhysicalParameters: SolarSystemOpenDataResponse
  ): number => {
    if (basePhysicalParameters.mass) {
      const massValue = basePhysicalParameters.mass.massValue;
      const massExponent = basePhysicalParameters.mass.massExponent;
      return massValue * 10 ** massExponent;
    }
    //   else if (basePhysicalParameters.meanRadius) moon.Physical.Mass = (4 / 3) * Math.PI * moon.Physical.MeanRadius ** 3 * moon.Physical.Density;
    return -1;
  };
  public processVolume = (
    basePhysicalParameters: SolarSystemOpenDataResponse
  ): number => {
    const { vol, mass, density, meanRadius, equaRadius, polarRadius } =
      basePhysicalParameters;
    if (vol) {
      return vol.volValue * 10 ** vol.volExponent;
    } else if (mass) {
      return (mass.massValue * 10 ** mass.massExponent) / density;
    } else if (meanRadius) {
      return (4 / 3) * Math.PI * meanRadius ** 3;
    } else if (equaRadius && polarRadius) {
      return (4 / 3) * Math.PI * equaRadius ** 2 * polarRadius;
    }
    return -1;
  };
}

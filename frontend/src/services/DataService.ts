import {
  PlanetaryOrbitalElements,
  OrbitalParameters,
  OrbitalElementsResponse,
  PlanetaryOrbitalElementsResponse,
  distanceKeys,
  SolarSystemParameters,
  CelestialBodyParameters,
  CelestialTextures,
  SolarSystemOpenDataResponse,
  API_INCLUDE_DATA,
  BodyTypes,
  PhysicalParameters,
  BasePhysicalParameters,
  StarPhysicalParameters,
  PlanetPhysicalParameters,
  MoonPhysicalParameters,
  RequiredStarPhysicalParameters,
  RequiredPlanetPhysicalParameters,
  RequiredMoonPhysicalParameters,
  StarParameters,
  OrbitingBodyParameters,
  SecondaryOrbitalElements,
  CelestialOptionalPhysicalParameters,
} from "../types";
interface WikiSummary {
  extract: string;
}
import { Vector3 } from "three";
import { SCALE, KM_TO_M, DEG_TO_RAD, HOUR_TO_SECOND } from "../utils/constants";
import textures from "../data/textures.json";
import optionalPhysicalData from "../data/optionalPhysicalData.json";

export default class DataService {
  private PRIMARY_PLANETS_FILTER = `bodyType,eq,Planet`;
  private DUMB_DWARF_FILTER = `englishName,eq,Pluto`;
  private STAR_FILTER = `bodyType,eq,Star`;

  private _solarSystemParameters!: SolarSystemParameters;

  private _orbitalParameters?: PlanetaryOrbitalElements;
  private _starPlanetaryParameters?: StarParameters;
  private _primaryPlanetaryParameters?: OrbitingBodyParameters[];
  private _dumbDwarfParameters?: OrbitingBodyParameters[];
  public _focusedPlanetsMoons?: SecondaryOrbitalElements;
  private _textureData: CelestialTextures;
  private _optionalPhysicalData: CelestialOptionalPhysicalParameters;

  constructor() {
    this._textureData = textures;
    this._optionalPhysicalData = optionalPhysicalData;
    this.fetchPlanetaryData();
  }
  private fetchPlanetaryData = async () => {
    try {
      this._orbitalParameters = await this.getPlanetaryData();
      this.handleOrbitalData();
    } catch (error) {
      console.error("Error fetching planetary data:", error);
    }
  };
  private getPlanetaryData = async (): Promise<PlanetaryOrbitalElements> => {
    const response = await fetch("/get_parameters", {
      method: "GET",
      headers: { "Content-Type": "application/json" },
    });
    const data = await response.json();
    return (await this.processPlanetaryOrbitalParameters(
      data,
    )) as PlanetaryOrbitalElements;
  };
  public fetchFocusedPlanetsMoonData = async (
    planetName: string,
    moons: string[],
  ) => {
    // Maybe do all processing inside here
    this._focusedPlanetsMoons = await this.getMoonOrbitalParameters(
      planetName,
      moons,
    );
  };
  private getMoonOrbitalParameters = async (
    planetName: string,
    moons: string[],
  ): Promise<SecondaryOrbitalElements> => {
    const response = await fetch(`/get_moon_parameters`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        planetName,
        moons,
      }),
    });

    const data = await response.json();
    return (await this.processPlanetaryOrbitalParameters(
      data,
    )) as SecondaryOrbitalElements;
  };
  private processPlanetaryOrbitalParameters = async (
    planetaryOrbitalParameters: PlanetaryOrbitalElementsResponse,
  ): Promise<PlanetaryOrbitalElements> => {
    return Object.fromEntries(
      Object.entries(planetaryOrbitalParameters).map(
        ([planet, orbitalParameters]) => [
          planet,
          this.processOrbitalParameters(orbitalParameters),
        ],
      ),
    ) as PlanetaryOrbitalElements;
  };
  private processOrbitalParameters = (
    orbitalParameters: OrbitalElementsResponse,
  ): OrbitalParameters => {
    distanceKeys.map(
      (distanceKey) =>
        (orbitalParameters[distanceKey] =
          orbitalParameters[distanceKey] * SCALE),
    );
    return {
      ...orbitalParameters,
      Position: new Vector3(...orbitalParameters.Position).multiplyScalar(
        SCALE,
      ),
      Velocity: new Vector3(...orbitalParameters.Velocity).multiplyScalar(
        SCALE,
      ),
      ParentBody: String(),
    };
  };
  private handleOrbitalData = async () => {
    if (this._orbitalParameters) {
      this._starPlanetaryParameters = (
        (await this.getPlanetaryPhysicalData(
          this.STAR_FILTER,
        )) as StarParameters[]
      )[0];
      this._primaryPlanetaryParameters = (await this.getPlanetaryPhysicalData(
        this.PRIMARY_PLANETS_FILTER,
      )) as OrbitingBodyParameters[];
      this._dumbDwarfParameters = (await this.getPlanetaryPhysicalData(
        this.DUMB_DWARF_FILTER,
      )) as OrbitingBodyParameters[];
      this.handleSolarSystemData();
    }
  };
  public a?: WikiSummary;
  public getCelestialBodyExtract = async (
    englishName: string,
    bodyType: string,
  ): Promise<WikiSummary> => {
    try {
      const data = await this.fetchCelestialBodyExtract(englishName, bodyType);
      // this.a = data;
      return data
    } catch(e) {console.log(e)}
    return {extract: ""}
  };
  public fetchCelestialBodyExtract = async (
    planetName: string,
    bodyType: string,
  ): Promise<WikiSummary> => {
    planetName = planetName.toLocaleLowerCase();
    console.log(`/api/rest/summary?planetName=${encodeURIComponent(planetName)}&bodyType=${encodeURIComponent(bodyType)}`)
    const response = await fetch(
      `/api/rest/summary?planetName=${encodeURIComponent(planetName)}&bodyType=${encodeURIComponent(bodyType)}`,
    );
    const data = await response.json();
    return data;
  };

  getPlanetaryPhysicalData = async (
    filter: string,
  ): Promise<CelestialBodyParameters[]> => {
    // console.log(`https://api.le-systeme-solaire.net/rest/bodies?data=${API_INCLUDE_DATA.join(",")}&filter[]=${filter}`);
    const response = await fetch(
      `https://api.le-systeme-solaire.net/rest/bodies?data=${API_INCLUDE_DATA.join(",")}&filter[]=${filter}`,
    );
    // const response = await fetch(`/api/rest/physical?data=${encodeURIComponent(API_INCLUDE_DATA.join(","))}&filter[]=${encodeURIComponent(filter)}`);
    const data = await response.json();
    return this.processPlanetaryPhysicalData(
      data.bodies as SolarSystemOpenDataResponse[],
    );
  };
  private processPlanetaryPhysicalData = async (
    physicalParameters: SolarSystemOpenDataResponse[],
  ): Promise<CelestialBodyParameters[]> => {
    return await Promise.all(
      physicalParameters.map(async (parameters) => {
        const orbitalParameters: OrbitalParameters | null =
          this._orbitalParameters![parameters.englishName];
        const bodyType = parameters.bodyType as BodyTypes;
        const parentBody = parameters.aroundPlanet
          ? parameters.aroundPlanet.planet
          : "soleil";

        // Fetch secondary bodies if moons exist
        const secondaryBodies = parameters.moons
          ? await Promise.all(
              parameters.moons.map(async (m) => {
                const data = await this.getPlanetaryPhysicalData(
                  `name,eq,${m.moon}`,
                );
                return data[0]; // Assuming 1 moon = 1 match
              }),
            )
          : null;

        return {
          MetaData: {
            Id: parameters.id,
            Name: parameters.name,
            EnglishName: parameters.englishName,
            BodyType: bodyType,
          },
          Physical: this.processPhysicalData(parameters, bodyType),
          Orbital: {
            ...orbitalParameters,
            ParentBody: parentBody,
          },
          SecondaryBodyParameters: secondaryBodies,
          Texture: this._textureData[parameters.englishName],
        } as CelestialBodyParameters;
      }),
    );
  };

  private processPhysicalData = (
    physicalParameters: SolarSystemOpenDataResponse,
    bodyType: BodyTypes,
  ): PhysicalParameters => {
    switch (bodyType) {
      case "Star":
        return {
          ...this.processBasePhysicalData(physicalParameters),
          ...(this._optionalPhysicalData[
            physicalParameters.englishName
          ] as RequiredStarPhysicalParameters),
        } as StarPhysicalParameters;
      case "Planet":
      case "Dwarf Planet":
        return {
          ...this.processBasePhysicalData(physicalParameters),
          ...(this._optionalPhysicalData[
            physicalParameters.englishName
          ] as RequiredPlanetPhysicalParameters),
        } as PlanetPhysicalParameters;
      case "Moon":
        return {
          ...this.processBasePhysicalData(physicalParameters),
          ...(this._optionalPhysicalData[
            physicalParameters.englishName
          ] as RequiredMoonPhysicalParameters),
        } as MoonPhysicalParameters;
    }
  };
  private processBasePhysicalData = (
    basePhysicalParameters: SolarSystemOpenDataResponse,
  ): BasePhysicalParameters => {
    const mass = basePhysicalParameters.mass
      ? basePhysicalParameters.mass.massValue *
        10 ** basePhysicalParameters.mass.massExponent *
        SCALE
      : 0;
    const vol = basePhysicalParameters.vol
      ? basePhysicalParameters.vol.volValue *
        10 ** basePhysicalParameters.vol.volExponent *
        SCALE *
        KM_TO_M
      : 0;
    return {
      Mass: mass,
      Volume: vol,
      // Mass: basePhysicalParameters.mass.massValue * 10 ** basePhysicalParameters.mass.massExponent * SCALE,
      // Volume: basePhysicalParameters.vol.volValue * 10 ** basePhysicalParameters.vol.volExponent * SCALE * KM_TO_M_CONVERSION,
      Density: basePhysicalParameters.density * 1000 /* Fix */,
      Gravity: basePhysicalParameters.gravity,
      Escape: basePhysicalParameters.escape,
      MeanRadius:
        basePhysicalParameters.meanRadius * KM_TO_M * SCALE,
      EquaRadius:
        basePhysicalParameters.equaRadius * KM_TO_M * SCALE,
      PolarRadius:
        basePhysicalParameters.polarRadius * KM_TO_M * SCALE,
      Flattening: basePhysicalParameters.flattening,
      AxialTilt: basePhysicalParameters.axialTilt * DEG_TO_RAD,
      SideralRotation: basePhysicalParameters.sideralRotation * HOUR_TO_SECOND,
      AverageTemperature: basePhysicalParameters.avgTemp,
    };
  };
  private handleSolarSystemData = () => {
    if (
      this._starPlanetaryParameters &&
      this._primaryPlanetaryParameters &&
      this._dumbDwarfParameters
    ) {
      const starSecondaryBodies = [
        ...this._primaryPlanetaryParameters,
        ...this._dumbDwarfParameters,
      ];
      this._starPlanetaryParameters["SecondaryBodyParameters"] =
        starSecondaryBodies;
      this._solarSystemParameters = {
        Primary: this._starPlanetaryParameters,
        Secondary: [
          ...this._primaryPlanetaryParameters,
          ...this._dumbDwarfParameters,
        ],
      };
    }
  };
  get solarSystemParameters() {
    return this._solarSystemParameters;
  }
  public hasFinishedLoading = (): boolean => {
    return !!(
      this._orbitalParameters &&
      this._starPlanetaryParameters &&
      this._primaryPlanetaryParameters &&
      this._dumbDwarfParameters
    );
  };
  public loadingStatus = (): number => {
    const total = 4;
    let definedCount = 0;

    this._orbitalParameters && definedCount++;
    this._starPlanetaryParameters && definedCount++;
    this._primaryPlanetaryParameters && definedCount++;
    this._dumbDwarfParameters && definedCount++;

    return definedCount / total;
  };

  private tempGetPlanetaryPhysicalData = async (bodyNames: string[]) => {
    const response = await fetch("/api/rest/tempphysical", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ bodyNames: bodyNames }),
    });
    const data = await response.json();
    // return this.processPlanetaryPhysicalData(data.bodies as SolarSystemOpenDataResponse[]);
  };

  private _wikiExtract?: string
  public tempFetchCelestialBodyExtract = async (
    planetName: string,
    bodyType: string,
  ): Promise<WikiSummary> => {
    planetName = planetName.toLocaleLowerCase();
    const response = await fetch("/api/rest/tempsummary", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ planetName: planetName, bodyType: bodyType }),
    });
    const data = await response.json();
    return data;
  };
}

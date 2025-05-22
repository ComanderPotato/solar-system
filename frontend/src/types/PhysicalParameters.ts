export const API_INCLUDE_DATA: string[] = [
  "id",
  "name",
  "englishName",
  "mass",
  "{massValue, massExponent}",
  "vol",
  "{volValue, volExponent}",
  "aroundPlanet",
  "{planet}",
  "moons",
  "{moon}",
  "density",
  "gravity",
  "escape",
  "meanRadius",
  "equaRadius",
  "polarRadius",
  "flattening",
  "axialTilt",
  "sideralRotation",
  "avgTemp",
  "bodyType",
];
export type PlanetNames = "Sun" | "Mercury" | "Venus" | "Earth" | "Mars" | "Jupiter" | "Saturn" | "Uranus" | "Neptune" | "Pluto";

export interface SolarSystemOpenDataResponse {
  id: string;
  name: string;
  englishName: PlanetNames;
  mass?: {
    massValue: number;
    massExponent: number;
  };
  vol?: {
    volValue: number;
    volExponent: number;
  };
  aroundPlanet: {
    planet: string;
  };
  moons: [
    {
      moon: string;
    }
  ];
  density: number;
  gravity: number;
  escape: number;
  meanRadius: number;
  equaRadius: number;
  polarRadius: number;
  flattening: number;
  axialTilt: number;
  avgTemp: number;
  sideralRotation: number;
  bodyType: string;
}

export interface BasePhysicalParameters {
  Mass: number;
  Volume: number;
  Density: number;
  Gravity: number;
  Escape: number;
  MeanRadius: number;
  EquaRadius: number;
  PolarRadius: number;
  Flattening: number;
  AxialTilt: number;
  SideralRotation: number;
  AverageTemperature: number;
}

export interface StarPhysicalParameters extends BasePhysicalParameters {
  Luminosity: number;
  SurfaceEmission: number;
}
interface OtherPhysicalParameters extends BasePhysicalParameters {
  LengthOfDay: number;
  MeanTemperature: number;
  SurfacePressure: number;
  RingSystem: boolean;
  InnerRingRadius?: number;
  OuterRingRadius?: number;
  GlobalMagneticField: boolean;
}
export type PlanetPhysicalParameters = OtherPhysicalParameters;
export type MoonPhysicalParameters = OtherPhysicalParameters;
export type OrbitingPhysicalParameters = PlanetPhysicalParameters | MoonPhysicalParameters;
export type PhysicalParameters = StarPhysicalParameters | OrbitingPhysicalParameters;
// export type PhysicalParameters = StarPhysicalParameters | PlanetPhysicalParameters | MoonPhysicalParameters;

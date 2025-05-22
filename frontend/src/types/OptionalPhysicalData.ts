export interface OptionalPhysicalParameters {
  LengthOfDay?: number;
  MeanTemperature?: number;
  SurfacePressure?: number | null;
  RingSystem?: boolean;
  InnerRingRadius?: number;
  OuterRingRadius?: number;
  GlobalMagneticField?: boolean;
  Luminosity?: number;
  SurfaceEmission?: number;
}

export type OptionalOtherPhysicalParameters = Pick<
  OptionalPhysicalParameters,
  "LengthOfDay" | "MeanTemperature" | "SurfacePressure" | "RingSystem" | "InnerRingRadius" | "OuterRingRadius" | "GlobalMagneticField"
>;

export type OptionalSunPhysicalParameters = Pick<OptionalPhysicalParameters, "Luminosity" | "SurfaceEmission">;
export type OptionalPlanetPhysicalParameters = OptionalOtherPhysicalParameters;
export type OptionalMoonPhysicalParameters = OptionalOtherPhysicalParameters;

export type RequiredStarPhysicalParameters = {
  [K in keyof OptionalSunPhysicalParameters]-?: OptionalSunPhysicalParameters[K];
};

export type RequiredOtherPhysicalParameters = {
  [K in keyof OptionalOtherPhysicalParameters]-?: OptionalOtherPhysicalParameters[K];
};
export type RequiredPlanetPhysicalParameters = RequiredOtherPhysicalParameters;
export type RequiredMoonPhysicalParameters = RequiredOtherPhysicalParameters;

export type RequiredPhysicalParameters = RequiredOtherPhysicalParameters | RequiredStarPhysicalParameters;

export interface CelestialOptionalPhysicalParameters {
  Sun: RequiredStarPhysicalParameters;
  Mercury: RequiredPlanetPhysicalParameters;
  Venus: RequiredPlanetPhysicalParameters;
  Earth: RequiredPlanetPhysicalParameters;
  Mars: RequiredPlanetPhysicalParameters;
  Jupiter: RequiredPlanetPhysicalParameters;
  Saturn: RequiredPlanetPhysicalParameters;
  Uranus: RequiredPlanetPhysicalParameters;
  Neptune: RequiredPlanetPhysicalParameters;
  Pluto: RequiredPlanetPhysicalParameters;
}

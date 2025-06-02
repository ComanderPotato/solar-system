import { Vector3 } from "three";
// ==================================================================================================================
// ORBITAL PARAMETERS
// ==================================================================================================================

export type FetchedOrbitalParameters = {
  [celestialBodyName: string]: OrbitalParametersResponse;
};
export interface OrbitalParametersResponse {
  Position: [number, number, number];
  DistanceFromPrimary: number;
  Velocity: [number, number, number];
  ApoapsisDistance: number; // Remove Distance
  ArgumentOfLatitude: number;
  ArgumentOfPeriapsis: number;
  EccentricAnomaly: number;
  OrbitalEccentricity: number; // OrbitalEccentricity
  Inclination: number;
  LongitudeOfAscendingNode: number;
  LongitudeOfPeriapsis: number;
  MeanAnomaly: number;
  MeanLongitude: number;
  MeanMotionPerDay: number;
  PeriapsisDistance: number;
  PeriapsisTime: number;
  PeriodInDays: number;
  SemiLatusRectum: number;
  SemiMajorAxis: number;
  SemiMinorAxis: number;
  TrueAnomaly: number;
  TrueLongitude: number;
}
export interface OrbitalParameters {
  Position: Vector3; // X, Y, Z position in meters
  DistanceFromPrimary: number; // Distance from the primary body (Earth) in meters
  Velocity: Vector3; // Velocity in m/s along X, Y, Z axes
  ApoapsisDistance: number; // Apoapsis (farthest point) distance in meters MAYBE CHANGE TO APSIS FOR WIKI
  ArgumentOfLatitude: number; // Argument of latitude in radians
  ArgumentOfPeriapsis: number; // Argument of periapsis in radians
  EccentricAnomaly: number; // Eccentric anomaly in radians
  OrbitalEccentricity: number; // Orbit eccentricity (0 = circular, 1 = parabolic) // Doesnt work ORBITALECCENTRICTY
  Inclination: number; // Inclination angle in radians
  LongitudeOfAscendingNode: number; // Longitude of ascending node in radians
  LongitudeOfPeriapsis: number; // Longitude of periapsis in radians
  MeanAnomaly: number; // Mean anomaly in radians
  MeanLongitude: number; // Mean longitude in radians
  MeanMotionPerDay: number; // Mean motion (orbits per day)
  PeriapsisDistance: number; // Periapsis (closest point) distance in meters
  PeriapsisTime: number; // Time of periapsis passage (Julian Date)
  PeriodInDays: number; // Orbital period in days
  SemiLatusRectum: number; // Semi-latus rectum in meters
  SemiMajorAxis: number; // Semi-major axis (orbit size) in meters
  SemiMinorAxis: number; // Semi-minor axis in meters
  TrueAnomaly: number; // True anomaly in radians
  TrueLongitude: number; // True longitude in radians
}
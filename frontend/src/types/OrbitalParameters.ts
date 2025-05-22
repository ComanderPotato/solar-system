import { Vector3 } from "three";
type Planets = "Sun" | "Earth" | "Mars" | "Jupiter" | "Saturn" | "Mercury" | "Uranus" | "Pluto" | "Venus" | "Neptune";

export type SecondaryOrbitalElements = {
  [secondaryName: string]: OrbitalElements;
};
export type PlanetaryOrbitalElements = {
  [planet in Planets]: OrbitalElements;
};
export type PlanetaryOrbitalElementsResponse = {
  [planet in Planets]: OrbitalElementsResponse;
};
export const distanceKeys = ["DistanceFromPrimary", "ApoapsisDistance", "PeriapsisDistance", "SemiLatusRectum", "SemiMajorAxis", "SemiMinorAxis"] as const;

// export const angleTypes = ["ArgumentOfLatitude", "ArgumentOfPeriapsis", "EccentricAnomaly", "Inclination", "LongitudeOfAscendingNode", "LongitudeOfPeriapsis", "MeanAnomaly", "MeanLongitude", "TrueAnomaly", "TrueLongitude" ] as const;

export const vector3Keys = ["Position", "Velocity"] as const;

export interface OrbitalElementsResponse {
  Position: [number, number, number]; // X, Y, Z position in meters
  DistanceFromPrimary: number; // Distance from the primary body (Earth) in meters
  Velocity: [number, number, number]; // Velocity in m/s along X, Y, Z axes
  ApoapsisDistance: number; // Apoapsis (farthest point) distance in meters
  ArgumentOfLatitude: number; // Argument of latitude in radians
  ArgumentOfPeriapsis: number; // Argument of periapsis in radians
  EccentricAnomaly: number; // Eccentric anomaly in radians
  Eccentricity: number; // Orbit eccentricity (0 = circular, 1 = parabolic)
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
export interface OrbitalElements {
  Position: Vector3; // X, Y, Z position in meters
  DistanceFromPrimary: number; // Distance from the primary body (Earth) in meters
  Velocity: Vector3; // Velocity in m/s along X, Y, Z axes
  ApoapsisDistance: number; // Apoapsis (farthest point) distance in meters
  ArgumentOfLatitude: number; // Argument of latitude in radians
  ArgumentOfPeriapsis: number; // Argument of periapsis in radians
  EccentricAnomaly: number; // Eccentric anomaly in radians
  Eccentricity: number; // Orbit eccentricity (0 = circular, 1 = parabolic)
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
  ParentBody: string;
}

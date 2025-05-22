import { Vector3 } from "three";
import {
  CelestialMetadata,
  TextureParameters,
  PhysicalParameters,
  OrbitalElements,
  ModelParameters,
  StarPhysicalParameters,
  PlanetPhysicalParameters,
  MoonPhysicalParameters,
} from ".";
type PlanetOrbitalElements = OrbitalElements;
type MoonOrbitalElements = OrbitalElements;
type SpacecraftOrbitalElements = OrbitalElements;
export type OrbitalParameters = PlanetOrbitalElements | MoonOrbitalElements | SpacecraftOrbitalElements;

export interface BaseCelestialBodyParameters {
  MetaData: CelestialMetadata;
  Physical: PhysicalParameters;
  SecondaryBodyParameters?: OrbitingBodyParameters[];
}
// Maybe pass physical into individual parameters
export interface StarParameters extends BaseCelestialBodyParameters {
  Texture: TextureParameters;
  Physical: StarPhysicalParameters;
  // SecondaryBodyParameters?: OrbitingBodyParameters[];
  Position: Vector3;
}
export interface PlanetParameters extends BaseCelestialBodyParameters {
  Orbital: OrbitalParameters;
  Physical: PlanetPhysicalParameters;
  // SecondaryBodyParameters?: (MoonParameters | SpacecraftParameters)[];
  Texture: TextureParameters;
}
export interface MoonParameters extends BaseCelestialBodyParameters {
  Orbital: OrbitalParameters;
  Physical: MoonPhysicalParameters;
  // SecondaryBodyParameters?: SpacecraftParameters[];
  Texture: TextureParameters;
}
export interface SpacecraftParameters extends BaseCelestialBodyParameters {
  Orbital: OrbitalParameters;
  // Physical: MoonPhysicalParameters
  Model: ModelParameters;
}

export type OrbitingBodyParameters = PlanetParameters | MoonParameters | SpacecraftParameters;

export type CelestialBodyParameters = StarParameters | OrbitingBodyParameters;

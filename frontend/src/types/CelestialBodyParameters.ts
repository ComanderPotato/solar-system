import { CelestialMetadata, BasePhysicalParameters, PlanetPhysicalParameters, StarPhysicalParameters, OrbitalParameters, TextureParameters } from ".";
// ==================================================================================================================
// CELESTIAL BODY PARAMETERS
// ==================================================================================================================
export interface BaseCelestialBodyParameters {
	MetaData: CelestialMetadata;
	Physical: BasePhysicalParameters;
	SecondaryBodyNames?: string[];
	Textures?: TextureParameters;
}
export interface OrbitingBodyParameters extends BaseCelestialBodyParameters {
	Orbital: OrbitalParameters;
}
export interface StarParameters extends BaseCelestialBodyParameters {
	Physical: StarPhysicalParameters;
	Textures: TextureParameters;
}
export interface PlanetParameters extends OrbitingBodyParameters {
	Physical: PlanetPhysicalParameters;
	Orbital: OrbitalParameters;
	Textures: TextureParameters;
}
export interface MoonParameters extends OrbitingBodyParameters {
	Orbital: OrbitalParameters;
	Textures: TextureParameters;
}
// export interface SpacecraftParameters extends OrbitingBodyParameters {
// 	SecondaryBodies: undefined;
// }

export type CelestialBodyParameters = OrbitingBodyParameters | StarParameters | PlanetParameters | MoonParameters;

export interface CelestialBodies {
	[celestialBodyName: string]: CelestialBodyParameters;
}
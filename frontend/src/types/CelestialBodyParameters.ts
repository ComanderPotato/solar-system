import { CelestialMetadata } from "./CelestialBodyMetadata";
import { BasePhysicalParameters } from "./PhysicalParameters";
import { PlanetPhysicalParameters } from "./PhysicalParameters";
import { StarPhysicalParameters } from "./PhysicalParameters";
import { MoonPhysicalParameters } from "./PhysicalParameters";
import { OrbitalParameters } from "./OrbitalParameters";
import { TextureFlags } from "./TextureParameters";
// ==================================================================================================================
// CELESTIAL BODY PARAMETERS
// ==================================================================================================================
export interface BaseCelestialBodyParameters {
	MetaData: CelestialMetadata;
	Physical: BasePhysicalParameters;
	SecondaryNames?: string[];
}
export interface OrbitingBodyParameters extends BaseCelestialBodyParameters {
	Orbital: OrbitalParameters;
}

export interface MeshedParameters {
	Textures: TextureFlags;
}
export interface StarParameters extends BaseCelestialBodyParameters, MeshedParameters {
	Physical: StarPhysicalParameters;
}
export interface PlanetParameters extends OrbitingBodyParameters, MeshedParameters {
	Physical: PlanetPhysicalParameters;
}
export interface MoonParameters extends OrbitingBodyParameters, MeshedParameters {
	Physical: MoonPhysicalParameters;
	// Orbital: OrbitalParameters;
}
// export interface SpacecraftParameters extends OrbitingBodyParameters {
// 	SecondaryBodies: undefined;
// }

export type CelestialBodyParameters = OrbitingBodyParameters | StarParameters | PlanetParameters | MoonParameters;

export interface CelestialBodies {
	[celestialBodyName: string]: CelestialBodyParameters;
}

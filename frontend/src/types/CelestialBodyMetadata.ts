// ==================================================================================================================
// METADATA PARAMETERS
// ==================================================================================================================
export type BodyTypes = "Star" | "Planet" | "DwarfPlanet" | "Moon";
export interface CelestialMetadata {
	Id: string;
	Name: string;
	EnglishName: string;
	BodyType: BodyTypes;
}
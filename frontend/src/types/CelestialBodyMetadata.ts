// ==================================================================================================================
// METADATA PARAMETERS
// ==================================================================================================================
// export type BodyTypes = "Star" | "Planet" | "DwarfPlanet" | "Moon";
export enum BodyTypes {
	Star = "Star",
	Planet = "Planet",
	DwarfPlanet = "DwarfPlanet",
	Moon = "Moon",
	// Spaceship = "Spaceship",
}
export interface CelestialMetadata {
	Id: string;
	Name: string;
	EnglishName: string;
	BodyType: BodyTypes;
}

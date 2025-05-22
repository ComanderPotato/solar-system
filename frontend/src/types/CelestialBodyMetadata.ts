export type BodyTypes = "Star" | "Planet" | "Dwarf Planet" | "Moon"
export interface CelestialMetadata {
    Id: string;
    Name: string;
    EnglishName: string;
    BodyType: BodyTypes;
}
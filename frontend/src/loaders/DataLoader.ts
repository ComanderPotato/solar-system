import { BodyTypes, OrbitalElementsResponse, PlanetNames } from "../types";
export interface PhysicalParametersResponse {
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
  bodyType: BodyTypes;
}
type FetchedSummary = {
  extract: string;
}

export type FetchedPhysicalParameters = {
  [secondaryName: string]: PhysicalParametersResponse;
};

export type FetchedOrbitalParameters = {
  [secondaryName: string]: OrbitalElementsResponse;
};
export default class DataLoader {

  public fetchPhysicalParameters = async (bodyNames: string[]): Promise<FetchedPhysicalParameters> => {
    const response = await fetch("/api/rest/physical", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ bodyNames: bodyNames }),
    });
    const data = await response.json();
    return data;
  };
  public fetchOrbitalParameters = async (primaryName: string, secondaryNames: string[]): Promise<FetchedOrbitalParameters> /* Check DataService for return type*/ => {
    const response = await fetch("/api/rest/orbital", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ primaryName: primaryName, secondaryNames: secondaryNames }),
    });
    const data = await response.json();
    return data
  };

  
  public fetchSummary = async (planetName: string, bodyType: string): Promise<FetchedSummary> => {
    planetName = planetName.toLocaleLowerCase();
    const response = await fetch("/api/rest/summary", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ planetName: planetName, bodyType: bodyType }),
    });
    const data = await response.json();
    return data;
  };
}

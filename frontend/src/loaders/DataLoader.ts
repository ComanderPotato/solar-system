import { PlanetNames, SecondaryOrbitalElements } from "../types";

interface WikiSummary {
  extract: string;
}
export default class DataLoader {

    constructor() {

    }




    public fetchPhysicalParameters = async (bodyNames: string[]) /* Check DataService for return type*/ => {
        const response = await fetch(`/api/rest/physical`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ bodyNames: bodyNames }),
        });
        const data = await response.json();
        // ... Check DataService
    };

    public fetchMoonOrbitalParameters = async (primaryName: string, secondaryMoons: string[]): Promise<SecondaryOrbitalElements> /* Check DataService for return type*/ => {
        const response = await fetch(`/api/rest/orbital`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ primaryName: primaryName, secondaryMoons: secondaryMoons}),
        });
        const data = await response.json();
        // ... Check DataService
        return data
      };
    public fetchPlanetaryData = async (primaryName: string, secondaryNames: string[]) /* Check DataService for return type*/ => {
        // Can join fetchMoon and fetchPlanetary if refactor backend
        const response = await fetch("/api/rest/orbital", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ primaryName: primaryName, secondaryNames: secondaryNames}),
        })
        const data = await response.json();

        // ... Check DataService
      };
    public fetchCelestialBodyExtract = async (planetName: string, bodyType: string): Promise<WikiSummary> => {
        planetName = planetName.toLocaleLowerCase();
        const response = await fetch("/api/rest/tempsummary", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ planetName: planetName, bodyType: bodyType }),
        });
        const data = await response.json();
        return data;
    };
}

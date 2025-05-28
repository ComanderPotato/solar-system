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
	summary: string;
};

export type FetchedPhysicalParameters = {
	[secondaryName: string]: PhysicalParametersResponse;
};

export type FetchedOrbitalParameters = {
	[secondaryName: string]: OrbitalElementsResponse;
};
export default class DataLoader {
	private _extractCache: Map<string, Promise<FetchedSummary>> = new Map();
	private _hasLoaded = false;

	get hasLoaded(): boolean {
		return this._hasLoaded;
	}

	public fetchPhysicalParameters = async (bodyNames: string[]): Promise<FetchedPhysicalParameters> => {
		const response = await fetch("/api/rest/parameters/physical", {
			method: "POST",
			headers: {
				"Content-Type": "application/json",
			},
			body: JSON.stringify({
				bodyNames: bodyNames,
			}),
		});
		const data = await response.json();
		return data;
	};
	public fetchOrbitalParameters = async (primaryName: string, secondaryNames: string[]): Promise<FetchedOrbitalParameters> => {
		const response = await fetch("/api/rest/parameters/orbital", {
			method: "POST",
			headers: {
				"Content-Type": "application/json",
			},
			body: JSON.stringify({
				primaryName: primaryName,
				secondaryNames: secondaryNames,
			}),
		});
		const data = await response.json();
		return data;
	};

	public fetchFocusedSummary = async (planetName: string, bodyType: string): Promise<FetchedSummary> => {
		planetName = planetName.replaceAll(" ", "_");
		if (this._extractCache.has(planetName)) return this._extractCache.get(planetName)!;
		const response = await fetch("/api/rest/summary/celestial", {
			method: "POST",
			headers: {
				"Content-Type": "application/json",
			},
			body: JSON.stringify({
				planetName: planetName,
				bodyType: bodyType,
			}),
		});
		const data = await response.json();
		this._extractCache.set(planetName, data);
		return data;
	};

	public fetchParameterSummary = async (parameterName: string): Promise<FetchedSummary> => {
		parameterName = parameterName.replaceAll(" ", "_");
		if (this._extractCache.has(parameterName)) return this._extractCache.get(parameterName)!;

		const response = await fetch("/api/rest/summary/parameter", {
			method: "POST",
			headers: {
				"Content-Type": "application/json",
			},
			body: JSON.stringify({
				parameterName: parameterName,
			}),
		});
		const data = await response.json();
		this._extractCache.set(parameterName, data);
		return data;
	};
}

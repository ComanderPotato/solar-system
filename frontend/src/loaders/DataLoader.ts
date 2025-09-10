// import { FetchedPhysicalParameters, FetchedOrbitalParameters } from "../types";

import { FetchedOrbitalParameters } from "../types/OrbitalParameters";
import { FetchedPhysicalParameters } from "../types/PhysicalParameters";
import { preprocessParameter } from "../utils/uiHelpers";

// import { preprocessParameter } from "../utils";
export interface FetchedSummary {
	summary: string;
}

export default class DataLoader {
	private _extractCache: Map<string, Promise<FetchedSummary>> = new Map();

	public hasExtract = (key: string): boolean => {
		return this._extractCache.has(key);
	};
	public async fetchPhysicalParameters(
		bodyNames: string[],
		filterBy: string = "englishName",
	): Promise<FetchedPhysicalParameters> {
		const response = await fetch("/api/rest/parameters/physical", {
			method: "POST",
			headers: {
				"Content-Type": "application/json",
			},
			body: JSON.stringify({
				bodyNames: bodyNames,
				filterBy: filterBy,
			}),
		});
		const data = await response.json();
		return data;
	}
	public async fetchOrbitalParameters(
		primaryName: string,
		secondaryNames: string[],
	): Promise<FetchedOrbitalParameters> {
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
	}

	public async fetchFocusedSummary(planetName: string, bodyType: string): Promise<FetchedSummary> {
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
	}

	public async fetchParameterSummary(parameterName: string): Promise<FetchedSummary> {
		if (this._extractCache.has(parameterName)) return this._extractCache.get(parameterName)!;
		const processedParamaterName = preprocessParameter(parameterName).replaceAll(" ", "_").toLowerCase();

		const response = await fetch("/api/rest/summary/parameter", {
			method: "POST",
			headers: {
				"Content-Type": "application/json",
			},
			body: JSON.stringify({
				parameterName: processedParamaterName,
			}),
		});
		const data = await response.json();
		this._extractCache.set(parameterName, data);
		return data;
	}
}

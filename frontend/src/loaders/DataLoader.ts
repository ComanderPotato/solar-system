import { FetchedSummary, FilterBy } from "../interfaces/managers/IDataManager";
import { FetchedOrbitalParameters } from "../types/OrbitalParameters";
import { FetchedPhysicalParameters } from "../types/PhysicalParameters";
import { preprocessParameter } from "../utils/uiHelpers";

const BASE_API_ENDPOINT = "/api/rest";
function endpointBuilder(...path: string[]) {
	return [BASE_API_ENDPOINT, ...path].join("/");
}

export default class DataLoader {
	private _summaryCache: Map<string, FetchedSummary> = new Map();

	public hasSummary(key: string): boolean {
		return this._summaryCache.has(key);
	}
	private async fetchData<T>(url: string, body: unknown): Promise<T> {
		try {
			const response = await fetch(url, {
				method: "POST",
				headers: {
					"Content-Type": "application/json",
				},
				body: JSON.stringify(body),
			});
			if (!response.ok) {
				throw new Error(`HTTP error, status error: ${response.status}`);
			}
			return await response.json();
		} catch (error) {
			throw new Error("Fetched failed", { cause: error });
		}
	}
	public async fetchPhysicalParameters(
		bodyNames: string[],
		filterBy: FilterBy = FilterBy.EnglishName,
	): Promise<FetchedPhysicalParameters> {
		// const response = await fetch("/api/rest/parameters/physical", {
		// 	method: "POST",
		// 	headers: {
		// 		"Content-Type": "application/json",
		// 	},
		// 	body: JSON.stringify({
		// 		bodyNames: bodyNames,
		// 		filterBy: filterBy,
		// 	}),
		// });
		// const data = await response.json();
		// console.log("Balls");
		// console.log(data);
		// return data;
		const url = endpointBuilder("parameters", "physical");
		return await this.fetchData(url, { bodyNames, filterBy });
	}
	public async fetchOrbitalParameters(
		primaryName: string,
		secondaryNames: string[],
	): Promise<FetchedOrbitalParameters> {
		const url = endpointBuilder("parameters", "orbital");
		return await this.fetchData(url, { primaryName, secondaryNames });
	}

	public async fetchFocusedSummary(planetName: string, bodyType: string): Promise<FetchedSummary> {
		planetName = planetName.replaceAll(" ", "_");
		if (this._summaryCache.has(planetName)) return this._summaryCache.get(planetName)!;

		const url = endpointBuilder("summary", "celestial");
		const data = await this.fetchData<FetchedSummary>(url, { planetName, bodyType });
		this._summaryCache.set(planetName, data);
		return data;
	}

	public async fetchParameterSummary(parameterName: string): Promise<FetchedSummary> {
		parameterName = preprocessParameter(parameterName).replaceAll(" ", "_").toLowerCase();
		if (this._summaryCache.has(parameterName)) return this._summaryCache.get(parameterName)!;

		const url = endpointBuilder("summary", "parameter");
		const data = await this.fetchData<FetchedSummary>(url, { parameterName });
		this._summaryCache.set(parameterName, data);
		return data;
	}
}

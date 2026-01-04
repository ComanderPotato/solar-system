import { FetchedSummary, FilterBy } from "../interfaces/managers/IDataManager";
import { FetchedOrbitalParameters } from "../types/OrbitalParameters";
import { FetchedPhysicalParameters } from "../types/PhysicalParameters";
import { preprocessParameter } from "../utils/uiHelpers";

const BASE_API_ENDPOINT = "/rest/v1";

function endpointBuilder(...path: string[]) {
	return [BASE_API_ENDPOINT, ...path].join("/");
}
function camelToSnake(str: string): string {
	return str.replace(/([A-Z])/g, "_$1").toLowerCase();
}
export default class DataLoader {
	private _summaryCache: Map<string, FetchedSummary> = new Map();

	public hasSummary(key: string): boolean {
		return this._summaryCache.has(key);
	}
	private queryParamsBuilder(params: object) {
		const query = new URLSearchParams();
		for (const [key, value] of Object.entries(params)) {
			const processedKey = camelToSnake(key);
			if (Array.isArray(value)) {
				value.forEach((param) => query.append(processedKey, param));
			} else {
				query.append(processedKey, value);
			}
		}
		return "?".concat(query.toString());
	}
	private async fetchData<T>(url: string, body?: unknown): Promise<T> {
		try {
			const response = await fetch(url, {
				method: "GET",
				headers: {
					"Content-Type": "application/json",
				},
				// body: JSON.stringify(body),
			});
			if (!response.ok) {
				const text = await response.text();
				throw new Error(`HTTP ${response.status}: ${text}`);
			}
			return await response.json();
		} catch (error) {
			throw new Error("Fetched failed", { cause: error });
		}
	}
	public async fetchMoonPhysical(
		primaryName: string,
		filterBy: FilterBy = FilterBy.ID,
	): Promise<FetchedPhysicalParameters> {
		const url = [BASE_API_ENDPOINT, "parameters", "physical", primaryName, "moons"]
			.join("/")
			.concat(this.queryParamsBuilder({ filterBy }));
		return await this.fetchData(url);
	}
	public async fetchPhysicalParameters(
		bodyNames: string[],
		filterBy: FilterBy = FilterBy.EnglishName,
	): Promise<FetchedPhysicalParameters> {
		const url = endpointBuilder("parameters", "physical").concat(this.queryParamsBuilder({ bodyNames, filterBy }));

		return await this.fetchData(url);
	}
	public async fetchOrbitalParameters(
		primaryName: string,
		secondaryNames: string[],
	): Promise<FetchedOrbitalParameters> {
		const url = endpointBuilder("parameters", "orbital").concat(
			this.queryParamsBuilder({ primaryName, secondaryNames }),
		);
		return await this.fetchData(url);
	}

	public async fetchFocusedSummary(celestial_name: string, bodyType: string): Promise<FetchedSummary> {
		celestial_name = celestial_name.replaceAll(" ", "_");
		if (this._summaryCache.has(celestial_name)) return this._summaryCache.get(celestial_name)!;

		const url = endpointBuilder("summary", "celestial").concat(
			this.queryParamsBuilder({ celestial_name, bodyType }),
		);
		const data = await this.fetchData<FetchedSummary>(url);
		this._summaryCache.set(celestial_name, data);
		return data;
	}

	public async fetchParameterSummary(parameterName: string): Promise<FetchedSummary> {
		parameterName = preprocessParameter(parameterName).replaceAll(" ", "_").toLowerCase();
		if (this._summaryCache.has(parameterName)) return this._summaryCache.get(parameterName)!;

		const url = endpointBuilder("summary", "parameter").concat(this.queryParamsBuilder({ parameterName }));
		const data = await this.fetchData<FetchedSummary>(url);
		this._summaryCache.set(parameterName, data);
		return data;
	}
}

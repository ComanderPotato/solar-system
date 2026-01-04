import { Vector3 } from "three";
import { FetchedOrbitalParameters } from "../types/OrbitalParameters";
import { FetchedPhysicalParameters } from "../types/PhysicalParameters";
import { CelestialMetadata } from "../types/CelestialBodyMetadata";
import {
	PhysicalParametersResponse,
	BasePhysicalParameters,
	StarPhysicalParameters,
} from "../types/PhysicalParameters";
import { CelestialTextures } from "../types/TextureParameters";
import { OptionalPhsyicalParametersJSON } from "../types/PhysicalParameters";
import { StarParameters } from "../types/CelestialBodyParameters";
import { OrbitalParametersResponse, OrbitalParameters } from "../types/OrbitalParameters";
import { distanceParametersToProcess } from "../types/ParameterCategories";
import { PlanetPhysicalParameters } from "../types/PhysicalParameters";
import { PlanetParameters } from "../types/CelestialBodyParameters";
import { MoonParameters } from "../types/CelestialBodyParameters";
import { CelestialBodyParameters } from "../types/CelestialBodyParameters";
import { PhysicalParameters } from "../types/PhysicalParameters";
import { MoonPhysicalParameters } from "../types/PhysicalParameters";
import { CelestialBodies } from "../types/CelestialBodyParameters";
import { BodyTypes } from "../types/CelestialBodyMetadata";

import { HOUR_TO_SECOND, KM_TO_M, SCALE } from "./constants";
import optionalPhysicalData from "../data/optionalPhysicalData.json";
import textures from "../data/textures.json";
export default class DataProcessor {
	private _optionalPhysicalParameters: OptionalPhsyicalParametersJSON = optionalPhysicalData;
	private _textures: CelestialTextures = textures;
	private static _totalFactor: number = 0;
	private static _totalDistance: number = 0;
	private static _count: number = 0;

	public process = (
		fetchedPhysicalParameters: FetchedPhysicalParameters,
		fetchedOrbitalParameters: FetchedOrbitalParameters,
		requireOrbitalParameters: boolean = true,
	): CelestialBodies => {
		const processedParameters: CelestialBodies = {};

		for (const secondaryName of Object.keys(fetchedPhysicalParameters)) {
			const physicalParameters: PhysicalParametersResponse = fetchedPhysicalParameters[secondaryName];
			const orbitalParameters: OrbitalParametersResponse | undefined = fetchedOrbitalParameters[secondaryName];

			if (requireOrbitalParameters && !orbitalParameters) continue;
			const metaData = this.processMetadata(physicalParameters);
			processedParameters[physicalParameters.englishName] = this.concatenateParameters(
				metaData,
				this.processPhysical(physicalParameters, metaData.BodyType),
				this.processOrbitalParameters(orbitalParameters),
				this.processSecondaryBodies(physicalParameters),
			);
		}
		return processedParameters;
	};

	private concatenateParameters = (
		metadata: CelestialMetadata,
		physical: PhysicalParameters,
		orbital?: OrbitalParameters,
		secondary?: string[],
	): CelestialBodyParameters => {
		physical.SolarRotation = this.processSideralRotation(physical, orbital);

		switch (metadata.BodyType) {
			case BodyTypes.Star: {
				// case "Star": {
				return {
					MetaData: metadata,
					Physical: physical as StarPhysicalParameters,
					SecondaryNames: secondary,
					Textures: this._textures[metadata.BodyType][metadata.EnglishName],
				} as StarParameters;
			}
			case BodyTypes.Planet:
			case BodyTypes.DwarfPlanet: {
				// case "Planet":
				// case "DwarfPlanet": {
				return {
					MetaData: metadata,
					Physical: physical as PlanetPhysicalParameters,
					Orbital: orbital,
					SecondaryNames: secondary,
					Textures: this._textures[metadata.BodyType][metadata.EnglishName],
				} as PlanetParameters;
			}
			case BodyTypes.Moon: {
				// case "Moon": {
				return {
					MetaData: metadata,
					Physical: physical as BasePhysicalParameters,
					Orbital: orbital,
					SecondaryNames: secondary,
					Textures: this._textures[metadata.BodyType]["Moon"],
				} as MoonParameters;
			}
		}
	};
	private processMetadata = (fetchedPhysicalParameters: PhysicalParametersResponse): CelestialMetadata => {
		return {
			Id: fetchedPhysicalParameters.id,
			Name: fetchedPhysicalParameters.name,
			EnglishName: fetchedPhysicalParameters.englishName,
			BodyType: fetchedPhysicalParameters.bodyType.replace(" ", "") as BodyTypes,
		};
	};
	private processPhysical = (
		fetchedPhysicalParameters: PhysicalParametersResponse,
		bodyType: BodyTypes,
	): PhysicalParameters => {
		switch (bodyType) {
			case BodyTypes.Star: {
				// case "Star": {
				return {
					...this.processBasePhysical(fetchedPhysicalParameters),
					...this._optionalPhysicalParameters[fetchedPhysicalParameters.englishName],
				} as StarPhysicalParameters;
			}
			// case "DwarfPlanet":
			// case "Planet": {
			case BodyTypes.DwarfPlanet:
			case BodyTypes.Planet: {
				return {
					...this.processBasePhysical(fetchedPhysicalParameters),
					...this._optionalPhysicalParameters[fetchedPhysicalParameters.englishName],
				} as PlanetPhysicalParameters;
			}
			// case "Moon": {
			case BodyTypes.Moon: {
				return {
					...this.processBasePhysical(fetchedPhysicalParameters),
				} as MoonPhysicalParameters;
			}
		}
	};

	safeVectorScale(values: number[], scale: number): Vector3 {
		const safe = values.map((v) => (Number.isFinite(v) ? v * scale : v));
		return new Vector3(...safe);
	}
	private processOrbitalParameters = (
		orbitalParameters?: OrbitalParametersResponse,
	): OrbitalParameters | undefined => {
		if (!orbitalParameters) return;
		// distanceParametersToProcess.map(
		// 	(distanceParameter) =>
		// 		(orbitalParameters[distanceParameter] = orbitalParameters[distanceParameter] * SCALE),
		distanceParametersToProcess.forEach((distanceParameter) => {
			const value = orbitalParameters[distanceParameter];

			if (Number.isFinite(value)) {
				orbitalParameters[distanceParameter] = value * SCALE;
			}
		}); // );
		return {
			...orbitalParameters,
			// Position: this.safeVectorScale(orbitalParameters.Position, SCALE),
			// Velocity: this.safeVectorScale(orbitalParameters.Velocity, SCALE),
			Position: new Vector3(...orbitalParameters.Position).multiplyScalar(SCALE),
			Velocity: new Vector3(...orbitalParameters.Velocity).multiplyScalar(SCALE),
		};
	};
	public processBasePhysical = (basePhysicalParameters: PhysicalParametersResponse): BasePhysicalParameters => {
		return {
			PlanetaryMass: this.processMass(basePhysicalParameters) * SCALE,
			Volume: this.processVolume(basePhysicalParameters) * SCALE,
			Density: basePhysicalParameters.density * 1000 /* Fix */,
			Gravity: basePhysicalParameters.gravity,
			EscapeVelocity: basePhysicalParameters.escape,
			OrbitalPeriod: basePhysicalParameters.sideralOrbit,
			MeanRadius: basePhysicalParameters.meanRadius * KM_TO_M * SCALE,
			EquatorialRadius: basePhysicalParameters.equaRadius * KM_TO_M * SCALE,
			PolarRadius: basePhysicalParameters.polarRadius * KM_TO_M * SCALE,
			Flattening: basePhysicalParameters.flattening,
			AxialTilt: basePhysicalParameters.axialTilt * (Math.PI / 180),
			SolarRotation: basePhysicalParameters.sideralRotation * HOUR_TO_SECOND,
			AverageTemperature: basePhysicalParameters.avgTemp,
		};
	};

	private processSideralRotation = (
		physicalParameters: PhysicalParameters,
		orbitalParameters?: OrbitalParameters,
	): number => {
		if (!orbitalParameters) return physicalParameters.SolarRotation;
		if (physicalParameters.SolarRotation != 0) {
			DataProcessor._totalFactor += Math.abs(orbitalParameters.PeriodInDays / physicalParameters.SolarRotation);
			DataProcessor._totalDistance += orbitalParameters.DistanceFromPrimary;
			DataProcessor._count += 1;
			return physicalParameters.SolarRotation;
		} else {
			const averageFactor = DataProcessor._totalFactor / DataProcessor._count;
			const averageDistance = DataProcessor._totalDistance / DataProcessor._count;
			const adjustedFactor = averageFactor * (orbitalParameters.DistanceFromPrimary / averageDistance);
			return orbitalParameters.PeriodInDays / adjustedFactor;
		}
	};
	private processSecondaryBodies = (physicalParameters: PhysicalParametersResponse): string[] | undefined => {
		if (!physicalParameters.moons) return;
		return physicalParameters.moons.map((key) => key.rel.split("/").at(-1)!);
	};
	public processMass = (basePhysicalParameters: PhysicalParametersResponse): number => {
		if (basePhysicalParameters.mass) {
			const massValue = basePhysicalParameters.mass.massValue;
			const massExponent = basePhysicalParameters.mass.massExponent;
			return massValue * 10 ** massExponent;
		}
		//   else if (basePhysicalParameters.meanRadius) moon.Physical.Mass = (4 / 3) * Math.PI * moon.Physical.MeanRadius ** 3 * moon.Physical.Density;
		return -1;
	};
	public processVolume = (basePhysicalParameters: PhysicalParametersResponse): number => {
		const { vol, mass, density, meanRadius, equaRadius, polarRadius } = basePhysicalParameters;
		if (vol) {
			return vol.volValue * 10 ** vol.volExponent;
		} else if (mass) {
			return (mass.massValue * 10 ** mass.massExponent) / density;
		} else if (meanRadius) {
			return (4 / 3) * Math.PI * meanRadius ** 3;
		} else if (equaRadius && polarRadius) {
			return (4 / 3) * Math.PI * equaRadius ** 2 * polarRadius;
		}
		return -1;
	};
}

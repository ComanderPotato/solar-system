import { BodyTypes } from ".";
// ==================================================================================================================
// PHYSICAL PARAMETERS
// ==================================================================================================================

export type FetchedPhysicalParameters = {
	[celestialBodyName: string]: PhysicalParametersResponse;
};
export interface PhysicalParametersResponse {
	id: string;
	name: string;
	englishName: string;
	mass?: {
		massValue: number;
		massExponent: number;
	};
	vol?: {
		volValue: number;
		volExponent: number;
	};
	moons?: [
		{
			moon: string;
			rel: string;
		}
	];
	density: number;
	gravity: number;
	escape: number;
	sideralOrbit: number;
	meanRadius: number;
	equaRadius: number;
	polarRadius: number;
	flattening: number;
	axialTilt: number;
	avgTemp: number;
	sideralRotation: number; // RotationPeriod
	bodyType: BodyTypes;
}

export interface BasePhysicalParameters {
	PlanetaryMass: number;
	Volume: number;
	Density: number;
	Gravity: number;
	EscapeVelocity: number;
	OrbitalPeriod: number;
	MeanRadius: number;
	EquatorialRadius: number;
	PolarRadius: number;
	Flattening: number;
	AxialTilt: number;
	SolarRotation: number;
	AverageTemperature: number;
}
export interface OptionalPhysicalParameters {
	LengthOfDay?: number;
	MeanTemperature?: number;
	SurfacePressure?: number | null;
	RingSystem?: boolean;
	InnerRingRadius?: number;
	OuterRingRadius?: number;
	GlobalMagneticField?: boolean;
	Luminosity?: number;
	Emissivity?: number;
}
export interface StarPhysicalParameters extends BasePhysicalParameters, OptionalPhysicalParameters {
	Luminosity: number;
	Emissivity: number;
}
export interface PlanetPhysicalParameters extends BasePhysicalParameters, OptionalPhysicalParameters {
	LengthOfDay: number;
	MeanTemperature: number;
	SurfacePressure: number;
	RingSystem: boolean;
	InnerRingRadius?: number;
	OuterRingRadius?: number;
	GlobalMagneticField: boolean;
}
export type MoonPhysicalParameters = BasePhysicalParameters;

export type PhysicalParameters = MoonPhysicalParameters | StarPhysicalParameters | PlanetPhysicalParameters;
export type OptionalPhsyicalParametersJSON = {
	[celestialBodyName: string]: OptionalPhysicalParameters;
};
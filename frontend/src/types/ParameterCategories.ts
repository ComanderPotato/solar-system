export const distanceParameters = [
	"DistanceFromPrimary",
	"ApoapsisDistance",
	"PeriapsisDistance",
	"SemiLatusRectum",
	"SemiMajorAxis",
	"SemiMinorAxis",
	"InnerRingRadius",
	"OuterRingRadius",
	"MeanRadius",
	"EquatorialRadius",
	"PolarRadius",
] as const;
export const distanceParametersToProcess = ["DistanceFromPrimary", "ApoapsisDistance", "PeriapsisDistance", "SemiLatusRectum", "SemiMajorAxis", "SemiMinorAxis"] as const;

export const angleParameters = [
	"AxialTilt",
	"Inclination",
	"EccentricAnomaly",
	"TrueAnomaly",
	"MeanAnomaly",
	"ArgumentOfLatitude",
	"ArgumentOfPeriapsis",
	"LongitudeOfAscendingNode",
	"LongitudeOfPeriapsis",
	"TrueLongitude",
	"MeanLongitude",
] as const;

export const timeParameters = ["SolarRotation", "LengthOfDay", "PeriodInDays", "OrbitalPeriod"] as const;

export const temperatureParameters = ["AverageTemperature", "MeanTemperature"] as const;

export const pressureParameters = ["SurfacePressure"] as const;

export const energyParameters = ["Luminosity", "Emissivity"] as const;

export const vectorParameters = ["Position", "Velocity"] as const;

export const parametersToIgnore = [
	"EquatorialRadius",
	"PolarRadius",
	"AverageTemperature",
	"GlobalMagneticField",
	"InnerRingRadius",
	"OuterRingRadius",
	"MeanTemperature",
	"SurfacePressure",
	"DistanceFromPrimary",
	"MeanMotionPerDay",
	"PeriapsisTime",
	"PeriodInDays",
	"Position",
	"SemiLatusRectum",
	"SemiMajorAxis",
	"SemiMinorAxis",
];

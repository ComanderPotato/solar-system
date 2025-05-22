import { CelestialBodyParameters } from "."
export interface SolarSystemParameters {
    Primary: CelestialBodyParameters,
    Secondary: CelestialBodyParameters[]
}
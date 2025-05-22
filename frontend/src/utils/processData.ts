// // import { OrbitalParameters, distanceKeys, angleKeys, vector3Keys } from "../types/OrbitalParameters";
// import { Vector3 } from "three";
// import { SCALE } from "./constants";
// import { OrbitalParameters, OrbitalParametersResponse, PlanetaryOrbitalParameters, PlanetaryOrbitalParametersResponse, distanceKeys } from "../types/OrbitalParameters";

import { BasePhysicalParameters, SolarSystemOpenDataResponse } from "../types";
import { KM_TO_M, SCALE } from "./constants";

// export const processPlanetaryOrbitalParameters = async (planetaryOrbitalParameters: PlanetaryOrbitalParametersResponse): Promise<PlanetaryOrbitalParameters> => {
//     return Object.fromEntries(
//         Object.entries(planetaryOrbitalParameters).map(([planet, orbitalParameters]) => [
//             planet,
//             processOrbitalParameters(orbitalParameters),
//     ])
//     ) as PlanetaryOrbitalParameters;
// }
// export const processOrbitalParameters = (orbitalParameters: OrbitalParametersResponse): OrbitalParameters => {
//     distanceKeys.map(distanceKey => orbitalParameters[distanceKey] = orbitalParameters[distanceKey] * SCALE)
// return {
//     ...orbitalParameters,
//     Position: new Vector3(...orbitalParameters.Position).multiplyScalar(SCALE),
//     Velocity: new Vector3(...orbitalParameters.Velocity).multiplyScalar(SCALE),
//     };
// }
import { GRAVITATIONAL_CONSTANT as G } from "./constants";
const HOURS_TO_SECONDS_CONVERSION = 3600;
const DEGREES_TO_RADIANS = Math.PI / 180;
export const processBasePhysicalData = (basePhysicalParameters: SolarSystemOpenDataResponse): BasePhysicalParameters => {
  const mass = basePhysicalParameters.mass ? basePhysicalParameters.mass.massValue * 10 ** basePhysicalParameters.mass.massExponent * SCALE : 0;
  const vol = basePhysicalParameters.vol ? basePhysicalParameters.vol.volValue * 10 ** basePhysicalParameters.vol.volExponent * SCALE * KM_TO_M : 0;
  return {
    Mass: processMass(basePhysicalParameters) * SCALE,
    Volume: processVolume(basePhysicalParameters) * SCALE,
    Density: basePhysicalParameters.density * 1000 /* Fix */,
    Gravity: basePhysicalParameters.gravity,
    Escape: basePhysicalParameters.escape,
    MeanRadius: basePhysicalParameters.meanRadius * KM_TO_M * SCALE,
    EquaRadius: basePhysicalParameters.equaRadius * KM_TO_M * SCALE,
    PolarRadius: basePhysicalParameters.polarRadius * KM_TO_M * SCALE,
    Flattening: basePhysicalParameters.flattening,
    AxialTilt: basePhysicalParameters.axialTilt * (Math.PI / 180),
    SideralRotation: basePhysicalParameters.sideralRotation * 3600,
    AverageTemperature: basePhysicalParameters.avgTemp,
  };
};

const processMass = (basePhysicalParameters: SolarSystemOpenDataResponse): number => {
  if (basePhysicalParameters.mass) {
    const massValue = basePhysicalParameters.mass.massValue;
    const massExponent = basePhysicalParameters.mass.massExponent;
    return massValue * 10 ** massExponent;
  }
  //   else if (basePhysicalParameters.meanRadius) moon.Physical.Mass = (4 / 3) * Math.PI * moon.Physical.MeanRadius ** 3 * moon.Physical.Density;
  return -1;
};
const processVolume = (basePhysicalParameters: SolarSystemOpenDataResponse): number => {
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

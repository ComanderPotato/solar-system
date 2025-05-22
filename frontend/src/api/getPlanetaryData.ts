// import { PlanetaryOrbitalParameters, processPlanetaryOrbitalParameters } from "../types/OrbitalParameters"
// export const getPlanetaryData = async (): Promise<PlanetaryOrbitalParameters> => {
//     const response = await fetch("http://127.0.0.1:5000/get_parameters", {
//       method: "GET",
//       headers: { "Content-Type": "application/json" },
//     })
//     const data = await response.json()
//     return await processPlanetaryOrbitalParameters(data) as PlanetaryOrbitalParameters
// }


// // export interface Root {
// //   bodies: Body[]
// // }

// // export interface Body {
// // id: string
// // name: string
// // englishName: string
// // isPlanet: boolean
// // moons?: Moon[]
// // semimajorAxis: number
// // perihelion: number
// // aphelion: number
// // eccentricity: number
// // inclination: number
// // mass?: Mass
// // vol?: Vol
// // density: number
// // gravity: number
// // escape: number
// // meanRadius: number
// // equaRadius: number
// // polarRadius: number
// // flattening: number
// // dimension: string
// // sideralOrbit: number
// // sideralRotation: number
// // aroundPlanet?: AroundPlanet
// // discoveredBy: string
// // discoveryDate: string
// // alternativeName: string
// // axialTilt: number
// // avgTemp: number
// // mainAnomaly: number
// // argPeriapsis: number
// // longAscNode: number
// // bodyType: string
// // rel: string
// // }

// // export interface Moon {
// // moon: string
// // rel: string
// // }

// // export interface Mass {
// // massValue: number
// // massExponent: number
// // }

// // export interface Vol {
// // volValue: number
// // volExponent: number
// // }

// // export interface AroundPlanet {
// // planet: string
// // rel: string
// // }

// const INCLUDE_DATA: string[] = [
//   "id",
//   "name",
//   "englishName",
//   "mass",
//   "vol",
//   "density",
//   "gravity",
//   "escape",
//   "meanRadius",
//   "equaRadius",
//   "polarRadius",
//   "flattening",
//   "avgTemp"
// ]
// interface PhysicalParametersResponse {
//   id: string
//   name: string
//   englishName: string
//   mass: string
//   vol: string
//   density: string
//   gravity: string
//   escape: string
//   meanRadius: string
//   equaRadius: string
//   polarRadius: string
//   flattening: string
//   avgTemp: string
// }
// interface PhysicalParameters {
//   Id: string
//   Name: string
//   EnglishName: string
//   Mass: string
//   Volume: string
//   Density: string
//   Gravity: string
//   Escape: string
//   MeanRadius: string
//   EquaRadius: string
//   PolarRadius: string
//   Flattening: string
//   AverageTemperature: string
// }
// export const getPlanetaryPhysicalData = async (): Promise<PhysicalParametersResponse[]> => {
//     const response = await fetch(`https://api.le-systeme-solaire.net/rest/bodies/earth?data=${INCLUDE_DATA.join(",")}`)
//     const data = await response.json()
//     return data as PhysicalParametersResponse[]
// }
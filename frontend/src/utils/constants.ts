export const AU_CONSTANT = 149.6e9;
export const KM_TO_M = 1000;
export const M_TO_KM = 1 / KM_TO_M
export const HOUR_TO_SECOND = 3600
export const SECOND_TO_HOUR = 1 / HOUR_TO_SECOND


const DEGREE = Math.PI / 180;
export const DEG_TO_RAD = DEGREE
export const RAD_TO_DEG = 1 / DEGREE
export const SCALE = 250 / AU_CONSTANT;
export const GRAVITATIONAL_CONSTANT = 6.6743e-11 * SCALE ** 2;


// TIME_SCALE AT HIGH SPEEDS ISNT WORKING FOR MOONS BECAUSE IT IS USING CURRENT TIME RATHER THAN SCALED
export const TIME_SCALE = 120;

export enum CelestialBodyDetail {
  // EXTRA_LOW = 1,
  NONE = 0,
  LOW = 2,
  MEDIUM = 8,
  HIGH = 16,
  // EXTRA_HIGH = 20,
}
// export enum CelestialBodyDistance {
//   EXTRA_CLOSE = 10000 * SCALE,
//   CLOSE = 20000 * SCALE,
//   EH = 30000 * SCALE,
//   FAR = 40000 * SCALE,
//   EXTRA_FAR = 50000 * SCALE,
// }
export enum CelestialBodyDistance {
  CLOSE = AU_CONSTANT * 0.01 * SCALE, // ≈ 149.6e6 m * scale
  MEDIUM = AU_CONSTANT * 0.1 * SCALE, // ≈ 1.496e9 m * scale
  FAR = AU_CONSTANT * 1 * SCALE, // ≈ 14.96e9 m * scale
}
export const CelestialBodyColourHover: Record<string, string> = {
  MERCURY: "#9768ac",
  VENUS: "#b07919",
  EARTH: "#09c",
  MARS: "#9a4e19",
  JUPITER: "#da8b72",
  URANUS: "#68ccda",
  NEPTUNE: "#708ce3",
  SATURN: "#d5c187",
  // MOON: "#b6acac",
  PLUTO: "#929871",
};
export const CelestialBodyColour: Record<string, string> = {
  MERCURY: "#714e81",
  VENUS: "#845b13",
  EARTH: "#007399",
  MARS: "#733a13",
  JUPITER: "#a36855",
  URANUS: "#4e99a3",
  NEPTUNE: "#5469aa",
  SATURN: "#786d4c",
  // MOON: "#b6acac",
  PLUTO: "#929871",
};
// export enum CelestialBodyDistance {
//   EXTRA_CLOSE = AU_CONSTANT * 0.001 * SCALE, // ≈ 1.496e9 m * scale
//   CLOSE = AU_CONSTANT * 0.01 * SCALE,
//   MEDIUM = AU_CONSTANT * 1 * SCALE, // ≈ 14.96e9 m * scale
//   FAR = AU_CONSTANT * 10 * SCALE, // ≈ 74.8e9 m * scale
//   EXTRA_FAR = AU_CONSTANT * 100 * SCALE, // ≈ 149.6e9 m * scale
// }
// export enum CelestialBodyDistance {
//   EXTRA_CLOSE = 0,
//   CLOSE = AU_CONSTANT * 0.1 * SCALE, // ≈ 1.496e9 m * scale
//   MEDIUM = AU_CONSTANT * 0.01 * SCALE,
//   FAR = AU_CONSTANT * 0.1 * SCALE, // 2.5
//   EXTRA_FAR = 0,
//   // EXTRA_FAR = AU_CONSTANT * 100 * SCALE, // ≈ 149.6e9 m * scale
// }

// 0.25
// constants.ts:41 2.5
// constants.ts:42 250
// constants.ts:43 2500
// constants.ts:44 25000
// console.log(CelestialBodyDistance.EXTRA_CLOSE);
// console.log(CelestialBodyDistance.CLOSE);
// console.log(CelestialBodyDistance.MEDIUM);
// console.log(CelestialBodyDistance.FAR);
// console.log(CelestialBodyDistance.EXTRA_FAR);
// export enum CelestialBodyDistance {
//   EXTRA_CLOSE = AU_CONSTANT * 0.00001 * SCALE, // ≈ 149.6e6 m * scale
//   CLOSE = AU_CONSTANT * 0.0001 * SCALE, // ≈ 1.496e9 m * scale
//   MEDIUM = AU_CONSTANT * 0.001 * SCALE, // ≈ 14.96e9 m * scale
//   FAR = AU_CONSTANT * 0.01 * SCALE, // ≈ 74.8e9 m * scale
//   EXTRA_FAR = AU_CONSTANT * 0.1 * SCALE, // ≈ 149.6e9 m * scale
// }

// WILL NEED TO UPDATE CURRENT TIME ON PYTHON. DO I NEED TO SCALE TIME? IM SO CONFUSED

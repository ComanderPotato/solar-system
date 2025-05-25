export const AU_CONSTANT = 149.6e9;
export const KM_TO_M = 1000;
export const M_TO_KM = 1 / KM_TO_M;
export const HOUR_TO_SECOND = 3600;
export const SECOND_TO_HOUR = 1 / HOUR_TO_SECOND;

const DEGREE = Math.PI / 180;
export const DEG_TO_RAD = DEGREE;
export const RAD_TO_DEG = 1 / DEGREE;
export const SCALE = 250 / AU_CONSTANT;
export const GRAVITATIONAL_CONSTANT = 6.6743e-11 * SCALE ** 2;

// TIME_SCALE AT HIGH SPEEDS ISNT WORKING FOR MOONS BECAUSE IT IS USING CURRENT TIME RATHER THAN SCALED
export const TIME_SCALE = 1;

export enum CelestialBodyDetail {
  NONE = 0,
  LOW = 2,
  MEDIUM = 8,
  HIGH = 16,
}
export enum CelestialBodyDistance {
  CLOSE = AU_CONSTANT * 0.01 * SCALE,
  MEDIUM = AU_CONSTANT * 0.1 * SCALE,
  FAR = AU_CONSTANT * 1 * SCALE,
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

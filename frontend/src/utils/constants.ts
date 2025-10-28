export const KM_TO_M = 1000;
export const M_TO_KM = 1 / KM_TO_M;
export const HOUR_TO_SECOND = 3600;
export const SECOND_TO_HOUR = 1 / HOUR_TO_SECOND;

const DEGREE = Math.PI / 180;
export const DEG_TO_RAD = DEGREE;
export const RAD_TO_DEG = 1 / DEGREE;
export const AU_CONSTANT = 149.6e9;
export const SCALE = 250 / AU_CONSTANT;
export const GRAVITATIONAL_CONSTANT = 6.6743e-11 * SCALE ** 2;

// export const TIME_SCALES = [-60, -30, -3, -1, 0, 1, 3, 30, 60];
export enum CelestialBodyDetail {
	NONE = 0,
	// LOW = 2,
	LOW = 2,
	MEDIUM = 8,
	HIGH = 16,
}
export enum CelestialBodyDistance {
	CLOSE = AU_CONSTANT * 1 * SCALE,
	MEDIUM = AU_CONSTANT * 10 * SCALE,
	FAR = AU_CONSTANT * 100 * SCALE,
}
export const CelestialBodyColorHover: Record<string, string> = {
	MERCURY: "#9768ac",
	VENUS: "#b07919",
	EARTH: "#09c",
	MARS: "#9a4e19",
	JUPITER: "#da8b72",
	URANUS: "#68ccda",
	NEPTUNE: "#708ce3",
	SATURN: "#d5c187",
	PLUTO: "#929871",
};
export const CelestialBodyColor: Record<string, string> = {
	MERCURY: "#714e81",
	VENUS: "#845b13",
	EARTH: "#007399",
	MARS: "#733a13",
	JUPITER: "#a36855",
	URANUS: "#4e99a3",
	NEPTUNE: "#5469aa",
	SATURN: "#786d4c",
	PLUTO: "#929871",
};

// Mesh constants
export const GLOW_MESH_SCALE_FACTOR = 1.01;
export const OPTIONAL_MESH_SCALE_FACTOR = 1.005;
export const LIGHT_OPACITY = 0.6;
export const CLOUD_OPACITY = 0.5;

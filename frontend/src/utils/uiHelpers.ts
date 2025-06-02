import { Vector3 } from "three";
import {
	OrbitingBodyParameters,
	PhysicalParameters,
	distanceParameters,
	angleParameters,
	timeParameters,
	temperatureParameters,
	pressureParameters,
	energyParameters,
	parametersToIgnore,
} from "../types";
import { SCALE } from "./constants";

export const preprocessParameter = (parameter: string): string =>
	parameter
		.replace(/([A-Z])/g, " $1")
		.trim()
		.replace(/\b\w/g, (char) => char.toUpperCase());

export const preprocessValue = (parameter: string, value: number | Vector3): string => {
	if (value instanceof Vector3) {
		const { x, y, z } = value.clone().divideScalar(SCALE).divideScalar(1000);
		if (parameter == "Position") {
			return `${Math.sqrt(x * x + y * y + z * z).toFixed(2)} km/s`;
		} else {
			return `${Math.sqrt(x * x + y * y + z * z).toFixed(2)} km/s`;
		}
	}

	if (distanceParameters.includes(parameter as any)) {
		return `${(value / 1000 / SCALE).toFixed(2)} km`;
	}
	if (angleParameters.includes(parameter as any)) {
		return `${(value * (180 / Math.PI)).toFixed(2)}°`;
	}
	if (timeParameters.includes(parameter as any)) {
		if (parameter === "PeriodInDays" || parameter == "OrbitalPeriod") return `${value.toFixed(2)} days`;
		if (parameter === "SolarRotation") return `${(value / 24).toFixed(2)} hrs`;
		return `${value.toFixed(2)} hrs`;
	}
	if (temperatureParameters.includes(parameter as any)) {
		return `${value.toFixed(2)} K`;
	}
	if (pressureParameters.includes(parameter as any)) {
		if (value) return `${value.toExponential(2)} Pa`;
	}
	if (energyParameters.includes(parameter as any)) {
		return parameter === "Luminosity" ? `${value.toExponential(2)} W` : `${value.toFixed(2)} W/m²`;
	}

	switch (parameter) {
		case "PlanetaryMass":
			return `${value.toExponential(2)} kg`;
		case "Volume":
			return `${value.toExponential(2)} m³`;
		case "Density":
			return `${value.toFixed(2)} kg/m³`;
		case "Gravity":
			return `${value.toFixed(2)} m/s²`;
		case "EscapeVelocity":
			return `${(value / 1000).toFixed(2)} km/s`;
		case "Flattening":
		case "OrbitalEccentricity":
			return value.toFixed(6);
		case "MeanMotionPerDay":
			return `${value.toFixed(4)} orbits/day`;
		case "PeriapsisTime":
			return `JD ${value.toFixed(2)}`;
		default:
			return value.toString();
	}
};

export const fillDropdown = async (panel: HTMLElement, entries: PhysicalParameters | OrbitingBodyParameters) => {
	const section = panel.querySelector(".dropdown-content") as HTMLElement;
	section.innerHTML = "";
	for (const [key, value] of Object.entries(entries)) {
		if (value === 0 || parametersToIgnore.includes(key)) continue;
		const row = document.createElement("div");
		row.className = "info-row";
		row.innerHTML = `
      	<span class="label">${preprocessParameter(key)}</span>
			<span class="value-container">
				<span class="value">${preprocessValue(key, value)}</span>
				<span class="information-btn icon" data-key="${key}">
			</span>
		</span>
      `;
		section.appendChild(row);
	}
};

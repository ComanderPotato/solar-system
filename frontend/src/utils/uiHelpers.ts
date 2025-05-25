import { CelestialBody, OrbitingBody } from "../models";
import { OrbitingBodyParameters, PhysicalParameters } from "../types";

export const preprocessKey = (key: string): string =>
  key
    .replace(/([A-Z])/g, " $1")
    .trim()
    .replace(/\b\w/g, (c) => c.toUpperCase());

export function updateInformationPanel(
  celestialBody: CelestialBody,
  extract: string
) {
  const panel = document.querySelector(".information-content") as HTMLElement;
  panel.querySelector(".title")!.textContent =
    celestialBody.metadata.EnglishName;
  panel.querySelector("#summary")!.textContent = extract;

  if (celestialBody instanceof OrbitingBody) {
    fillDropdown(
      "orbitalInfo",
      // panel,
      // ".dropdown:nth-child(3)",
      celestialBody.orbitingParameters
    ); // orbital
  }
  fillDropdown(
    "physicalInfo",
    // panel,
    // ".dropdown:nth-child(4)",
    celestialBody.physicalParameters
  ); // physical

  panel.classList.remove("collapsed");
}

function fillDropdown(
  // panel: HTMLElement,
  id: string,
  // selector: string,
  entries: PhysicalParameters | OrbitingBodyParameters
) {
  const section = (document.getElementById(id) as HTMLElement).querySelector(
    ".dropdown-content"
  ) as HTMLElement;
  section.innerHTML = "";
  for (const [key, value] of Object.entries(entries)) {
    if (value == 0) continue
    const row = document.createElement("div");
    row.className = "info-row";
    row.innerHTML = `<span>${preprocessKey(key)}</span><span>${value}</span>`;
    section.appendChild(row);
  }
}

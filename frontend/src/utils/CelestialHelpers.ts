import { Color } from "three";
import CelestialBody from "../models/CelestialBody";
import { CelestialBodyColor } from "./constants";
import { CelestialBodyMesh, CelestialBodyModel, CelestialBodyProvider } from "../models/types";
import OrbitingBody from "../models/OrbitingBody";
import { TextureType } from "../types/TextureParameters";
import { IMaterial } from "../types/Materials";

export function getCelestialBodyColor(body: CelestialBody): Color {
	const name = body.metadata.EnglishName.toUpperCase();
	const primaryName = body.primaryBody?.metadata.EnglishName.toUpperCase();
	return new Color(CelestialBodyColor[name] ?? CelestialBodyColor[primaryName!]);
}

export function getBodyMaterial(body: CelestialBodyMesh, type: TextureType): IMaterial | undefined {
	let material = undefined;
	if ([TextureType.Color, TextureType.Specular, TextureType.Bump].includes(type)) {
		material = body.material;
	} else if ([TextureType.Light, TextureType.Cloud].includes(type)) {
		material = TextureType.Light == type ? body.lightMesh?.material : body.cloudMesh?.material;
	} else {
		material = body.ringMesh?.material;
	}

	return material as IMaterial;
}
export function isMeshProvider(body: CelestialBody): body is CelestialBodyMesh {
	return typeof (body as CelestialBodyMesh).textures !== undefined;
}

export function isModelProvider(body: CelestialBody): body is CelestialBodyModel {
	return typeof (body as CelestialBodyModel).model === "object";
}

export function isOrbitingBody(body: CelestialBody): body is OrbitingBody {
	return body instanceof OrbitingBody;
}

export function getBodyProvider(body: CelestialBody): CelestialBodyProvider {
	if (isMeshProvider(body)) {
		return body as CelestialBodyMesh;
	} else if (isModelProvider(body)) {
		return body as CelestialBodyModel;
	} else {
		throw new Error("Body does not implement a valid provider");
	}
}

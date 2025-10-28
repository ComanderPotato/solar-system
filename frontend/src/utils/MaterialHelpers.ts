import { ShaderMaterial, Texture } from "three";
import { IMaterial, RingMaterial, StandardMaterial } from "../types/Materials";
import { MaterialMapType } from "../types/TextureParameters";

export function isStandardMaterial(
	material: IMaterial | undefined,
	mapType: MaterialMapType,
): material is StandardMaterial {
	return !!material && typeof (material as StandardMaterial)[mapType] === "object";
}
export function isRingMaterial(material?: IMaterial): material is RingMaterial {
	return !!material && (material as ShaderMaterial).isShaderMaterial === true;
}
export function hasTexture(texture: Texture | null): texture is Texture {
	return !!texture && (texture as Texture).isTexture === true;
}

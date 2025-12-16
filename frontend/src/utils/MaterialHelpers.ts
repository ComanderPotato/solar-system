import { ShaderMaterial, Texture } from "three";
import { IMaterial, PlanetMaterial, RingMaterial, StandardMaterial } from "../types/Materials";
import { MaterialMapType, UniformMapTypes } from "../types/TextureParameters";

// export function isStandardMaterial(
// 	material: IMaterial | undefined,
// 	mapType: MaterialMapType,
// ): material is StandardMaterial {
// 	return !!material && typeof (material as StandardMaterial)[mapType] === "object";
// }
export function isPlanetMaterial(
	material: IMaterial | undefined,
	uniformType: UniformMapTypes,
): material is PlanetMaterial {
	console.log(uniformType);
	return !!material && typeof (material as PlanetMaterial).uniforms[uniformType] === "object";
}
export function isRingMaterial(
	material: IMaterial | undefined,
	uniformType: UniformMapTypes,
): material is RingMaterial {
	return !!material && typeof (material as RingMaterial).uniforms[uniformType] === "object";
}
// export function isRingMaterial(material: IMaterial | undefined): material is RingMaterial {
// 	return !!material && (material as ShaderMaterial).isShaderMaterial === true;
// }
export function hasTexture(texture: Texture | null): texture is Texture {
	return !!texture && (texture as Texture).isTexture === true;
}

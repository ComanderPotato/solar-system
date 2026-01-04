import { ShaderMaterial, Texture } from "three";
import { IMaterial, CelestialShader, RingShader, StandardMaterial } from "../types/Materials";
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
): material is CelestialShader {
	return !!material && typeof (material as CelestialShader).uniforms[uniformType] === "object";
}
export function isRingMaterial(material: IMaterial | undefined, uniformType: UniformMapTypes): material is RingShader {
	return !!material && typeof (material as RingShader).uniforms[uniformType] === "object";
}
// export function isRingMaterial(material: IMaterial | undefined): material is RingMaterial {
// 	return !!material && (material as ShaderMaterial).isShaderMaterial === true;
// }
export function hasTexture(texture: Texture | null): texture is Texture {
	return !!texture && (texture as Texture).isTexture === true;
}

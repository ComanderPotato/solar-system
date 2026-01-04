import { Color, IUniform, Material, ShaderMaterial, Texture } from "three";
import { Vector2, Vector3 } from "three";

export interface StandardMaterial extends Material {
	map: Texture | null;
	alphaMap: Texture | null;
	bumpMap: Texture | null;
	specularMap: Texture | null;
	isStandardMaterial: true;
}
interface CommonUniforms {
	uColor: IUniform<Texture | null>;
	[uniform: string]: IUniform<any>;
}
export interface CelestialBodyUniforms extends CommonUniforms {
	uHasAtmosphere: IUniform<boolean>;
	uRotation: IUniform<number>;
}
export interface PlanetUniforms extends CelestialBodyUniforms {
	uTime: IUniform<number>;
	uSunPosition: IUniform<Vector3>;
	uNight: IUniform<Texture | null>;
	uClouds: IUniform<Texture | null>;
	uSpecular: IUniform<Texture | null>;
	uNormal: IUniform<Texture | null>;
	uBump: IUniform<Texture | null>;
	uAtmosphericPrimary: IUniform<Color>;
	uAtmosphericSecondary: IUniform<Color>;
}
export interface MoonUniforms extends CelestialBodyUniforms {
	uSunPosition: IUniform<Vector3>;
}
export interface StarUniforms extends CelestialBodyUniforms {
	uEmissive: IUniform<Texture | null>;
}
// export interface RingUniforms {
// 	map: IUniform<Texture | null>;
// 	alphaMap: IUniform<Texture | null>;
// 	useAlphaTexture: IUniform<boolean>;
// 	innerRadius: IUniform<number>;
// 	outerRadius: IUniform<number>;
// 	[uniform: string]: IUniform<any>;
// }
export interface RingUniforms extends CommonUniforms {
	uAlpha: IUniform<Texture | null>;
	uHasAlpha: IUniform<boolean>;
	uInnerRadius: IUniform<number>;
	uOuterRadius: IUniform<number>;
}
export type CelestialShader = ShaderMaterial & { uniforms: PlanetUniforms };
export type RingShader = ShaderMaterial & { uniforms: RingUniforms; isRingMaterial: true };
// export type IMaterial = StandardMaterial | RingMaterial;
export type IMaterial = CelestialShader | RingShader;

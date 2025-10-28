import { IUniform, Material, ShaderMaterial, Texture } from "three";

export type StandardMaterial = Material & {
	map: Texture | null;
	alphaMap: Texture | null;
	bumpMap: Texture | null;
	specularMap: Texture | null;
	isStandardMaterial: true;
};
export type RingUniforms = {
	map: IUniform<Texture | null>;
	alphaMap: IUniform<Texture | null>;
	useAlphaTexture: IUniform<boolean>;
	innerRadius: IUniform<number>;
	outerRadius: IUniform<number>;
	[uniform: string]: IUniform<any>;
};
export type RingMaterial = ShaderMaterial & { uniforms: RingUniforms; isRingMaterial: true };
export type IMaterial = StandardMaterial | RingMaterial;

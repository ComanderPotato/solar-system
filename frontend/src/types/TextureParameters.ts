// ==================================================================================================================
// TEXTURE PARAMETERS
// ==================================================================================================================
export type CelestialTextures = {
	Star: { [celestialBodyName: string]: TextureFlags };
	Planet: { [celestialBodyName: string]: TextureFlags };
	DwarfPlanet: { [celestialBodyName: string]: TextureFlags };
	Moon: { [celestialBodyName: string]: TextureFlags };
};
export interface TextureFlags {
	Color: boolean;
	Specular?: boolean;
	Bump?: boolean;
	Light?: boolean;
	Cloud?: boolean;
	Ring?: boolean;
	RingAlpha?: boolean;
}
export enum TextureType {
	Color = "color",
	Specular = "specular",
	Bump = "bump",
	Light = "light",
	Cloud = "cloud",
	Ring = "ring",
	RingAlpha = "ring_alpha",
}
const TextureFlagsToMap: Record<keyof TextureFlags, TextureType> = {
	Color: TextureType.Color,
	Specular: TextureType.Specular,
	Bump: TextureType.Bump,
	Light: TextureType.Light,
	Cloud: TextureType.Cloud,
	Ring: TextureType.Ring,
	RingAlpha: TextureType.RingAlpha,
};

export type MaterialMapType = "map" | "bumpMap" | "specularMap" | "alphaMap";

const TextureTypeToMaterialMap: Record<TextureType, MaterialMapType> = {
	[TextureType.Color]: "map",
	[TextureType.Light]: "map",
	[TextureType.Cloud]: "map",
	[TextureType.Ring]: "map",
	[TextureType.Specular]: "specularMap",
	[TextureType.Bump]: "bumpMap",
	[TextureType.RingAlpha]: "alphaMap",
};

export function getTextures(textures: TextureFlags): void {
	console.log(Object.keys(textures) as (keyof TextureFlags)[]);
}
export function getEnabledTextures(params: TextureFlags): TextureType[] {
	return (Object.keys(params) as (keyof TextureFlags)[])
		.filter((key) => params[key])
		.map((key) => TextureFlagsToMap[key]);
}
export function getTextureMapping(textureType: TextureType): MaterialMapType {
	return TextureTypeToMaterialMap[textureType];
}

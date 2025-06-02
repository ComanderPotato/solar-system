// ==================================================================================================================
// TEXTURE PARAMETERS
// ==================================================================================================================
export type Textures = {
	Star: { [celestialBodyName: string]: TextureParameters };
	Planet: { [celestialBodyName: string]: TextureParameters };
	DwarfPlanet: { [celestialBodyName: string]: TextureParameters };
	Moon: { [celestialBodyName: string]: TextureParameters };
};
export interface TextureParameters {
	Color: boolean;
	Specular?: boolean;
	Bump?: boolean;
	Light?: boolean;
	Cloud?: boolean;
	Ring?: boolean;
	RingAlpha?: boolean;
}

// ==================================================================================================================
// ASSET PARAMETERS
// ==================================================================================================================

export type CelestialAssets = {
	Star: { [celestialBodyName: string]: TextureFlags };
	Planet: { [celestialBodyName: string]: TextureFlags };
	DwarfPlanet: { [celestialBodyName: string]: TextureFlags };
	Moon: { [celestialBodyName: string]: TextureFlags };
	Spaceship: { [celestialBodyName: string]: ModelFlags };
};

export interface ModelFlags {}
export interface TextureFlags {
	Color: boolean;
	Specular?: boolean;
	Bump?: boolean;
	Light?: boolean;
	Cloud?: boolean;
	Ring?: boolean;
	RingAlpha?: boolean;
}

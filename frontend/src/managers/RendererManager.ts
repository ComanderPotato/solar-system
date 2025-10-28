import { BufferGeometry, Mesh, ShaderMaterial, Texture } from "three";
import CelestialBodyRenderer, {
	MoonRenderer,
	PlanetRenderer,
	SpaceshipRenderer,
	StarRenderer,
} from "../core/CelestialBodyRenderer";
import Manager from "../core/Manager";
import IRendererManager from "../interfaces/managers/IRendererManager";
import { getTextureMapping, MaterialMapType, TextureType } from "../types/TextureParameters";
import { CelestialBodyMesh, CelestialBodyModel, CelestialBodyProvider } from "../models/types";
import { IMaterial } from "../types/Materials";
import CelestialBody from "../models/CelestialBody";
import { getBodyMaterial, isMeshProvider, isModelProvider } from "../utils/CelestialHelpers";
import { BodyTypes } from "../types/CelestialBodyMetadata";
import { IAssetLoaderType } from "../interfaces/IAssetLoader";
import { hasTexture, isRingMaterial, isStandardMaterial } from "../utils/MaterialHelpers";
import { AssetType } from "../interfaces/managers/IAssetManager";

export default class RendererManager extends Manager implements IRendererManager {
	private _renderer?: CelestialBodyRenderer;
	private _planetRenderer: CelestialBodyRenderer = new PlanetRenderer();
	private _moonRenderer: CelestialBodyRenderer = new MoonRenderer();
	private _starRenderer: CelestialBodyRenderer = new StarRenderer();
	private _spaceshipRenderer: CelestialBodyRenderer = new SpaceshipRenderer();
	constructor() {
		super();
	}

	setRenderer(body: CelestialBodyProvider): void {
		switch (body.metadata.BodyType) {
			case BodyTypes.Star:
				this._renderer = this._starRenderer;
				break;
			case BodyTypes.DwarfPlanet:
			case BodyTypes.Planet:
				this._renderer = this._planetRenderer;
				break;
			case BodyTypes.Moon:
				this._renderer = this._moonRenderer;
				break;
			// case BodyTypes.Spaceship:
			// 	this._renderer = this._spaceshipRenderer;
			// 	break;
		}
		this._renderer.reset(body);
	}
	get renderer(): CelestialBodyRenderer {
		if (!this._renderer) throw new Error("No renderer has been set");
		return this._renderer;
	}

	disposeAsset(body: CelestialBody, asset: AssetType): void {}

	disposeTexture(body: CelestialBodyMesh, type: TextureType): void {
		const textureMapping = getTextureMapping(type);
		const material = getBodyMaterial(body, type);

		if (isStandardMaterial(material, textureMapping) && hasTexture(material[textureMapping])) {
			material[textureMapping].dispose();
		} else if (isRingMaterial(material) && hasTexture(material.uniforms[textureMapping].value)) {
			material.uniforms[textureMapping].value.dispose();
		}
	}
	applyAsset(body: CelestialBody, asset: IAssetLoaderType, assetType: TextureType): void {
		if (isMeshProvider(body) && asset instanceof Texture) {
			this.applyTexture(body, assetType, asset);
		} else if (isModelProvider(body)) {
		}
	}
	applyTexture(body: CelestialBodyMesh, type: TextureType, texture: Texture): void {
		const textureMapping = getTextureMapping(type);
		const material = getBodyMaterial(body, type);
		if (!material) return;
		if (isStandardMaterial(material, textureMapping)) {
			material[textureMapping] = texture;
		} else if (isRingMaterial(material)) {
			material.uniforms[textureMapping].value = texture;
		}
		material.needsUpdate = true;
	}
}

import { Texture } from "three";
import CelestialBodyRenderer, {
	MoonRenderer,
	PlanetRenderer,
	SpaceshipRenderer,
	StarRenderer,
} from "../core/CelestialBodyRenderer";
import Manager from "../core/Manager";
import IRendererManager from "../interfaces/managers/IRendererManager";
import { getUniformMapping, TextureType } from "../types/TextureParameters";
import { CelestialBodyMesh, CelestialBodyProvider } from "../models/types";
import CelestialBody from "../models/CelestialBody";
import { getBodyMaterial, getShader, isMeshProvider, isModelProvider } from "../utils/CelestialHelpers";
import { BodyTypes } from "../types/CelestialBodyMetadata";
import { IAssetLoaderType } from "../interfaces/IAssetLoader";
import { hasTexture, isPlanetMaterial, isRingMaterial } from "../utils/MaterialHelpers";
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
		const uniformMapping = getUniformMapping(type);
		const material = getBodyMaterial(body, type);

		if (material) {
			material.uniforms[uniformMapping].value.dispose();
		}
	}
	applyAsset(body: CelestialBody, asset: IAssetLoaderType, assetType: TextureType): void {
		if (isMeshProvider(body) && asset instanceof Texture) {
			this.applyTexture(body, assetType, asset);
		} else if (isModelProvider(body)) {
		}
	}

	// Shader uniform texture application test
	applyTexture(body: CelestialBodyMesh, type: TextureType, texture: Texture): void {
		// console.log(body.metadata.EnglishName);
		const uniformMapping = getUniformMapping(type);
		const shader = getShader(body, type);
		if (!shader) return;
		// console.log(uniformMapping);
		shader.uniforms[uniformMapping].value = texture;

		shader.needsUpdate = true;
	}
	// applyTexture(body: CelestialBodyMesh, type: TextureType, texture: Texture): void {
	// 	const textureMapping = getTextureMapping(type);
	// 	const material = getBodyMaterial(body, type);
	// 	if (!material) return;
	// 	if (isStandardMaterial(material, textureMapping)) {
	// 		material[textureMapping] = texture;
	// 		// Fix
	// 		if (body instanceof Star) {
	// 			body.material.emissiveMap = texture;
	// 			body.material.needsUpdate = true;
	// 		}
	// 	} else if (isRingMaterial(material)) {
	// 		material.uniforms[textureMapping].value = texture;
	// 	}
	// 	material.needsUpdate = true;
	// }
}

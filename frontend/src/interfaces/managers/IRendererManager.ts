import CelestialBodyRenderer, { MeshRenderer } from "../../core/CelestialBodyRenderer";
import IManager from "../IManager";
import { CelestialBodyMesh } from "../../models/types";
import { Texture } from "three";
import { TextureType } from "../../types/TextureParameters";
import CelestialBody from "../../models/CelestialBody";
export default interface IRendererManager extends IManager {
	get renderer(): CelestialBodyRenderer;
	setRenderer(body: CelestialBody): void;
	// getMeshRenderer(body: CelestialBodyMesh): MeshRenderer;
	applyTexture(body: CelestialBodyMesh, type: TextureType, texture: Texture): void;
	disposeTexture(body: CelestialBodyMesh, type: TextureType): void;
}

import CelestialBody from "../../models/CelestialBody";
import { AssetOperation } from "../managers/IAssetManager";

export default interface IRendererController {
	handleAssetUpdate(body: CelestialBody): void;
	handleRenderableAssets(body: CelestialBody, assetOperation: AssetOperation): void;

	applyRotation(body: CelestialBody, deltaRotation: number): void;
	getAssetPaths(body: CelestialBody): string[];

	buildRenderable(body: CelestialBody): void;
	updateRenderable(body: CelestialBody): void;
	updateRenderables(): void;
	disposeRenderable(body: CelestialBody): void;

	preloadRenderable(body: CelestialBody): void;
}

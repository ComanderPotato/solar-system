import Controller from "../core/Controller";
import IRendererController from "../interfaces/controllers/IRendererController";
import IAppContext from "../interfaces/IAppContext";
import IRendererManager from "../interfaces/managers/IRendererManager";
import { TextureType } from "../types/TextureParameters";
import { CelestialBodyMesh } from "../models/types";
import { CelestialBodyDetail, CelestialBodyDistance } from "../utils/constants";
import CelestialBody from "../models/CelestialBody";
import { isMeshProvider, isModelProvider } from "../utils/CelestialHelpers";
import { AssetOperation } from "../interfaces/managers/IAssetManager";
import IInjectableController from "../interfaces/IInjectableController";

export default class RendererController
	extends Controller<IRendererManager>
	implements IRendererController, IInjectableController
{
	public constructor(manager: IRendererManager) {
		super(manager);
	}
	public injectControllers(appContext: IAppContext): void {
		this.engineController = appContext.engineController;
		this.assetController = appContext.assetController;
		this.sceneController = appContext.sceneController;
		this.solarSystemController = appContext.solarSystemController;
		this.timeController = appContext.timeController;
	}

	buildRenderable(body: CelestialBody): void {
		this.manager.setRenderer(body);
		this.manager.renderer.build();
		this.handleRenderableAssets(body, AssetOperation.Initialise);
	}

	disposeRenderable(body: CelestialBody): void {
		this.manager.setRenderer(body);
		this.manager.renderer.dispose();
	}

	updateRenderable(body: CelestialBody): void {
		this.manager.setRenderer(body);
		if (isMeshProvider(body)) {
			this.handleMeshLOD(body);
		} else if (isModelProvider(body)) {
			if (this.solarSystemController.focusedCelestialBody === body) {
			} else {
			}
		}
	}

	preloadRenderable(body: CelestialBody): void {
		this.manager.setRenderer(body);
		if (isMeshProvider(body)) {
			body.meshDetail = CelestialBodyDetail.HIGH;
			this.updateBody(body);
		} else if (isModelProvider(body)) {
		}
	}
	updateRenderables(): void {
		const solarCenter = this.solarSystemController.solarSystem.primaryBody;
		if (!solarCenter) return;
		const queue: CelestialBody[] = [solarCenter];
		while (queue.length > 0) {
			const current = queue.shift()!;
			// this.rendererController.updateRenderable(current);
			this.updateRenderable(current);
			for (const secondary of current.secondaryBodies ?? []) {
				queue.push(secondary);
			}
		}
	}

	applyRotation(body: CelestialBody, deltaRotation: number): void {
		this.manager.setRenderer(body);
		this.manager.renderer.rotate(deltaRotation);
	}
	private updateBody(body: CelestialBody): void {
		let geometry = undefined;
		if (isMeshProvider(body)) {
			geometry = this.assetController.getGeometryLOD(body.meshDetail);
		}

		this.manager.renderer.update(geometry);
		this.handleAssetUpdate(body);
	}
	handleRenderableAssets(body: CelestialBody, assetOperation: AssetOperation): void {
		this.manager.setRenderer(body);
		if (isMeshProvider(body)) {
			// Fix this
			for (const baseTexture of Object.keys(body.textures).map((key) => key.toLowerCase() as TextureType)) {
				// for (const baseTexture of getEnabledTextures(body.textures)) {
				// if (!baseTexture) continue;
				if (assetOperation === AssetOperation.Update) this.manager.disposeTexture(body, baseTexture);
				const path = this.manager.renderer.getAssetPath(baseTexture);
				this.assetController
					.getTexture(path)
					.then((texture) => this.manager.applyTexture(body, baseTexture, texture));
			}
		} else if (isModelProvider(body)) {
		}
	}
	handleAssetUpdate(body: CelestialBody): void {
		this.handleRenderableAssets(body, AssetOperation.Update);
	}
	private calculateLOD(body: CelestialBody): CelestialBodyDetail {
		const camera = this.sceneController.sceneResources.camera;
		const distance = camera.position.distanceTo(body.celestialBodyGroup.position);

		const radius = body.physicalParameters.MeanRadius;
		const distanceFromSurface = distance - radius;
		const ratio = distanceFromSurface / radius;
		if (ratio < CelestialBodyDistance.CLOSE) {
			return CelestialBodyDetail.HIGH;
		} else if (ratio < CelestialBodyDistance.MEDIUM) {
			return CelestialBodyDetail.MEDIUM;
		} else if (ratio < CelestialBodyDistance.FAR) {
			return CelestialBodyDetail.LOW;
		}
		return CelestialBodyDetail.NONE;
	}
	private getTargetLOD(body: CelestialBodyMesh): CelestialBodyDetail {
		if (this.solarSystemController.focusedCelestialBody === body) return CelestialBodyDetail.HIGH;
		return this.calculateLOD(body);
	}
	private shouldUpdateLOD(body: CelestialBodyMesh, newDetail: CelestialBodyDetail): boolean {
		// ElapsedTime??
		const currentTime = this.timeController.absoluteDelta;
		const timeSinceLast = currentTime - body._dummyLastDetailUpdateTime;

		if (timeSinceLast < body._DUMMY_DETAIL_COOLDOWN && newDetail === body.meshDetail) {
			return false;
		}
		body._dummyLastDetailUpdateTime = currentTime;
		return newDetail !== body.meshDetail;
	}
	private updateVisibility(body: CelestialBodyMesh): void {
		// const orbitLine = body.primaryBody?.orbits.get(body.metadata.EnglishName);
		// const isOrbitVisible = body.meshDetail < CelestialBodyDetail.HIGH;
		// if (orbitLine && orbitLine.visible != isOrbitVisible) {
		// 	orbitLine.visible = body.meshDetail < CelestialBodyDetail.HIGH;
		// }
		// // const isBodyVisible = Boolean(body.meshDetail);
		// // isBodyVisible != body.mesh.visible && (body.mesh.visible = isBodyVisible);
		// body.mesh.visible = Boolean(body.meshDetail);
		// if (body === this.solarSystemController.focusedCelestialBody) {
		// 	console.log(body.meshDetail, Boolean(body.meshDetail), body.mesh.visible);
		// }
	}
	private updateBodyIfNeeded(body: CelestialBodyMesh): void {
		if (
			body.meshDetail === CelestialBodyDetail.NONE ||
			this.sceneController.sceneResources.lerpDestination ||
			this.solarSystemController.focusedCelestialBody !== body
		)
			return;

		this.updateBody(body);
	}
	private handleMeshLOD(body: CelestialBodyMesh): void {
		if (!body.mesh) return;
		const newDetail = this.getTargetLOD(body);
		this.updateVisibility(body);
		if (!this.shouldUpdateLOD(body, newDetail)) return;
		body.meshDetail = newDetail;

		this.updateBodyIfNeeded(body);
	}
	// Can be fixed
	private a(body: CelestialBodyMesh): void {
		if (!body.mesh) return;
		const oldDetail = body.meshDetail;
		body.meshDetail =
			this.solarSystemController.focusedCelestialBody === body
				? CelestialBodyDetail.HIGH
				: this.calculateLOD(body);

		this.updateVisibility(body);

		// Elapsed or absoluteDelta???
		const currentTime = this.timeController.absoluteDelta;

		if (currentTime - body._dummyLastDetailUpdateTime < body._DUMMY_DETAIL_COOLDOWN) {
			body._dummyLastDetailUpdateTime =
				oldDetail == body.meshDetail ? currentTime : body._dummyLastDetailUpdateTime;
			return;
		}
		if (oldDetail != body.meshDetail) {
			if (
				body.meshDetail == CelestialBodyDetail.NONE ||
				this.sceneController.sceneResources.lerpDestination ||
				this.solarSystemController.focusedCelestialBody != body
			)
				return;
			this.updateBody(body);
			// this.handleAssetUpdate(body);
		}
	}

	getAssetPaths(body: CelestialBody): string[] {
		this.manager.setRenderer(body);
		return this.manager.renderer.getAssetPaths();
		// return this.manager.getRenderer(body).getAssetPaths();
	}
	destroy(): void {
		throw new Error("Method not implemented.");
	}
}

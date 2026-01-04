import ICelestialBodyController from "../interfaces/controllers/ICelestialBodyController";
import IOrbitingBodyController from "../interfaces/controllers/IOrbitingBodyController";
import Controller from "../core/Controller";
import CelestialBody from "../models/CelestialBody";
import { CelestialBodyParameters } from "../types/CelestialBodyParameters";
import ICelestialBodyManager from "../interfaces/managers/ICelestialBodyManager";
import IAppContext from "../interfaces/IAppContext";
import OrbitingBody from "../models/OrbitingBody";
import { Vector3 } from "three";
import {
	calculateAcceleration,
	calculateAttractiveForce,
	calculateForceDirection,
	calculateSquaredDistance,
} from "../utils/formulas";
import IInjectableController from "../interfaces/IInjectableController";

export default class CelestialBodyController
	extends Controller<ICelestialBodyManager>
	implements ICelestialBodyController, IOrbitingBodyController, IInjectableController
{
	public constructor(manager: ICelestialBodyManager) {
		super(manager);
	}

	public injectControllers(appContext: IAppContext): void {
		this.sceneController = appContext.sceneController;
		this.uiController = appContext.uiController;
		this.assetController = appContext.assetController;
		this.rendererController = appContext.rendererController;
	}
	handleDisposal(body: CelestialBody): void {
		this.uiController.removeCelestialBodyListeners(body);
		this.manager.destroyBody(body);

		if (body.container.element.parentElement) {
			body.container.element.parentElement.removeChild(body.container.element);
		}
		this.sceneController.removeFromScene(body.container, body.celestialBodyGroup);
	}
	handleSecondaryDisposal(body: CelestialBody): void {
		if (!body.secondaryBodies) return;
		body.secondaryBodies.forEach((secondaryBody) => {
			this.handleDisposal(secondaryBody);
			this.manager.removeOrbit(body, secondaryBody.metadata.Name);
		});
	}
	public handleCreation(parameters: CelestialBodyParameters, primary?: CelestialBody): CelestialBody {
		const body = this.manager.createBody(parameters, primary);
		const assetPaths = this.rendererController.getAssetPaths(body);
		this.assetController.loadAssetsForBody(assetPaths);
		this.rendererController.buildRenderable(body);
		this.handleOrbitInitialisation(body);
		this.attachUI(body);
		this.uiController.attachCelestialBodyListeners(body);
		this.sceneController.addToScene(body.orbitGroup, body.celestialBodyGroup);
		return body;
	}

	// handleOrbitUpdates
	private handleOrbitInitialisation(body: CelestialBody): void {
		if (body instanceof OrbitingBody) {
			const { x, y, z } = body.orbitingParameters.Velocity;
			const orbitalVelocity = new Vector3(x, y, z);
			if (body.primaryBody instanceof OrbitingBody) {
				body.position = body.orbitingParameters.Position.add(body.primaryBody.position);
				body.currentVelocity.copy(orbitalVelocity.add(body.primaryBody.currentVelocity));
			} else {
				body.position = body.orbitingParameters.Position;
				body.currentVelocity.copy(orbitalVelocity);
			}
			body.celestialBodyGroup.position.copy(body.position);
		}
	}

	handleVelocityUpdate(body: OrbitingBody, dt: number): void {
		const acceleration = this.calculateAcceleration(body);
		body.currentVelocity.add(acceleration.multiplyScalar(dt));
	}
	handlePositionUpdate(body: OrbitingBody, dt: number): void {
		const newVelocity = body.currentVelocity.clone().multiplyScalar(dt);
		body.position = body.position.add(newVelocity);
		// body.position.add(newVelocity);
	}
	handleRotation(body: CelestialBody, dt: number): void {
		const deltaRotation = this.manager.fetchUpdatedRotation(body, dt);
		this.rendererController.applyRotation(body, deltaRotation);
	}
	calculateAcceleration(body: OrbitingBody): Vector3 {
		// let acceleration = new Vector3();
		let [P, S] = [body.primaryBody.position, body.position];
		let [M, m] = [body.primaryBody.physicalParameters.PlanetaryMass, body.physicalParameters.PlanetaryMass];
		const sqrDist = calculateSquaredDistance(P, S);
		const forceDir = calculateForceDirection(P, S);
		const force = calculateAttractiveForce(forceDir, M, m, sqrDist);
		const acceleration = calculateAcceleration(force, m);
		return acceleration;
	}

	private attachUI(body: CelestialBody): void {
		body.container = this.uiController.initialiseCelestialBodyUI(body);
		body.container.visible = true;
		body.celestialBodyGroup.add(body.container);
	}
	public handleSecondaryCreation(primary: CelestialBody, secondaries: CelestialBodyParameters[]): OrbitingBody[] {
		return secondaries.map((secondaryParamters) => {
			const secondary = this.handleCreation(secondaryParamters, primary) as OrbitingBody;
			primary.addSecondary(secondary);
			return secondary;
		});
	}
	// public initialiseRing = async (): Promise<void> => {
	// 	if (!this._physicalParameters.RingSystem) return;
	// 	const inner = this._physicalParameters.InnerRingRadius! * KM_TO_M * SCALE;
	// 	const outer = this._physicalParameters.OuterRingRadius! * KM_TO_M * SCALE;
	// 	const [ringTexture, alphaTexture] = await Promise.all([
	// 		AppContext.instance.DataManager.getTexture(this.createTexturePath("ring")),
	// 		AppContext.instance.DataManager.getTexture(this.createTexturePath("ring_alpha")),
	// 	]);
	// 	const geometry = new RingGeometry(inner, outer, 64);
	// 	geometry.rotateX(-Math.PI / 2);
	// 	const material = getRingMat(ringTexture, alphaTexture, inner, outer);
	// 	const mesh = new Mesh(geometry, material);
	// 	this._celestialBodyGroup.add(mesh);
	// };
	// public removeOrbit(body: CelestialBody): void {
	// 	const orbitLine = body.orbits.get(body.metadata.EnglishName);
	// 	if (orbitLine) {
	// 		body.orbitGroup.remove(orbitLine);
	// 		orbitLine.geometry.dispose();
	// 		orbitLine.material.dispose();
	// 		body.orbits.delete(body.metadata.EnglishName);
	// 	}
	// }
	// destroy(): void {
	// 	throw new Error("Method not implemented.");
	// }
}

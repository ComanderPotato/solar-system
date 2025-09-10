import ICelestialBodyController from "../interfaces/controllers/ICelestialBodyController";
import IOrbitingBodyController from "../interfaces/controllers/IOrbitingBodyController";
import Controller from "../core/Controller";
import CelestialBody from "../models/CelestialBody";
import { CelestialBodies, CelestialBodyParameters } from "../types/CelestialBodyParameters";
import ICelestialBodyManager from "../interfaces/managers/ICelestialBodyManager";
import IAppContext from "../interfaces/IAppContext";
import OrbitingBody from "../models/OrbitingBody";

export default class CelestialBodyController
	extends Controller<ICelestialBodyManager>
	implements ICelestialBodyController, IOrbitingBodyController
{
	public constructor(manager: ICelestialBodyManager) {
		super(manager);
	}

	protected injectControllers(appContext: IAppContext): void {
		this.sceneController = appContext.sceneController;
		this.uiController = appContext.uiController;
		this.solarSystemController = appContext.solarSystemController;
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
		const celestialBody = this.manager.createBody(parameters, primary);
		this.attachUI(celestialBody);
		this.uiController.attachCelestialBodyListeners(celestialBody);
		this.sceneController.addToScene(celestialBody.orbitGroup, celestialBody.celestialBodyGroup);
		return celestialBody;
	}

	private attachUI(body: CelestialBody): void {
		body.container = this.uiController.initialiseCelestialBodyUI(body);
		body.container.visible = true;
		body.celestialBodyGroup.add(body.container);
	}
	public handleSecondaryCreation(primary: CelestialBody, secondaries: CelestialBodies): OrbitingBody[] {
		const a = this.solarSystemController.focusedCelestialBody;

		const orbitingBodies: OrbitingBody[] = [];
		for (const secondaryParameters of Object.values(secondaries)) {
			orbitingBodies.push(this.handleCreation(secondaryParameters, primary) as OrbitingBody);
		}
		return orbitingBodies;
	}
	public handleMeshCreation(body: CelestialBody): void {}

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

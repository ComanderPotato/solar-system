import ISolarSystemController, { FocusedBodyInformation } from "../interfaces/controllers/ISolarSystemController";
import CelestialBody from "../models/CelestialBody";
import SolarSystem, { InitialSolarSystem } from "../models/Solarsystem";
import Controller from "../core/Controller";
import ISolarSystemManager from "../interfaces/managers/ISolarSystemManager";
import OrbitingBody from "../models/OrbitingBody";
import { CelestialBodies } from "../types/CelestialBodyParameters";
import IInjectableController from "../interfaces/IInjectableController";
import IAppContext from "../interfaces/IAppContext";
import { velocity } from "three/src/nodes/TSL.js";
import { isOrbitingBody } from "../utils/CelestialHelpers";
import { BodyTypes } from "../types/CelestialBodyMetadata";
import Debugger from "../core/Debugger";
export default class SolarSystemController
	extends Controller<ISolarSystemManager>
	implements ISolarSystemController, IInjectableController
{
	public constructor(manager: ISolarSystemManager) {
		super(manager);
	}

	injectControllers(appContext: IAppContext): void {
		this.celestialBodyController = appContext.celestialBodyController;
		this.rendererController = appContext.rendererController;
	}
	public handleSolarSystemInitialisation(initialBodies: CelestialBodies): void {
		this.initialiseSolarSystem(initialBodies);
	}

	get focusedBodyInformation(): FocusedBodyInformation | undefined {
		if (!this.focusedCelestialBody) return;
		let velocity = undefined;
		let primaryPosition = undefined;
		if (this.focusedCelestialBody instanceof OrbitingBody) {
			velocity = this.focusedCelestialBody.currentVelocity;
			primaryPosition = this.focusedCelestialBody.primaryBody!.position;
		}
		return {
			body: this.focusedCelestialBody,
			position: this.focusedCelestialBody.position,
			radius: this.focusedCelestialBody.physicalParameters.MeanRadius,
			velocity: velocity,
			primaryPosition: primaryPosition,
		};
	}

	initialiseSolarSystem(initialBodies: CelestialBodies) {
		const { primary: primaryParameters, secondaries: secondaryParameters } = this.initialSolarSystemData;

		const primary = this.celestialBodyController.handleCreation(initialBodies[primaryParameters]);
		const secondaries = this.celestialBodyController.handleSecondaryCreation(
			primary,
			secondaryParameters.map((secondaryParameters) => initialBodies[secondaryParameters]),
		);
		this.manager.initialiseSolarSystem(primary, secondaries);
	}
	initialiseFocusedSecondaries(secondaryParameters: CelestialBodies) {
		if (!this.focusedCelestialBody) return;
		const focusedSecondaries = this.celestialBodyController.handleSecondaryCreation(
			this.focusedCelestialBody,
			Object.values(secondaryParameters),
		);
	}
	handleSimulation(dt: number): void {
		const solarCenter = this.manager.solarSystem.primaryBody;
		if (!solarCenter) return;
		const velocityQueue: CelestialBody[] = [solarCenter];
		const positionQueue: CelestialBody[] = [];
		while (velocityQueue.length > 0) {
			const body = velocityQueue.shift()!;
			this.celestialBodyController.handleRotation(body, dt);
			/* updateVelocity */
			if (isOrbitingBody(body)) {
				this.celestialBodyController.handleVelocityUpdate(body, dt);
			}
			positionQueue.push(body);

			for (const secondary of body.secondaryBodies ?? []) {
				velocityQueue.push(secondary);
			}
		}
		/* updatePosition separately */
		positionQueue.forEach((body) => {
			if (isOrbitingBody(body)) {
				this.celestialBodyController.handlePositionUpdate(body, dt);
			}
		});
	}

	get initialSolarSystemData(): InitialSolarSystem {
		return this.manager.solarSystem.initialData;
	}
	get solarSystem(): SolarSystem {
		return this.manager.solarSystem;
	}
	set focusedCelestialBody(body: CelestialBody) {
		this.manager.focusedCelestialBody = body;
	}
	get focusedCelestialBody(): CelestialBody | undefined {
		return this.manager.focusedCelestialBody;
	}

	destroy(): void {
		throw new Error("Method not implemented.");
	}
}

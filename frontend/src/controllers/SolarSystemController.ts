import ISolarSystemController, { FocusedBodyInformation } from "../interfaces/controllers/ISolarSystemController";
import CelestialBody from "../models/CelestialBody";
import SolarSystem, { InitialSolarSystem } from "../models/Solarsystem";
import Controller from "../core/Controller";
import ISolarSystemManager from "../interfaces/managers/ISolarSystemManager";
import OrbitingBody from "../models/OrbitingBody";
import { CelestialBodies } from "../types/CelestialBodyParameters";
export default class SolarSystemController extends Controller<ISolarSystemManager> implements ISolarSystemController {
	public constructor(manager: ISolarSystemManager) {
		super(manager);
	}
	public handleSolarSystemInitialisation(initialBodies: CelestialBodies): void {}

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
		const secondaries = secondaryParameters.map((secondaryParameter) =>
			this.celestialBodyController.handleCreation(initialBodies[secondaryParameter]),
		);
		this.manager.initialiseSolarSystem(primary, secondaries);
	}
	handleSimulation(dt: number): void {
		throw new Error("Method not implemented.");
	}
	handleDetailUpdate(): void {
		throw new Error("Method not implemented.");
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

	simulate(dt: number): void {
		this.manager.solarSystem.simulate(dt);
	}
	updateDetail(): void {
		this.manager.solarSystem.updateDetail();
	}
	initialiseScene(): void {
		throw new Error("Method not implemented.");
	}
	destroy(): void {
		throw new Error("Method not implemented.");
	}
}

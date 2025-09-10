import { CelestialBodies, CelestialBodyParameters } from "../../types/CelestialBodyParameters";
import CelestialBody from "../../models/CelestialBody";
import IController from "../IController";
import ICelestialBodyManager from "../managers/ICelestialBodyManager";
import OrbitingBody from "../../models/OrbitingBody";
export default interface ICelestialBodyController extends IController<ICelestialBodyManager> {
	handleCreation(parameters: CelestialBodyParameters): CelestialBody;
	handleSecondaryCreation(primary: CelestialBody, secondaries: CelestialBodies): OrbitingBody[]
	// removeOrbit(body: CelestialBody): void;
	// addOrbit(body: CelestialBody): void; // Might need to add orbitLine2
	handleDisposal(body: CelestialBody): void;
	handleSecondaryDisposal(body: CelestialBody): void;
	// destroySecondaries(body: CelestialBody): void;
	// destroyCelestialBody(body: CelestialBody): void;
	// updateBodyDetail(body: CelestialBody): void;
}

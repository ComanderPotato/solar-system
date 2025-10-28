import { CelestialBodyParameters } from "../../types/CelestialBodyParameters";
import CelestialBody from "../../models/CelestialBody";
import OrbitingBody from "../../models/OrbitingBody";
export default interface ICelestialBodyController {
	handleCreation(parameters: CelestialBodyParameters): CelestialBody;
	handleSecondaryCreation(primary: CelestialBody, secondaries: CelestialBodyParameters[]): OrbitingBody[];

	handleDisposal(body: CelestialBody): void;
	handleSecondaryDisposal(body: CelestialBody): void;

	handleRotation(body: CelestialBody, dt: number): void;
	handleOrbitalStep(body: CelestialBody, dt: number): void;
}

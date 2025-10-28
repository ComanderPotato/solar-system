import { BufferGeometry } from "three";
import CelestialBody from "../../models/CelestialBody";
import { CelestialBodyMesh } from "../../models/types";
import { CelestialBodyParameters } from "../../types/CelestialBodyParameters";
import IManager from "../IManager";

export default interface ICelestialBodyManager extends IManager {
	destroyBody(body: CelestialBody): void;
	removeOrbit(primaryBody: CelestialBody, secondaryName: string): void;
	createBody(parameters: CelestialBodyParameters, primary?: CelestialBody): CelestialBody;
	updateGeometryLOD(body: CelestialBodyMesh, geometry: BufferGeometry): void;
	fetchUpdatedRotation(body: CelestialBody, dt: number): number;
}

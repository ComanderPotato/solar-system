import CelestialBody from "../../models/CelestialBody";
import { CelestialBodyParameters } from "../../types/CelestialBodyParameters";
import { CelestialBodyDetail } from "../../utils/constants";
import IManager from "../IManager";
import IMeshProvider from "../IMeshProvider";
import IModelProvider from "../IModelProvider";

export default interface ICelestialBodyManager extends IManager {
	destroyBody(body: CelestialBody): void;
	removeOrbit(primaryBody: CelestialBody, secondaryName: string): void;
	createBody(parameters: CelestialBodyParameters, primary?: CelestialBody): CelestialBody;
	updateGeometryDetail(body: IMeshProvider | IModelProvider, detail: CelestialBodyDetail): void;
}

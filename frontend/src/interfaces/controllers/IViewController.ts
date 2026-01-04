import { Object3D } from "three";

export default interface IViewController {
	canSeeBody(celestialBodyMesh: Object3D): boolean;
}

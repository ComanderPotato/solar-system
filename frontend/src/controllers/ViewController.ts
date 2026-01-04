import { Matrix4, Object3D, Vector3 } from "three";
import Controller from "../core/Controller";
import IViewController from "../interfaces/controllers/IViewController";
import IAppContext from "../interfaces/IAppContext";
import IInjectableController from "../interfaces/IInjectableController";
import { isMeshProvider } from "../utils/CelestialHelpers";

export default class ViewController
	extends Controller<IViewController>
	implements IViewController, IInjectableController
{
	injectControllers(appContext: IAppContext): void {
		this.sceneController = appContext.sceneController;
		this.solarSystemController = appContext.solarSystemController;
	}

	handleCelestialVisibility(): void {}
	public canSeeBody(celestialBodyMesh: Object3D): boolean {
		const { camera, frustum, raycaster } = this.sceneController.sceneResources;
		const allBodies: Object3D[] = this.solarSystemController.solarSystem.allBodies
			.filter((body) => isMeshProvider(body))
			.map((body) => body.mesh);
		camera.updateMatrixWorld();
		frustum.setFromProjectionMatrix(
			new Matrix4().multiplyMatrices(camera.projectionMatrix, camera.matrixWorldInverse),
		);

		const worldTargetPosition = celestialBodyMesh.getWorldPosition(new Vector3());
		if (!frustum.containsPoint(worldTargetPosition)) return false;

		const cameraPosition = new Vector3();
		camera.getWorldPosition(cameraPosition);

		const direction = new Vector3().subVectors(worldTargetPosition, cameraPosition).normalize();

		raycaster.set(cameraPosition, direction);
		raycaster.far = cameraPosition.distanceTo(worldTargetPosition);

		const intersections = raycaster.intersectObjects(allBodies, true);
		if (intersections.length === 0) return true;

		const firstHit = intersections[0].object;

		let obj: Object3D | null = firstHit;
		while (obj) {
			if (obj === celestialBodyMesh) {
				return true;
			}
			obj = obj.parent;
		}

		return false;
	}
}

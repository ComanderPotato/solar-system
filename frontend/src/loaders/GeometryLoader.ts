import { BufferGeometry, BufferGeometryLoader, LoadingManager } from "three";
import AssetLoader from "../core/AssetLoader";

export class GeometryLoader extends AssetLoader<BufferGeometry> {
	constructor(manager: LoadingManager) {
		super(new BufferGeometryLoader(manager));
	}
}

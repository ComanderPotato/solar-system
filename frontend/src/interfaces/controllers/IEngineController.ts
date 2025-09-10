import IController from "../IController";
import IEngineManager from "../managers/IEngineManager";

export default interface IEngineController extends IController<IEngineManager> {
	handleRenderLoop(): void;
}

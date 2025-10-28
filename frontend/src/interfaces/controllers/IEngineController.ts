// import IController from "../IController";
// import IEngineManager from "../managers/IEngineManager";
//
export default interface IEngineController {
	start(): void;
	stop(): void;
	debugger(callback: () => void): void;
	// handleRenderLoop(): void;
}

import IManager from "../IManager";

export default interface IEngineManager extends IManager {
	animate(): void;
	get FPS(): number;
	get FRAME_RATE(): number;
}

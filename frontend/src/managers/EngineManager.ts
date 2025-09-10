import Manager from "../core/Manager";
import IEngineManager from "../interfaces/managers/IEngineManager";

export default class EngineManager extends Manager implements IEngineManager {
	private _fps: number = 24;
	private _frameRate: number = 1 / this._fps;

	get FRAME_RATE(): number {
		return this._frameRate;
	}
	get FPS(): number {
		return this._fps;
	}
	animate(): void {}
}

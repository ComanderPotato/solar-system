import IAppContext from "./IAppContext";
import IManager from "./IManager";

export default interface IController<T extends IManager = IManager> {
	readonly manager: T;
	init?(): void;
	injectControllers?(appContext: IAppContext): void;
}

// import IAppContext from "./IAppContext";
import IManager from "./IManager";

// export default interface IController extends BaseController<IManager> {
// 	// initialiseScene?(): void;
//
// 	destroy(): void;
export default interface IController<T extends IManager> {
	readonly manager: T;
}

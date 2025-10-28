import IAppContext from "./IAppContext";

export default interface IInjectableController {
	injectControllers(appContext: IAppContext): void;
}

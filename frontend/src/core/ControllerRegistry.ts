import ITimeController from "../interfaces/controllers/ITimeController";
import IAppContext from "../interfaces/IAppContext";

export class ControllerRegistry {
	private static _context: IAppContext;

	static set context(context: IAppContext) {
		this._context = context;
	}

	static get ctx(): IAppContext {
		if (!this._context) throw new Error("");
		return this._context;
	}

	static get timeController(): ITimeController {
		return this._context.timeController;
	}
}

enum Controllers {
	"timeController",
}

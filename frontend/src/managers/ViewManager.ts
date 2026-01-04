import Manager from "../core/Manager";
import IViewManager from "../interfaces/managers/IViewManager";

export default class ViewManager extends Manager implements IViewManager {
	constructor() {
		super();
	}

	isBodyVisible() {}
}

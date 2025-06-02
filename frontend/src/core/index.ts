import { DataManager, UIManager, TimeManager } from "../managers";
import App from "./App";
// Maybe have an AppContext (Includes all instances)
let appInstance: App | null = null;
let uiManagerInstance: UIManager | null = null;
let dataManagerInstance: DataManager | null = null;
let timeManagerInstance: TimeManager | null = null;
export const app = (): App => {
	if (!appInstance) appInstance = new App();
	return appInstance;
};
export const dataManager = (): DataManager => {
	if (!dataManagerInstance) dataManagerInstance = new DataManager();
	return dataManagerInstance;
};
export const timeManager = (): TimeManager => {
	if (!timeManagerInstance) timeManagerInstance = new TimeManager();
	return timeManagerInstance;
};
export const uiManager = (): UIManager => {
	if (!uiManagerInstance) uiManagerInstance = new UIManager();
	return uiManagerInstance;
};
app().render();

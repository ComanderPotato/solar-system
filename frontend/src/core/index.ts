// import { AssetLoadingManager } from "../loaders/AssetLoadingManager";
// import DataManager, from "../managers/DataManager";
// import DataManager from "../managers/DataManager";
// import UIManager from "../managers/UIManager";
import { DataManager, UIManager, AssetLoadingManager } from "../managers";
import App from "./App";
// export const app = new App();
let appInstance: App | null = null;
let assetManagerInstance: AssetLoadingManager | null = null;
let uiManagerInstance: UIManager | null = null;
let dataManagerInstance: DataManager | null = null;


export const dataManager = (): DataManager => {
  if (!dataManagerInstance) dataManagerInstance = new DataManager();
  return dataManagerInstance;
};
export const assetManager = (): AssetLoadingManager => {
  if (!assetManagerInstance)
    assetManagerInstance = new AssetLoadingManager(
      (url, p) => {
        // console.log(`Loaded ${url}`);
      },
      () => {}
    );

  return assetManagerInstance;
};
export const uiManager = (): UIManager => {
  if (!uiManagerInstance) uiManagerInstance = new UIManager();
  return uiManagerInstance;
};
export const app = (): App => {
  if (!appInstance) appInstance = new App();
  return appInstance;
};
app().render();

// let instance: AssetLoadingManager | null = null;

// export function getAssetLoader(): AssetLoadingManager {
//   if (!instance) {
//     instance = new AssetLoadingManager(onProgress, () => (app.isLoading = false));
//   }
//   return instance;
// }

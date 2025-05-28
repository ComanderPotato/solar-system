import { DataManager, UIManager } from "../managers";
import { Clock } from "../utils/Clock";
import App from "./App";
let appInstance: App | null = null;
// let assetLoadingManagerInstance: AssetLoadingManager | null = null;
let uiManagerInstance: UIManager | null = null;
let dataManagerInstance: DataManager | null = null;
let clockInstance: Clock | null = null

export const dataManager = (): DataManager => {
  if (!dataManagerInstance) dataManagerInstance = new DataManager();

  return dataManagerInstance;
};
export const clock = (): Clock => {
  if (!clockInstance) clockInstance = new Clock();

  return clockInstance;
};
// export const assetLoadingManager = (): AssetLoadingManager => {
//   if (!assetLoadingManagerInstance)
//     assetLoadingManagerInstance = new AssetLoadingManager(
//       (url, p) => {
//         // console.log(`Loaded ${url}`);
//       },
//       () => {}
//     );

//   return assetLoadingManagerInstance;
// };
export const uiManager = (): UIManager => {
  if (!uiManagerInstance) uiManagerInstance = new UIManager();
  return uiManagerInstance;
};
export const app = (): App => {
  if (!appInstance) appInstance = new App();
  return appInstance;
};
app().render();

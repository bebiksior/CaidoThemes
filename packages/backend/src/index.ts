import { DefineAPI } from "caido:plugin";
import { CaidoBackendSDK } from "@/types";
import DatabaseManager from "@/database/database";
import { ThemesStore } from "@/store/themes";
import { addTheme, getTheme, getThemes, removeTheme, updateTheme, resetThemes } from "./api/themes";

export type { BackendEvents } from "./types";

export type API = DefineAPI<{
  getThemes: typeof getThemes;
  addTheme: typeof addTheme;
  removeTheme: typeof removeTheme;
  getTheme: typeof getTheme;
  updateTheme: typeof updateTheme;
  resetThemes: typeof resetThemes;
}>;

export async function init(sdk: CaidoBackendSDK): Promise<void> {
  sdk.api.register("getThemes", getThemes);
  sdk.api.register("addTheme", addTheme);
  sdk.api.register("removeTheme", removeTheme);
  sdk.api.register("getTheme", getTheme);
  sdk.api.register("updateTheme", updateTheme);
  sdk.api.register("resetThemes", resetThemes);

  const dbManager = new DatabaseManager(sdk);
  const setup = await dbManager.init();

  ThemesStore.init(dbManager, sdk);
  if (setup) {
    sdk.console.log("First time CaidoThemes launch, adding default themes");
    await ThemesStore.get().resetThemes();
  }
}

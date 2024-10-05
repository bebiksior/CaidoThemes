import DatabaseManager from "@/database/database";
import { Theme } from "shared";
import { CaidoBackendSDK } from "@/types";
import { DEFAULT_THEMES } from "@/defaults";

export class ThemesStore {
  private static instance: ThemesStore;

  private themesMap: Map<string, Theme> = new Map();
  private dbManager: DatabaseManager;
  private sdk: CaidoBackendSDK;

  constructor(dbManager: DatabaseManager, sdk: CaidoBackendSDK) {
    this.dbManager = dbManager;
    this.sdk = sdk;
  }

  public static async init(dbManager: DatabaseManager, sdk: CaidoBackendSDK) {
    this.instance = new ThemesStore(dbManager, sdk);
    return this.instance;
  }

  public static get(): ThemesStore {
    if (!ThemesStore.instance) {
      throw new Error("ThemesStore not initialized");
    }

    return ThemesStore.instance;
  }

  public async resetThemes(): Promise<void> {
    await this.dbManager.clearThemes();
    this.themesMap.clear();

    for (const theme of DEFAULT_THEMES) {
      await this.addTheme(theme);
    }
  }

  public async getThemes(): Promise<Theme[]> {
    const themes = await this.dbManager.getThemes();
    this.themesMap = new Map(themes.map((theme) => [theme.id, theme]));
    return themes;
  }

  public async existsID(id: string): Promise<boolean> {
    return this.themesMap.has(id);
  }

  public async getTheme(id: string): Promise<Theme | null> {
    return this.dbManager.getTheme(id);
  }

  public async addTheme(theme: Omit<Theme, "id">): Promise<Theme> {
    const id = await this.dbManager.createTheme(theme);

    const newTheme = {
      ...theme,
      id,
    };
    this.themesMap.set(id, newTheme);

    return newTheme;
  }

  public async updateTheme(theme: Theme): Promise<Theme> {
    await this.dbManager.updateTheme(theme);
    this.themesMap.set(theme.id, theme);
    return theme;
  }

  public async removeTheme(id: string): Promise<void> {
    await this.dbManager.deleteTheme(id);
    this.themesMap.delete(id);
  }

  public async clear(): Promise<void> {
    await this.dbManager.clearThemes();
    this.themesMap.clear();
  }
}

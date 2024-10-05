import { error, ok, Result } from "shared";
import { CaidoBackendSDK } from "@/types";
import { Theme } from "shared";
import { ThemesStore } from "@/store/themes";

async function getThemes(sdk: CaidoBackendSDK): Promise<Result<Theme[]>> {
  const themeStore = ThemesStore.get();
  const themes = await themeStore.getThemes();

  return ok(themes);
}

async function getTheme(
  sdk: CaidoBackendSDK,
  themeID: string
): Promise<Result<Theme>> {
  const themeStore = ThemesStore.get();
  const theme = await themeStore.getTheme(themeID);

  if (!theme) {
    return error(`Theme ${themeID} not found`);
  }

  return ok(theme);
}

async function addTheme(
  sdk: CaidoBackendSDK,
  newTheme: Omit<Theme, "id">
): Promise<Result<Theme[]>> {
  const themeStore = ThemesStore.get();
  const themes = await themeStore.getThemes();

  const validationResult = validateTheme(newTheme);
  if (validationResult.kind === "Error") {
    return error(validationResult.error);
  }

  const theme = await themeStore.addTheme(newTheme);
  return ok([...themes, theme]);
}

async function updateTheme(
  sdk: CaidoBackendSDK,
  themeID: string,
  updatedThemeFields: Partial<Theme>
): Promise<Result<Theme[]>> {
  const themeStore = ThemesStore.get();
  const theme = await themeStore.getTheme(themeID);
  if (!theme) {
    return error(`Theme ${themeID} not found`);
  }

  const updatedTheme = { ...theme, ...updatedThemeFields };
  const validationResult = validateTheme(updatedTheme);
  if (validationResult.kind === "Error") {
    return error(validationResult.error);
  }

  await themeStore.updateTheme(updatedTheme);

  const themes = await themeStore.getThemes();
  return ok(themes);
}

async function removeTheme(
  sdk: CaidoBackendSDK,
  themeID: string
): Promise<Result<Theme[]>> {
  const themeStore = ThemesStore.get();
  const theme = await themeStore.getTheme(themeID);
  if (!theme) {
    return error(`Theme ${themeID} not found`);
  }

  await themeStore.removeTheme(themeID);

  const themes = await themeStore.getThemes();
  return ok(themes);
}

async function resetThemes(sdk: CaidoBackendSDK): Promise<Result<Theme[]>> {
  const themeStore = ThemesStore.get();
  await themeStore.resetThemes();
  return getThemes(sdk);
}

function validateTheme(theme: Omit<Theme, "id">): Result<Omit<Theme, "id">> {
  if (!theme.name) {
    return error("Theme name is required");
  }

  if (!theme.author) {
    return error("Theme author is required");
  }

  if (!theme.description) {
    return error("Theme description is required");
  }

  if (theme.author.length > 50) {
    return error("Theme author is too long");
  }

  if (theme.name.length > 50) {
    return error("Theme name is too long");
  }

  if (theme.description.length > 300) {
    return error("Theme description is too long");
  }

  return ok(theme);
}

export { getThemes, getTheme, addTheme, updateTheme, removeTheme, resetThemes };

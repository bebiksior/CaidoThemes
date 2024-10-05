import { Theme } from "shared";

export let usedThemeID: string | undefined;

export function setTheme(theme: Theme): void {
  localStorage.setItem("caidothemes:theme", theme.id);
  const root = document.documentElement;
  usedThemeID = theme.id;

  // Set primary colors
  setPropertyIfNotUndefined(root, "--caidothemes-primary-dark", theme.primary.dark);
  setPropertyIfNotUndefined(root, "--caidothemes-primary-light", theme.primary.light);
  setPropertyIfNotUndefined(root, "--caidothemes-subtle", theme.primary.subtle);

  // Set button colors
  if (theme.button) {
    setPropertyIfNotUndefined(root, "--caidothemes-btn-primary-bg", theme.button.primary?.bg);
    setPropertyIfNotUndefined(root, "--caidothemes-btn-primary-text", theme.button.primary?.text);
    setPropertyIfNotUndefined(root, "--caidothemes-btn-secondary-bg", theme.button.secondary?.bg);
    setPropertyIfNotUndefined(root, "--caidothemes-btn-secondary-text", theme.button.secondary?.text);
    setPropertyIfNotUndefined(root, "--caidothemes-btn-tertiary-bg", theme.button.tertiary?.bg);
    setPropertyIfNotUndefined(root, "--caidothemes-btn-tertiary-text", theme.button.tertiary?.text);
  }
}

export function resetTheme(): void {
  usedThemeID = undefined;
  const root = document.documentElement;
  localStorage.removeItem("caidothemes:theme");
  
  const properties = Object.values(root.style);
  for (const property of properties) {
    if (property.startsWith("--caidothemes-")) {
      root.style.removeProperty(property);
    }
  }
}

const setPropertyIfNotUndefined = (
  root: HTMLElement,
  property: string,
  value: string | undefined
) => {
  if (value && value !== "") {
    root.style.setProperty(property, value);
  } else {
    root.style.removeProperty(property);
  }
};

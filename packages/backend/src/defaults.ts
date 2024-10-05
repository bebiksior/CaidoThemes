import { Theme } from "shared";

/* Most of this themes are made by ChatGPT lol. Feel free to contribute your own! */
export const DEFAULT_THEMES: Omit<Theme, "id">[] = [
  {
    name: "Default",
    description: "The default Caido theme",
    author: "Caido",
    primary: {
      dark: "#25272d",
      light: "#353942",
      subtle: "#2f323a",
    },
  },
  {
    name: "Dark Gray",
    description: "For hackers who like their themes as dark as their intentions",
    author: "bebiks",
    primary: {
      dark: "#262626",
      light: "#3a3a3a",
      subtle: "#303030",
    },
  },
  {
    name: "Even Darker",
    description: "So dark, you might lose your mouse cursor",
    author: "bebiks",
    primary: {
      dark: "#000000",
      light: "#121111",
      subtle: "#151414",
    },
  },
  {
    name: "Coffee Stain",
    description: "A dark theme inspired by your favorite brew",
    author: "bebiks",
    primary: {
      dark: "#2e241f",
      light: "#4d3e32",
      subtle: "#3a3027",
    },
  },
  {
    name: "Ocean Blue",
    description: "For when you want your screen to look like a fish tank",
    author: "bebiks",
    primary: {
      dark: "#1a2b3c",
      light: "#3a5a7a",
      subtle: "#2c4a6a",
    },
  },
  {
    name: "Forest Green",
    description: "Perfect for pretending you're outside while testing indoors",
    author: "bebiks",
    primary: {
      dark: "#1e3a23",
      light: "#3c7a4d",
      subtle: "#2c5a3d",
    },
  },
  {
    name: "Sunset Orange",
    description: "Caido, but make it pumpkin spice",
    author: "bebiks",
    primary: {
      dark: "#3a2a1a",
      light: "#7a5a3a",
      subtle: "#5a4a2a",
    },
  },
  {
    name: "Lavender",
    description: "For researchers who want their proxy to smell like a fancy soap shop",
    author: "bebiks",
    primary: {
      dark: "#2a1a3a",
      light: "#5a3a7a",
      subtle: "#4a2a5a",
    },
  },
];

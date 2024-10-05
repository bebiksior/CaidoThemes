import React from "react";
import { ThemeProvider } from "@mui/material/styles";
import { caidoTheme, StyledSplitter } from "caido-material-ui";
import "allotment/dist/style.css";
import "./styles/style.css";
import { ThemesList } from "@/components/ThemesList";
import { ThemePreview } from "@/components/ThemePreview";
import { useThemeStore } from "@/stores/themes";

export const App = () => {
  const { selectedThemeID: selectedThemeName } = useThemeStore();
  
  return (
    <ThemeProvider theme={caidoTheme}>
      <StyledSplitter>
        <ThemesList />
        {selectedThemeName && <ThemePreview />}
      </StyledSplitter>
    </ThemeProvider>
  );
};

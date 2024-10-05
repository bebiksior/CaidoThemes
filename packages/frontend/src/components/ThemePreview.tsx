import { useSDK } from "@/stores/sdk";
import { useTheme, useThemeStore, useUpdateTheme } from "@/stores/themes";
import {
  Typography,
  Button,
  TextField,
  Box,
  Tooltip,
  Divider,
} from "@mui/material";
import { StyledBox } from "caido-material-ui";
import { setTheme as useThemeFrontend } from "@/themes/switcher";
import { useState, useEffect } from "react";
import { Theme } from "shared";

interface EmptyPageProps {
  text: string;
}

function EmptyPage({ text }: EmptyPageProps) {
  return (
    <StyledBox className="flex items-center justify-center h-full">
      <Typography>{text}</Typography>
    </StyledBox>
  );
}

interface ColorInputProps {
  label: string;
  value: string;
  onChange: (value: string) => void;
}

function ColorInput({ label, value, onChange }: ColorInputProps) {
  return (
    <Box display="flex" alignItems="center" gap={2}>
      <Box flexGrow={1}>
        <TextField
          fullWidth
          label={label}
          value={value}
          onChange={(e) => onChange(e.target.value)}
        />
      </Box>
      <Box width="33%">
        <input
          type="color"
          value={value || "#000000"}
          onChange={(e) => onChange(e.target.value)}
          style={{ width: "100%", height: "56px" }}
        />
      </Box>
    </Box>
  );
}

export function ThemePreview() {
  const sdk = useSDK();
  const { selectedThemeID } = useThemeStore();
  const { data: theme, isError } = useTheme(sdk, selectedThemeID ?? "");
  const { mutate: updateTheme } = useUpdateTheme(sdk);

  const [editedTheme, setEditedTheme] = useState<Theme | null>(null);

  useEffect(() => {
    if (theme) {
      setEditedTheme(theme);
    }
  }, [theme]);

  if (!selectedThemeID) {
    return <EmptyPage text="No theme selected" />;
  }

  if (isError || !theme || !editedTheme) {
    return <EmptyPage text="Error occurred while loading theme" />;
  }

  const handleUseTheme = () => {
    if (editedTheme) {
      useThemeFrontend(editedTheme);
      updateTheme({ themeID: selectedThemeID, updatedTheme: editedTheme });
      localStorage.setItem("caidothemes:theme", editedTheme.id);
    }
  };

  const handleExportTheme = () => {
    const { id, ...themeWithoutId } = editedTheme;
    const themeData = JSON.stringify(themeWithoutId, null, 2);
    const blob = new Blob([themeData], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const fileName = `${editedTheme.name.toLowerCase().replace(/\s+/g, '-')}.json`;

    const link = document.createElement("a");
    link.href = url;
    link.download = fileName;
    link.click();

    URL.revokeObjectURL(url);

    sdk.window.showToast("Theme exported successfully", { variant: "success" });
  };

  const handleColorChange = (
    category: "primary" | "button",
    subCategory: string,
    property: string,
    value: string
  ) => {
    if (editedTheme) {
      setEditedTheme((prevTheme) => {
        if (!prevTheme) return null;
        if (category === "primary") {
          return {
            ...prevTheme,
            primary: {
              ...prevTheme.primary,
              [subCategory]: value,
            },
          };
        } else if (category === "button") {
          return {
            ...prevTheme,
            button: {
              ...prevTheme.button,
              [subCategory]: {
                ...(prevTheme.button?.[subCategory as keyof Theme["button"]] ||
                  {}),
                [property]: value,
              },
            },
          };
        }
        return prevTheme;
      });
    }
  };

  return (
    <StyledBox sx={{ p: 2, overflow: "auto" }}>
      <div className="flex justify-between items-center mb-4">
        <Typography variant="h5" sx={{ fontWeight: "bold" }}>
          Theme Preview
          <Typography variant="body2" sx={{ color: "text.secondary" }}>
            ID: {editedTheme.id}
          </Typography>
        </Typography>
        <div className="flex gap-2">
          <Button
            variant="outlined"
            color="primary"
            onClick={handleExportTheme}
          >
            Export
          </Button>
          <Button variant="contained" color="primary" onClick={handleUseTheme}>
            Use and Save
          </Button>
        </div>
      </div>
      <Box sx={{ display: "flex", flexDirection: "column", gap: 3 }}>
        <TextField
          label="Theme Name"
          value={editedTheme.name}
          onChange={(e) =>
            setEditedTheme({ ...editedTheme, name: e.target.value })
          }
          fullWidth
        />
        <TextField
          label="Author"
          value={editedTheme.author}
          onChange={(e) =>
            setEditedTheme({ ...editedTheme, author: e.target.value })
          }
          fullWidth
        />
        <TextField
          label="Description"
          value={editedTheme.description}
          onChange={(e) =>
            setEditedTheme({ ...editedTheme, description: e.target.value })
          }
          fullWidth
          multiline
          rows={3}
        />

        <Divider />

        <Typography variant="h6" sx={{ fontWeight: "bold" }}>
          Primary Colors
        </Typography>

        <ColorInput
          label="Primary Dark"
          value={editedTheme.primary.dark}
          onChange={(value) => handleColorChange("primary", "dark", "", value)}
        />

        <ColorInput
          label="Primary Subtle"
          value={editedTheme.primary.subtle}
          onChange={(value) =>
            handleColorChange("primary", "subtle", "", value)
          }
        />

        <Tooltip
          title="Make sure it's just a bit lighter than the subtle color. This is used mostly on HTTP history page - in even request rows, and table head."
          arrow
          slotProps={{ tooltip: { sx: { fontSize: "1rem" } } }}
        >
          <div>
            <ColorInput
              label="Primary Light"
              value={editedTheme.primary.light}
              onChange={(value) =>
                handleColorChange("primary", "light", "", value)
              }
            />
          </div>
        </Tooltip>

        <Divider />

        <Typography variant="h5" sx={{ fontWeight: "bold" }}>
          Button Colors
        </Typography>

        <ColorInput
          label="Primary Button Background"
          value={editedTheme.button?.primary?.bg || ""}
          onChange={(value) =>
            handleColorChange("button", "primary", "bg", value)
          }
        />

        <ColorInput
          label="Primary Button Text"
          value={editedTheme.button?.primary?.text || ""}
          onChange={(value) =>
            handleColorChange("button", "primary", "text", value)
          }
        />

        <ColorInput
          label="Secondary Button Background"
          value={editedTheme.button?.secondary?.bg || ""}
          onChange={(value) =>
            handleColorChange("button", "secondary", "bg", value)
          }
        />

        <ColorInput
          label="Secondary Button Text"
          value={editedTheme.button?.secondary?.text || ""}
          onChange={(value) =>
            handleColorChange("button", "secondary", "text", value)
          }
        />

        <ColorInput
          label="Tertiary Button Background"
          value={editedTheme.button?.tertiary?.bg || ""}
          onChange={(value) =>
            handleColorChange("button", "tertiary", "bg", value)
          }
        />

        <ColorInput
          label="Tertiary Button Text"
          value={editedTheme.button?.tertiary?.text || ""}
          onChange={(value) =>
            handleColorChange("button", "tertiary", "text", value)
          }
        />
      </Box>
    </StyledBox>
  );
}

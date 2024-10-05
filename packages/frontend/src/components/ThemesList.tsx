import { useSDK } from "@/stores/sdk";
import { useRemoveTheme, useThemes, useThemeStore } from "@/stores/themes";
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Typography,
  Button,
  Menu,
  MenuItem,
  ListItemIcon,
  Dialog,
  DialogContentText,
  DialogContent,
  DialogActions,
  DialogTitle,
} from "@mui/material";
import { StyledBox } from "caido-material-ui";
import { useAddTheme } from "@/stores/themes";
import { useState } from "react";
import RestartAltIcon from "@mui/icons-material/RestartAlt";
import FileUploadIcon from "@mui/icons-material/FileUpload";
import { useQueryClient } from "@tanstack/react-query";

export const ThemesList = () => {
  const sdk = useSDK();
  const queryClient = useQueryClient();

  const { data: themes } = useThemes(sdk);
  const { selectedThemeID, setSelectedThemeID } = useThemeStore();
  const { mutate: addTheme } = useAddTheme(sdk);
  const { mutate: removeTheme } = useRemoveTheme(sdk);

  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);

  const handleAddTheme = () => {
    addTheme({
      name: "New Theme " + Date.now(),
      description: "This is easily the best theme ever created",
      author: "awesome-someone",
      primary: {
        dark: "#25272d",
        light: "#353942",
        subtle: "#2f323a",
      },
    });

    sdk.window.showToast("New theme created", {
      variant: "success",
    });
  };

  const handleRemoveTheme = (themeId: string) => {
    removeTheme(themeId);

    sdk.window.showToast("Theme deleted", {
      variant: "success",
    });
  };

  const handleImportTheme = () => {
    const input = document.createElement("input");
    input.type = "file";
    input.accept = ".json";
    input.onchange = (event) => {
      const file = (event.target as HTMLInputElement).files?.[0];
      if (file) {
        const reader = new FileReader();
        reader.onload = (e) => {
          try {
            const themeData = JSON.parse(e.target?.result as string);
            addTheme(themeData);
            sdk.window.showToast("Theme imported successfully", {
              variant: "success",
            });
          } catch (error) {
            sdk.window.showToast("Error importing theme", { variant: "error" });
          }
        };
        reader.readAsText(file);
      }
    };
    input.click();
  };

  const handleResetThemes = async () => {
    await sdk.backend.resetThemes();

    sdk.window.showToast("Themes reset", {
      variant: "success",
    });
  };
  const [openResetDialog, setOpenResetDialog] = useState(false);

  const handleOpenResetDialog = () => {
    setOpenResetDialog(true);
    setAnchorEl(null);
  };

  const handleCloseResetDialog = () => {
    setOpenResetDialog(false);
  };

  const handleConfirmReset = async () => {
    await handleResetThemes();
    handleCloseResetDialog();
    setSelectedThemeID(null);
    queryClient.invalidateQueries({ queryKey: ["themes"] });
  };
  return (
    <StyledBox>
      <div className="flex justify-between items-center p-5">
        <Typography sx={{ fontWeight: "bold" }} variant="h5">
          Themes
        </Typography>
        <div className="flex gap-2">
          <Button
            variant="outlined"
            color="primary"
            aria-haspopup="true"
            onClick={(event) => setAnchorEl(event.currentTarget)}
          >
            Actions
          </Button>
          <Menu
            anchorEl={anchorEl}
            open={Boolean(anchorEl)}
            onClose={() => setAnchorEl(null)}
          >
            <MenuItem onClick={handleOpenResetDialog}>
              <ListItemIcon>
                <RestartAltIcon fontSize="small" />
              </ListItemIcon>
              Reset
            </MenuItem>
            <MenuItem onClick={handleImportTheme}>
              <ListItemIcon>
                <FileUploadIcon fontSize="small" />
              </ListItemIcon>
              Import
            </MenuItem>
          </Menu>
          <Button variant="contained" color="primary" onClick={handleAddTheme}>
            New
          </Button>
        </div>
        <Dialog
          open={openResetDialog}
          onClose={handleCloseResetDialog}
          aria-labelledby="alert-dialog-title"
          aria-describedby="alert-dialog-description"
        >
          <DialogTitle id="alert-dialog-title">{"Reset Themes?"}</DialogTitle>
          <DialogContent>
            <DialogContentText id="alert-dialog-description">
              Are you sure you want to reset all themes? This action cannot be
              undone.
            </DialogContentText>
          </DialogContent>
          <DialogActions>
            <Button onClick={handleCloseResetDialog} color="primary">
              Cancel
            </Button>
            <Button onClick={handleConfirmReset} color="primary" autoFocus>
              Confirm
            </Button>
          </DialogActions>
        </Dialog>
      </div>

      <TableContainer sx={{ overflow: 'auto', maxHeight: 'calc(100vh - 150px)' }}>
        <Table stickyHeader>
          <TableHead>
            <TableRow>
              <TableCell sx={{ backgroundColor: 'rgba(0, 0, 0, 0.2)' }}>Name</TableCell>
              <TableCell sx={{ backgroundColor: 'rgba(0, 0, 0, 0.2)' }}>Description</TableCell>
              <TableCell sx={{ backgroundColor: 'rgba(0, 0, 0, 0.2)' }}>Author</TableCell>
              <TableCell sx={{ backgroundColor: 'rgba(0, 0, 0, 0.2)' }}>Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {themes?.map((theme) => (
              <TableRow
                key={theme.id}
                onClick={() => setSelectedThemeID(theme.id)}
                selected={selectedThemeID === theme.id}
                hover
              >
                <TableCell>{theme.name}</TableCell>
                <TableCell>{theme.description}</TableCell>
                <TableCell>{theme.author}</TableCell>
                <TableCell>
                  <Button
                    variant="outlined"
                    color="primary"
                    onClick={(e) => {
                      e.stopPropagation();
                      handleRemoveTheme(theme.id);
                    }}
                  >
                    Delete
                  </Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </StyledBox>
  );
};

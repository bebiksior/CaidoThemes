import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { CaidoSDK } from "@/types";
import { Theme } from "shared";
import { handleResult } from "@/utils/api-calls";
import { create } from "zustand";
import { resetTheme, usedThemeID } from "@/themes/switcher";

const THEMES_QUERY_KEY = ["themes"];

interface ThemeLocalStore {
  selectedThemeID: string | null;
  setSelectedThemeID: (themeID: string | null) => void;
}

const useThemeLocalStore = create<ThemeLocalStore>((set) => ({
  selectedThemeID: localStorage.getItem("caidothemes:theme") || null,
  setSelectedThemeID: (themeID) => set({ selectedThemeID: themeID }),
}));

function useThemes(sdk: CaidoSDK) {
  return useQuery<Theme[], Error>({
    queryKey: THEMES_QUERY_KEY,
    queryFn: () => handleResult(sdk.backend.getThemes(), sdk),
    staleTime: 1000 * 60 * 5,
  });
}

function useTheme(sdk: CaidoSDK, themeID: string) {
  return useQuery<Theme, Error>({
    queryKey: [THEMES_QUERY_KEY, themeID],
    queryFn: () => handleResult(sdk.backend.getTheme(themeID), sdk),
  });
}

function useUpdateTheme(sdk: CaidoSDK) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      themeID,
      updatedTheme,
    }: {
      themeID: string;
      updatedTheme: Partial<Theme>;
    }) => handleResult(sdk.backend.updateTheme(themeID, updatedTheme), sdk),
    onSuccess: (data) => {
      queryClient.setQueryData(THEMES_QUERY_KEY, data);
    },
  });
}

function useAddTheme(sdk: CaidoSDK) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (newTheme: Omit<Theme, "id">) =>
      handleResult(sdk.backend.addTheme(newTheme), sdk),
    onSuccess: (data) => {
      queryClient.setQueryData(THEMES_QUERY_KEY, data);
    },
  });
}

function useRemoveTheme(sdk: CaidoSDK) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (themeID: string) =>
      handleResult(sdk.backend.removeTheme(themeID), sdk),
    onSuccess: (data, variables) => {
      const currentSelectedTheme =
        useThemeLocalStore.getState().selectedThemeID;

      if (usedThemeID === variables) {
        resetTheme();
      }

      if (currentSelectedTheme === variables) {
        useThemeLocalStore.setState({ selectedThemeID: null });
      }

      queryClient.setQueryData(THEMES_QUERY_KEY, data);
    },
  });
}

export {
  useThemes,
  useAddTheme,
  useRemoveTheme,
  useThemeLocalStore as useThemeStore,
  useTheme,
  useUpdateTheme,
};

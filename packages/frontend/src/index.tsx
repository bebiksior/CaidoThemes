import { createRoot } from "react-dom/client";
import { CaidoSDK } from "./types";
import { App } from "@/App";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { SDKProvider } from "@/stores/sdk";
import { setTheme } from "@/themes/switcher";

const queryClient = new QueryClient();

export const init = async (sdk: CaidoSDK) => {
  const rootElement = document.createElement("div");
  Object.assign(rootElement.style, {
    height: "100%",
    width: "100%",
  });

  const root = createRoot(rootElement);
  root.render(
    <SDKProvider sdk={sdk}>
      <QueryClientProvider client={queryClient}>
        <App />
      </QueryClientProvider>
    </SDKProvider>
  );

  sdk.navigation.addPage("/themes", {
    body: rootElement,
  });

  sdk.sidebar.registerItem("Themes", "/themes", {
    icon: "fas fa-palette",
  });

  const storedTheme = localStorage.getItem("caidothemes:theme");
  if (storedTheme) {
    localStorage.removeItem("caidothemes:theme");

    const result = await sdk.backend.getTheme(storedTheme);
    if (result.kind === "Error") {
      return;
    }

    const theme = result.value;
    setTheme(theme);
  }
};

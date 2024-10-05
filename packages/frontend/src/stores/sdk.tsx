import { createContext, useContext, ReactNode } from "react";
import { CaidoSDK } from "@/types";

interface SDKProviderProps {
  sdk: CaidoSDK;
  children: ReactNode;
}

const SDKContext = createContext<CaidoSDK | undefined>(undefined);

export function SDKProvider({ sdk, children }: SDKProviderProps) {
  return <SDKContext.Provider value={sdk}>{children}</SDKContext.Provider>;
}

export function useSDK(): CaidoSDK {
  const context = useContext(SDKContext);
  if (context === undefined) {
    throw new Error("useSDK must be used within an SDKProvider");
  }
  return context;
}

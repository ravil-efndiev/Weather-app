import { type Dispatch, type SetStateAction, createContext, useContext } from "react";

export interface GlobalData {
  temperatureUnit: string;
  windSpeedUnit: string;
}

interface GlobalDataContextType {
  globalData: GlobalData;
  setGlobalData: Dispatch<SetStateAction<GlobalData>>;
}

export const GlobalDataContext = createContext<GlobalDataContextType | undefined>(
  undefined
);

export function useGlobalData() {
  const context = useContext(GlobalDataContext);
  if (!context) {
    throw new Error(
      "useGlobalData must be used within a GlobalDataContext.Provider"
    );
  }
  return context;
}

export interface WeatherData {
  temperature?: number;
  humidity?: number;
  windSpeed?: number;
}

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
  temperature: number;
  feelsLike: number;
  humidity: number;
  dewPoint: number;
  uvIndex: number;
  windSpeed: number;
  isDay: boolean;
  conditionsInfo: {
    text: string;
    iconURL: string;
  }
}

export interface Coordinates {
  lat: number;
  long: number;
}

export interface Location {
  name: string;
  coordinates: Coordinates;
  weather: WeatherData;
}

export interface DayData {
  date: string;
  avgTemp: number;
  minTemp: number;
  maxTemp: number;
  sunrise: string;
  sunset: string;
  conditionsInfo: {
    text: string;
    iconURL: string;
  }
}

export type Forecast = { dayData: DayData; hourlyData: WeatherData[] }[];

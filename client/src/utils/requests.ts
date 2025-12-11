import type { Coordinates, Forecast, GlobalData, Location } from "@/globalData";
import { api } from "./api";

export async function getRealtimeWeather(
  coordinates: Coordinates,
  globalData: GlobalData
): Promise<Location> {
  const res = await api.get("/weather/realtime", {
    params: {
      lat: coordinates.lat,
      long: coordinates.long,
      globalData: JSON.stringify(globalData),
    },
  });

  return res.data;
}

export async function getForecast(
  coordinates: Coordinates,
  globalData: GlobalData,
  days: number
): Promise<{ location: Location; forecast: Forecast }> {
  const res = await api.get("/weather/forecast", {
    params: {
      lat: coordinates.lat,
      long: coordinates.long,
      globalData: JSON.stringify(globalData),
      days: days,
    },
  });

  return res.data;
}

import type { Coordinates, GlobalData, Location, WeatherData } from "@/globalData";
import { weatherApi } from "./api";

export async function getRealtimeWeather(
  coordinates: Coordinates,
  globalData: GlobalData
): Promise<Location> {
  try {
    const res = await weatherApi.get("/current.json", {
      params: {
        q: `${coordinates.lat},${coordinates.long}`,
      },
    });

    const weatherData = res.data.current;
    const locWeather: WeatherData = {
      temperature:
        globalData.temperatureUnit === "C"
          ? weatherData.temp_c
          : weatherData.temp_f,
      humidity: weatherData.humidity,
      windSpeed:
        globalData.windSpeedUnit === "km/h"
          ? weatherData.wind_kph
          : weatherData.wind_mph,
      conditionsInfo: {
        text: weatherData.condition.text,
        iconURL: weatherData.condition.icon,
      },
      isDay: weatherData.is_day,
    };

    const locName = res.data.location.name;
    return { name: locName, weather: locWeather, coordinates: coordinates };
  } catch (err) {
    console.error(err);
    throw err;
  }
}

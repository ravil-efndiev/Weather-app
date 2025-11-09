import type {
  Coordinates,
  DayData,
  Forecast,
  GlobalData,
  Location,
  WeatherData,
} from "@/globalData";
import { weatherApi } from "./api";

const convertWeatherData = (
  rawData: any,
  globalData: GlobalData
): WeatherData => ({
  temperature: Math.round(
    globalData.temperatureUnit === "C" ? rawData.temp_c : rawData.temp_f
  ),
  feelsLike: Math.round(
    globalData.temperatureUnit === "C"
      ? rawData.feelslike_c
      : rawData.feelslike_f
  ),
  dewPoint: Math.round(
    globalData.temperatureUnit === "C" ? rawData.dewpoint_c : rawData.dewpoint_f
  ),
  humidity: rawData.humidity,
  windSpeed:
    globalData.windSpeedUnit === "km/h" ? rawData.wind_kph : rawData.wind_mph,
  conditionsInfo: {
    text: rawData.condition.text,
    iconURL: rawData.condition.icon,
  },
  isDay: rawData.is_day,
  uvIndex: rawData.uv,
});

const convertDayData = (rawData: any, globalData: GlobalData): DayData => ({
  date: rawData.date,
  avgTemp: Math.round(
    globalData.temperatureUnit === "C"
      ? rawData.day.avgtemp_c
      : rawData.day.avgtemp_f
  ),
  minTemp: Math.round(
    globalData.temperatureUnit === "C"
      ? rawData.day.mintemp_c
      : rawData.day.mintemp_f
  ),
  maxTemp: Math.round(
    globalData.temperatureUnit === "C"
      ? rawData.day.maxtemp_c
      : rawData.day.maxtemp_f
  ),
  sunrise: rawData.astro.sunrise,
  sunset: rawData.astro.sunset,
  conditionsInfo: {
    text: rawData.day.condition.text,
    iconURL: rawData.day.condition.icon,
  },
});

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
    const locWeather = convertWeatherData(weatherData, globalData);
    const locName = res.data.location.name as string;
    return { name: locName, weather: locWeather, coordinates: coordinates };
  } catch (err) {
    throw err;
  }
}

export async function getForecast(
  coordinates: Coordinates,
  globalData: GlobalData,
  days: number
): Promise<{ location: Location; forecast: Forecast }> {
  try {
    const res = await weatherApi.get("/forecast.json", {
      params: {
        q: `${coordinates.lat},${coordinates.long}`,
        days: days,
      },
    });

    const currentWeather = convertWeatherData(res.data.current, globalData);
    const locName = res.data.location.name as string;

    const forecast: { dayData: DayData; hourlyData: WeatherData[] }[] = [];
    for (const resDayData of res.data.forecast.forecastday) {
      const dayData = convertDayData(resDayData, globalData);
      const hourlyData: WeatherData[] = resDayData.hour.map((data: any) =>
        convertWeatherData(data, globalData)
      );
      forecast.push({ dayData, hourlyData });
    }

    console.log(res.data);
    return {
      location: {
        name: locName,
        weather: currentWeather,
        coordinates: coordinates,
      },
      forecast: forecast,
    };
  } catch (err) {
    throw err;
  }
}

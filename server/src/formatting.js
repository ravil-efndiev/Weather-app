export const convertWeatherData = (rawData, globalData) => ({
  temperature:
    globalData.temperatureUnit === "C" ? rawData.temp_c : rawData.temp_f,
  feelsLike:
    globalData.temperatureUnit === "C"
      ? rawData.feelslike_c
      : rawData.feelslike_f,
  dewPoint:
    globalData.temperatureUnit === "C"
      ? rawData.dewpoint_c
      : rawData.dewpoint_f,
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

export const convertDayData = (rawData, globalData) => ({
  date: rawData.date,
  avgTemp:
    globalData.temperatureUnit === "C"
      ? rawData.day.avgtemp_c
      : rawData.day.avgtemp_f,
  minTemp:
    globalData.temperatureUnit === "C"
      ? rawData.day.mintemp_c
      : rawData.day.mintemp_f,
  maxTemp:
    globalData.temperatureUnit === "C"
      ? rawData.day.maxtemp_c
      : rawData.day.maxtemp_f,
  sunrise: rawData.astro.sunrise,
  sunset: rawData.astro.sunset,
  conditionsInfo: {
    text: rawData.day.condition.text,
    iconURL: rawData.day.condition.icon,
  },
});

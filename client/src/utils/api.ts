import axios from "axios";

export const weatherApi = axios.create({
  baseURL: "https://api.weatherapi.com/v1/",
  params: {
    key: import.meta.env.VITE_WEATHER_API_KEY,
    aqi: "yes",
    allerts: "yes",
  },
});

export const locationSearchApi = axios.create({
  baseURL: "https://geocoding-api.open-meteo.com/v1/search",
});

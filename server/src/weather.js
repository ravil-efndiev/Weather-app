import { Router } from "express";
import { weatherApi } from "./axios";
import { convertWeatherData } from "./formatting";
import { convertDayData } from "./formatting";

export const weatherRoute = new Router();

weatherRoute.get("/forecast", async (req, res) => {
  try {
    const { coordinates, globalData, days } = req.query;
    const apiRes = await weatherApi.get("/forecast.json", {
      params: {
        q: `${coordinates.lat},${coordinates.long}`,
        days: days,
      },
    });

    const currentWeather = convertWeatherData(apiRes.data.current, globalData);
    const locName = apiRes.data.location.name;

    const forecast = [];
    for (const resDayData of apiRes.data.forecast.forecastday) {
      const dayData = convertDayData(resDayData, globalData);
      const hourlyData = resDayData.hour.map((data) =>
        convertWeatherData(data, globalData)
      );
      forecast.push({ dayData, hourlyData });
    }

    console.log(apiRes.data);
    return res
      .json({
        location: {
          name: locName,
          weather: currentWeather,
          coordinates: coordinates,
        },
        forecast: forecast,
      })
      .status(200);
  } catch (err) {
    return res.json({ error: err }).status(400);
  }
});

weatherRoute.get("/realtime", async (req, res) => {
  try {
    const { coordinates, globalData } = req.query;
    const apiRes = await weatherApi.get("/current.json", {
      params: {
        q: `${coordinates.lat},${coordinates.long}`,
      },
    });

    const weatherData = apiRes.data.current;
    const locWeather = convertWeatherData(weatherData, globalData);
    const locName = apiRes.data.location.name;
    return res
      .json({ name: locName, weather: locWeather, coordinates: coordinates })
      .status(200);
  } catch (err) {
    return res.json({ error: err }).status(400);
  }
});

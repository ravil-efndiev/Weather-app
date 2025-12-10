import { Router } from "express";
import { redis, weatherApi } from "./index.js";
import { convertWeatherData, convertDayData } from "./formatting.js";

export const weatherRoute = new Router();

const makeRedisKey = (type, lat, long, globalData) =>
  `${type}:${lat},${long},${globalData.temperatureUnit},${globalData.windSpeedUnit}`;

const cacheTTL = 15 * 60;

weatherRoute.get("/forecast", async (req, res) => {
  try {
    const { lat, long, globalData, days } = req.query;
    const globalDataObj = JSON.parse(globalData);

    const redisKey = makeRedisKey("forecast", lat, long, globalDataObj);
    const cachedData = await redis.get(redisKey);
    if (cachedData) return res.json(cachedData).status(200);

    const apiRes = await weatherApi.get("/forecast.json", {
      params: {
        q: `${lat},${long}`,
        days: days,
      },
    });

    const currentWeather = convertWeatherData(
      apiRes.data.current,
      globalDataObj
    );
    const locName = apiRes.data.location.name;

    const forecast = [];
    for (const resDayData of apiRes.data.forecast.forecastday) {
      const dayData = convertDayData(resDayData, globalDataObj);
      const hourlyData = resDayData.hour.map((data) =>
        convertWeatherData(data, globalDataObj)
      );
      forecast.push({ dayData, hourlyData });
    }

    const outputData = {
      location: {
        name: locName,
        weather: currentWeather,
        coordinates: { lat, long },
      },
      forecast: forecast,
    };

    await redis.setex(redisKey, cacheTTL, JSON.stringify(outputData));
    return res.json(outputData).status(200);
  } catch (err) {
    console.error(err);
    return res.json({ error: err }).status(400);
  }
});

weatherRoute.get("/realtime", async (req, res) => {
  try {
    const { lat, long, globalData } = req.query;
    const globalDataObj = JSON.parse(globalData);

    const redisKey = makeRedisKey("realtime", lat, long, globalDataObj);
    const cachedData = await redis.get(redisKey);
    if (cachedData) return res.json(cachedData).status(200);

    const apiRes = await weatherApi.get("/current.json", {
      params: {
        q: `${lat},${long}`,
      },
    });

    const weatherData = apiRes.data.current;
    const locWeather = convertWeatherData(weatherData, globalDataObj);
    const locName = apiRes.data.location.name;
    const outputData = {
      name: locName,
      weather: locWeather,
      coordinates: { lat, long },
    };

    await redis.setex(redisKey, cacheTTL, JSON.stringify(outputData));
    return res.json(outputData).status(200);
  } catch (err) {
    console.error(err);
    return res.json({ error: err }).status(400);
  }
});

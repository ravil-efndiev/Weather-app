import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import { weatherRoute } from "./weather.js";
import { locationRoute } from "./location.js";
import { createWeatherApi, createLocationsApi } from "./axios.js";

dotenv.config();

export const weatherApi = createWeatherApi();
export const locationSearchApi = createLocationsApi();

const app = express();
app.use(
  cors({ "Access-Control-Allow-Origin": process.env.DEV_CLIENT_URL || "/" })
);

app.use("/weather", weatherRoute);
app.use("/location", locationRoute);

app.listen(process.env.PORT || 3000, () => {
  console.log("App is running");
});

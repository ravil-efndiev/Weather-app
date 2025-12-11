import { locationSearchApi } from "./index.js";
import { Router } from "express";

export const locationRoute = new Router();

locationRoute.get("/", async (req, res) => {
  try {
    const { name } = req.query;
    const apiRes = await locationSearchApi.get("/", {
      params: { name },
    });

    return res
      .json({
        found:
          apiRes.data.results
            ?.filter((result) => result.country && result.admin1)
            ?.map((result) => {
              return {
                id: result.id,
                name: result.name,
                country: result.country,
                admin1: result.admin1,
                lat: result.latitude,
                long: result.longitude,
              };
            }) || [],
      })
      .status(200);
  } catch (err) {
    console.error(err);
    return res.json({ error: err }).status(400);
  }
});

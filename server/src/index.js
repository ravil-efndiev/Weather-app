import express from "express";
import cors from "cors";
import { weatherRoute } from "./weather";
import { locationRoute } from "./location";
import dotenv from "dotenv";

dotenv.config();

const app = express();
app.use(cors({"Access-Control-Allow-Origin": process.env.DEV_CLIENT_URL || "."}))

app.get("/", (req, res) => {
    return res.json({ test: "sucess" });
});

app.use("/weather", weatherRoute);
app.use("/location", locationRoute);

app.listen(process.env.PORT || 3000, () => {
    console.log("App is running");
});

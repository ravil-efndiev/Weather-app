import { useEffect, useState } from "react";
import {
  type GlobalData,
  type WeatherData,
  GlobalDataContext,
} from "@/globalData";
import CityCard from "./Components/CityCard";
import weatherApi from "./services/api";
import SearchBar from "./Components/SearchBar";

function App() {
  const [globalData, setGlobalData] = useState<GlobalData>({
    temperatureUnit: "C",
    windSpeedUnit: "m/s",
  });

  const [savedCities, setSavedCities] = useState<Map<string, WeatherData>>(
    new Map([["Praha", {}]])
  );

  useEffect(() => {
    const getCitiesWeather = async () => {
      try {
        for (let [city, weather] of savedCities) {
          const res = await weatherApi.get("/realtime", {
            params: {
              location: city,
              units: globalData.temperatureUnit === "C" ? "metric" : "imperial",
            },
          });
          const weatherData = res.data.data.values;
          weather = {
            temperature: weatherData.temperature,
            humidity: weatherData.humidity,
            windSpeed: weatherData.windSpeed,
          };
          setSavedCities((prev) => new Map(prev).set(city, weather));
        }
      } catch (err) {
        console.error(err);
      }
    };
    getCitiesWeather();
  }, []);

  return (
    <GlobalDataContext.Provider value={{ globalData, setGlobalData }}>
      <div className="w-[80%] flex flex-col mx-auto py-10">
        <SearchBar />

        {Array.from(savedCities.entries()).map(([city, weather]) => (
          <CityCard key={city} cityName={city} weather={weather} />
        ))}
      </div>
    </GlobalDataContext.Provider>
  );
}

export default App;

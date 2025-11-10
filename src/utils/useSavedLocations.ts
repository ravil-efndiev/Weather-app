import { useEffect, useState } from "react";
import { type Coordinates, type GlobalData, type Location } from "@/globalData";
import { getRealtimeWeather } from "./requests";

function useSavedLocations(globalData: GlobalData) {
  const [savedLocations, setSavedLocations] = useState<Location[]>([]);

  useEffect(() => {
    const getLocationsData = async () => {
      const locationsRaw = localStorage.getItem("locations");
      if (!locationsRaw) return;

      const locations = JSON.parse(locationsRaw) as Coordinates[];

      try {
        const results = await Promise.all(
          locations.map((coords) => getRealtimeWeather(coords, globalData))
        );

        setSavedLocations(results);
      } catch (err) {
        console.error(err);
      }
    };

    getLocationsData();
  }, []);

  return { savedLocations, setSavedLocations };
}

export default useSavedLocations;

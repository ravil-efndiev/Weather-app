import { useEffect, useState, type Dispatch, type SetStateAction } from "react";
import { type Coordinates, type GlobalData, type Location } from "@/globalData";
import { getRealtimeWeather } from "./requests";

function useSavedLocations(globalData: GlobalData): [Location[], Dispatch<SetStateAction<Location[]>>] {
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
  }, [globalData]);

  return [ savedLocations, setSavedLocations ];
}

export default useSavedLocations;

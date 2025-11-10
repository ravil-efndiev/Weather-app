import {
  useGlobalData,
  type Location,
  type Coordinates,
  type DayData,
  type WeatherData,
  type Forecast,
} from "@/globalData";
import { AnimatePresence } from "framer-motion";
import { useEffect, useState } from "react";
import { getForecast } from "@/utils/requests";
import LocationPanelHeader from "./LocationPanel/LocationPanelHeader";
import LocationPanelHourly from "./LocationPanel/LocationPanelHourly";
import LocationPanelForecast from "./LocationPanel/LocationPanelForecast";
import LocationPanelWidgets from "./LocationPanel/LocationPanelWidgets";
import LocationPanelWrapper, {
  type StartAnimationData,
} from "./LocationPanel/LocationPanelWrapper";
import ThemeProvider from "./ThemeProvider";

interface Props {
  locationCoordinates: Coordinates /* using coords here instead of passing a
                                      location object already containing weather data to do a new realtime request
                                      and get fresh realtime data when the full panel is open */;
  locationName: string; // because name can behave weird when coming from /forecast api call
  startAnimationData: StartAnimationData;
  onClose: () => void;
}

function LocationPanel({
  locationCoordinates,
  locationName,
  startAnimationData,
  onClose,
}: Props) {
  const { globalData } = useGlobalData();
  const [location, setLocation] = useState<Location>();
  const [appearAnimationComplete, setAppearAnimationComplete] = useState(false);
  const [avgDayData, setAvgDayData] = useState<DayData>();
  const [hourlyWeatherData, setHourlyWeatherData] = useState<WeatherData[]>([]);
  const [forecast, setForecast] = useState<Forecast>([]);

  useEffect(() => {
    const getAllLocationData = async () => {
      try {
        const { location, forecast } = await getForecast(
          locationCoordinates,
          globalData,
          7
        );

        const updatedLocation = { ...location, name: locationName };

        setLocation(updatedLocation);
        setAvgDayData(forecast[0].dayData);
        setHourlyWeatherData(forecast[0].hourlyData);
        setForecast(forecast);
      } catch (err) {
        console.error(err);
      }
    };

    getAllLocationData();
  }, [locationCoordinates, globalData]);

  return (
    <ThemeProvider isDay={location?.weather.isDay}>
      <LocationPanelWrapper
        onAppearAnimationComplete={() => setAppearAnimationComplete(true)}
        startAnimationData={startAnimationData}
      >
        <LocationPanelHeader onClose={onClose} location={location} />
        <AnimatePresence>
          {appearAnimationComplete && (
            <>
              <LocationPanelHourly
                location={location}
                hourlyWeatherData={hourlyWeatherData}
              />
              <LocationPanelForecast forecast={forecast} />
              <LocationPanelWidgets
                location={location}
                avgDayData={avgDayData}
              />
            </>
          )}
        </AnimatePresence>
      </LocationPanelWrapper>
    </ThemeProvider>
  );
}

export default LocationPanel;

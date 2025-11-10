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
import DailyDataPanel, { type DailyDataPanelReqInfo } from "./DailyDataPanel";

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
  const [dailyDataPanelOpen, setDailyDataPanelOpen] = useState(false);
  const [dailyDataPanelInfo, setDailyDataPanelInfo] =
    useState<DailyDataPanelReqInfo>();

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

  const handleDailyDataPanelOpen = (
    hourlyData: WeatherData[],
    dayData: DayData
  ) => {
    setDailyDataPanelOpen(true);
    setDailyDataPanelInfo({ hourlyData, dayData });
  };

  return (
    <ThemeProvider isDay={location?.weather.isDay}>
      {dailyDataPanelInfo && (
        <DailyDataPanel
          open={dailyDataPanelOpen}
          reqInfo={dailyDataPanelInfo}
          onClose={() => setDailyDataPanelOpen(false)}
        />
      )}
      {location && avgDayData && (
        <LocationPanelWrapper
          onAppearAnimationComplete={() => setAppearAnimationComplete(true)}
          startAnimationData={startAnimationData}
        >
          <LocationPanelHeader onClose={onClose} location={location} />
          <AnimatePresence>
            {appearAnimationComplete && (
              <>
                <LocationPanelHourly
                  hourlyWeatherData={hourlyWeatherData}
                  onDailyPanelOpen={(hourlyData) =>
                    handleDailyDataPanelOpen(hourlyData, avgDayData)
                  }
                />
                <LocationPanelForecast
                  forecast={forecast}
                  onDailyPanelOpen={handleDailyDataPanelOpen}
                />
                <LocationPanelWidgets
                  location={location}
                  avgDayData={avgDayData}
                />
              </>
            )}
          </AnimatePresence>
        </LocationPanelWrapper>
      )}
    </ThemeProvider>
  );
}

export default LocationPanel;

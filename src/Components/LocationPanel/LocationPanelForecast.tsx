import type { DayData, Forecast, WeatherData } from "@/globalData";
import LocationPanelSection from "./LocationPanelSection";
import { useTheme } from "../ThemeProvider";
import { renderDayName } from "@/utils/misc";
import useWindowWidth from "@/utils/useWindowWidth";

interface Props {
  forecast: Forecast;
  onDailyPanelOpen: (
    hourlyWeatherData: WeatherData[],
    dayData: DayData
  ) => void;
}

function LocationPanelForecast({ forecast, onDailyPanelOpen }: Props) {
  const theme = useTheme();
  const windowWidth = useWindowWidth();
  const hideConditionsText = windowWidth < 615;
  const showBigTempLabels = windowWidth < 400;

  return (
    <LocationPanelSection appearAnimationDelay={0.1}>
      <p className="text-xl mb-5">7 day forecast</p>
      <ul
        className={`flex flex-col overflow-x-auto justify-around text-xl pt-2 rounded-lg ${theme.cardBackground}`}
      >
        {forecast.map(({ dayData, hourlyData }, index) => (
          <li
            key={index}
            className={`flex p-2 m-2 border-b cursor-pointer ${theme.border}`}
            onClick={() => onDailyPanelOpen(hourlyData, dayData)}
          >
            <p className="w-32 max-lg:w-5">
              {renderDayName(dayData.date, "short")}{" "}
              <span className="font-thin">{index === 0 && "(today)"}</span>
            </p>
            <div className="ml-18 flex font-thin">
              <img src={dayData.conditionsInfo.iconURL} className="w-8 h-8 mr-5 max-sm:mr-2" />
              {!hideConditionsText && <p>{dayData.conditionsInfo.text}</p>}
            </div>
            <div className="flex flex-1 justify-end">
              <p className="mr-4 max-sm:mr-2">
                <span className={`${theme.textSecondary} font-light`}>
                  {!showBigTempLabels ? "Min:" : "L:"}
                </span>{" "}
                {Math.round(dayData.minTemp || 0)}°
              </p>
              <p>
                <span className={`${theme.textSecondary} font-light`}>
                  {!showBigTempLabels ? "Max:" : "H:"}
                </span>{" "}
                {Math.round(dayData.maxTemp || 0)}°
              </p>
            </div>
          </li>
        ))}
      </ul>
    </LocationPanelSection>
  );
}

export default LocationPanelForecast;

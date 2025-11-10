import type { Forecast } from "@/globalData";
import LocationPanelSection from "./LocationPanelSection";
import { useTheme } from "../ThemeProvider";

interface Props {
  forecast: Forecast;
}

function LocationPanelForecast({ forecast }: Props) {
  const theme = useTheme();

  const renderDayName = (date: string) => {
    const day = new Date(date).getDay();
    const dayNames = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
    return dayNames[day];
  };

  return (
    <LocationPanelSection appearAnimationDelay={0.1}>
      <p className="text-xl mb-5">7 day forecast</p>
      <ul
        className={`flex flex-col overflow-x-auto justify-around text-xl pt-2 rounded-lg ${theme.cardBackground}`}
      >
        {forecast.map(({ dayData }, index) => (
          <li key={index} className={`flex p-2 m-2 border-b ${theme.border}`}>
            <p className="w-32">
              {renderDayName(dayData.date!)}{" "}
              <span className="font-thin">{index === 0 && "(today)"}</span>
            </p>
            <div className="ml-18 flex font-thin">
              <img src={dayData.conditionsInfo?.iconURL} className="w-8 mr-5" />
              <p>{dayData.conditionsInfo?.text}</p>
            </div>
            <div className="flex flex-1 justify-end">
              <p className="mr-4">
                <span className={`${theme.textSecondary} font-light`}>
                  Min:
                </span>{" "}
                {dayData.minTemp}°
              </p>
              <p>
                <span className={`${theme.textSecondary} font-light`}>
                  Max:
                </span>{" "}
                {dayData.maxTemp}°
              </p>
            </div>
          </li>
        ))}
      </ul>
    </LocationPanelSection>
  );
}

export default LocationPanelForecast;

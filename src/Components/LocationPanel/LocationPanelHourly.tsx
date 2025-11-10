import { useTheme } from "../ThemeProvider";
import LocationPanelSection from "./LocationPanelSection";
import type { WeatherData, Location } from "@/globalData";

interface Props {
  location?: Location;
  hourlyWeatherData: WeatherData[];
}

function LocationPanelHourly({ hourlyWeatherData }: Props) {
  const theme = useTheme();

  return (
    <LocationPanelSection appearAnimationDelay={0}>
      <p className="text-xl mb-5">Hourly conditions</p>
      <ul
        className={`flex overflow-x-auto justify-around text-xl pt-2 rounded-lg ${theme.cardBackground}`}
      >
        {hourlyWeatherData.map((data, hour) => (
          <li key={hour} className="m-5 w-9 shrink-0">
            <p className="text-center text-gray-300 mb-3">
              {hour < 10 ? `0${hour}` : hour}
            </p>
            <p className="text-center">{data.temperature}°</p>
            <img
              src={data.conditionsInfo?.iconURL}
              className="w-full mx-auto"
            />
          </li>
        ))}
      </ul>
    </LocationPanelSection>
  );
}

export default LocationPanelHourly;

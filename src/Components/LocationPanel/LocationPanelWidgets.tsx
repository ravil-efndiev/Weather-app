import { useGlobalData, type DayData, type Location } from "@/globalData";
import LocationPanelSection from "./LocationPanelSection";
import sunsetImg from "@/assets/sunset.svg";
import sunriseImg from "@/assets/sunrise.svg";
import { useTheme } from "../ThemeProvider";

interface Props {
  location: Location;
  avgDayData: DayData;
}

function LocationPanelWidgets({ location, avgDayData }: Props) {
  const { globalData } = useGlobalData();
  const theme = useTheme();

  const widgetClasses = `p-5 rounded-xl ${theme.cardBackground}`;

  return (
    <LocationPanelSection fadeInOnScroll={true}>
      <div className="grid grid-cols-4 gap-7">
        <div className={widgetClasses}>
          <p className="text-lg font-light mb-3">Feels like</p>
          <p className="text-3xl">
            {Math.round(location.weather.feelsLike || 0)}°
            {globalData.temperatureUnit}
          </p>
        </div>
        <div className={widgetClasses}>
          <p className="text-lg font-light mb-3">Wind speed</p>
          <p className="text-3xl">
            {location.weather.windSpeed} {globalData.windSpeedUnit}
          </p>
        </div>
        <div className={widgetClasses}>
          <p className="text-lg font-light mb-3">Humidity</p>
          <p className="text-3xl mb-1">{location.weather.humidity}%</p>
          <p>Dew point is {Math.round(location.weather.dewPoint || 0)}°</p>
        </div>
        <div className={widgetClasses}>
          <p className="text-lg font-light mb-3">UV index</p>
          <p className="text-3xl mb-1">{location.weather.uvIndex}</p>
        </div>
        <div className={widgetClasses + " flex col-span-2 justify-around"}>
          <div>
            <img
              src={sunriseImg}
              alt="Sunrise"
              width={30}
              className="mx-auto"
            />
            <p className="text-lg font-light mb-3 text-center">Sunrise</p>
            <p className="text-3xl mb-1">{avgDayData.sunrise}</p>
          </div>
          <div>
            <img src={sunsetImg} alt="Sunset" width={30} className="mx-auto" />
            <p className="text-lg font-light mb-3 text-center">Sunset</p>
            <p className="text-3xl mb-1">{avgDayData.sunset}</p>
          </div>
        </div>
      </div>
    </LocationPanelSection>
  );
}

export default LocationPanelWidgets;

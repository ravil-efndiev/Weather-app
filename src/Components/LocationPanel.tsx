import {
  useGlobalData,
  type Location,
  type Coordinates,
  type DayData,
  type WeatherData,
  type Forecast,
} from "@/globalData";
import { AnimatePresence, motion } from "framer-motion";
import arrowLeft from "@/assets/arrow-left-3099.svg";
import sunsetImg from "@/assets/sunset.svg";
import sunriseImg from "@/assets/sunrise.svg";
import { useEffect, useState } from "react";
import { getForecast } from "@/utils/requests";
import LocationPanelSection from "./LocationPanelSection";

interface Props {
  locationCoordinates: Coordinates /* using coords here instead of passing a
                                      location object already containing weather data to do a new realtime request
                                      and get fresh realtime data when the full panel is open */;
  locationName: string; // because name can behave weird when coming from /forecast api call
  startAnimationData: {
    x: number;
    y: number;
    width: number;
    height: number;
  };
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

        location.name = locationName;

        setLocation(location);
        setAvgDayData(forecast[0].dayData);
        setHourlyWeatherData(forecast[0].hourlyData);
        setForecast(forecast);
      } catch (err) {
        console.error(err);
      }
    };

    getAllLocationData();
  }, [locationCoordinates, globalData]);

  const renderDayName = (date: string) => {
    const day = new Date(date).getDay();
    const dayNames = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
    return dayNames[day];
  };

  const widgetClasses = `p-5 rounded-xl ${
    location?.weather.isDay ? "bg-[#6a84ab3c]" : "bg-[#62748e44]"
  }`;

  return (
    <motion.div
      className="absolute inset-0 z-10 rounded-xl overflow-y-auto bg-transparent"
      initial={{
        x: startAnimationData.x,
        y: startAnimationData.y,
        width: startAnimationData.width,
        height: startAnimationData.height,
        borderRadius: "12px",
      }}
      animate={{
        x: 0,
        y: 0,
        width: "100%",
        height: "100%",
        opacity: 1,
        borderRadius: 0,
      }}
      exit={{
        y: -100,
        opacity: 0,
      }}
      transition={{
        duration: 0.3,
        ease: "linear",
      }}
      onAnimationComplete={() => setAppearAnimationComplete(true)}
    >
      <div
        className={`fixed -z-10 transition-colors inset-0 duration-700 top-0 left-0 w-full h-full ${
          location?.weather.isDay
            ? "bg-linear-to-b from-[#99C0DB] via-[#5F98C9] to-[#3C709F]"
            : "bg-linear-to-b from-[#2E4E68] via-[#24364E] to-[#1E2F44]"
        }`}
      />
      <main>
        <button
          onClick={() => onClose()}
          className="flex p-5 pr-7 m-2 transition hover:bg-[#3ea1d955] rounded-full"
        >
          <img src={arrowLeft} alt="" width={40} />
          <p className="text-gray-200 my-auto text-2xl font-light">Back</p>
        </button>
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{
            duration: 1,
          }}
          className="w-1/3 flex mx-auto flex-col text-center items-center mb-8"
        >
          <h1 className="text-6xl mb-5">{location?.name}</h1>
          <h2 className="text-3xl mb-3">
            {location?.weather.temperature}°{globalData.temperatureUnit}
          </h2>
          <p className="text-xl text-[#DBDEE4] font-light">
            {location?.weather.conditionsInfo?.text}
          </p>
          <img src={location?.weather.conditionsInfo?.iconURL} width="42px" />
        </motion.div>
        <AnimatePresence>
          {appearAnimationComplete && (
            <>
              <LocationPanelSection
                isDay={location?.weather.isDay}
                appearAnimationDelay={0}
              >
                <p className="text-xl mb-5">Hourly conditions</p>
                <ul
                  className={`flex overflow-x-auto justify-around text-xl pt-2 rounded-lg ${
                    location?.weather.isDay
                      ? "bg-[#6a84ab3c]"
                      : "bg-[#62748e44]"
                  }`}
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
              <LocationPanelSection
                isDay={location?.weather.isDay}
                appearAnimationDelay={0.1}
              >
                <p className="text-xl mb-5">7 day forecast</p>
                <ul
                  className={`flex flex-col overflow-x-auto justify-around text-xl pt-2 rounded-lg ${
                    location?.weather.isDay
                      ? "bg-[#6a84ab3c]"
                      : "bg-[#62748e44]"
                  }`}
                >
                  {forecast.map(({ dayData }, index) => (
                    <li
                      key={index}
                      className={`flex p-2 m-2 border-b ${
                        location?.weather.isDay
                          ? "border-b-gray-200"
                          : "border-b-gray-400"
                      }`}
                    >
                      <p className="w-32">
                        {renderDayName(dayData.date!)}{" "}
                        <span className="font-thin">
                          {index === 0 && "(today)"}
                        </span>
                      </p>
                      <div className="ml-18 flex font-thin">
                        <img
                          src={dayData.conditionsInfo?.iconURL}
                          className="w-8 mr-5"
                        />
                        <p>{dayData.conditionsInfo?.text}</p>
                      </div>
                      <div className="flex flex-1 justify-end">
                        <p className="mr-4">
                          <span
                            className={`${
                              location?.weather.isDay
                                ? "text-gray-200"
                                : "text-gray-300"
                            } font-light`}
                          >
                            Min:
                          </span>{" "}
                          {dayData.minTemp}°
                        </p>
                        <p>
                          <span
                            className={`${
                              location?.weather.isDay
                                ? "text-gray-200"
                                : "text-gray-300"
                            } font-light`}
                          >
                            Max:
                          </span>{" "}
                          {dayData.maxTemp}°
                        </p>
                      </div>
                    </li>
                  ))}
                </ul>
              </LocationPanelSection>
              <LocationPanelSection
                isDay={location?.weather.isDay}
                fadeInOnScroll={true}
              >
                <div className="grid grid-cols-4 gap-7">
                  <div className={widgetClasses}>
                    <p className="text-lg font-light mb-3">Feels like</p>
                    <p className="text-3xl">
                      {location?.weather.feelsLike}°{globalData.temperatureUnit}
                    </p>
                  </div>
                  <div className={widgetClasses}>
                    <p className="text-lg font-light mb-3">Wind speed</p>
                    <p className="text-3xl">
                      {location?.weather.windSpeed} {globalData.windSpeedUnit}
                    </p>
                  </div>
                  <div className={widgetClasses}>
                    <p className="text-lg font-light mb-3">Humidity</p>
                    <p className="text-3xl mb-1">
                      {location?.weather.humidity}%
                    </p>
                    <p>Dew point is {location?.weather.dewPoint}°</p>
                  </div>
                  <div className={widgetClasses}>
                    <p className="text-lg font-light mb-3">UV index</p>
                    <p className="text-3xl mb-1">{location?.weather.uvIndex}</p>
                  </div>
                  <div
                    className={
                      widgetClasses + " flex col-span-2 justify-around"
                    }
                  >
                    <div>
                      <img
                        src={sunriseImg}
                        alt="Sunrise"
                        width={30}
                        className="mx-auto"
                      />
                      <p className="text-lg font-light mb-3 text-center">
                        Sunrise
                      </p>
                      <p className="text-3xl mb-1">{avgDayData?.sunrise}</p>
                    </div>
                    <div>
                      <img
                        src={sunsetImg}
                        alt="Sunset"
                        width={30}
                        className="mx-auto"
                      />
                      <p className="text-lg font-light mb-3 text-center">
                        Sunset
                      </p>
                      <p className="text-3xl mb-1">{avgDayData?.sunset}</p>
                    </div>
                  </div>
                </div>
              </LocationPanelSection>
            </>
          )}
        </AnimatePresence>
      </main>
    </motion.div>
  );
}

export default LocationPanel;

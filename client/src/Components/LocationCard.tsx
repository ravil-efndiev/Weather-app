import { useGlobalData, type Coordinates, type Location } from "@/globalData";
import { useRef, useState } from "react";
import useWindowWidth from "@/utils/useWindowWidth";
import CardCloseButton from "./CardCloseButton";

interface Props {
  location: Location;
  onSelect: (locationCoordinates: Coordinates, cardBounds: DOMRect) => void;
  onDelete: (locationCoordinates: Coordinates) => void;
}

function LocationCard({ location, onSelect, onDelete }: Props) {
  const { globalData } = useGlobalData();
  const { name, weather, coordinates } = location;
  const [deleteBtnVisible, setDeleteBtnVisible] = useState(false);

  const cardRef = useRef<HTMLDivElement>(null);

  const windowWidth = useWindowWidth();
  const showMinorDataSmall = windowWidth < 640;

  const handleCardClick = () => {
    if (cardRef.current) {
      const rect = cardRef.current.getBoundingClientRect();
      onSelect(coordinates, rect);
    }
  };

  return (
    <div
      ref={cardRef}
      onClick={handleCardClick}
      onMouseEnter={() => setDeleteBtnVisible(true)}
      onMouseLeave={() => setDeleteBtnVisible(false)}
      className={`
         relative cursor-pointer hover:scale-[1.05] transition 
         w-[80%] max-sm:w-[90%] mx-auto p-5 flex
         rounded-xl justify-around shadow-sm ${
           weather.isDay ? "bg-sky-600" : "bg-sky-900"
         }`}
    >
      <CardCloseButton
        onDelete={() => onDelete(location.coordinates)}
        visibleOnHover={deleteBtnVisible}
      />
      <div>
        <div className="flex">
          <h2 className="text-2xl font-semibold my-auto">{name}</h2>
          <img
            src={weather.conditionsInfo.iconURL}
            width="42px"
            className="h-[42px] my-auto"
          />
        </div>
        <p className="text-gray-300 mb-5">{weather.conditionsInfo.text}</p>
        {!showMinorDataSmall ? (
          <>
            <p>Humidity: {weather.humidity}%</p>
            <p>
              Wind Speed: {Math.round(weather.windSpeed)}{" "}
              {globalData.windSpeedUnit}
            </p>
          </>
        ) : (
          <p>
            H: {weather.humidity}%, Wind: {Math.round(weather.windSpeed)}{" "}
            {globalData.windSpeedUnit}
          </p>
        )}
      </div>
      <div>
        <p className="text-3xl ">
          {Math.round(weather.temperature)}°{globalData.temperatureUnit}
        </p>
      </div>
    </div>
  );
}

export default LocationCard;

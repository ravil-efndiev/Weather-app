import { useGlobalData, type Coordinates, type Location } from "@/globalData";
import { useRef } from "react";

interface Props {
  location: Location;
  onSelect: (locationCoordinates: Coordinates, cardBounds: DOMRect) => void;
}

function LocationCard({ location, onSelect }: Props) {
  const { globalData } = useGlobalData();
  const { name, weather, coordinates } = location;

  const cardRef = useRef<HTMLDivElement>(null);

  const handleCardClick = () => {
    if (cardRef.current) {
      const rect = cardRef.current.getBoundingClientRect();
      onSelect(coordinates, rect);
    }
  }

  return (
    <div
      ref={cardRef}
      onClick={handleCardClick}
      className={`
         cursor-pointer hover:scale-[1.05] transition 
         w-sm max-w-sm mx-auto p-5 flex
         rounded-xl justify-around shadow-sm ${
           weather.isDay ? "bg-sky-600" : "bg-sky-900"
         }`}
    >
      <div>
        <div className="flex">
          <h2 className="text-2xl font-semibold my-auto">{name}</h2>
          <img
            src={weather.conditionsInfo?.iconURL}
            width="42px"
            className="h-[42px] my-auto"
          />
        </div>
        <p className="text-gray-300 mb-5">{weather.conditionsInfo?.text}</p>
        <p>Humidity: {weather.humidity}%</p>
        <p>
          Wind Speed: {weather.windSpeed} {globalData.windSpeedUnit}
        </p>
      </div>
      <div>
        <p className="text-3xl ">
          {weather.temperature}°{globalData.temperatureUnit}
        </p>
      </div>
    </div>
  );
}

export default LocationCard;

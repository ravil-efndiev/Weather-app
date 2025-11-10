import { useGlobalData, type Coordinates, type Location } from "@/globalData";
import { AnimatePresence, motion } from "framer-motion";
import { useRef, useState } from "react";
import cross from "@/assets/cross-svgrepo-com(1).svg";

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
         w-sm max-w-sm mx-auto p-5 flex
         rounded-xl justify-around shadow-sm ${
           weather.isDay ? "bg-sky-600" : "bg-sky-900"
         }`}
    >
      <AnimatePresence>
        {deleteBtnVisible && (
          <motion.button
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="
              absolute left-[calc(100%-25px)] -top-2.5 w-15 h-15 rounded-full 
              flex justify-center align-center
              bg-[#297ff8c8] hover:bg-[#297ff8ee] transition-colors
            "
            onClick={(e) => {
              e.stopPropagation();
              onDelete(location.coordinates);
            }}
          >
            <img src={cross} alt="Delete" width="40px" />
          </motion.button>
        )}
      </AnimatePresence>
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

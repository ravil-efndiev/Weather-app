import { motion } from "motion/react";
import { useGlobalData, type Location } from "@/globalData";
import arrowLeft from "@/assets/arrow-left-3099.svg";

interface Props {
  onClose: () => void;
  location?: Location;
}

function LocationPanelHeader({ onClose, location }: Props) {
  const { globalData } = useGlobalData();
 
  return (
    <>
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
    </>
  );
}

export default LocationPanelHeader;

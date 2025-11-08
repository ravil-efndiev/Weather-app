import { type Coordinates } from "@/globalData";
import { motion } from "framer-motion";

interface Props {
  locationCoordinates: Coordinates; // using coords here instead of passing a
  // location object already containing weather data to do a new realtime request
  // and get fresh realtime data when the full panel is open
  startAnimationData: {
    x: number;
    y: number;
    width: number;
    height: number;
  };
}

function LocationPanel({ startAnimationData }: Props) {
  return <motion.div className="bg-red-500 absolute" style={{
    left: startAnimationData.x,
    top: startAnimationData.y,
    width: startAnimationData.width,
    height: startAnimationData.height,
  }}>panel test</motion.div>;
}

export default LocationPanel;

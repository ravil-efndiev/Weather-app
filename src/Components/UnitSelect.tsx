import { useGlobalData } from "@/globalData";
import React from "react";

interface Props {
  classes?: string;
}

function UnitSelect({ classes }: Props) {
  const { globalData, setGlobalData } = useGlobalData();

  const handleTempUnitChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setGlobalData((prev) => ({ ...prev, temperatureUnit: e.target.value }));
  };

  const handleSpeedUnitChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setGlobalData((prev) => ({ ...prev, windSpeedUnit: e.target.value }));
  };

  const commonSelectStyles = "bg-gray-700 p-2 rounded-md cursor-pointer"

  return (
    <div className={classes}>
      <select
        value={globalData.temperatureUnit}
        onChange={handleTempUnitChange}
        className={commonSelectStyles}
      >
        <option value="C">°C</option>
        <option value="F">°F</option>
      </select>
      <select
        value={globalData.windSpeedUnit}
        onChange={handleSpeedUnitChange}
        name="speed"
        className={`${commonSelectStyles} ml-2`}
      >
        <option value="km/h">km/h</option>
        <option value="m/h">m/h</option>
      </select>
    </div>
  );
}

export default UnitSelect;

import { useGlobalData, type DayData, type WeatherData } from "@/globalData";
import { AnimatePresence, motion } from "motion/react";
import arrowLeft from "@/assets/arrow-left-3099.svg";
import { Line } from "react-chartjs-2";
import { renderDayName } from "@/utils/misc";
import { useEffect } from "react";

export interface DailyDataPanelReqInfo {
  hourlyData: WeatherData[];
  dayData: DayData;
}

interface Props {
  reqInfo: DailyDataPanelReqInfo;
  open: boolean;
  onClose: () => void;
}

function DailyDataPanel({ reqInfo, open, onClose }: Props) {
  const { hourlyData, dayData } = reqInfo;
  const { globalData } = useGlobalData();

  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        onClose();
      }
    };

    window.addEventListener("keydown", handleKeyDown);

    return () => window.removeEventListener("keydown", handleKeyDown);
  }, []);

  const formOptions = () => {
    const temperatures = hourlyData.map((data) => data.temperature);

    return {
      responsive: true,
      plugins: {
        legend: { display: false },
        tooltip: { mode: "index" as const },
      },
      scales: {
        x: {
          grid: { display: false },
          ticks: {
            font: { size: 16 },
            callback: (value: number | string) =>
              Number(value) < 10 ? `0${value}` : value,
          },
        },
        y: {
          beginAtZero: false,
          suggestedMin: Math.min(...temperatures) - 2,
          suggestedMax: Math.max(...temperatures) + 2,
          ticks: {
            callback: (tickValue: number | string) => `${tickValue}°`,
            font: { size: 16 },
          },
        },
      },
    };
  };

  const formData = () => {
    const hours = hourlyData.map((_, index) => index);
    const temperatures = hourlyData.map((data) => data.temperature);

    return {
      labels: hours,
      datasets: [
        {
          label: `Temperature (°${globalData.temperatureUnit})`,
          data: temperatures,
          borderColor: "#3B82F6",
          backgroundColor: "rgba(59, 130, 246, 0.3)",
          tension: 0.3,
          fill: true,
        },
      ],
    };
  };

  return (
    <AnimatePresence>
      {open && (
        <motion.div
          initial={{
            x: 10,
            y: -100,
            opacity: 0,
          }}
          animate={{
            x: 0,
            y: 0,
            opacity: 1,
          }}
          exit={{
            y: -100,
            opacity: 0,
          }}
          transition={{
            duration: 0.2,
            ease: "linear",
          }}
          className="absolute left-0 top-0 w-full h-full  z-30"
        >
          <div
            className={`fixed -z-20 transition-colors inset-0 duration-700 top-0 left-0 w-full h-full bg-[#364153ed]`}
          />
          <button
            onClick={() => onClose()}
            className="flex p-5 pr-7 m-2 transition hover:bg-[#3ea1d955] rounded-full"
          >
            <img src={arrowLeft} alt="" width={40} />
            <p className="text-gray-200 my-auto text-2xl font-light">Back</p>
          </button>
          <h2 className="text-center text-4xl mb-6">
            {renderDayName(dayData.date, "long")}
          </h2>
          <div className="max-w-3/4 bg-slate-700 p-3 border border-slate-800 mx-auto ">
            <div className={`flex justify-between`}>
              <p className="text-2xl mb-3 my-auto">
                <span className="font-light">Average:</span> {dayData.avgTemp}°
                {globalData.temperatureUnit}
              </p>
              <img src={dayData.conditionsInfo.iconURL} className="" />
            </div>
            <Line data={formData()} options={formOptions()} />
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

export default DailyDataPanel;

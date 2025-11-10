import { motion } from "motion/react";
import { type PropsWithChildren } from "react";
import { useTheme } from "@/Components/ThemeProvider";

export interface StartAnimationData {
  x: number;
  y: number;
  width: number;
  height: number;
}

interface Props extends PropsWithChildren {
  startAnimationData: StartAnimationData;
  onAppearAnimationComplete: () => void;
}

function LocationPanelWrapper({
  startAnimationData,
  onAppearAnimationComplete,
  children,
}: Props) {
  const theme = useTheme();

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
      onAnimationComplete={onAppearAnimationComplete}
    >
      <div
        className={`fixed -z-10 transition-colors inset-0 duration-700 top-0 left-0 w-full h-full ${theme.background}`}
      />
      <main>
        {children}
      </main>
    </motion.div>
  );
}

export default LocationPanelWrapper;

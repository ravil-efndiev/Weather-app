import { motion } from "framer-motion";
import { type PropsWithChildren } from "react";

interface Props extends PropsWithChildren {
  isDay?: boolean;
  appearAnimationDelay?: number;
  fadeInOnScroll?: boolean;
}

function LocationPanelSection({
  isDay,
  appearAnimationDelay,
  fadeInOnScroll,
  children,
}: Props) {
  return (
    <motion.div
      initial={{
        opacity: 0,
        y: 10,
      }}
      animate={
        !fadeInOnScroll
          ? {
              opacity: 1,
              y: 0,
            }
          : {}
      }
      transition={{
        delay: appearAnimationDelay,
      }}
      className="w-[70%] items-center justify-center rounded-3xl mx-auto p-5 mb-10"
      style={{
        backgroundColor: isDay ? "rgba(180,200,220,0.45)" : "#e5e7eb11",
      }}
      whileInView={fadeInOnScroll ? { opacity: 1, y: 0 } : {}}
      viewport={
        fadeInOnScroll
          ? {
              once: true,
              amount: 0.3,
            }
          : {}
      }
    >
      {children}
    </motion.div>
  );
}

export default LocationPanelSection;

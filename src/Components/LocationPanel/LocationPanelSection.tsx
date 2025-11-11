import { motion } from "framer-motion";
import { type PropsWithChildren } from "react";
import { useTheme } from "../ThemeProvider";

interface Props extends PropsWithChildren {
  appearAnimationDelay?: number;
  fadeInOnScroll?: boolean;
}

function LocationPanelSection({
  appearAnimationDelay,
  fadeInOnScroll,
  children,
}: Props) {
  const theme = useTheme();

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
      className={`md:w-[70%] w-[90%] items-center justify-center rounded-3xl mx-auto p-5 mb-10 ${theme.widgetBackground}`}
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

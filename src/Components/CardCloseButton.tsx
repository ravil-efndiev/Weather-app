import { AnimatePresence, motion } from "framer-motion";
import cross from "@/assets/cross-svgrepo-com(1).svg";
import { useState } from "react";

interface Props {
  onDelete: () => void;
  visibleOnHover: boolean;
}

function CardCloseButton({ onDelete, visibleOnHover }: Props) {
  const buttonStyles = `
                absolute left-[calc(100%-25px)] -top-2.5 w-15 h-15 rounded-full 
                flex justify-center align-center
                bg-[#297ff8c8] hover:bg-[#297ff8ee] transition-colors
                max-md:w-10 max-md:h-10
              `;

  const [isDeviceTouchscreen] = useState(
    "ontouchstart" in window || navigator.maxTouchPoints > 0
  );

  return !isDeviceTouchscreen ? (
    <AnimatePresence>
      {visibleOnHover && (
        <motion.button
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className={buttonStyles}
          onClick={(e) => {
            e.stopPropagation();
            onDelete();
          }}
        >
          <img src={cross} alt="Delete" className="w-10 max-lg:w-7" />
        </motion.button>
      )}
    </AnimatePresence>
  ) : (
    <button
      className={buttonStyles}
      onClick={(e) => {
        e.stopPropagation();
        onDelete();
      }}
    >
      <img src={cross} alt="Delete" className="w-10 max-lg:w-7" />
    </button>
  );
}

export default CardCloseButton;

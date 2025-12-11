import { createContext, useContext, useMemo, type PropsWithChildren } from "react";

interface Props extends PropsWithChildren {
  isDay?: boolean;
}

interface Theme {
  background: string;
  widgetBackground: string;
  cardBackground: string;
  textSecondary: string;
  border: string;
}

const ThemeContext = createContext<Theme | undefined>(undefined);

function ThemeProvider({ isDay, children }: Props) {
  const theme = useMemo<Theme>(() => {
    return isDay
      ? {
          background:
            "bg-linear-to-b from-[#99C0DB] via-[#5F98C9] to-[#3C709F]",
          widgetBackground: "bg-[rgba(180,200,220,0.45)]",
          cardBackground: "bg-[#6a84ab3c]",
          textSecondary: "text-gray-200",
          border: "border-b-gray-200",
        }
      : {
          background:
            "bg-linear-to-b from-[#2E4E68] via-[#24364E] to-[#1E2F44]",
          widgetBackground: "bg-[#e5e7eb11]",
          cardBackground: "bg-[#62748e44]",
          textSecondary: "text-gray-300",
          border: "border-b-gray-400",
        };
  }, [isDay]);

  return (
    <ThemeContext.Provider value={theme}>{children}</ThemeContext.Provider>
  );
}

export function useTheme() {
  const context = useContext(ThemeContext);

  if (!context) {
    throw new Error("Theme context must only be used inside of ThemeProvider");
  }

  return context;
}

export default ThemeProvider;

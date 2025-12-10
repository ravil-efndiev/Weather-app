import { type Location } from "@/globalData";

export const saveLocationsToLocalStorage = (locationsArray: Location[]) => {
  localStorage.setItem(
    "locations",
    JSON.stringify(locationsArray.map((location) => location.coordinates))
  );
};

export const renderDayName = (date: string, variant: "short" | "long") => {
  const day = new Date(date).getDay();
  const dayNames =
    variant === "short"
      ? ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"]
      : [
          "Sunday",
          "Monday",
          "Tuesday",
          "Wednesday",
          "Thursday",
          "Friday",
          "Saturday",
        ];
  return dayNames[day];
};

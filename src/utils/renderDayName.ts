const renderDayName = (date: string, variant: "short" | "long") => {
  const day = new Date(date).getDay();
  const dayNames =
    variant === "short"
      ? ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"]
      : ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];
  return dayNames[day];
};

export default renderDayName;

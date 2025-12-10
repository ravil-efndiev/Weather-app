import UnitSelect from "./UnitSelect";
import useWindowWidth from "@/utils/useWindowWidth";

function AppHeader() {
  const windowWidth = useWindowWidth();
  const windowMobile = windowWidth < 640;

  return !windowMobile ? (
    <div className="flex relative justify-end mb-4">
      <h1 className="absolute left-1/2 -translate-x-1/2 text-3xl">
        Weather App
      </h1>
      <UnitSelect />
    </div>
  ) : (
    <div className="flex flex-col">
      <h1 className="text-center text-3xl">Weather App</h1>
      <UnitSelect classes="ml-auto my-4" />
    </div>
  );
}

export default AppHeader;

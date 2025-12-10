import { useEffect, useState } from "react";
import {
  type Coordinates,
  type GlobalData,
  GlobalDataContext,
} from "@/globalData";
import LocationCard from "./Components/LocationCard";
import SearchBar from "./Components/SearchBar";
import { getRealtimeWeather } from "./utils/requests";
import { AnimatePresence } from "framer-motion";
import LocationPanel from "./Components/LocationPanel";
import useSavedLocations from "./utils/useSavedLocations";
import { saveLocationsToLocalStorage } from "./utils/misc";
import AppHeader from "./Components/AppHeader";

function App() {
  const [globalData, setGlobalData] = useState<GlobalData>({
    temperatureUnit: "C",
    windSpeedUnit: "km/h",
  });

  const [savedLocations, setSavedLocations] = useSavedLocations(globalData);
  const [newLocationCoords, setNewLocationCoords] = useState<Coordinates>();

  const [selectedCardBounds, setSelectedCardBounds] = useState<DOMRect | null>(
    null
  );
  const [fullPanelLocationCoords, setFullPanelLocationCoords] =
    useState<Coordinates | null>(null);

  const [fullPanelLocationName, setFullPanelLocationName] = useState("");

  useEffect(() => {
    if (
      !newLocationCoords ||
      savedLocations.some(
        (loc) =>
          JSON.stringify(loc.coordinates) === JSON.stringify(newLocationCoords)
      )
    )
      return;

    const updateLocations = async () => {
      try {
        const newLocation = await getRealtimeWeather(
          newLocationCoords,
          globalData
        );

        setSavedLocations((prev) => {
          const newArray = [...prev, newLocation];
          saveLocationsToLocalStorage(newArray);
          return newArray;
        });
      } catch (err) {
        console.error(err);
      }
    };

    updateLocations();
  }, [globalData, newLocationCoords]);

  const handleCardSelect = (coords: Coordinates, cardBounds: DOMRect) => {
    const found = savedLocations.find(
      (location) =>
        JSON.stringify(location.coordinates) === JSON.stringify(coords)
    );
    if (!found) return;
    setFullPanelLocationName(found.name);
    setSelectedCardBounds(cardBounds);
    setFullPanelLocationCoords(coords);
  };

  const handleCardDelete = (coords: Coordinates) => {
    setSavedLocations((prev) => {
      const newArray = prev.filter(
        (location) => location.coordinates !== coords
      );
      saveLocationsToLocalStorage(newArray);
      return newArray;
    });
  };

  const handleFullPanelClose = () => {
    setSelectedCardBounds(null);
    setFullPanelLocationCoords(null);
  };

  return (
    <GlobalDataContext.Provider value={{ globalData, setGlobalData }}>
      <AnimatePresence>
        {fullPanelLocationCoords && selectedCardBounds && (
          <LocationPanel
            locationCoordinates={fullPanelLocationCoords}
            locationName={fullPanelLocationName}
            startAnimationData={{
              x: selectedCardBounds.x,
              y: selectedCardBounds.y,
              width: selectedCardBounds.width,
              height: selectedCardBounds.height,
            }}
            onClose={handleFullPanelClose}
          />
        )}
      </AnimatePresence>
      <div className="w-[90%] flex flex-col mx-auto py-10 h-dvh">
        <AppHeader />
        <SearchBar
          onLocationSelect={(coordinates) => setNewLocationCoords(coordinates)}
        />

        <div
          className="
            w-[99%] mx-auto grid grid-cols-3 max-[1100px]:grid-cols-2 max-md:grid-cols-1
            gap-y-7 overflow-y-auto py-5 md:px-5 sm:px-0 lg:px-10
          "
        >
          {savedLocations.map((location) => (
            <LocationCard
              key={location.name}
              location={location}
              onSelect={handleCardSelect}
              onDelete={handleCardDelete}
            />
          ))}
        </div>
      </div>
    </GlobalDataContext.Provider>
  );
}

export default App;

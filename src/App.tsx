import { useEffect, useState } from "react";
import {
  type Coordinates,
  type GlobalData,
  type Location,
  GlobalDataContext,
} from "@/globalData";
import LocationCard from "./Components/LocationCard";
import SearchBar from "./Components/SearchBar";
import { getRealtimeWeather } from "./utils/requests";
import { AnimatePresence } from "framer-motion";
import LocationPanel from "./Components/LocationPanel";

function App() {
  const [globalData, setGlobalData] = useState<GlobalData>({
    temperatureUnit: "C",
    windSpeedUnit: "km/h",
  });

  const [savedLocations, setSavedLocations] = useState<Location[]>([]);
  const [newLocationCoords, setNewLocationCoords] = useState<Coordinates>();

  const [selectedCardBounds, setSelectedCardBounds] = useState<DOMRect | null>(null);
  const [fullPanelLocationCoords, setFullPanelLocationCoords] = useState<Coordinates | null>(null);

  useEffect(() => {
    if (
      !newLocationCoords ||
      savedLocations.some(
        (loc) =>
          JSON.stringify(loc.coordinates) === JSON.stringify(newLocationCoords) // TODO: make view go to full panel of the duplicate location
      )
    )
      return;

    const updateLocations = async () => {
      try {
        const newLocation = await getRealtimeWeather(
          newLocationCoords,
          globalData
        );

        setSavedLocations((prev) => [...prev, newLocation]);
      } catch (err) {
        console.error(err);
      }
    };

    updateLocations();
  }, [globalData, newLocationCoords]);

  const handleCardSelect = (coords: Coordinates, cardBounds: DOMRect) => {
    setSelectedCardBounds(cardBounds);
    setFullPanelLocationCoords(coords);
  }

  return (
    <GlobalDataContext.Provider value={{ globalData, setGlobalData }}>
      <div className="w-[80%] flex flex-col mx-auto py-10">
        <SearchBar
          onLocationSelect={(coordinates) => setNewLocationCoords(coordinates)}
        />

        <div className="grid grid-cols-[repeat(auto-fit,minmax(400px,1fr))] gap-y-7">
          {savedLocations.map((location) => (
            <LocationCard key={location.name} location={location} onSelect={handleCardSelect} />
          ))}
        </div>

        <AnimatePresence>
          {fullPanelLocationCoords && selectedCardBounds && (
            <LocationPanel locationCoordinates={fullPanelLocationCoords} 
              startAnimationData={{
                x: selectedCardBounds.x,
                y: selectedCardBounds.y,
                width: selectedCardBounds.width,
                height: selectedCardBounds.height,
              }}
            />
          )}
        </AnimatePresence>
      </div>
    </GlobalDataContext.Provider>
  );
}

export default App;

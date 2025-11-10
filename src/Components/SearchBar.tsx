import { useDebounce } from "use-debounce";
import { useEffect, useRef, useState } from "react";
import { locationSearchApi } from "@/utils/api";
import { motion, AnimatePresence } from "framer-motion";
import type { Coordinates } from "@/globalData";

interface Props {
  onLocationSelect: (coordinates: Coordinates) => void;
}

function SearchBar({ onLocationSelect }: Props) {
  interface LocationResult {
    id: number;
    name: string;
    country: string;
    admin1: string;
    lat: number;
    long: number;
  }

  const [searchQuery, setSearchQuery] = useState("");
  const [debouncedQuery] = useDebounce(searchQuery, 400);
  const [foundLocations, setFoundLocations] = useState<LocationResult[]>([]);
  const [isFocused, setIsFocused] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    const getLocations = async () => {
      try {
        const res = await locationSearchApi.get("/", {
          params: {
            name: debouncedQuery,
          },
        });

        setFoundLocations(
          res.data.results
            ?.filter((result: any) => result.country && result.admin1)
            ?.map((result: any) => {
              return {
                id: result.id,
                name: result.name,
                country: result.country,
                admin1: result.admin1,
                lat: result.latitude,
                long: result.longitude,
              };
            }) || []
        );
      } catch (err) {
        console.error(err);
      }
    };

    getLocations();
  }, [debouncedQuery]);

  return (
    <div className="flex mb-10">
      <input
        ref={inputRef}
        type="text"
        placeholder="Search for your city..."
        className="w-[90%] flex-1 mx-auto bg-gray-700 rounded-full 
                  py-5 px-9 border border-transparent
                focus:border-gray-400 transition shadow-lg"
        onChange={(e) => setSearchQuery(e.target.value)}
        onFocus={() => setIsFocused(true)}
        onBlur={() => setIsFocused(false)}
      />
      <AnimatePresence>
        {isFocused && foundLocations && foundLocations.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{
              opacity: 1,
              y: inputRef.current?.offsetHeight,
            }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.2 }}
            className={
              "absolute left-0 right-0 bg-slate-800 rounded-2xl shadow-lg p-4 mx-auto"
            }
            style={{
              width: inputRef.current?.offsetWidth,
            }}
          >
            {foundLocations.map((res) => (
              <div
                key={res.id}
                className="p-2 hover:bg-slate-700 cursor-pointer rounded-md"
                onMouseDown={() =>
                  onLocationSelect({ lat: res.lat, long: res.long })
                }
              >
                <p>
                  {res.name},{" "}
                  <span className="text-gray-400">
                    {res.admin1}, {res.country}
                  </span>
                </p>
              </div>
            ))}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

export default SearchBar;

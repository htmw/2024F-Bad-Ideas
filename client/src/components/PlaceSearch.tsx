// src/components/PlaceSearch.tsx
import React, { useState, useEffect, useRef } from "react";
import { Input } from "@/components/ui/input";
import { Loader2, Search, X } from "lucide-react";
import { cn } from "@/lib/utils";

interface Place {
  name: string;
  country: string;
  state?: string;
  lat: number;
  lon: number;
}

interface PlaceSearchProps {
  onPlaceSelect: (place: Place) => void;
  disabled?: boolean;
}

export function PlaceSearch({
  onPlaceSelect,
  disabled = false,
}: PlaceSearchProps) {
  const [searchTerm, setSearchTerm] = useState("");
  const [places, setPlaces] = useState<Place[]>([]);
  const [loading, setLoading] = useState(false);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const searchRef = useRef<HTMLDivElement>(null);

  // Debounced search function
  useEffect(() => {
    const searchPlaces = async () => {
      if (searchTerm.length < 2) {
        setPlaces([]);
        return;
      }

      try {
        setLoading(true);
        const response = await fetch(
          `/api/geocoding?search=${encodeURIComponent(searchTerm)}`,
        );

        if (!response.ok) {
          throw new Error("Failed to fetch places");
        }

        const data = await response.json();
        setPlaces(data);
      } catch (error) {
        console.error("Error searching places:", error);
        setPlaces([]);
      } finally {
        setLoading(false);
      }
    };

    const timeoutId = setTimeout(() => {
      searchPlaces();
    }, 300); // 300ms delay

    return () => clearTimeout(timeoutId);
  }, [searchTerm]);

  // Close suggestions when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        searchRef.current &&
        !searchRef.current.contains(event.target as Node)
      ) {
        setShowSuggestions(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handlePlaceClick = (place: Place) => {
    setSearchTerm(
      `${place.name}${place.state ? `, ${place.state}` : ""}, ${place.country}`,
    );
    setShowSuggestions(false);
    onPlaceSelect(place);
  };

  const clearSearch = () => {
    setSearchTerm("");
    setPlaces([]);
  };

  return (
    <div ref={searchRef} className="relative w-full">
      <div className="relative">
        <Input
          type="text"
          placeholder="Search for a place..."
          value={searchTerm}
          onChange={(e) => {
            setSearchTerm(e.target.value);
            setShowSuggestions(true);
          }}
          disabled={disabled}
          className="pr-24"
        />
        <div className="absolute right-3 top-1/2 -translate-y-1/2 flex items-center gap-2">
          {loading && <Loader2 className="h-4 w-4 animate-spin" />}
          {!loading && searchTerm && (
            <X
              className="h-4 w-4 cursor-pointer text-muted-foreground hover:text-foreground"
              onClick={clearSearch}
            />
          )}
          {!loading && !searchTerm && (
            <Search className="h-4 w-4 text-muted-foreground" />
          )}
        </div>
      </div>

      {/* Suggestions dropdown */}
      {showSuggestions && places.length > 0 && (
        <div className="absolute z-10 w-full mt-1 bg-background border rounded-md shadow-lg max-h-64 overflow-auto">
          {places.map((place) => (
            <div
              key={`${place.lat}-${place.lon}`}
              className="p-2 hover:bg-accent cursor-pointer flex items-center gap-2"
              onClick={() => handlePlaceClick(place)}
            >
              <Search className="h-4 w-4 text-muted-foreground" />
              <div>
                <span className="font-medium">{place.name}</span>
                {place.state && (
                  <span className="text-muted-foreground">, {place.state}</span>
                )}
                <span className="text-muted-foreground">, {place.country}</span>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

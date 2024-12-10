// src/components/PlaceSearch.tsx
import React, { useState, useEffect, useRef } from "react";
import { Input } from "@/components/ui/input";
import { Loader2, MapPin, X } from "lucide-react";
import { cn } from "@/lib/utils";

interface Place {
  name: string;
  state?: string;
  country: string;
  lat: number;
  lon: number;
  fullAddress: string;
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
    if (searchTerm.length < 2) {
      setPlaces([]);
      return;
    }

    const timeoutId = setTimeout(async () => {
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
        setShowSuggestions(true);
      } catch (error) {
        console.error("Error searching places:", error);
        setPlaces([]);
      } finally {
        setLoading(false);
      }
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
    setSearchTerm(place.fullAddress);
    setShowSuggestions(false);
    onPlaceSelect(place);
  };

  const clearSearch = () => {
    setSearchTerm("");
    setPlaces([]);
    setShowSuggestions(false);
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
            if (e.target.value.length >= 2) {
              setShowSuggestions(true);
            }
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
            <MapPin className="h-4 w-4 text-muted-foreground" />
          )}
        </div>
      </div>

      {/* Suggestions dropdown */}
      {showSuggestions && places.length > 0 && (
        <div className="absolute z-10 w-full mt-1 bg-background border rounded-md shadow-lg max-h-64 overflow-auto">
          {places.map((place) => (
            <div
              key={`${place.lat}-${place.lon}`}
              className="p-3 hover:bg-accent cursor-pointer flex items-center gap-2"
              onClick={() => handlePlaceClick(place)}
            >
              <MapPin className="h-4 w-4 flex-shrink-0 text-muted-foreground" />
              <div className="flex flex-col">
                <span className="font-medium truncate">
                  {place.fullAddress}
                </span>
                <span className="text-sm text-muted-foreground truncate">
                  {place.name}
                  {place.state && `, ${place.state}`}
                  {place.country && `, ${place.country}`}
                </span>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

import React, { useState } from "react";
import { Check, ChevronsUpDown, MapPin } from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
} from "@/components/ui/command";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";

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
  const [open, setOpen] = useState(false);
  const [value, setValue] = useState("");
  const [places, setPlaces] = useState<Place[]>([]);
  const [loading, setLoading] = useState(false);

  const searchPlaces = async (searchTerm: string) => {
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

  const handleSelect = (place: Place) => {
    setValue(place.name);
    setOpen(false);
    onPlaceSelect(place);
  };

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          role="combobox"
          aria-expanded={open}
          disabled={disabled}
          className="w-full justify-between"
        >
          {value || "Search for a place..."}
          <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-full p-0">
        <Command shouldFilter={false}>
          <CommandInput
            placeholder="Enter a city name..."
            onValueChange={(search) => {
              searchPlaces(search);
            }}
            className="h-9"
          />
          {loading && (
            <div className="py-6 text-center text-sm text-muted-foreground">
              Searching places...
            </div>
          )}
          {!loading && places.length === 0 && (
            <CommandEmpty className="py-6">No places found.</CommandEmpty>
          )}
          <CommandGroup>
            {places.map((place) => (
              <CommandItem
                key={`${place.lat}-${place.lon}`}
                value={place.name}
                onSelect={() => handleSelect(place)}
              >
                <MapPin className="mr-2 h-4 w-4 shrink-0" />
                <span className="flex-1">
                  {place.name}
                  {place.state && `, ${place.state}`}
                  {place.country && ` (${place.country})`}
                </span>
                {value === place.name && (
                  <Check className="ml-2 h-4 w-4 shrink-0" />
                )}
              </CommandItem>
            ))}
          </CommandGroup>
        </Command>
      </PopoverContent>
    </Popover>
  );
}

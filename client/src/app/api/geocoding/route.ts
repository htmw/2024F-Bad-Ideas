// src/app/api/geocoding/route.ts
import { NextRequest, NextResponse } from "next/server";

const GEOCODING_URL =
  "https://google-maps-geocoding.p.rapidapi.com/geocode/json";
const RAPIDAPI_KEY = process.env.RAPIDAPI_KEY;

interface AddressComponent {
  long_name: string;
  short_name: string;
  types: string[];
}

interface Location {
  lat: number;
  lng: number;
}

interface Geometry {
  location: Location;
  location_type: string;
  bounds?: {
    northeast: Location;
    southwest: Location;
  };
  viewport: {
    northeast: Location;
    southwest: Location;
  };
}

interface GeocodingResult {
  address_components: AddressComponent[];
  formatted_address: string;
  geometry: Geometry;
  place_id: string;
  types: string[];
}

interface GeocodingResponse {
  results: GeocodingResult[];
  status: string;
}

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const searchTerm = searchParams.get("search");

    if (!searchTerm || searchTerm.length < 2) {
      return NextResponse.json([]);
    }

    const url = new URL(GEOCODING_URL);
    url.searchParams.set("language", "en");
    url.searchParams.set("address", searchTerm);

    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 5000);

    try {
      const response = await fetch(url.toString(), {
        headers: {
          "X-RapidAPI-Key": RAPIDAPI_KEY!,
          "X-RapidAPI-Host": "google-maps-geocoding.p.rapidapi.com",
        },
        signal: controller.signal,
      });

      clearTimeout(timeoutId);

      if (!response.ok) {
        throw new Error(`API responded with status: ${response.status}`);
      }

      const data: GeocodingResponse = await response.json();

      if (data.status !== "OK" || !data.results.length) {
        return NextResponse.json([]);
      }

      // Transform the results into our simplified format
      const places = data.results
        .map((result) => {
          const cityComponent = result.address_components.find((component) =>
            component.types.includes("locality"),
          );
          const stateComponent = result.address_components.find((component) =>
            component.types.includes("administrative_area_level_1"),
          );
          const countryComponent = result.address_components.find((component) =>
            component.types.includes("country"),
          );

          return {
            name:
              cityComponent?.long_name ||
              result.formatted_address.split(",")[0],
            state: stateComponent?.short_name || undefined,
            country: countryComponent?.short_name || "Unknown",
            lat: result.geometry.location.lat,
            lon: result.geometry.location.lng,
            fullAddress: result.formatted_address,
          };
        })
        .slice(0, 5); // Limit to 5 results

      return NextResponse.json(places);
    } catch (fetchError) {
      clearTimeout(timeoutId);
      if (fetchError instanceof Error && fetchError.name === "AbortError") {
        return NextResponse.json([]);
      }
      throw fetchError;
    }
  } catch (error) {
    console.error("Geocoding API error:", error);
    return NextResponse.json([]);
  }
}

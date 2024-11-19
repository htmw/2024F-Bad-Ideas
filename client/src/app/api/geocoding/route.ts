import { NextRequest, NextResponse } from "next/server";

const OPEN_WEATHER_URL = "https://open-weather13.p.rapidapi.com";
const RAPIDAPI_KEY = process.env.RAPIDAPI_KEY;

const rapidApiHeaders = {
  "X-RapidAPI-Key": RAPIDAPI_KEY!,
  "X-RapidAPI-Host": "open-weather13.p.rapidapi.com",
};

export async function GET(request: NextRequest) {
  try {
    if (!RAPIDAPI_KEY) {
      console.error("RAPIDAPI_KEY is not configured");
      return NextResponse.json(
        { error: "Geocoding service is not properly configured" },
        { status: 503 },
      );
    }

    const { searchParams } = new URL(request.url);
    const searchTerm = searchParams.get("search");

    if (!searchTerm) {
      return NextResponse.json(
        { error: "Search term is required" },
        { status: 400 },
      );
    }

    const cleanedSearch = searchTerm.trim();
    if (cleanedSearch.length < 2) {
      return NextResponse.json(
        { error: "Search term must be at least 2 characters" },
        { status: 400 },
      );
    }

    const url = `${OPEN_WEATHER_URL}/geo/cities/${encodeURIComponent(cleanedSearch)}`;

    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 5000);

    try {
      const response = await fetch(url, {
        headers: rapidApiHeaders,
        signal: controller.signal,
      });

      clearTimeout(timeoutId);

      if (!response.ok) {
        const errorText = await response.text();
        console.error("Geocoding API Error:", {
          status: response.status,
          statusText: response.statusText,
          error: errorText,
          url: url,
        });

        if (response.status === 429) {
          return NextResponse.json(
            { error: "Rate limit exceeded. Please try again later" },
            { status: 429 },
          );
        }

        return NextResponse.json(
          { error: "Geocoding service temporarily unavailable" },
          { status: response.status },
        );
      }

      const data = await response.json();

      // Transform and filter the response data
      const places = data
        .map((place: any) => ({
          name: place.name,
          country: place.country,
          state: place.state,
          lat: place.lat,
          lon: place.lon,
        }))
        .slice(0, 5); // Limit to 5 results

      return NextResponse.json(places);
    } catch (fetchError) {
      clearTimeout(timeoutId);
      if (fetchError instanceof Error) {
        if (fetchError.name === "AbortError") {
          return NextResponse.json(
            { error: "Request timeout - please try again" },
            { status: 408 },
          );
        }
        console.error("Fetch error:", fetchError.message);
      }
      throw fetchError;
    }
  } catch (error) {
    console.error("Geocoding API error:", error);
    return NextResponse.json(
      { error: "An unexpected error occurred while searching for places" },
      { status: 500 },
    );
  }
}

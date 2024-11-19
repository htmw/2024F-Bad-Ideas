// src/app/api/weather/forecast/route.ts

import { NextRequest, NextResponse } from "next/server";
import type { OpenWeatherForecastResponse } from "@/types/weather";

const OPEN_WEATHER_URL = "https://open-weather13.p.rapidapi.com";
const RAPIDAPI_KEY = process.env.RAPIDAPI_KEY;

const rapidApiHeaders = {
  "X-RapidAPI-Key": RAPIDAPI_KEY!,
  "X-RapidAPI-Host": "open-weather13.p.rapidapi.com",
};

function kelvinToFahrenheit(kelvin: number): number {
  return Math.round((((kelvin - 273.15) * 9) / 5 + 32) * 10) / 10;
}

function validateCoordinates(
  lat: string | null,
  lon: string | null,
): { error?: string; latNum?: number; lonNum?: number } {
  if (!lat || !lon) {
    return { error: "Both latitude and longitude are required" };
  }

  const latNum = parseFloat(lat);
  const lonNum = parseFloat(lon);

  if (
    isNaN(latNum) ||
    isNaN(lonNum) ||
    latNum < -90 ||
    latNum > 90 ||
    lonNum < -180 ||
    lonNum > 180
  ) {
    return { error: "Invalid coordinates provided" };
  }

  return { latNum, lonNum };
}

function debugLog(label: string, data: any) {
  console.log(`[DEBUG] ${label}:`, JSON.stringify(data, null, 2));
}

export async function GET(request: NextRequest) {
  try {
    if (!RAPIDAPI_KEY) {
      console.error("RAPIDAPI_KEY is not configured");
      return NextResponse.json(
        { error: "Weather service is not properly configured" },
        { status: 503 },
      );
    }

    const { searchParams } = new URL(request.url);
    const lat = searchParams.get("lat");
    const lon = searchParams.get("lon");
    const date = searchParams.get("date");

    debugLog("Search Params", { lat, lon, date });

    // Validate coordinates
    const coordValidation = validateCoordinates(lat, lon);
    if (coordValidation.error) {
      return NextResponse.json(
        { error: coordValidation.error },
        { status: 400 },
      );
    }

    // Build the URL for the forecast endpoint
    const url = `${OPEN_WEATHER_URL}/city/fivedaysforcast/${lat}/${lon}`;
    debugLog("Request URL", url);

    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 5000);

    try {
      const response = await fetch(url, {
        headers: rapidApiHeaders,
        next: { revalidate: 300 },
        signal: controller.signal,
      });

      clearTimeout(timeoutId);

      if (!response.ok) {
        const errorText = await response.text();
        console.error("Weather API Error:", {
          status: response.status,
          statusText: response.statusText,
          error: errorText,
          url: url,
        });

        if (response.status === 404) {
          return NextResponse.json(
            { error: "Forecast data not found for this location" },
            { status: 404 },
          );
        }

        if (response.status === 429) {
          return NextResponse.json(
            { error: "Rate limit exceeded. Please try again later" },
            { status: 429 },
          );
        }

        return NextResponse.json(
          { error: "Weather service temporarily unavailable" },
          { status: response.status },
        );
      }

      const data = await response.json();
      debugLog("Raw API Response", data);

      // Ensure data.list exists and has items
      if (!data.list || !Array.isArray(data.list) || data.list.length === 0) {
        console.error("Invalid forecast data structure:", data);
        return NextResponse.json(
          { error: "Invalid response from weather service" },
          { status: 502 },
        );
      }

      // Group forecasts by day to get one forecast per day
      const dailyForecasts = data.list.reduce((acc: any, item: any) => {
        // Convert timestamp to date string
        const date = new Date(item.dt * 1000).toISOString().split("T")[0];
        if (!acc[date]) {
          acc[date] = item;
        }
        return acc;
      }, {});

      debugLog("Grouped Daily Forecasts", dailyForecasts);

      const transformedData = {
        city: data.city?.name || "Unknown",
        country: data.city?.country || "Unknown",
        forecast: Object.values(dailyForecasts).map((item: any) => {
          const timestamp = item.dt * 1000; // Convert to milliseconds
          const dateStr = new Date(timestamp).toISOString();

          debugLog("Processing forecast item", {
            timestamp,
            dateStr,
            original: item,
          });

          return {
            temperature: {
              current: kelvinToFahrenheit(item.main.temp),
              feels_like: kelvinToFahrenheit(item.main.feels_like),
              min: kelvinToFahrenheit(item.main.temp_min),
              max: kelvinToFahrenheit(item.main.temp_max),
            },
            humidity: item.main.humidity,
            wind: {
              speed: item.wind.speed,
              degree: item.wind.deg,
            },
            weather: {
              main: item.weather[0].main,
              description: item.weather[0].description,
              icon: item.weather[0].icon,
            },
            pressure: item.main.pressure,
            visibility: item.visibility / 1000,
            timestamp: item.dt,
            dt_txt: dateStr,
            pop: item.pop || 0,
          };
        }),
      };

      debugLog("Transformed Response", transformedData);

      return NextResponse.json(transformedData);
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
    console.error("Weather API error:", error);
    return NextResponse.json(
      { error: "An unexpected error occurred while fetching weather data" },
      { status: 500 },
    );
  }
}

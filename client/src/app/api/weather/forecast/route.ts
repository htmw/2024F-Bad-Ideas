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

function groupForecastsByDay(forecastList: any[]) {
  const dailyForecasts = forecastList.reduce((acc: any, forecast: any) => {
    // Use dt_txt for consistent date handling
    const dateStr = forecast.dt_txt.split(" ")[0]; // Get just the date part 'YYYY-MM-DD'

    if (!acc[dateStr]) {
      // Initialize with first forecast of the day
      acc[dateStr] = {
        temperature: {
          current: kelvinToFahrenheit(forecast.main.temp),
          feels_like: kelvinToFahrenheit(forecast.main.feels_like),
          min: kelvinToFahrenheit(forecast.main.temp_min),
          max: kelvinToFahrenheit(forecast.main.temp_max),
        },
        humidity: forecast.main.humidity,
        wind: {
          speed: forecast.wind.speed,
          degree: forecast.wind.deg,
        },
        weather: {
          main: forecast.weather[0].main,
          description: forecast.weather[0].description,
          icon: forecast.weather[0].icon,
        },
        pressure: forecast.main.pressure,
        visibility: forecast.visibility / 1000,
        timestamp: forecast.dt,
        dt_txt: forecast.dt_txt, // Keep the original dt_txt
        pop: forecast.pop || 0,
      };
    } else {
      // Update min/max temperatures
      acc[dateStr].temperature.min = Math.min(
        acc[dateStr].temperature.min,
        kelvinToFahrenheit(forecast.main.temp_min),
      );
      acc[dateStr].temperature.max = Math.max(
        acc[dateStr].temperature.max,
        kelvinToFahrenheit(forecast.main.temp_max),
      );
      // Update precipitation probability if higher
      acc[dateStr].pop = Math.max(acc[dateStr].pop, forecast.pop || 0);
    }

    return acc;
  }, {});

  // Convert to array and sort by date
  return Object.entries(dailyForecasts)
    .sort(([dateA], [dateB]) => dateA.localeCompare(dateB))
    .map(([_, forecast]) => forecast)
    .slice(0, 5); // Ensure we only return 5 days
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

    if (!lat || !lon) {
      return NextResponse.json(
        { error: "Both latitude and longitude are required" },
        { status: 400 },
      );
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
      return NextResponse.json(
        { error: "Invalid coordinates provided" },
        { status: 400 },
      );
    }

    const url = `${OPEN_WEATHER_URL}/city/fivedaysforcast/${lat}/${lon}`;

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

      const data: OpenWeatherForecastResponse = await response.json();

      if (!data.list || !Array.isArray(data.list) || data.list.length === 0) {
        return NextResponse.json(
          { error: "Invalid response from weather service" },
          { status: 502 },
        );
      }

      const transformedData = {
        city: data.city?.name || "Unknown",
        country: data.city?.country || "Unknown",
        forecast: groupForecastsByDay(data.list),
      };

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

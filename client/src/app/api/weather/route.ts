import { NextRequest, NextResponse } from "next/server";
import type { OpenWeatherResponse } from "@/types/weather";

const RAPIDAPI_KEY = process.env.RAPIDAPI_KEY;
const BASE_URL = "https://open-weather13.p.rapidapi.com";

const rapidApiHeaders = {
  "X-RapidAPI-Key": RAPIDAPI_KEY!,
  "X-RapidAPI-Host": "open-weather13.p.rapidapi.com",
};

const COUNTRY_CODE_REGEX = /^[A-Z]{2}$/;
const CITY_NAME_REGEX = /^[a-zA-Z\s\-'.]+$/;

function kelvinToFahrenheit(kelvin: number): number {
  return Math.round((((kelvin - 273.15) * 9) / 5 + 32) * 10) / 10;
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
    const city = searchParams.get("city");
    const country = searchParams.get("country");

    let validatedCountry = "US";
    if (country) {
      const upperCountry = country.toUpperCase().trim();
      if (!COUNTRY_CODE_REGEX.test(upperCountry)) {
        return NextResponse.json(
          {
            error:
              "Invalid country code. Please use ISO 3166-1 alpha-2 format (e.g., US, GB, DE)",
          },
          { status: 400 },
        );
      }
      validatedCountry = upperCountry;
    }

    let url: string;
    let temperatureUnit: "kelvin" | "fahrenheit" = "fahrenheit";
    if (lat && lon) {
      temperatureUnit = "kelvin";
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
      url = `${BASE_URL}/city/latlon/${lat}/${lon}`;
    } else if (city) {
      temperatureUnit = "fahrenheit";
      const cleanedCity = city.trim();

      if (cleanedCity.length < 2) {
        return NextResponse.json(
          { error: "City name must be at least 2 characters long" },
          { status: 400 },
        );
      }

      if (!CITY_NAME_REGEX.test(cleanedCity)) {
        return NextResponse.json(
          {
            error:
              "Invalid city name. Only letters, spaces, hyphens, periods, and apostrophes are allowed",
          },
          { status: 400 },
        );
      }

      const formattedCity = cleanedCity
        .toLowerCase()
        .replace(/\s+/g, " ")
        .trim()
        .replace(/\s/g, "-")
        .replace(/^-+|-+$/g, "");

      url = `${BASE_URL}/city/${formattedCity}/${validatedCountry}`;
    } else {
      return NextResponse.json(
        { error: "Either city name or coordinates (lat/lon) are required" },
        { status: 400 },
      );
    }

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
            {
              error:
                "Location not found. Please check the spelling and try again",
            },
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

      const data: OpenWeatherResponse = await response.json();

      if (
        !data ||
        !data.name ||
        !data.sys ||
        !data.main ||
        !data.weather?.[0]
      ) {
        console.error("Invalid API response format:", data);
        return NextResponse.json(
          { error: "Invalid response from weather service" },
          { status: 502 },
        );
      }

      const temperatureConverter =
        temperatureUnit === "kelvin"
          ? kelvinToFahrenheit
          : (temp: number) => temp;

      const weatherResponse = {
        city: data.name,
        country: data.sys.country,
        temperature: {
          current: temperatureConverter(data.main.temp),
          feels_like: temperatureConverter(data.main.feels_like),
          min: temperatureConverter(data.main.temp_min),
          max: temperatureConverter(data.main.temp_max),
        },
        humidity: data.main.humidity,
        wind: {
          speed: data.wind.speed,
          degree: data.wind.deg,
        },
        weather: {
          main: data.weather[0].main,
          description: data.weather[0].description,
          icon: data.weather[0].icon,
        },
        pressure: data.main.pressure,
        visibility: data.visibility / 1000,
        timestamp: data.dt,
      };

      return NextResponse.json(weatherResponse);
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

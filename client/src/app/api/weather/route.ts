import { NextResponse } from "next/server";

const RAPIDAPI_KEY = process.env.RAPIDAPI_KEY;
const BASE_URL = "https://open-weather13.p.rapidapi.com/city";

// Type for the weather response
type WeatherResponse = {
  city: string;
  country: string;
  temperature: {
    current: number;
    feels_like: number;
    min: number;
    max: number;
  };
  humidity: number;
  wind: {
    speed: number;
    degree: number;
  };
  weather: {
    main: string;
    description: string;
    icon: string;
  };
  pressure: number;
  visibility: number;
  timestamp: number;
};

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const city = searchParams.get("city");
  const country = searchParams.get("country") || "EN";

  if (!city) {
    return NextResponse.json(
      { error: "City parameter is required" },
      { status: 400 },
    );
  }

  if (!RAPIDAPI_KEY) {
    console.error("RAPIDAPI_KEY not configured");
    return NextResponse.json(
      { error: "Server configuration error" },
      { status: 500 },
    );
  }

  try {
    const response = await fetch(`${BASE_URL}/${city}/${country}`, {
      headers: {
        "x-rapidapi-key": RAPIDAPI_KEY,
        "x-rapidapi-host": "open-weather13.p.rapidapi.com",
      },
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error(`Weather API error: ${response.status} ${errorText}`);
      throw new Error(
        `Failed to fetch weather data: ${response.status} ${errorText}`,
      );
    }

    const data = await response.json();

    // Transform the API response into a more structured format
    const weatherResponse: WeatherResponse = {
      city: data.name,
      country: data.sys.country,
      temperature: {
        current: data.main.temp,
        feels_like: data.main.feels_like,
        min: data.main.temp_min,
        max: data.main.temp_max,
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
      visibility: data.visibility,
      timestamp: data.dt,
    };

    return NextResponse.json(weatherResponse);
  } catch (error) {
    console.error("Error in /api/weather route:", error);
    return NextResponse.json(
      { error: error.message || "Error fetching weather data" },
      { status: 500 },
    );
  }
}

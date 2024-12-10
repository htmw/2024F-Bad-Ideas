// src/app/page.tsx
"use client";

import { useState, useEffect, useCallback } from "react";
import { Button } from "@/components/ui/button";
import { useGeolocation } from "@/hooks/useGeolocation";
import WeatherDisplay from "@/components/WeatherDisplay";
import OutfitRecommendation from "@/components/OutfitRecommendation";
import OutfitHistory from "@/components/OutfitHistory";
import { AlertCircle, RefreshCw, LogOut, User } from "lucide-react";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ThemeToggle } from "@/components/ThemeToggle";
import { PlaceSearch } from "@/components/PlaceSearch";
import { useAuth } from "@/hooks/useAuth";
import Link from "next/link";
import type { WeatherResponse, ForecastResponse } from "@/types/weather";

interface Place {
  name: string;
  country: string;
  state?: string;
  lat: number;
  lon: number;
}

export default function Home() {
  const [selectedPlace, setSelectedPlace] = useState<Place | null>(null);
  const [currentWeather, setCurrentWeather] = useState<WeatherResponse | null>(
    null,
  );
  const [forecastData, setForecastData] = useState<ForecastResponse | null>(
    null,
  );
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [lastFetchedCoords, setLastFetchedCoords] = useState<{
    lat: number;
    lon: number;
  } | null>(null);

  const { user, logout } = useAuth();
  const {
    latitude,
    longitude,
    error: geoError,
    loading: geoLoading,
  } = useGeolocation();

  // Fetch weather data
  const fetchWeatherData = async (params: URLSearchParams) => {
    const [weatherResponse, forecastResponse] = await Promise.all([
      fetch(`/api/weather?${params}`),
      fetch(`/api/weather/forecast?${params}`),
    ]);

    if (!weatherResponse.ok) {
      const errorData = await weatherResponse.json();
      throw new Error(errorData.error || `Error: ${weatherResponse.status}`);
    }

    if (!forecastResponse.ok) {
      const errorData = await forecastResponse.json();
      throw new Error(errorData.error || `Error: ${forecastResponse.status}`);
    }

    const [weather, forecast] = await Promise.all([
      weatherResponse.json(),
      forecastResponse.json(),
    ]);

    setCurrentWeather(weather);
    setForecastData(forecast);
  };

  // Fetch weather by coordinates
  const fetchWeatherByCoords = useCallback(
    async (lat: number, lon: number) => {
      // Check if we've already fetched for these coordinates
      if (
        lastFetchedCoords?.lat === lat &&
        lastFetchedCoords?.lon === lon &&
        currentWeather &&
        forecastData
      ) {
        return;
      }

      try {
        setLoading(true);
        setError("");

        const params = new URLSearchParams({
          lat: lat.toString(),
          lon: lon.toString(),
        });

        await fetchWeatherData(params);
        setLastFetchedCoords({ lat, lon });
      } catch (err) {
        console.error("Error fetching weather:", err);
        setError(
          err instanceof Error ? err.message : "Failed to fetch weather data",
        );
      } finally {
        setLoading(false);
      }
    },
    [lastFetchedCoords, currentWeather, forecastData],
  );

  // Handle place selection
  const handlePlaceSelect = (place: Place) => {
    setSelectedPlace(place);
    fetchWeatherByCoords(place.lat, place.lon);
  };

  // Handle manual refresh
  const handleRefresh = async () => {
    setIsRefreshing(true);
    try {
      if (selectedPlace) {
        await fetchWeatherByCoords(selectedPlace.lat, selectedPlace.lon);
      } else if (latitude && longitude) {
        await fetchWeatherByCoords(latitude, longitude);
      }
    } finally {
      setIsRefreshing(false);
    }
  };

  // Effect to fetch weather when coordinates are available
  useEffect(() => {
    if (
      latitude !== null &&
      longitude !== null &&
      !geoError &&
      !selectedPlace
    ) {
      fetchWeatherByCoords(latitude, longitude);
    }
  }, [latitude, longitude, fetchWeatherByCoords, geoError, selectedPlace]);

  return (
    <div className="min-h-screen bg-background transition-colors duration-300">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header Section with Auth */}
        <header className="relative flex flex-col items-center mb-12">
          <div className="absolute right-0 top-0 flex items-center gap-2">
            {user ? (
              <>
                <div className="flex items-center gap-2 mr-4">
                  <User className="h-4 w-4" />
                  <span className="text-sm">{user.email}</span>
                </div>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={logout}
                  className="mr-4"
                >
                  <LogOut className="h-4 w-4 mr-2" />
                  Logout
                </Button>
              </>
            ) : (
              <div className="flex gap-2 mr-4">
                <Button variant="ghost" size="sm" asChild>
                  <Link href="/auth/signin">Sign In</Link>
                </Button>
                <Button size="sm" asChild>
                  <Link href="/auth/register">Sign Up</Link>
                </Button>
              </div>
            )}
            <ThemeToggle />
          </div>
          <h1 className="text-4xl font-bold mb-2 bg-gradient-to-r from-primary to-primary/80 bg-clip-text text-transparent">
            WeatherWear
          </h1>
          <p className="text-muted-foreground text-lg">
            Your personal weather & outfit guide
          </p>
        </header>

        <main className="max-w-4xl mx-auto space-y-8">
          {/* Geolocation Error */}
          {geoError && (
            <Alert variant="destructive" className="animate-fadeIn">
              <AlertCircle className="h-4 w-4" />
              <AlertDescription>{geoError}</AlertDescription>
            </Alert>
          )}

          {/* Search and Refresh Bar */}
          <div className="flex gap-4">
            <div className="flex-1">
              <PlaceSearch
                onPlaceSelect={handlePlaceSelect}
                disabled={loading}
              />
            </div>
            <Button
              variant="outline"
              onClick={handleRefresh}
              disabled={isRefreshing || !currentWeather}
              className="w-12 aspect-square"
            >
              <RefreshCw
                className={`h-4 w-4 ${isRefreshing ? "animate-spin" : ""}`}
              />
            </Button>
          </div>

          {/* Error Display */}
          {error && (
            <Alert variant="destructive" className="animate-fadeIn">
              <AlertCircle className="h-4 w-4" />
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}

          {/* Weather and Outfit Content */}
          {currentWeather && (
            <Tabs defaultValue="weather" className="space-y-6">
              <TabsList className="grid w-full grid-cols-3 lg:w-[600px] mx-auto">
                <TabsTrigger value="weather">Weather</TabsTrigger>
                <TabsTrigger value="outfit">Outfit Planner</TabsTrigger>
                <TabsTrigger value="history" disabled={!user}>
                  History
                </TabsTrigger>
              </TabsList>

              <TabsContent value="weather" className="animate-fadeIn">
                <WeatherDisplay weatherData={currentWeather} />
              </TabsContent>

              <TabsContent value="outfit" className="animate-fadeIn">
                {forecastData && (
                  <OutfitRecommendation forecastData={forecastData} />
                )}
              </TabsContent>

              <TabsContent value="history" className="animate-fadeIn">
                <OutfitHistory />
              </TabsContent>
            </Tabs>
          )}
        </main>

        <footer className="text-center text-sm text-muted-foreground mt-12">
          <p>Powered by OpenWeather API</p>
          <p className="text-xs mt-1">
            {process.env.NEXT_PUBLIC_VERSION || "Development"} Build
          </p>
        </footer>
      </div>
    </div>
  );
}

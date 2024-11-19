"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useGeolocation } from "@/hooks/useGeolocation";
import WeatherDisplay from "@/components/WeatherDisplay";
import OutfitRecommendation from "@/components/OutfitRecommendation";
import { AlertCircle, RefreshCw } from "lucide-react";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import type { WeatherResponse } from "@/types/weather";

export default function Home() {
  const [city, setCity] = useState("");
  const [weatherData, setWeatherData] = useState<WeatherResponse | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [activeDate, setActiveDate] = useState<Date>(new Date());
  const [isRefreshing, setIsRefreshing] = useState(false);

  const {
    latitude,
    longitude,
    error: geoError,
    loading: geoLoading,
  } = useGeolocation();

  // Fetch weather by coordinates
  const fetchWeatherByCoords = async (lat: number, lon: number) => {
    try {
      setLoading(true);
      setError("");

      const params = new URLSearchParams({
        lat: lat.toString(),
        lon: lon.toString(),
      });

      const response = await fetch(`/api/weather?${params}`);

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || `Error: ${response.status}`);
      }

      const data = await response.json();
      setWeatherData(data);
    } catch (err) {
      console.error("Error fetching weather:", err);
      setError(
        err instanceof Error ? err.message : "Failed to fetch weather data",
      );
    } finally {
      setLoading(false);
    }
  };

  // Fetch weather by city name
  const fetchWeatherByCity = async () => {
    if (!city.trim()) {
      setError("Please enter a city name");
      return;
    }

    try {
      setLoading(true);
      setError("");

      const params = new URLSearchParams({
        city: city.trim(),
      });

      const response = await fetch(`/api/weather?${params}`);

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || `Error: ${response.status}`);
      }

      const data = await response.json();
      setWeatherData(data);
    } catch (err) {
      console.error("Error fetching weather:", err);
      setError(
        err instanceof Error ? err.message : "Failed to fetch weather data",
      );
    } finally {
      setLoading(false);
    }
  };

  // Fetch weather forecast
  const fetchWeatherForecast = async (date: Date) => {
    try {
      setLoading(true);
      setError("");

      const params = new URLSearchParams({
        date: date.toISOString(),
        ...(latitude && longitude
          ? { lat: latitude.toString(), lon: longitude.toString() }
          : { city: weatherData?.city || city }),
      });

      const response = await fetch(`/api/weather/forecast?${params}`);

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || `Error: ${response.status}`);
      }

      const data = await response.json();
      setWeatherData(data);
      setActiveDate(date);
    } catch (err) {
      console.error("Error fetching forecast:", err);
      setError(
        err instanceof Error ? err.message : "Failed to fetch weather forecast",
      );
    } finally {
      setLoading(false);
    }
  };

  // Handle manual refresh
  const handleRefresh = async () => {
    setIsRefreshing(true);
    if (latitude && longitude) {
      await fetchWeatherByCoords(latitude, longitude);
    } else if (weatherData?.city) {
      await fetchWeatherByCity();
    }
    setIsRefreshing(false);
  };

  // Handle Enter key press
  const handleKeyPress = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter" && !loading) {
      fetchWeatherByCity();
    }
  };

  // Effect to fetch weather when coordinates are available
  useEffect(() => {
    if (latitude !== null && longitude !== null && !weatherData && !error) {
      fetchWeatherByCoords(latitude, longitude);
    }
  }, [latitude, longitude]);

  return (
    <div className="grid grid-rows-[auto_1fr_auto] min-h-screen p-8 gap-8">
      <header className="text-center">
        <h1 className="text-4xl font-bold mb-4">WeatherWear</h1>
        <p className="text-muted-foreground">
          Your personal weather & outfit guide
        </p>
      </header>

      <main className="max-w-2xl mx-auto w-full space-y-8">
        {/* Geolocation Error */}
        {geoError && (
          <Alert variant="destructive">
            <AlertCircle className="h-4 w-4" />
            <AlertDescription>{geoError}</AlertDescription>
          </Alert>
        )}

        {/* Search and Refresh Bar */}
        <div className="flex gap-4">
          <Input
            type="text"
            placeholder="Enter city name..."
            value={city}
            onChange={(e) => setCity(e.target.value)}
            onKeyPress={handleKeyPress}
            disabled={loading}
            className="flex-1"
          />
          <Button
            onClick={fetchWeatherByCity}
            disabled={loading || !city.trim()}
          >
            {loading ? "Loading..." : "Get Weather"}
          </Button>
          <Button
            variant="outline"
            onClick={handleRefresh}
            disabled={isRefreshing || !weatherData}
            className="w-12"
          >
            <RefreshCw
              className={`h-4 w-4 ${isRefreshing ? "animate-spin" : ""}`}
            />
          </Button>
        </div>

        {/* Error Display */}
        {error && (
          <Alert variant="destructive">
            <AlertCircle className="h-4 w-4" />
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        )}

        {/* Weather and Outfit Content */}
        {weatherData && (
          <Tabs defaultValue="weather" className="space-y-6">
            <TabsList className="grid grid-cols-2">
              <TabsTrigger value="weather">Weather</TabsTrigger>
              <TabsTrigger value="outfit">Outfit</TabsTrigger>
            </TabsList>

            <TabsContent value="weather">
              <WeatherDisplay weatherData={weatherData} />
            </TabsContent>

            <TabsContent value="outfit">
              <OutfitRecommendation
                weatherData={weatherData}
                onDateChange={fetchWeatherForecast}
              />
            </TabsContent>
          </Tabs>
        )}
      </main>

      <footer className="text-center text-sm text-muted-foreground">
        <p>Powered by OpenWeather API</p>
        <p className="text-xs mt-1">
          {process.env.NEXT_PUBLIC_VERSION || "Development"} Build
        </p>
      </footer>
    </div>
  );
}

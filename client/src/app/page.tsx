"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import WeatherDisplay from "@/components/WeatherDisplay";

export default function Home() {
  const [city, setCity] = useState("");
  const [weatherData, setWeatherData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const fetchWeather = async () => {
    if (!city) return;

    setLoading(true);
    setError("");

    try {
      const response = await fetch(
        `/api/weather?city=${encodeURIComponent(city)}`,
      );
      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Failed to fetch weather data");
      }

      setWeatherData(data);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="grid grid-rows-[auto_1fr_auto] min-h-screen p-8 gap-8">
      <header className="text-center">
        <h1 className="text-4xl font-bold mb-4">WeatherWear</h1>
        <p className="text-muted-foreground">
          Your personal guide to weather conditions
        </p>
      </header>

      <main className="max-w-2xl mx-auto w-full space-y-8">
        <div className="flex gap-4">
          <Input
            type="text"
            placeholder="Enter city name..."
            value={city}
            onChange={(e) => setCity(e.target.value)}
            onKeyPress={(e) => e.key === "Enter" && fetchWeather()}
          />
          <Button onClick={fetchWeather} disabled={loading}>
            {loading ? "Loading..." : "Get Weather"}
          </Button>
        </div>

        {error && <div className="text-red-500 text-center p-4">{error}</div>}

        {weatherData && <WeatherDisplay weatherData={weatherData} />}
      </main>

      <footer className="text-center text-sm text-muted-foreground">
        Powered by OpenWeather API
      </footer>
    </div>
  );
}

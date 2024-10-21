import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

export default function Home() {
  const [city, setCity] = useState("");
  const [weather, setWeather] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const fetchWeather = async () => {
    setLoading(true);
    setError("");
    try {
      const response = await fetch(
        `/api/weather?city=${encodeURIComponent(city)}`,
      );
      if (!response.ok) {
        throw new Error("Failed to fetch weather data");
      }
      const data = await response.json();
      setWeather(data);
    } catch (err) {
      setError("Error fetching weather data. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="grid grid-rows-[20px_1fr_20px] items-center justify-items-center min-h-screen p-8 pb-20 gap-16 sm:p-20 font-[family-name:var(--font-geist-sans)]">
      <main className="flex flex-col gap-8 row-start-2 items-center sm:items-start">
        <h1 className="text-4xl font-bold text-center sm:text-left">
          Welcome to WeatherWear
        </h1>
        <p className="text-lg text-center sm:text-left max-w-md">
          Your personal guide to dressing for any weather condition. Stay
          stylish and comfortable, no matter the forecast.
        </p>

        <div className="flex flex-col sm:flex-row w-full max-w-md gap-4">
          <Input
            type="text"
            placeholder="Enter city"
            value={city}
            onChange={(e) => setCity(e.target.value)}
            className="flex-grow"
          />
          <Button onClick={fetchWeather} disabled={loading}>
            {loading ? "Loading..." : "Get Weather"}
          </Button>
        </div>

        {error && <p className="text-red-500">{error}</p>}

        {weather && (
          <div className="text-center sm:text-left">
            <h2 className="text-2xl font-semibold mb-2">
              {weather.city}, {weather.country}
            </h2>
            <p className="text-xl mb-1">{weather.temperature}°C</p>
            <p className="text-lg mb-1">{weather.description}</p>
            <img
              src={`http://openweathermap.org/img/wn/${weather.icon}@2x.png`}
              alt={weather.description}
              className="mx-auto sm:mx-0"
            />
          </div>
        )}

        <ol className="list-inside list-decimal text-sm text-center sm:text-left font-[family-name:var(--font-geist-mono)]">
          <li className="mb-2">
            Check the weather forecast for your location.
          </li>
          <li className="mb-2">Get personalized outfit recommendations.</li>
          <li>Stay comfortable and stylish all day long!</li>
        </ol>
      </main>
    </div>
  );
}

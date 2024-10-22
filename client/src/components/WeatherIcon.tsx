import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Wind, Droplets, Thermometer, Eye } from "lucide-react";
import WeatherIcon from "@/components/WeatherIcon";

export default function WeatherDisplay({ weatherData }) {
  if (!weatherData) return null;

  return (
    <Card className="w-full max-w-2xl">
      <CardHeader>
        <CardTitle className="flex justify-between items-center">
          <span>
            {weatherData.city}, {weatherData.country}
          </span>
          <WeatherIcon icon={weatherData.weather.icon} />
        </CardTitle>
      </CardHeader>
      <CardContent className="grid gap-4">
        {/* Temperature Section */}
        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-2">
            <div className="flex items-center gap-2 text-muted-foreground">
              <Thermometer className="h-4 w-4" />
              <span>Temperature</span>
            </div>
            <div className="text-2xl font-bold">
              {weatherData.temperature.current}°C
            </div>
            <div className="text-sm text-muted-foreground">
              Feels like: {weatherData.temperature.feels_like}°C
            </div>
          </div>
          <div className="space-y-1">
            <div className="text-sm text-muted-foreground">Range</div>
            <div>Min: {weatherData.temperature.min}°C</div>
            <div>Max: {weatherData.temperature.max}°C</div>
          </div>
        </div>

        {/* Weather Details Grid */}
        <div className="grid grid-cols-3 gap-4 pt-4">
          {/* Humidity */}
          <div className="space-y-2">
            <div className="flex items-center gap-2 text-muted-foreground">
              <Droplets className="h-4 w-4" />
              <span>Humidity</span>
            </div>
            <div className="text-xl font-semibold">{weatherData.humidity}%</div>
          </div>

          {/* Wind */}
          <div className="space-y-2">
            <div className="flex items-center gap-2 text-muted-foreground">
              <Wind className="h-4 w-4" />
              <span>Wind</span>
            </div>
            <div className="text-xl font-semibold">
              {weatherData.wind.speed} m/s
            </div>
          </div>

          {/* Visibility */}
          <div className="space-y-2">
            <div className="flex items-center gap-2 text-muted-foreground">
              <Eye className="h-4 w-4" />
              <span>Visibility</span>
            </div>
            <div className="text-xl font-semibold">
              {(weatherData.visibility / 1000).toFixed(1)} km
            </div>
          </div>
        </div>

        {/* Weather Condition */}
        <div className="pt-4">
          <div className="text-lg font-medium">{weatherData.weather.main}</div>
          <div className="text-muted-foreground capitalize">
            {weatherData.weather.description}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

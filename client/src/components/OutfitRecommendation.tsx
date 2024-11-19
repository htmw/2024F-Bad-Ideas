import React, { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Slider } from "@/components/ui/slider";
import { Calendar } from "@/components/ui/calendar";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Thermometer, Wind, Droplets, Sun } from "lucide-react";
import WeatherIcon from "@/components/WeatherIcon";

const OutfitRecommendation = ({ forecastData, onDateChange }) => {
  // User preferences state
  const [preferences, setPreferences] = useState({
    coldSensitivity: 50,
    rainProtection: true,
    windProtection: true,
    formalStyle: false,
  });

  // Selected date state
  const [selectedDate, setSelectedDate] = useState(new Date());

  // Get outfit recommendations based on weather and preferences
  const getOutfitRecommendation = (weather, prefs) => {
    const temp = weather.temperature.max; // Using max temperature for the day
    const isRaining =
      weather.weather.main.toLowerCase().includes("rain") || weather.pop > 0.5;
    const isWindy = weather.wind.speed > 5;
    const tempThreshold = prefs.coldSensitivity * 0.2 + 15;

    const outfit = {
      layers: [],
      accessories: [],
      footwear: "",
    };

    // Base layer
    if (temp < tempThreshold) {
      outfit.layers.push("Thermal Undershirt");
    }

    // Mid layer
    if (temp < tempThreshold + 5) {
      outfit.layers.push(prefs.formalStyle ? "Sweater" : "Fleece");
    }

    // Outer layer
    if (temp < tempThreshold) {
      outfit.layers.push(prefs.formalStyle ? "Wool Coat" : "Winter Jacket");
    } else if (temp < tempThreshold + 10) {
      outfit.layers.push(prefs.formalStyle ? "Light Blazer" : "Light Jacket");
    }

    // Rain protection
    if (isRaining && prefs.rainProtection) {
      outfit.accessories.push("Umbrella");
      outfit.layers.push("Rain Jacket");
      outfit.footwear = "Waterproof Boots";
    } else {
      outfit.footwear = temp < tempThreshold ? "Boots" : "Sneakers";
    }

    // Wind protection
    if (isWindy && prefs.windProtection) {
      outfit.accessories.push("Scarf");
      if (temp < tempThreshold) {
        outfit.accessories.push("Gloves");
      }
    }

    // Warm weather options
    if (temp > 25) {
      outfit.layers = [prefs.formalStyle ? "Light Cotton Shirt" : "T-Shirt"];
      outfit.accessories.push("Sunglasses");
      outfit.footwear = prefs.formalStyle ? "Light Dress Shoes" : "Sandals";
    }

    return outfit;
  };

  // Group forecast data by day
  const groupedForecasts =
    forecastData?.forecast?.reduce((acc, forecast) => {
      const date = new Date(forecast.dt * 1000).toLocaleDateString();
      if (!acc[date]) {
        acc[date] = [];
      }
      acc[date].push(forecast);
      return acc;
    }, {}) || {};

  return (
    <Card className="w-full max-w-4xl mt-8">
      <CardHeader>
        <CardTitle>
          5-Day Outfit Recommendations for {forecastData?.city}
        </CardTitle>
      </CardHeader>
      <CardContent>
        <Tabs defaultValue="forecast">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="forecast">Forecast</TabsTrigger>
            <TabsTrigger value="preferences">Preferences</TabsTrigger>
          </TabsList>

          <TabsContent value="forecast" className="space-y-6">
            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
              {Object.entries(groupedForecasts).map(([date, dayForecasts]) => {
                const middayForecast =
                  dayForecasts.find(
                    (f) =>
                      new Date(f.dt * 1000).getHours() >= 12 &&
                      new Date(f.dt * 1000).getHours() <= 15,
                  ) || dayForecasts[0];

                const outfit = getOutfitRecommendation(
                  middayForecast,
                  preferences,
                );

                return (
                  <Card key={date} className="w-full">
                    <CardHeader className="pb-2">
                      <CardTitle className="flex justify-between items-center text-lg">
                        <span>
                          {new Date(date).toLocaleDateString("en-US", {
                            weekday: "short",
                            month: "short",
                            day: "numeric",
                          })}
                        </span>
                        <WeatherIcon icon={middayForecast.weather.icon} />
                      </CardTitle>
                    </CardHeader>

                    <CardContent className="space-y-4">
                      {/* Weather Summary */}
                      <div className="text-sm text-muted-foreground">
                        <p>{middayForecast.weather.description}</p>
                        <p>
                          High: {Math.round(middayForecast.temperature.max)}°F
                        </p>
                        <p>
                          Rain chance: {Math.round(middayForecast.pop * 100)}%
                        </p>
                      </div>

                      {/* Outfit Recommendations */}
                      <div className="space-y-2">
                        <div>
                          <h4 className="text-sm font-semibold">Layers</h4>
                          <ul className="text-sm text-muted-foreground list-disc list-inside">
                            {outfit.layers.map((layer, index) => (
                              <li key={index}>{layer}</li>
                            ))}
                          </ul>
                        </div>

                        {outfit.accessories.length > 0 && (
                          <div>
                            <h4 className="text-sm font-semibold">
                              Accessories
                            </h4>
                            <ul className="text-sm text-muted-foreground list-disc list-inside">
                              {outfit.accessories.map((accessory, index) => (
                                <li key={index}>{accessory}</li>
                              ))}
                            </ul>
                          </div>
                        )}

                        <div>
                          <h4 className="text-sm font-semibold">Footwear</h4>
                          <p className="text-sm text-muted-foreground">
                            {outfit.footwear}
                          </p>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                );
              })}
            </div>
          </TabsContent>

          <TabsContent value="preferences" className="space-y-6">
            {/* Temperature Sensitivity */}
            <div className="space-y-2">
              <Label className="flex items-center gap-2">
                <Thermometer className="h-4 w-4" />
                Temperature Sensitivity
              </Label>
              <Slider
                value={[preferences.coldSensitivity]}
                onValueChange={([value]) =>
                  setPreferences((prev) => ({
                    ...prev,
                    coldSensitivity: value,
                  }))
                }
                max={100}
                step={1}
              />
              <p className="text-sm text-muted-foreground">
                {preferences.coldSensitivity < 30
                  ? "I usually run warm"
                  : preferences.coldSensitivity > 70
                    ? "I get cold easily"
                    : "Average temperature sensitivity"}
              </p>
            </div>

            {/* Rain Protection */}
            <div className="flex items-center justify-between">
              <Label className="flex items-center gap-2">
                <Droplets className="h-4 w-4" />
                Prioritize Rain Protection
              </Label>
              <Switch
                checked={preferences.rainProtection}
                onCheckedChange={(checked) =>
                  setPreferences((prev) => ({
                    ...prev,
                    rainProtection: checked,
                  }))
                }
              />
            </div>

            {/* Wind Protection */}
            <div className="flex items-center justify-between">
              <Label className="flex items-center gap-2">
                <Wind className="h-4 w-4" />
                Prioritize Wind Protection
              </Label>
              <Switch
                checked={preferences.windProtection}
                onCheckedChange={(checked) =>
                  setPreferences((prev) => ({
                    ...prev,
                    windProtection: checked,
                  }))
                }
              />
            </div>

            {/* Style Preference */}
            <div className="flex items-center justify-between">
              <Label className="flex items-center gap-2">
                Prefer Formal Style
              </Label>
              <Switch
                checked={preferences.formalStyle}
                onCheckedChange={(checked) =>
                  setPreferences((prev) => ({ ...prev, formalStyle: checked }))
                }
              />
            </div>
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  );
};

export default OutfitRecommendation;

import React, { useState, useMemo } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Slider } from "@/components/ui/slider";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Thermometer, Wind, Droplets } from "lucide-react";
import WeatherIcon from "@/components/WeatherIcon";

const OutfitRecommendation = ({ forecastData }) => {
  const [preferences, setPreferences] = useState({
    coldSensitivity: 50,
    rainProtection: true,
    windProtection: true,
    formalStyle: false,
  });

  // Process and group forecast data by day
  const groupedForecasts = useMemo(() => {
    if (!forecastData?.forecast || !Array.isArray(forecastData.forecast)) {
      return {};
    }

    // Group forecasts by day and find max/min temps
    const grouped = forecastData.forecast.reduce((acc, forecast) => {
      // Get date string in local timezone
      const date = new Date(forecast.dt * 1000).toLocaleDateString("en-US", {
        timeZone: "America/New_York", // Adjust this based on your needs
      });

      if (!acc[date]) {
        acc[date] = {
          forecasts: [],
          maxTemp: -Infinity,
          minTemp: Infinity,
          highestPop: 0,
          weatherDescriptions: new Set(),
          icons: new Set(),
        };
      }

      acc[date].forecasts.push(forecast);
      acc[date].maxTemp = Math.max(acc[date].maxTemp, forecast.temperature.max);
      acc[date].minTemp = Math.min(acc[date].minTemp, forecast.temperature.min);
      acc[date].highestPop = Math.max(acc[date].highestPop, forecast.pop);
      acc[date].weatherDescriptions.add(forecast.weather.description);
      acc[date].icons.add(forecast.weather.icon);

      return acc;
    }, {});

    // Take first 5 days only
    return Object.fromEntries(Object.entries(grouped).slice(0, 5));
  }, [forecastData]);

  const getOutfitRecommendation = (dayForecast, prefs) => {
    const temp = dayForecast.maxTemp;
    const isRaining =
      dayForecast.highestPop > 0.3 ||
      Array.from(dayForecast.weatherDescriptions).some((desc) =>
        desc.toLowerCase().includes("rain"),
      );
    const isWindy = dayForecast.forecasts.some((f) => f.wind.speed > 5);
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
      if (dayForecast.highestPop > 0.5) {
        outfit.layers.push("Rain Jacket");
        outfit.footwear = "Waterproof Boots";
      }
    }

    if (!outfit.footwear) {
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

  if (!forecastData || Object.keys(groupedForecasts).length === 0) {
    return null;
  }

  return (
    <Card className="w-full max-w-4xl mt-8">
      <CardHeader>
        <CardTitle>
          5-Day Outfit Recommendations for {forecastData.city}
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
              {Object.entries(groupedForecasts).map(([date, dayData]) => {
                const outfit = getOutfitRecommendation(dayData, preferences);
                // Get the most representative icon for the day
                const mainIcon = Array.from(dayData.icons)[0];

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
                        <WeatherIcon icon={mainIcon} />
                      </CardTitle>
                    </CardHeader>

                    <CardContent className="space-y-4">
                      {/* Weather Summary */}
                      <div className="text-sm text-muted-foreground">
                        <p>{Array.from(dayData.weatherDescriptions)[0]}</p>
                        <p>High: {Math.round(dayData.maxTemp)}°F</p>
                        <p>Low: {Math.round(dayData.minTemp)}°F</p>
                        <p>
                          Rain chance: {Math.round(dayData.highestPop * 100)}%
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

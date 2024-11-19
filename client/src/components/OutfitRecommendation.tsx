// src/components/OutfitRecommendation.tsx

import React, { useState, useMemo } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Slider } from "@/components/ui/slider";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { Select, SelectItem } from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Thermometer, Wind, Droplets, User } from "lucide-react";
import WeatherIcon from "@/components/WeatherIcon";
import { generateOutfitRecommendation } from "@/lib/outfitLogic";

const OutfitRecommendation = ({ forecastData }) => {
  const [preferences, setPreferences] = useState({
    gender: "unisex" as "male" | "female",
    formalityPreference: 3,
    temperatureSensitivity: 50,
    prioritizeRainProtection: true,
    prioritizeWindProtection: true,
  });

  const getOutfitForDay = (dayData) => {
    const weatherConditions = {
      temperature: dayData.temperature.max,
      isRaining: dayData.pop > 0.3,
      isSnowing: dayData.weather.main === "Snow",
      windSpeed: dayData.wind.speed,
      timeOfDay: "day" as "morning" | "afternoon" | "evening" | "night",
    };

    return generateOutfitRecommendation(weatherConditions, preferences);
  };

  if (!forecastData || !forecastData.forecast) {
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
              {forecastData.forecast.map((dayData) => {
                const outfit = getOutfitForDay(dayData);
                const date = new Date(dayData.dt_txt);
                const dateStr = date.toLocaleDateString("en-US", {
                  weekday: "short",
                  month: "short",
                  day: "numeric",
                });

                return (
                  <Card key={dayData.dt_txt} className="w-full">
                    <CardHeader className="pb-2">
                      <CardTitle className="flex justify-between items-center text-lg">
                        <span>{dateStr}</span>
                        <WeatherIcon icon={dayData.weather.icon} />
                      </CardTitle>
                    </CardHeader>

                    <CardContent className="space-y-4">
                      {/* Weather Summary */}
                      <div className="text-sm text-muted-foreground">
                        <p className="capitalize">
                          {dayData.weather.description}
                        </p>
                        <p>High: {Math.round(dayData.temperature.max)}°F</p>
                        <p>Low: {Math.round(dayData.temperature.min)}°F</p>
                        <p>Rain chance: {Math.round(dayData.pop * 100)}%</p>
                      </div>

                      {/* Outfit Recommendations */}
                      <div className="space-y-3">
                        {/* Base Layers */}
                        {outfit.baseLayers.length > 0 && (
                          <div>
                            <h4 className="text-sm font-semibold">
                              Base Layer
                            </h4>
                            <ul className="text-sm text-muted-foreground list-disc list-inside">
                              {outfit.baseLayers.map((item, index) => (
                                <li key={index}>{item.name}</li>
                              ))}
                            </ul>
                          </div>
                        )}

                        {/* Mid Layers */}
                        {outfit.midLayers.length > 0 && (
                          <div>
                            <h4 className="text-sm font-semibold">Mid Layer</h4>
                            <ul className="text-sm text-muted-foreground list-disc list-inside">
                              {outfit.midLayers.map((item, index) => (
                                <li key={index}>{item.name}</li>
                              ))}
                            </ul>
                          </div>
                        )}

                        {/* Outer Layers */}
                        {outfit.outerLayers.length > 0 && (
                          <div>
                            <h4 className="text-sm font-semibold">
                              Outer Layer
                            </h4>
                            <ul className="text-sm text-muted-foreground list-disc list-inside">
                              {outfit.outerLayers.map((item, index) => (
                                <li key={index}>{item.name}</li>
                              ))}
                            </ul>
                          </div>
                        )}

                        {/* Bottoms */}
                        <div>
                          <h4 className="text-sm font-semibold">Bottoms</h4>
                          <ul className="text-sm text-muted-foreground list-disc list-inside">
                            {outfit.bottoms.map((item, index) => (
                              <li key={index}>{item.name}</li>
                            ))}
                          </ul>
                        </div>

                        {/* Footwear */}
                        <div>
                          <h4 className="text-sm font-semibold">Footwear</h4>
                          <ul className="text-sm text-muted-foreground list-disc list-inside">
                            {outfit.footwear.map((item, index) => (
                              <li key={index}>{item.name}</li>
                            ))}
                          </ul>
                        </div>

                        {/* Accessories */}
                        {outfit.accessories.length > 0 && (
                          <div>
                            <h4 className="text-sm font-semibold">
                              Accessories
                            </h4>
                            <ul className="text-sm text-muted-foreground list-disc list-inside">
                              {outfit.accessories.map((item, index) => (
                                <li key={index}>{item.name}</li>
                              ))}
                            </ul>
                          </div>
                        )}
                      </div>
                    </CardContent>
                  </Card>
                );
              })}
            </div>
          </TabsContent>

          <TabsContent value="preferences" className="space-y-6">
            {/* Gender Preference */}
            <div className="space-y-2">
              <Label className="flex items-center gap-2">
                <User className="h-4 w-4" />
                Style Preference
              </Label>
              <Select
                value={preferences.gender}
                onValueChange={(value: "male" | "female") =>
                  setPreferences((prev) => ({ ...prev, gender: value }))
                }
              >
                <SelectItem value="male">Men's Style</SelectItem>
                <SelectItem value="female">Women's Style</SelectItem>
              </Select>
            </div>

            {/* Formality Level */}
            <div className="space-y-2">
              <Label>Formality Level</Label>
              <Slider
                value={[preferences.formalityPreference]}
                onValueChange={([value]) =>
                  setPreferences((prev) => ({
                    ...prev,
                    formalityPreference: value,
                  }))
                }
                max={5}
                step={1}
              />
              <p className="text-sm text-muted-foreground">
                {preferences.formalityPreference === 1 && "Very Casual"}
                {preferences.formalityPreference === 2 && "Casual"}
                {preferences.formalityPreference === 3 && "Smart Casual"}
                {preferences.formalityPreference === 4 && "Business Casual"}
                {preferences.formalityPreference === 5 && "Formal"}
              </p>
            </div>

            {/* Temperature Sensitivity */}
            <div className="space-y-2">
              <Label className="flex items-center gap-2">
                <Thermometer className="h-4 w-4" />
                Temperature Sensitivity
              </Label>
              <Slider
                value={[preferences.temperatureSensitivity]}
                onValueChange={([value]) =>
                  setPreferences((prev) => ({
                    ...prev,
                    temperatureSensitivity: value,
                  }))
                }
                max={100}
                step={1}
              />
              <p className="text-sm text-muted-foreground">
                {preferences.temperatureSensitivity < 30
                  ? "I usually run warm"
                  : preferences.temperatureSensitivity > 70
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
                checked={preferences.prioritizeRainProtection}
                onCheckedChange={(checked) =>
                  setPreferences((prev) => ({
                    ...prev,
                    prioritizeRainProtection: checked,
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
                checked={preferences.prioritizeWindProtection}
                onCheckedChange={(checked) =>
                  setPreferences((prev) => ({
                    ...prev,
                    prioritizeWindProtection: checked,
                  }))
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

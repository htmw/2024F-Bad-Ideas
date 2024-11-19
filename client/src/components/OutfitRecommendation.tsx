// src/components/OutfitRecommendation.tsx

import React, { useState, useMemo } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Slider } from "@/components/ui/slider";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { Select, SelectItem } from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Thermometer,
  Wind,
  Droplets,
  User,
  Sparkles,
  Shirt,
  PaintBucket,
} from "lucide-react";
import WeatherIcon from "@/components/WeatherIcon";
import { generateOutfitRecommendation, styleProfiles } from "@/lib/outfitLogic";

const OutfitRecommendation = ({ forecastData }) => {
  const [preferences, setPreferences] = useState({
    gender: "male" as "male" | "female",
    formalityPreference: 3,
    temperatureSensitivity: 50,
    prioritizeRainProtection: true,
    prioritizeWindProtection: true,
    preferredStyle: ["classic", "modern"] as string[],
    favoriteColors: ["black", "navy", "gray"] as string[],
    avoidedMaterials: [] as string[],
    occasionType: "casual",
    comfortPriority: 3,
    sustainabilityPreference: false,
    layeringPreference: "moderate" as "minimal" | "moderate" | "maximum",
  });

  const getOutfitForDay = (dayData) => {
    const weatherConditions = {
      temperature: dayData.temperature.max,
      feelsLike: dayData.temperature.feels_like,
      isRaining: dayData.pop > 0.3,
      isSnowing: dayData.weather.main === "Snow",
      windSpeed: dayData.wind.speed,
      precipitation:
        dayData.pop > 0.7
          ? "heavy"
          : dayData.pop > 0.4
            ? "moderate"
            : dayData.pop > 0.1
              ? "light"
              : "none",
      humidity: dayData.humidity,
      uvIndex: 0, // Add UV index if available in your weather data
      timeOfDay: "day" as "morning" | "afternoon" | "evening" | "night",
      season: getSeasonFromDate(new Date(dayData.dt_txt)),
    };

    return generateOutfitRecommendation(weatherConditions, preferences);
  };

  const getSeasonFromDate = (
    date: Date,
  ): "spring" | "summer" | "fall" | "winter" => {
    const month = date.getMonth();
    if (month >= 2 && month <= 4) return "spring";
    if (month >= 5 && month <= 7) return "summer";
    if (month >= 8 && month <= 10) return "fall";
    return "winter";
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
                const outfitSuggestion = getOutfitForDay(dayData);
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

                      {/* Outfit Score */}
                      <div className="flex justify-between text-sm">
                        <span>
                          Weather Suitability:{" "}
                          {outfitSuggestion.weatherSuitability}%
                        </span>
                        <span>Comfort: {outfitSuggestion.comfortRating}%</span>
                      </div>

                      {/* Outfit Recommendations */}
                      <div className="space-y-3">
                        {outfitSuggestion.outfit.baseLayers.length > 0 && (
                          <div>
                            <h4 className="text-sm font-semibold">
                              Base Layer
                            </h4>
                            <ul className="text-sm text-muted-foreground list-disc list-inside">
                              {outfitSuggestion.outfit.baseLayers.map(
                                (item, index) => (
                                  <li key={index}>{item.name}</li>
                                ),
                              )}
                            </ul>
                          </div>
                        )}

                        {/* Mid Layers */}
                        {outfitSuggestion.outfit.midLayers.length > 0 && (
                          <div>
                            <h4 className="text-sm font-semibold">Mid Layer</h4>
                            <ul className="text-sm text-muted-foreground list-disc list-inside">
                              {outfitSuggestion.outfit.midLayers.map(
                                (item, index) => (
                                  <li key={index}>{item.name}</li>
                                ),
                              )}
                            </ul>
                          </div>
                        )}

                        {/* Continue with other layers... */}

                        {/* Style Notes */}
                        {outfitSuggestion.styleNotes.length > 0 && (
                          <div className="mt-4 text-sm">
                            <h4 className="font-semibold">Style Notes</h4>
                            <ul className="text-muted-foreground list-disc list-inside">
                              {outfitSuggestion.styleNotes.map(
                                (note, index) => (
                                  <li key={index}>{note}</li>
                                ),
                              )}
                            </ul>
                          </div>
                        )}

                        {/* Weather Notes */}
                        {outfitSuggestion.weatherNotes.length > 0 && (
                          <div className="mt-2 text-sm">
                            <h4 className="font-semibold">Weather Notes</h4>
                            <ul className="text-muted-foreground list-disc list-inside">
                              {outfitSuggestion.weatherNotes.map(
                                (note, index) => (
                                  <li key={index}>{note}</li>
                                ),
                              )}
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
            {/* Existing preferences... */}

            {/* New preferences */}
            <div className="space-y-2">
              <Label className="flex items-center gap-2">
                <Shirt className="h-4 w-4" />
                Layering Preference
              </Label>
              <Select
                value={preferences.layeringPreference}
                onValueChange={(value: "minimal" | "moderate" | "maximum") =>
                  setPreferences((prev) => ({
                    ...prev,
                    layeringPreference: value,
                  }))
                }
              >
                <SelectItem value="minimal">Minimal Layers</SelectItem>
                <SelectItem value="moderate">Moderate Layers</SelectItem>
                <SelectItem value="maximum">Maximum Layers</SelectItem>
              </Select>
            </div>

            <div className="space-y-2">
              <Label className="flex items-center gap-2">
                <PaintBucket className="h-4 w-4" />
                Occasion Type
              </Label>
              <Select
                value={preferences.occasionType}
                onValueChange={(value) =>
                  setPreferences((prev) => ({ ...prev, occasionType: value }))
                }
              >
                {styleProfiles.map((profile) => (
                  <SelectItem
                    key={profile.name.toLowerCase()}
                    value={profile.name.toLowerCase()}
                  >
                    {profile.name}
                  </SelectItem>
                ))}
              </Select>
            </div>

            <div className="flex items-center justify-between">
              <Label className="flex items-center gap-2">
                <Sparkles className="h-4 w-4" />
                Prefer Sustainable Options
              </Label>
              <Switch
                checked={preferences.sustainabilityPreference}
                onCheckedChange={(checked) =>
                  setPreferences((prev) => ({
                    ...prev,
                    sustainabilityPreference: checked,
                  }))
                }
              />
            </div>

            {/* Comfort Priority */}
            <div className="space-y-2">
              <Label>Comfort Priority</Label>
              <Slider
                value={[preferences.comfortPriority]}
                onValueChange={([value]) =>
                  setPreferences((prev) => ({
                    ...prev,
                    comfortPriority: value,
                  }))
                }
                max={5}
                step={1}
              />
              <p className="text-sm text-muted-foreground">
                {preferences.comfortPriority === 1 && "Style First"}
                {preferences.comfortPriority === 2 && "Mostly Stylish"}
                {preferences.comfortPriority === 3 && "Balanced"}
                {preferences.comfortPriority === 4 && "Mostly Comfortable"}
                {preferences.comfortPriority === 5 && "Maximum Comfort"}
              </p>
            </div>
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  );
};

export default OutfitRecommendation;

import React, { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Slider } from "@/components/ui/slider";
import { Calendar } from "@/components/ui/calendar";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Thermometer, Wind, Droplets, Sun } from "lucide-react";

const OutfitRecommendation = ({ weatherData, onDateChange }) => {
  // User preferences state
  const [preferences, setPreferences] = useState({
    coldSensitivity: 50, // 0-100 scale where higher means more sensitive to cold
    rainProtection: true,
    windProtection: true,
    formalStyle: false,
  });

  // Selected date state
  const [selectedDate, setSelectedDate] = useState(new Date());

  // Get outfit recommendations based on weather and preferences
  const getOutfitRecommendation = (weather, prefs) => {
    const temp = weather.temperature.current;
    const isRaining = weather.weather.main.toLowerCase().includes("rain");
    const isWindy = weather.wind.speed > 5;
    const tempThreshold = prefs.coldSensitivity * 0.2 + 15; // Adjusts temperature threshold based on sensitivity

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

  const outfit = getOutfitRecommendation(weatherData, preferences);

  return (
    <Card className="w-full max-w-2xl mt-8">
      <CardHeader>
        <CardTitle>Outfit Recommendations</CardTitle>
      </CardHeader>
      <CardContent>
        <Tabs defaultValue="current">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="current">Current Weather</TabsTrigger>
            <TabsTrigger value="preferences">Preferences</TabsTrigger>
          </TabsList>

          <TabsContent value="current" className="space-y-4">
            {/* Calendar for future planning */}
            <div className="mb-6">
              <Label>Plan for a future date</Label>
              <Calendar
                mode="single"
                selected={selectedDate}
                onSelect={(date) => {
                  setSelectedDate(date);
                  onDateChange?.(date);
                }}
                className="rounded-md border"
              />
            </div>

            {/* Outfit Recommendations */}
            <div className="space-y-4">
              <div>
                <h3 className="font-semibold mb-2">Recommended Layers</h3>
                <ul className="list-disc list-inside space-y-1">
                  {outfit.layers.map((layer, index) => (
                    <li key={index} className="text-muted-foreground">
                      {layer}
                    </li>
                  ))}
                </ul>
              </div>

              <div>
                <h3 className="font-semibold mb-2">Accessories</h3>
                <ul className="list-disc list-inside space-y-1">
                  {outfit.accessories.map((accessory, index) => (
                    <li key={index} className="text-muted-foreground">
                      {accessory}
                    </li>
                  ))}
                </ul>
              </div>

              <div>
                <h3 className="font-semibold mb-2">Footwear</h3>
                <p className="text-muted-foreground">{outfit.footwear}</p>
              </div>
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

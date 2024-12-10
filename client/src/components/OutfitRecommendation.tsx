// src/components/OutfitRecommendation.tsx
import React, { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Slider } from "@/components/ui/slider";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Thermometer,
  Wind,
  Droplets,
  User,
  Shirt,
  Clock,
  ThermometerSun,
  ThumbsUp,
  ThumbsDown,
} from "lucide-react";
import WeatherIcon from "@/components/WeatherIcon";
import { generateOutfitRecommendation } from "@/lib/outfitLogic";
import { useAuth } from "@/hooks/useAuth";
import {
  getOutfitHistory,
  saveOutfitToHistory,
  getSimilarOutfits,
} from "@/lib/firebase/outfitHistory";
import {
  saveOutfitRecommendation,
  updateFeedback,
  getRecommendations,
  getLikedRecommendations,
} from "@/lib/firebase/outfitRecommendations";

const OutfitRecommendation = ({ forecastData }) => {
  const { user } = useAuth();
  const [preferences, setPreferences] = useState({
    gender: "male" as "male" | "female",
    formalityPreference: 3,
    temperatureSensitivity: 50,
    prioritizeRainProtection: true,
    prioritizeWindProtection: true,
    stylePreference: "casual" as
      | "casual"
      | "streetwear"
      | "business"
      | "formal"
      | "athletic",
  });
  const [outfitHistory, setOutfitHistory] = useState([]);
  const [similarOutfits, setSimilarOutfits] = useState([]);
  const [loading, setLoading] = useState(false);
  const [savedRecommendations, setSavedRecommendations] = useState<{
    [key: string]: string;
  }>({});
  const [recommendations, setRecommendations] = useState([]);
  const [likedRecommendations, setLikedRecommendations] = useState([]);

  // Load outfit history, recommendations, and similar outfits
  useEffect(() => {
    async function loadData() {
      if (!user || !forecastData) return;

      setLoading(true);
      try {
        const [history, similar, recs, liked] = await Promise.all([
          getOutfitHistory(user.uid),
          getSimilarOutfits(user.uid, forecastData),
          getRecommendations(user.uid),
          getLikedRecommendations(user.uid),
        ]);

        setOutfitHistory(history);
        setSimilarOutfits(similar);
        setRecommendations(recs);
        setLikedRecommendations(liked);
      } catch (error) {
        console.error("Error loading data:", error);
      } finally {
        setLoading(false);
      }
    }

    loadData();
  }, [user, forecastData]);

  const handleSaveRecommendation = async (outfit, weatherData) => {
    if (!user) return;

    try {
      // Save to recommendations
      const recommendationId = await saveOutfitRecommendation(
        user.uid,
        outfit,
        weatherData,
      );

      // Also save to history
      await saveOutfitToHistory(user.uid, outfit, weatherData);

      setSavedRecommendations((prev) => ({
        ...prev,
        [weatherData.dt_txt]: recommendationId,
      }));

      // Refresh recommendations after saving
      const newRecs = await getRecommendations(user.uid);
      setRecommendations(newRecs);
    } catch (error) {
      console.error("Error saving recommendation:", error);
    }
  };

  const handleFeedback = async (
    recommendationId: string,
    feedback: "like" | "dislike",
  ) => {
    try {
      await updateFeedback(recommendationId, feedback);

      // Update local state
      setRecommendations((prev) =>
        prev.map((rec) =>
          rec.id === recommendationId ? { ...rec, feedback } : rec,
        ),
      );

      // Refresh liked recommendations after feedback
      const liked = await getLikedRecommendations(user.uid);
      setLikedRecommendations(liked);
    } catch (error) {
      console.error("Error updating feedback:", error);
    }
  };

  const getOutfitForDay = (dayData) => {
    const weatherConditions = {
      temperature: dayData.temperature.max,
      isRaining: dayData.pop > 0.3,
      isSnowing: dayData.weather.main === "Snow",
      windSpeed: dayData.wind.speed,
      timeOfDay: "day" as "morning" | "afternoon" | "evening" | "night",
    };

    const outfit = generateOutfitRecommendation(weatherConditions, preferences);

    return outfit;
  };

  const renderOutfitDetails = (outfit) => {
    return (
      <div className="space-y-3">
        {/* Base Layers */}
        {outfit.baseLayers?.length > 0 && (
          <div>
            <h4 className="text-sm font-semibold">Base Layer</h4>
            <ul className="text-sm text-muted-foreground list-disc list-inside">
              {outfit.baseLayers.map((item, index) => (
                <li key={index}>{item.name}</li>
              ))}
            </ul>
          </div>
        )}

        {/* Mid Layers */}
        {outfit.midLayers?.length > 0 && (
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
        {outfit.outerLayers?.length > 0 && (
          <div>
            <h4 className="text-sm font-semibold">Outer Layer</h4>
            <ul className="text-sm text-muted-foreground list-disc list-inside">
              {outfit.outerLayers.map((item, index) => (
                <li key={index}>{item.name}</li>
              ))}
            </ul>
          </div>
        )}

        {/* Bottoms */}
        {outfit.bottoms?.length > 0 && (
          <div>
            <h4 className="text-sm font-semibold">Bottoms</h4>
            <ul className="text-sm text-muted-foreground list-disc list-inside">
              {outfit.bottoms.map((item, index) => (
                <li key={index}>{item.name}</li>
              ))}
            </ul>
          </div>
        )}

        {/* Footwear */}
        {outfit.footwear?.length > 0 && (
          <div>
            <h4 className="text-sm font-semibold">Footwear</h4>
            <ul className="text-sm text-muted-foreground list-disc list-inside">
              {outfit.footwear.map((item, index) => (
                <li key={index}>{item.name}</li>
              ))}
            </ul>
          </div>
        )}

        {/* Accessories */}
        {outfit.accessories?.length > 0 && (
          <div>
            <h4 className="text-sm font-semibold">Accessories</h4>
            <ul className="text-sm text-muted-foreground list-disc list-inside">
              {outfit.accessories.map((item, index) => (
                <li key={index}>{item.name}</li>
              ))}
            </ul>
          </div>
        )}
      </div>
    );
  };

  if (!forecastData || !forecastData.forecast) {
    return null;
  }

  return (
    <Card className="w-full max-w-4xl mt-8">
      <CardHeader>
        <CardTitle>Outfit Recommendations for {forecastData.city}</CardTitle>
      </CardHeader>
      <CardContent>
        <Tabs defaultValue="forecast">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="forecast">Forecast</TabsTrigger>
            <TabsTrigger value="preferences">Preferences</TabsTrigger>
            <TabsTrigger value="saved" disabled={!user}>
              Saved Outfits
            </TabsTrigger>
          </TabsList>

          <TabsContent value="forecast" className="space-y-6">
            {likedRecommendations.length > 0 && (
              <Card className="mb-6">
                <CardHeader>
                  <CardTitle className="text-lg">
                    Your Favorite Outfits
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid gap-4 md:grid-cols-2">
                    {likedRecommendations.map((rec, index) => (
                      <Card key={rec.id} className="p-4">
                        <div className="flex items-center justify-between mb-4">
                          <div className="flex items-center gap-2">
                            <Clock className="h-4 w-4" />
                            <span className="text-sm text-muted-foreground">
                              {new Date(rec.date).toLocaleDateString()}
                            </span>
                          </div>
                          <div className="flex items-center gap-2">
                            <ThermometerSun className="h-4 w-4" />
                            <span className="text-sm">
                              {Math.round(rec.weather.temperature)}°F
                            </span>
                          </div>
                        </div>
                        {renderOutfitDetails(rec.outfit)}
                      </Card>
                    ))}
                  </div>
                </CardContent>
              </Card>
            )}

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

                    <CardContent>
                      <div className="text-sm text-muted-foreground mb-4">
                        <p className="capitalize">
                          {dayData.weather.description}
                        </p>
                        <p>High: {Math.round(dayData.temperature.max)}°F</p>
                        <p>Low: {Math.round(dayData.temperature.min)}°F</p>
                        <p>Rain chance: {Math.round(dayData.pop * 100)}%</p>
                      </div>

                      {renderOutfitDetails(outfit)}

                      {user && (
                        <div className="mt-4 space-x-2">
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() =>
                              handleSaveRecommendation(outfit, dayData)
                            }
                            disabled={savedRecommendations[dayData.dt_txt]}
                          >
                            {savedRecommendations[dayData.dt_txt]
                              ? "Saved"
                              : "Save Outfit"}
                          </Button>
                          {savedRecommendations[dayData.dt_txt] && (
                            <>
                              <Button
                                variant="outline"
                                size="icon"
                                onClick={() =>
                                  handleFeedback(
                                    savedRecommendations[dayData.dt_txt],
                                    "like",
                                  )
                                }
                              >
                                <ThumbsUp className="h-4 w-4" />
                              </Button>
                              <Button
                                variant="outline"
                                size="icon"
                                onClick={() =>
                                  handleFeedback(
                                    savedRecommendations[dayData.dt_txt],
                                    "dislike",
                                  )
                                }
                              >
                                <ThumbsDown className="h-4 w-4" />
                              </Button>
                            </>
                          )}
                        </div>
                      )}
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
                Gender Style
              </Label>
              <Select
                value={preferences.gender}
                onValueChange={(value: "male" | "female") =>
                  setPreferences((prev) => ({ ...prev, gender: value }))
                }
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select gender style" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="male">Men's Style</SelectItem>
                  <SelectItem value="female">Women's Style</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {/* Style Preference */}
            <div className="space-y-2">
              <Label className="flex items-center gap-2">
                <Shirt className="h-4 w-4" />
                Style Preference
              </Label>
              <Select
                value={preferences.stylePreference}
                onValueChange={(
                  value:
                    | "casual"
                    | "streetwear"
                    | "business"
                    | "formal"
                    | "athletic",
                ) =>
                  setPreferences((prev) => ({
                    ...prev,
                    stylePreference: value,
                  }))
                }
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select style preference" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="casual">Casual</SelectItem>
                  <SelectItem value="streetwear">Streetwear</SelectItem>
                  <SelectItem value="business">Business</SelectItem>
                  <SelectItem value="formal">Formal</SelectItem>
                  <SelectItem value="athletic">Athletic</SelectItem>
                </SelectContent>
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

          <TabsContent value="saved" className="space-y-6">
            {!user ? (
              <Card>
                <CardContent className="py-6">
                  <p className="text-center text-muted-foreground">
                    Please sign in to view your saved outfits
                  </p>
                </CardContent>
              </Card>
            ) : loading ? (
              <Card>
                <CardContent className="py-6">
                  <p className="text-center text-muted-foreground">
                    Loading your saved outfits...
                  </p>
                </CardContent>
              </Card>
            ) : recommendations.length === 0 ? (
              <Card>
                <CardContent className="py-6">
                  <p className="text-center text-muted-foreground">
                    No saved outfits yet. Save some outfit recommendations to
                    see them here!
                  </p>
                </CardContent>
              </Card>
            ) : (
              <div className="space-y-6">
                {recommendations.map((rec) => (
                  <Card key={rec.id}>
                    <CardHeader>
                      <CardTitle className="flex items-center justify-between text-lg">
                        <div className="flex items-center gap-2">
                          <Clock className="h-4 w-4" />
                          <span>
                            {new Date(rec.date).toLocaleDateString("en-US", {
                              weekday: "long",
                              year: "numeric",
                              month: "long",
                              day: "numeric",
                            })}
                          </span>
                        </div>
                        <div className="flex items-center gap-2">
                          <ThermometerSun className="h-4 w-4" />
                          <span>{Math.round(rec.weather.temperature)}°F</span>
                        </div>
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-4">
                        {/* Weather Summary */}
                        <div className="text-sm text-muted-foreground">
                          <p>
                            Weather Conditions:{" "}
                            {rec.weather.isRaining
                              ? "Rainy"
                              : rec.weather.isSnowing
                                ? "Snowy"
                                : "Clear"}
                          </p>
                          <p>Wind Speed: {rec.weather.windSpeed} m/s</p>
                        </div>

                        {/* Outfit Details */}
                        {renderOutfitDetails(rec.outfit)}

                        {/* Feedback Buttons */}
                        <div className="flex gap-2 mt-4">
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => handleFeedback(rec.id, "like")}
                            className={
                              rec.feedback === "like" ? "bg-green-100" : ""
                            }
                          >
                            <ThumbsUp className="h-4 w-4 mr-2" />
                            Like
                          </Button>
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => handleFeedback(rec.id, "dislike")}
                            className={
                              rec.feedback === "dislike" ? "bg-red-100" : ""
                            }
                          >
                            <ThumbsDown className="h-4 w-4 mr-2" />
                            Dislike
                          </Button>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            )}
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  );
};

export default OutfitRecommendation;

// src/lib/outfitLogic.ts

// Type Definitions
interface StyleProfile {
  name: string;
  description: string;
  formalityRange: [number, number];
  occasions: string[];
  characteristics: string[];
}

interface ClothingItem {
  id: string;
  name: string;
  type: "top" | "bottom" | "outerwear" | "footwear" | "accessory";
  subtype: string;
  minTemp: number;
  maxTemp: number;
  formalityLevel: number;
  rainSuitable: boolean;
  windSuitable: boolean;
  snowSuitable: boolean;
  gender: "male" | "female" | "unisex";
  layer: "base" | "mid" | "outer" | "none";
  season: ("spring" | "summer" | "fall" | "winter")[];
  occasions: string[];
  styles: string[];
  material: string;
  careInstructions: string;
  matchesWith: string[]; // IDs of complementary items
  colors: string[];
  description: string;
  uvProtection?: boolean;
  waterResistance?: "none" | "water-resistant" | "waterproof";
  warmthRating?: number; // 1-5
  breathability?: number; // 1-5
  sustainability?: {
    ecoFriendly: boolean;
    recyclable: boolean;
    organicMaterials: boolean;
  };
}

interface WeatherConditions {
  temperature: number;
  feelsLike: number;
  isRaining: boolean;
  isSnowing: boolean;
  windSpeed: number;
  precipitation: "none" | "light" | "moderate" | "heavy";
  humidity: number;
  uvIndex: number;
  timeOfDay: "morning" | "afternoon" | "evening" | "night";
  season: "spring" | "summer" | "fall" | "winter";
}

interface StylePreferences {
  gender: "male" | "female";
  formalityPreference: number; // 1-5
  temperatureSensitivity: number; // 0-100
  prioritizeRainProtection: boolean;
  prioritizeWindProtection: boolean;
  preferredStyle: string[];
  favoriteColors: string[];
  avoidedMaterials: string[];
  occasionType: string;
  comfortPriority: number; // 1-5
  sustainabilityPreference: boolean;
  layeringPreference: "minimal" | "moderate" | "maximum";
}

export interface OutfitRecommendation {
  baseLayers: ClothingItem[];
  midLayers: ClothingItem[];
  outerLayers: ClothingItem[];
  bottoms: ClothingItem[];
  footwear: ClothingItem[];
  accessories: ClothingItem[];
}

interface OutfitSuggestion {
  outfit: OutfitRecommendation;
  styleNotes: string[];
  careInstructions: string[];
  alternatives: Partial<OutfitRecommendation>;
  occasion: string;
  formality: number;
  weatherSuitability: number;
  comfortRating: number;
  colorPalette: string[];
  layeringTips: string[];
  weatherNotes: string[];
}

// Style Profiles
export const styleProfiles: StyleProfile[] = [
  {
    name: "Casual",
    description:
      "Relaxed, everyday wear perfect for casual outings and errands",
    formalityRange: [1, 2],
    occasions: ["weekend", "outdoor", "casual", "shopping"],
    characteristics: ["comfortable", "practical", "low-maintenance"],
  },
  {
    name: "Smart Casual",
    description: "Polished yet relaxed look suitable for most occasions",
    formalityRange: [2, 3],
    occasions: ["dinner", "date", "casual office", "social gathering"],
    characteristics: ["neat", "presentable", "versatile"],
  },
  {
    name: "Business Casual",
    description:
      "Professional but not overly formal, perfect for modern offices",
    formalityRange: [3, 4],
    occasions: ["office", "meeting", "presentation", "business lunch"],
    characteristics: ["professional", "polished", "appropriate"],
  },
  {
    name: "Business Professional",
    description: "Formal business attire suitable for traditional offices",
    formalityRange: [4, 5],
    occasions: ["formal meeting", "interview", "conference", "business event"],
    characteristics: ["formal", "refined", "structured"],
  },
  {
    name: "Formal",
    description: "Elegant attire for special occasions and formal events",
    formalityRange: [5, 5],
    occasions: ["wedding", "gala", "formal dinner", "ceremony"],
    characteristics: ["elegant", "sophisticated", "luxurious"],
  },
];

// Helper Functions
function getSeasonFromMonth(): "spring" | "summer" | "fall" | "winter" {
  const month = new Date().getMonth();
  if (month >= 2 && month <= 4) return "spring";
  if (month >= 5 && month <= 7) return "summer";
  if (month >= 8 && month <= 10) return "fall";
  return "winter";
}

function calculateLayerNeed(
  temp: number,
  sensitivity: number,
): "minimal" | "moderate" | "maximum" {
  const adjustedTemp = temp - (sensitivity - 50) * 0.2;
  if (adjustedTemp > 75) return "minimal";
  if (adjustedTemp > 55) return "moderate";
  return "maximum";
}

function getColorPalette(season: string, style: string[]): string[] {
  // Define base colors for each season
  const seasonalColors = {
    spring: ["pastel", "light", "bright"],
    summer: ["bright", "light", "vibrant"],
    fall: ["warm", "earth", "rich"],
    winter: ["dark", "deep", "cool"],
  };

  // Additional color logic based on style preferences
  return seasonalColors[season];
}

function calculateWarmthScore(
  temp: number,
  windSpeed: number,
  precipitation: string,
): number {
  let score = temp;
  score -= windSpeed * 0.5;
  if (precipitation !== "none") score -= 5;
  return score;
}

// Main Recommendation Functions
export function generateOutfitRecommendation(
  weather: WeatherConditions,
  preferences: StylePreferences,
): OutfitSuggestion {
  // Temperature adjustment based on sensitivity
  const sensitivityAdjustment = (preferences.temperatureSensitivity - 50) * 0.2;
  const adjustedTemp = weather.temperature - sensitivityAdjustment;

  // Determine layering needs
  const layeringNeed = calculateLayerNeed(
    adjustedTemp,
    preferences.temperatureSensitivity,
  );

  // Get appropriate color palette
  const colorPalette = getColorPalette(
    weather.season,
    preferences.preferredStyle,
  );

  // Filter functions
  const isWeatherAppropriate = (item: ClothingItem) => {
    return (
      adjustedTemp >= item.minTemp &&
      adjustedTemp <= item.maxTemp &&
      (!weather.isRaining ||
        item.rainSuitable ||
        !preferences.prioritizeRainProtection) &&
      (!weather.windSpeed > 10 ||
        item.windSuitable ||
        !preferences.prioritizeWindProtection) &&
      (!weather.isSnowing || item.snowSuitable) &&
      item.season.includes(weather.season)
    );
  };

  const isStyleAppropriate = (item: ClothingItem) => {
    return (
      (item.gender === "unisex" || item.gender === preferences.gender) &&
      Math.abs(item.formalityLevel - preferences.formalityPreference) <= 1 &&
      (preferences.sustainabilityPreference
        ? item.sustainability?.ecoFriendly
        : true) &&
      !preferences.avoidedMaterials.includes(item.material) &&
      item.occasions.some((occ) => preferences.occasionType.includes(occ))
    );
  };

  // Filter clothing items
  const recommendation: OutfitRecommendation = {
    baseLayers: clothingDatabase.filter(
      (item) =>
        item.layer === "base" &&
        isWeatherAppropriate(item) &&
        isStyleAppropriate(item),
    ),
    midLayers: clothingDatabase.filter(
      (item) =>
        item.layer === "mid" &&
        isWeatherAppropriate(item) &&
        isStyleAppropriate(item),
    ),
    outerLayers: clothingDatabase.filter(
      (item) =>
        item.layer === "outer" &&
        isWeatherAppropriate(item) &&
        isStyleAppropriate(item),
    ),
    bottoms: clothingDatabase.filter(
      (item) =>
        item.type === "bottom" &&
        isWeatherAppropriate(item) &&
        isStyleAppropriate(item),
    ),
    footwear: clothingDatabase.filter(
      (item) =>
        item.type === "footwear" &&
        isWeatherAppropriate(item) &&
        isStyleAppropriate(item),
    ),
    accessories: clothingDatabase.filter(
      (item) =>
        item.type === "accessory" &&
        isWeatherAppropriate(item) &&
        isStyleAppropriate(item),
    ),
  };

  // Generate style notes
  const styleNotes = generateStyleNotes(weather, preferences, recommendation);

  // Calculate ratings
  const weatherSuitability = calculateWeatherSuitability(
    weather,
    recommendation,
  );
  const comfortRating = calculateComfortRating(
    weather,
    preferences,
    recommendation,
  );

  // Prepare final suggestion
  const suggestion: OutfitSuggestion = {
    outfit: recommendation,
    styleNotes,
    careInstructions: generateCareInstructions(recommendation),
    alternatives: generateAlternatives(weather, preferences, recommendation),
    occasion: preferences.occasionType,
    formality: preferences.formalityPreference,
    weatherSuitability,
    comfortRating,
    colorPalette,
    layeringTips: generateLayeringTips(weather, layeringNeed),
    weatherNotes: generateWeatherNotes(weather),
  };

  return suggestion;
}

// Helper functions for generating various aspects of the suggestion
function generateStyleNotes(
  weather: WeatherConditions,
  preferences: StylePreferences,
  outfit: OutfitRecommendation,
): string[] {
  const notes = [];

  // Add weather-specific style notes
  if (weather.isRaining) {
    notes.push("Consider water-resistant fabrics");
  }
  if (weather.uvIndex > 7) {
    notes.push("Don't forget UV protection");
  }

  // Add occasion-specific notes
  const styleProfile = styleProfiles.find(
    (profile) =>
      profile.formalityRange[0] <= preferences.formalityPreference &&
      profile.formalityRange[1] >= preferences.formalityPreference,
  );
  if (styleProfile) {
    notes.push(`Style suitable for ${styleProfile.name} occasions`);
  }

  return notes;
}

function generateCareInstructions(outfit: OutfitRecommendation): string[] {
  const instructions = new Set<string>();

  Object.values(outfit)
    .flat()
    .forEach((item) => {
      if (item.careInstructions) {
        instructions.add(item.careInstructions);
      }
    });

  return Array.from(instructions);
}

function generateAlternatives(
  weather: WeatherConditions,
  preferences: StylePreferences,
  mainOutfit: OutfitRecommendation,
): Partial<OutfitRecommendation> {
  // Simplified alternative generation logic
  return {
    baseLayers: mainOutfit.baseLayers.slice(1),
    footwear: mainOutfit.footwear.slice(1),
  };
}

// Add these functions to outfitLogic.ts

function calculateWeatherSuitability(
  weather: WeatherConditions,
  outfit: OutfitRecommendation,
): number {
  let score = 100;
  const allItems = [
    ...outfit.baseLayers,
    ...outfit.midLayers,
    ...outfit.outerLayers,
    ...outfit.bottoms,
    ...outfit.footwear,
    ...outfit.accessories,
  ];

  // Temperature Suitability (40% of total score)
  let temperatureSuitability = 40;
  for (const item of allItems) {
    if (weather.temperature < item.minTemp) {
      temperatureSuitability -= 5; // Too cold for this item
    } else if (weather.temperature > item.maxTemp) {
      temperatureSuitability -= 5; // Too warm for this item
    }
  }
  temperatureSuitability = Math.max(0, temperatureSuitability);
  score = (score * temperatureSuitability) / 40;

  // Rain Protection (20% of total score)
  if (weather.isRaining || weather.precipitation !== "none") {
    let rainProtection = 20;
    const needsRainProtection = weather.precipitation === "heavy" ? 2 : 1;
    let hasRainProtection = 0;

    // Check outer layers and accessories for rain protection
    const outerItems = [...outfit.outerLayers, ...outfit.accessories];
    for (const item of outerItems) {
      if (item.rainSuitable) {
        hasRainProtection++;
      }
    }

    if (hasRainProtection < needsRainProtection) {
      rainProtection -= 10 * (needsRainProtection - hasRainProtection);
    }

    // Check footwear for rain protection
    if (!outfit.footwear.some((item) => item.rainSuitable)) {
      rainProtection -= 5;
    }

    rainProtection = Math.max(0, rainProtection);
    score = (score * rainProtection) / 20;
  }

  // Wind Protection (20% of total score)
  if (weather.windSpeed > 10) {
    let windProtection = 20;
    const needsWindProtection = weather.windSpeed > 20 ? 2 : 1;
    let hasWindProtection = 0;

    // Check outer layers for wind protection
    for (const item of outfit.outerLayers) {
      if (item.windSuitable) {
        hasWindProtection++;
      }
    }

    if (hasWindProtection < needsWindProtection) {
      windProtection -= 10 * (needsWindProtection - hasWindProtection);
    }

    windProtection = Math.max(0, windProtection);
    score = (score * windProtection) / 20;
  }

  // Snow Protection (10% of total score)
  if (weather.isSnowing) {
    let snowProtection = 10;
    if (!outfit.outerLayers.some((item) => item.snowSuitable)) {
      snowProtection -= 5;
    }
    if (!outfit.footwear.some((item) => item.snowSuitable)) {
      snowProtection -= 5;
    }
    snowProtection = Math.max(0, snowProtection);
    score = (score * snowProtection) / 10;
  }

  // UV Protection (10% of total score)
  if (weather.uvIndex > 7) {
    let uvProtection = 10;
    if (!outfit.outerLayers.some((item) => item.uvProtection)) {
      uvProtection -= 5;
    }
    if (!outfit.accessories.some((item) => item.uvProtection)) {
      uvProtection -= 5;
    }
    uvProtection = Math.max(0, uvProtection);
    score = (score * uvProtection) / 10;
  }

  return Math.round(score);
}

function calculateComfortRating(
  weather: WeatherConditions,
  preferences: StylePreferences,
  outfit: OutfitRecommendation,
): number {
  let score = 100;
  const allItems = [
    ...outfit.baseLayers,
    ...outfit.midLayers,
    ...outfit.outerLayers,
    ...outfit.bottoms,
    ...outfit.footwear,
    ...outfit.accessories,
  ];

  // Temperature Comfort (35% of total score)
  let temperatureComfort = 35;
  const adjustedTemp =
    weather.feelsLike - (preferences.temperatureSensitivity - 50) * 0.2;
  const desiredLayers =
    preferences.layeringPreference === "minimal"
      ? 1
      : preferences.layeringPreference === "moderate"
        ? 2
        : 3;

  // Check if we have appropriate layers for the temperature
  const actualLayers =
    outfit.baseLayers.length +
    outfit.midLayers.length +
    outfit.outerLayers.length;
  if (Math.abs(actualLayers - desiredLayers) > 0) {
    temperatureComfort -= 5 * Math.abs(actualLayers - desiredLayers);
  }

  // Check if each layer is appropriate for the temperature
  for (const item of allItems) {
    const tempRange = item.maxTemp - item.minTemp;
    const idealTemp = (item.maxTemp + item.minTemp) / 2;
    const tempDiff = Math.abs(adjustedTemp - idealTemp);
    if (tempDiff > tempRange / 2) {
      temperatureComfort -= 5;
    }
  }

  temperatureComfort = Math.max(0, temperatureComfort);
  score = (score * temperatureComfort) / 35;

  // Material Comfort (25% of total score)
  let materialComfort = 25;
  for (const item of allItems) {
    // Check for avoided materials
    if (preferences.avoidedMaterials.includes(item.material)) {
      materialComfort -= 5;
    }

    // Check breathability for warm weather
    if (
      weather.temperature > 75 &&
      item.breathability &&
      item.breathability < 3
    ) {
      materialComfort -= 3;
    }

    // Check warmth rating for cold weather
    if (
      weather.temperature < 45 &&
      item.warmthRating &&
      item.warmthRating < 3
    ) {
      materialComfort -= 3;
    }
  }
  materialComfort = Math.max(0, materialComfort);
  score = (score * materialComfort) / 25;

  // Style Comfort (20% of total score)
  let styleComfort = 20;
  for (const item of allItems) {
    // Check formality match
    const formalityDiff = Math.abs(
      item.formalityLevel - preferences.formalityPreference,
    );
    if (formalityDiff > 1) {
      styleComfort -= 3;
    }

    // Check style preferences
    if (
      !item.styles.some((style) => preferences.preferredStyle.includes(style))
    ) {
      styleComfort -= 2;
    }
  }
  styleComfort = Math.max(0, styleComfort);
  score = (score * styleComfort) / 20;

  // Activity Suitability (20% of total score)
  let activitySuitability = 20;
  for (const item of allItems) {
    if (!item.occasions.includes(preferences.occasionType)) {
      activitySuitability -= 4;
    }
  }
  activitySuitability = Math.max(0, activitySuitability);
  score = (score * activitySuitability) / 20;

  // Additional comfort factors
  if (preferences.sustainabilityPreference) {
    let sustainabilityScore = 0;
    let sustainableItems = 0;
    for (const item of allItems) {
      if (item.sustainability?.ecoFriendly) {
        sustainableItems++;
      }
    }
    const sustainabilityRatio = sustainableItems / allItems.length;
    score *= 0.9 + sustainabilityRatio * 0.1; // Up to 10% bonus for sustainability
  }

  return Math.round(score);
}

function generateLayeringTips(
  weather: WeatherConditions,
  layeringNeed: "minimal" | "moderate" | "maximum",
): string[] {
  const tips = [];

  switch (layeringNeed) {
    case "minimal":
      tips.push("Light, breathable layers recommended");
      break;
    case "moderate":
      tips.push("Consider adding a light outer layer for variable conditions");
      break;
    case "maximum":
      tips.push("Multiple warm layers recommended for cold conditions");
      break;
  }

  return tips;
}

function generateWeatherNotes(weather: WeatherConditions): string[] {
  const notes = [];

  if (weather.uvIndex > 7) {
    notes.push("High UV index - sun protection recommended");
  }
  if (weather.windSpeed > 15) {
    notes.push("Strong winds expected - secure loose items");
  }
  if (weather.precipitation !== "none") {
    notes.push(`${weather.precipitation} precipitation expected`);
  }

  return notes;
}

// Continuation of outfitLogic.ts

export const clothingDatabase: ClothingItem[] = [
  // Men's Base Layers
  {
    id: "m-base-1",
    name: "Merino Wool Base Layer",
    type: "top",
    subtype: "thermal",
    minTemp: -20,
    maxTemp: 45,
    formalityLevel: 1,
    rainSuitable: true,
    windSuitable: true,
    snowSuitable: true,
    gender: "male",
    layer: "base",
    season: ["fall", "winter"],
    occasions: ["outdoor", "sports", "casual"],
    styles: ["athletic", "practical"],
    material: "Merino Wool",
    careInstructions: "Machine wash cold, lay flat to dry",
    matchesWith: ["m-mid-1", "m-outer-1", "m-bottom-1"],
    colors: ["black", "navy", "gray"],
    description: "Premium merino wool base layer for cold weather activities",
    breathability: 5,
    warmthRating: 4,
    sustainability: {
      ecoFriendly: true,
      recyclable: true,
      organicMaterials: true,
    },
  },
  {
    id: "m-base-2",
    name: "Performance Tech Tee",
    type: "top",
    subtype: "t-shirt",
    minTemp: 60,
    maxTemp: 95,
    formalityLevel: 2,
    rainSuitable: true,
    windSuitable: true,
    snowSuitable: false,
    gender: "male",
    layer: "base",
    season: ["spring", "summer"],
    occasions: ["sports", "casual", "outdoor"],
    styles: ["athletic", "modern"],
    material: "Moisture-wicking Polyester",
    careInstructions: "Machine wash cold, tumble dry low",
    matchesWith: ["m-bottom-2", "m-outer-2"],
    colors: ["white", "black", "blue", "gray"],
    description: "Moisture-wicking performance t-shirt",
    breathability: 5,
    warmthRating: 1,
    uvProtection: true,
  },

  // Women's Base Layers
  {
    id: "w-base-1",
    name: "Silk-blend Camisole",
    type: "top",
    subtype: "camisole",
    minTemp: 65,
    maxTemp: 95,
    formalityLevel: 3,
    rainSuitable: true,
    windSuitable: false,
    snowSuitable: false,
    gender: "female",
    layer: "base",
    season: ["spring", "summer"],
    occasions: ["work", "evening", "formal"],
    styles: ["elegant", "feminine"],
    material: "Silk Blend",
    careInstructions: "Hand wash cold, lay flat to dry",
    matchesWith: ["w-outer-1", "w-bottom-1"],
    colors: ["ivory", "black", "navy", "blush"],
    description: "Luxurious silk-blend camisole for layering or wearing alone",
    breathability: 5,
    warmthRating: 1,
  },
  {
    id: "w-base-2",
    name: "Thermal Turtleneck",
    type: "top",
    subtype: "turtleneck",
    minTemp: 30,
    maxTemp: 60,
    formalityLevel: 3,
    rainSuitable: true,
    windSuitable: true,
    snowSuitable: true,
    gender: "female",
    layer: "base",
    season: ["fall", "winter"],
    occasions: ["work", "casual", "outdoor"],
    styles: ["classic", "practical"],
    material: "Cotton Blend",
    careInstructions: "Machine wash cold, tumble dry low",
    matchesWith: ["w-outer-2", "w-bottom-2"],
    colors: ["black", "white", "burgundy", "navy"],
    description: "Warm and stylish turtleneck base layer",
    breathability: 3,
    warmthRating: 4,
  },

  // Men's Mid Layers
  {
    id: "m-mid-1",
    name: "Cashmere Sweater",
    type: "top",
    subtype: "sweater",
    minTemp: 35,
    maxTemp: 65,
    formalityLevel: 4,
    rainSuitable: false,
    windSuitable: true,
    snowSuitable: true,
    gender: "male",
    layer: "mid",
    season: ["fall", "winter"],
    occasions: ["work", "formal", "evening"],
    styles: ["luxury", "classic"],
    material: "Cashmere",
    careInstructions: "Dry clean only",
    matchesWith: ["m-bottom-3", "m-outer-3"],
    colors: ["charcoal", "navy", "camel", "burgundy"],
    description: "Premium cashmere sweater for sophisticated occasions",
    breathability: 4,
    warmthRating: 3,
    sustainability: {
      ecoFriendly: true,
      recyclable: false,
      organicMaterials: true,
    },
  },

  // Women's Mid Layers
  {
    id: "w-mid-1",
    name: "Wool Blend Cardigan",
    type: "top",
    subtype: "cardigan",
    minTemp: 40,
    maxTemp: 65,
    formalityLevel: 3,
    rainSuitable: true,
    windSuitable: true,
    snowSuitable: true,
    gender: "female",
    layer: "mid",
    season: ["fall", "winter"],
    occasions: ["work", "casual", "evening"],
    styles: ["classic", "feminine"],
    material: "Wool Blend",
    careInstructions: "Hand wash cold, lay flat to dry",
    matchesWith: ["w-base-1", "w-bottom-2"],
    colors: ["gray", "navy", "cream", "black"],
    description: "Versatile wool blend cardigan for multiple occasions",
    breathability: 3,
    warmthRating: 3,
  },

  // Men's Outerwear
  {
    id: "m-outer-1",
    name: "Waterproof Shell Jacket",
    type: "outerwear",
    subtype: "jacket",
    minTemp: 35,
    maxTemp: 65,
    formalityLevel: 2,
    rainSuitable: true,
    windSuitable: true,
    snowSuitable: true,
    gender: "male",
    layer: "outer",
    season: ["spring", "fall"],
    occasions: ["outdoor", "casual", "sports"],
    styles: ["technical", "modern"],
    material: "Gore-Tex",
    careInstructions: "Machine wash cold, tumble dry low",
    matchesWith: ["m-base-1", "m-mid-1"],
    colors: ["black", "navy", "gray"],
    description: "Weatherproof shell jacket for outdoor activities",
    waterResistance: "waterproof",
    breathability: 4,
    warmthRating: 2,
  },

  // Women's Outerwear
  {
    id: "w-outer-1",
    name: "Trench Coat",
    type: "outerwear",
    subtype: "coat",
    minTemp: 40,
    maxTemp: 65,
    formalityLevel: 4,
    rainSuitable: true,
    windSuitable: true,
    snowSuitable: false,
    gender: "female",
    layer: "outer",
    season: ["spring", "fall"],
    occasions: ["work", "formal", "evening"],
    styles: ["classic", "elegant"],
    material: "Cotton Blend",
    careInstructions: "Dry clean only",
    matchesWith: ["w-base-1", "w-mid-1"],
    colors: ["beige", "black", "navy"],
    description: "Classic trench coat for sophisticated style",
    waterResistance: "water-resistant",
    breathability: 3,
    warmthRating: 2,
  },

  // Men's Bottoms
  {
    id: "m-bottom-1",
    name: "Wool Dress Pants",
    type: "bottom",
    subtype: "pants",
    minTemp: 30,
    maxTemp: 75,
    formalityLevel: 5,
    rainSuitable: true,
    windSuitable: true,
    snowSuitable: true,
    gender: "male",
    layer: "none",
    season: ["fall", "winter", "spring"],
    occasions: ["work", "formal", "evening"],
    styles: ["formal", "classic"],
    material: "Wool Blend",
    careInstructions: "Dry clean only",
    matchesWith: ["m-mid-1", "m-outer-1"],
    colors: ["charcoal", "navy", "black"],
    description: "Classic wool dress pants for formal occasions",
    breathability: 3,
    warmthRating: 3,
  },

  // Women's Bottoms
  {
    id: "w-bottom-1",
    name: "A-Line Skirt",
    type: "bottom",
    subtype: "skirt",
    minTemp: 60,
    maxTemp: 85,
    formalityLevel: 4,
    rainSuitable: true,
    windSuitable: false,
    snowSuitable: false,
    gender: "female",
    layer: "none",
    season: ["spring", "summer"],
    occasions: ["work", "formal", "evening"],
    styles: ["feminine", "classic"],
    material: "Cotton Blend",
    careInstructions: "Machine wash cold, line dry",
    matchesWith: ["w-base-1", "w-mid-1"],
    colors: ["black", "navy", "gray", "beige"],
    description: "Classic A-line skirt for professional settings",
    breathability: 4,
    warmthRating: 2,
  },

  // Footwear
  {
    id: "m-foot-1",
    name: "Leather Oxford Shoes",
    type: "footwear",
    subtype: "dress shoes",
    minTemp: 20,
    maxTemp: 85,
    formalityLevel: 5,
    rainSuitable: false,
    windSuitable: true,
    snowSuitable: false,
    gender: "male",
    layer: "none",
    season: ["spring", "summer", "fall", "winter"],
    occasions: ["work", "formal", "evening"],
    styles: ["formal", "classic"],
    material: "Leather",
    careInstructions: "Polish regularly, use shoe trees",
    matchesWith: ["m-bottom-1"],
    colors: ["black", "brown"],
    description: "Classic leather oxford shoes for formal occasions",
    waterResistance: "none",
  },

  // Accessories
  {
    id: "uni-acc-1",
    name: "Wool Scarf",
    type: "accessory",
    subtype: "scarf",
    minTemp: -20,
    maxTemp: 50,
    formalityLevel: 3,
    rainSuitable: true,
    windSuitable: true,
    snowSuitable: true,
    gender: "unisex",
    layer: "none",
    season: ["fall", "winter"],
    occasions: ["casual", "work", "outdoor"],
    styles: ["classic", "practical"],
    material: "Wool",
    careInstructions: "Hand wash cold, lay flat to dry",
    matchesWith: ["m-outer-1", "w-outer-1"],
    colors: ["gray", "navy", "black", "camel"],
    description: "Warm wool scarf for cold weather",
    warmthRating: 4,
  },
];

export type {
  StyleProfile,
  ClothingItem,
  WeatherConditions,
  StylePreferences,
  OutfitRecommendation,
  OutfitSuggestion,
};

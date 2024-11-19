// src/lib/outfitLogic.ts

interface ClothingItem {
  name: string;
  type: "top" | "bottom" | "outerwear" | "footwear" | "accessory";
  minTemp: number; // Minimum temperature in Fahrenheit
  maxTemp: number; // Maximum temperature in Fahrenheit
  formalityLevel: number; // 1-5 (casual to formal)
  rainSuitable: boolean;
  windSuitable: boolean;
  snowSuitable: boolean;
  gender: "male" | "female" | "unisex";
  layer: "base" | "mid" | "outer" | "none";
}

// Comprehensive clothing database
export const clothingDatabase: ClothingItem[] = [
  // Base Layers - Tops
  {
    name: "T-Shirt",
    type: "top",
    minTemp: 60,
    maxTemp: 100,
    formalityLevel: 1,
    rainSuitable: true,
    windSuitable: true,
    snowSuitable: true,
    gender: "unisex",
    layer: "base",
  },
  {
    name: "Long Sleeve T-Shirt",
    type: "top",
    minTemp: 45,
    maxTemp: 70,
    formalityLevel: 1,
    rainSuitable: true,
    windSuitable: true,
    snowSuitable: true,
    gender: "unisex",
    layer: "base",
  },
  {
    name: "Thermal Undershirt",
    type: "top",
    minTemp: -20,
    maxTemp: 45,
    formalityLevel: 1,
    rainSuitable: true,
    windSuitable: true,
    snowSuitable: true,
    gender: "unisex",
    layer: "base",
  },
  {
    name: "Tank Top",
    type: "top",
    minTemp: 75,
    maxTemp: 100,
    formalityLevel: 1,
    rainSuitable: true,
    windSuitable: false,
    snowSuitable: false,
    gender: "unisex",
    layer: "base",
  },

  // Mid Layers
  {
    name: "Cotton Shirt",
    type: "top",
    minTemp: 60,
    maxTemp: 85,
    formalityLevel: 3,
    rainSuitable: true,
    windSuitable: true,
    snowSuitable: false,
    gender: "unisex",
    layer: "mid",
  },
  {
    name: "Dress Shirt",
    type: "top",
    minTemp: 55,
    maxTemp: 85,
    formalityLevel: 4,
    rainSuitable: true,
    windSuitable: true,
    snowSuitable: false,
    gender: "unisex",
    layer: "mid",
  },
  {
    name: "Sweater",
    type: "top",
    minTemp: 30,
    maxTemp: 65,
    formalityLevel: 3,
    rainSuitable: true,
    windSuitable: true,
    snowSuitable: true,
    gender: "unisex",
    layer: "mid",
  },
  {
    name: "Cardigan",
    type: "top",
    minTemp: 45,
    maxTemp: 70,
    formalityLevel: 3,
    rainSuitable: true,
    windSuitable: true,
    snowSuitable: false,
    gender: "unisex",
    layer: "mid",
  },

  // Outerwear
  {
    name: "Light Jacket",
    type: "outerwear",
    minTemp: 55,
    maxTemp: 70,
    formalityLevel: 2,
    rainSuitable: false,
    windSuitable: true,
    snowSuitable: false,
    gender: "unisex",
    layer: "outer",
  },
  {
    name: "Rain Jacket",
    type: "outerwear",
    minTemp: 40,
    maxTemp: 75,
    formalityLevel: 2,
    rainSuitable: true,
    windSuitable: true,
    snowSuitable: false,
    gender: "unisex",
    layer: "outer",
  },
  {
    name: "Winter Coat",
    type: "outerwear",
    minTemp: -20,
    maxTemp: 45,
    formalityLevel: 3,
    rainSuitable: true,
    windSuitable: true,
    snowSuitable: true,
    gender: "unisex",
    layer: "outer",
  },
  {
    name: "Blazer",
    type: "outerwear",
    minTemp: 55,
    maxTemp: 80,
    formalityLevel: 5,
    rainSuitable: false,
    windSuitable: false,
    snowSuitable: false,
    gender: "unisex",
    layer: "outer",
  },

  // Bottoms
  {
    name: "Shorts",
    type: "bottom",
    minTemp: 70,
    maxTemp: 100,
    formalityLevel: 1,
    rainSuitable: true,
    windSuitable: false,
    snowSuitable: false,
    gender: "unisex",
    layer: "none",
  },
  {
    name: "Jeans",
    type: "bottom",
    minTemp: 30,
    maxTemp: 75,
    formalityLevel: 2,
    rainSuitable: true,
    windSuitable: true,
    snowSuitable: true,
    gender: "unisex",
    layer: "none",
  },
  {
    name: "Dress Pants",
    type: "bottom",
    minTemp: 30,
    maxTemp: 85,
    formalityLevel: 4,
    rainSuitable: true,
    windSuitable: true,
    snowSuitable: false,
    gender: "unisex",
    layer: "none",
  },
  {
    name: "Skirt",
    type: "bottom",
    minTemp: 65,
    maxTemp: 90,
    formalityLevel: 3,
    rainSuitable: true,
    windSuitable: false,
    snowSuitable: false,
    gender: "female",
    layer: "none",
  },

  // Footwear
  {
    name: "Sneakers",
    type: "footwear",
    minTemp: 45,
    maxTemp: 100,
    formalityLevel: 1,
    rainSuitable: false,
    windSuitable: true,
    snowSuitable: false,
    gender: "unisex",
    layer: "none",
  },
  {
    name: "Boots",
    type: "footwear",
    minTemp: -20,
    maxTemp: 60,
    formalityLevel: 2,
    rainSuitable: true,
    windSuitable: true,
    snowSuitable: true,
    gender: "unisex",
    layer: "none",
  },
  {
    name: "Dress Shoes",
    type: "footwear",
    minTemp: 30,
    maxTemp: 90,
    formalityLevel: 5,
    rainSuitable: false,
    windSuitable: true,
    snowSuitable: false,
    gender: "unisex",
    layer: "none",
  },
  {
    name: "Sandals",
    type: "footwear",
    minTemp: 70,
    maxTemp: 100,
    formalityLevel: 1,
    rainSuitable: false,
    windSuitable: false,
    snowSuitable: false,
    gender: "unisex",
    layer: "none",
  },

  // Accessories
  {
    name: "Scarf",
    type: "accessory",
    minTemp: -20,
    maxTemp: 50,
    formalityLevel: 2,
    rainSuitable: true,
    windSuitable: true,
    snowSuitable: true,
    gender: "unisex",
    layer: "none",
  },
  {
    name: "Gloves",
    type: "accessory",
    minTemp: -20,
    maxTemp: 45,
    formalityLevel: 2,
    rainSuitable: true,
    windSuitable: true,
    snowSuitable: true,
    gender: "unisex",
    layer: "none",
  },
  {
    name: "Umbrella",
    type: "accessory",
    minTemp: -20,
    maxTemp: 100,
    formalityLevel: 3,
    rainSuitable: true,
    windSuitable: false,
    snowSuitable: false,
    gender: "unisex",
    layer: "none",
  },
  {
    name: "Sunglasses",
    type: "accessory",
    minTemp: 60,
    maxTemp: 100,
    formalityLevel: 2,
    rainSuitable: false,
    windSuitable: true,
    snowSuitable: false,
    gender: "unisex",
    layer: "none",
  },
];

interface OutfitPreferences {
  gender: "male" | "female";
  formalityPreference: number; // 1-5
  temperatureSensitivity: number; // 0-100
  prioritizeRainProtection: boolean;
  prioritizeWindProtection: boolean;
}

interface WeatherConditions {
  temperature: number;
  isRaining: boolean;
  isSnowing: boolean;
  windSpeed: number;
  timeOfDay: "morning" | "afternoon" | "evening" | "night";
}

export interface OutfitRecommendation {
  baseLayers: ClothingItem[];
  midLayers: ClothingItem[];
  outerLayers: ClothingItem[];
  bottoms: ClothingItem[];
  footwear: ClothingItem[];
  accessories: ClothingItem[];
}

export function generateOutfitRecommendation(
  weather: WeatherConditions,
  preferences: OutfitPreferences,
): OutfitRecommendation {
  // Adjust temperature based on sensitivity
  const sensitivityAdjustment = (preferences.temperatureSensitivity - 50) * 0.2;
  const adjustedTemp = weather.temperature - sensitivityAdjustment;

  // Filter functions for clothing selection
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
      (!weather.isSnowing || item.snowSuitable)
    );
  };

  const isGenderAppropriate = (item: ClothingItem) => {
    return item.gender === "unisex" || item.gender === preferences.gender;
  };

  const isFormalityAppropriate = (item: ClothingItem) => {
    return Math.abs(item.formalityLevel - preferences.formalityPreference) <= 1;
  };

  // Select clothing items
  const recommendation: OutfitRecommendation = {
    baseLayers: clothingDatabase.filter(
      (item) =>
        item.layer === "base" &&
        isWeatherAppropriate(item) &&
        isGenderAppropriate(item) &&
        isFormalityAppropriate(item),
    ),
    midLayers: clothingDatabase.filter(
      (item) =>
        item.layer === "mid" &&
        isWeatherAppropriate(item) &&
        isGenderAppropriate(item) &&
        isFormalityAppropriate(item),
    ),
    outerLayers: clothingDatabase.filter(
      (item) =>
        item.layer === "outer" &&
        isWeatherAppropriate(item) &&
        isGenderAppropriate(item) &&
        isFormalityAppropriate(item),
    ),
    bottoms: clothingDatabase.filter(
      (item) =>
        item.type === "bottom" &&
        isWeatherAppropriate(item) &&
        isGenderAppropriate(item) &&
        isFormalityAppropriate(item),
    ),
    footwear: clothingDatabase.filter(
      (item) =>
        item.type === "footwear" &&
        isWeatherAppropriate(item) &&
        isGenderAppropriate(item) &&
        isFormalityAppropriate(item),
    ),
    accessories: clothingDatabase.filter(
      (item) =>
        item.type === "accessory" &&
        isWeatherAppropriate(item) &&
        isGenderAppropriate(item),
    ),
  };

  return recommendation;
}

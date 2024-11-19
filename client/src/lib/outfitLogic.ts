interface ClothingItem {
  name: string;
  type: "top" | "bottom" | "outerwear" | "footwear" | "accessory";
  minTemp: number;
  maxTemp: number;
  formalityLevel: number; // 1-5
  rainSuitable: boolean;
  windSuitable: boolean;
  snowSuitable: boolean;
  gender: "male" | "female" | "unisex";
  layer: "base" | "mid" | "outer" | "none";
  style: "casual" | "streetwear" | "business" | "formal" | "athletic";
}

// Comprehensive clothing database
export const clothingDatabase: ClothingItem[] = [
  // Base Layer Tops
  {
    name: "Athletic T-Shirt",
    type: "top",
    minTemp: 60,
    maxTemp: 100,
    formalityLevel: 1,
    rainSuitable: true,
    windSuitable: true,
    snowSuitable: false,
    gender: "unisex",
    layer: "base",
    style: "athletic",
  },
  {
    name: "Basic Cotton T-Shirt",
    type: "top",
    minTemp: 60,
    maxTemp: 100,
    formalityLevel: 1,
    rainSuitable: true,
    windSuitable: true,
    snowSuitable: false,
    gender: "unisex",
    layer: "base",
    style: "casual",
  },
  {
    name: "Long Sleeve Athletic Shirt",
    type: "top",
    minTemp: 45,
    maxTemp: 70,
    formalityLevel: 1,
    rainSuitable: true,
    windSuitable: true,
    snowSuitable: true,
    gender: "unisex",
    layer: "base",
    style: "athletic",
  },
  {
    name: "Basic Long Sleeve T-Shirt",
    type: "top",
    minTemp: 45,
    maxTemp: 70,
    formalityLevel: 1,
    rainSuitable: true,
    windSuitable: true,
    snowSuitable: true,
    gender: "unisex",
    layer: "base",
    style: "casual",
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
    style: "casual",
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
    style: "casual",
  },
  {
    name: "Athletic Tank Top",
    type: "top",
    minTemp: 75,
    maxTemp: 100,
    formalityLevel: 1,
    rainSuitable: true,
    windSuitable: false,
    snowSuitable: false,
    gender: "unisex",
    layer: "base",
    style: "athletic",
  },

  // Mid Layer Tops
  {
    name: "Casual Button-Up Shirt",
    type: "top",
    minTemp: 60,
    maxTemp: 85,
    formalityLevel: 3,
    rainSuitable: true,
    windSuitable: true,
    snowSuitable: false,
    gender: "unisex",
    layer: "mid",
    style: "casual",
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
    style: "formal",
  },
  {
    name: "Casual Sweater",
    type: "top",
    minTemp: 30,
    maxTemp: 65,
    formalityLevel: 2,
    rainSuitable: true,
    windSuitable: true,
    snowSuitable: true,
    gender: "unisex",
    layer: "mid",
    style: "casual",
  },
  {
    name: "Dress Sweater",
    type: "top",
    minTemp: 30,
    maxTemp: 65,
    formalityLevel: 3,
    rainSuitable: true,
    windSuitable: true,
    snowSuitable: true,
    gender: "unisex",
    layer: "mid",
    style: "business",
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
    style: "business",
  },
  {
    name: "Hoodie",
    type: "top",
    minTemp: 40,
    maxTemp: 70,
    formalityLevel: 1,
    rainSuitable: true,
    windSuitable: true,
    snowSuitable: true,
    gender: "unisex",
    layer: "mid",
    style: "casual",
  },
  {
    name: "Blouse",
    type: "top",
    minTemp: 60,
    maxTemp: 85,
    formalityLevel: 3,
    rainSuitable: true,
    windSuitable: true,
    snowSuitable: false,
    gender: "female",
    layer: "mid",
    style: "business",
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
    style: "casual",
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
    style: "casual",
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
    style: "casual",
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
    style: "formal",
  },
  {
    name: "Denim Jacket",
    type: "outerwear",
    minTemp: 50,
    maxTemp: 75,
    formalityLevel: 2,
    rainSuitable: false,
    windSuitable: true,
    snowSuitable: false,
    gender: "unisex",
    layer: "outer",
    style: "casual",
  },
  {
    name: "Fleece Jacket",
    type: "outerwear",
    minTemp: 40,
    maxTemp: 65,
    formalityLevel: 1,
    rainSuitable: false,
    windSuitable: true,
    snowSuitable: true,
    gender: "unisex",
    layer: "outer",
    style: "casual",
  },

  // Bottoms
  {
    name: "Athletic Shorts",
    type: "bottom",
    minTemp: 70,
    maxTemp: 100,
    formalityLevel: 1,
    rainSuitable: true,
    windSuitable: false,
    snowSuitable: false,
    gender: "unisex",
    layer: "none",
    style: "athletic",
  },
  {
    name: "Casual Shorts",
    type: "bottom",
    minTemp: 70,
    maxTemp: 100,
    formalityLevel: 2,
    rainSuitable: true,
    windSuitable: false,
    snowSuitable: false,
    gender: "unisex",
    layer: "none",
    style: "casual",
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
    style: "casual",
  },
  {
    name: "Khaki Pants",
    type: "bottom",
    minTemp: 30,
    maxTemp: 85,
    formalityLevel: 3,
    rainSuitable: true,
    windSuitable: true,
    snowSuitable: false,
    gender: "unisex",
    layer: "none",
    style: "business",
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
    style: "formal",
  },
  {
    name: "Athletic Pants",
    type: "bottom",
    minTemp: 30,
    maxTemp: 75,
    formalityLevel: 1,
    rainSuitable: true,
    windSuitable: true,
    snowSuitable: true,
    gender: "unisex",
    layer: "none",
    style: "athletic",
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
    style: "business",
  },
  {
    name: "Dress",
    type: "bottom",
    minTemp: 65,
    maxTemp: 90,
    formalityLevel: 4,
    rainSuitable: true,
    windSuitable: false,
    snowSuitable: false,
    gender: "female",
    layer: "none",
    style: "formal",
  },

  // Footwear
  {
    name: "Athletic Sneakers",
    type: "footwear",
    minTemp: 45,
    maxTemp: 100,
    formalityLevel: 1,
    rainSuitable: false,
    windSuitable: true,
    snowSuitable: false,
    gender: "unisex",
    layer: "none",
    style: "athletic",
  },
  {
    name: "Casual Sneakers",
    type: "footwear",
    minTemp: 45,
    maxTemp: 100,
    formalityLevel: 2,
    rainSuitable: false,
    windSuitable: true,
    snowSuitable: false,
    gender: "unisex",
    layer: "none",
    style: "casual",
  },
  {
    name: "Winter Boots",
    type: "footwear",
    minTemp: -20,
    maxTemp: 45,
    formalityLevel: 2,
    rainSuitable: true,
    windSuitable: true,
    snowSuitable: true,
    gender: "unisex",
    layer: "none",
    style: "casual",
  },
  {
    name: "Rain Boots",
    type: "footwear",
    minTemp: 35,
    maxTemp: 75,
    formalityLevel: 1,
    rainSuitable: true,
    windSuitable: true,
    snowSuitable: false,
    gender: "unisex",
    layer: "none",
    style: "casual",
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
    style: "formal",
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
    style: "casual",
  },
  {
    name: "Flats",
    type: "footwear",
    minTemp: 50,
    maxTemp: 85,
    formalityLevel: 3,
    rainSuitable: false,
    windSuitable: true,
    snowSuitable: false,
    gender: "female",
    layer: "none",
    style: "business",
  },
  {
    name: "Heels",
    type: "footwear",
    minTemp: 50,
    maxTemp: 85,
    formalityLevel: 4,
    rainSuitable: false,
    windSuitable: false,
    snowSuitable: false,
    gender: "female",
    layer: "none",
    style: "formal",
  },

  // Accessories
  {
    name: "Winter Hat",
    type: "accessory",
    minTemp: -20,
    maxTemp: 45,
    formalityLevel: 1,
    rainSuitable: true,
    windSuitable: true,
    snowSuitable: true,
    gender: "unisex",
    layer: "none",
    style: "casual",
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
    style: "casual",
  },
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
    style: "casual",
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
    style: "casual",
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
    style: "casual",
  },
  {
    name: "Baseball Cap",
    type: "accessory",
    minTemp: 60,
    maxTemp: 100,
    formalityLevel: 1,
    rainSuitable: true,
    windSuitable: true,
    snowSuitable: false,
    gender: "unisex",
    layer: "none",
    style: "casual",
  },
  {
    name: "Belt",
    type: "accessory",
    minTemp: -20,
    maxTemp: 100,
    formalityLevel: 3,
    rainSuitable: true,
    windSuitable: true,
    snowSuitable: true,
    gender: "unisex",
    layer: "none",
    style: "business",
  },
];

interface WeatherConditions {
  temperature: number;
  isRaining: boolean;
  isSnowing: boolean;
  windSpeed: number;
  timeOfDay: "morning" | "afternoon" | "evening" | "night";
}

interface OutfitPreferences {
  gender: "male" | "female";
  formalityPreference: number; // 1-5
  temperatureSensitivity: number; // 0-100
  prioritizeRainProtection: boolean;
  prioritizeWindProtection: boolean;
  stylePreference: "casual" | "streetwear" | "business" | "formal" | "athletic";
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

  const isStyleAppropriate = (item: ClothingItem) => {
    // Allow some style flexibility while maintaining preference
    if (preferences.stylePreference === "formal") {
      return ["formal", "business"].includes(item.style);
    }
    if (preferences.stylePreference === "business") {
      return ["business", "formal", "casual"].includes(item.style);
    }
    return (
      item.style === preferences.stylePreference || item.style === "casual"
    );
  };

  // Select clothing items
  const recommendation: OutfitRecommendation = {
    baseLayers: clothingDatabase.filter(
      (item) =>
        item.layer === "base" &&
        isWeatherAppropriate(item) &&
        isGenderAppropriate(item) &&
        isFormalityAppropriate(item) &&
        isStyleAppropriate(item),
    ),
    midLayers: clothingDatabase.filter(
      (item) =>
        item.layer === "mid" &&
        isWeatherAppropriate(item) &&
        isGenderAppropriate(item) &&
        isFormalityAppropriate(item) &&
        isStyleAppropriate(item),
    ),
    outerLayers: clothingDatabase.filter(
      (item) =>
        item.layer === "outer" &&
        isWeatherAppropriate(item) &&
        isGenderAppropriate(item) &&
        isFormalityAppropriate(item) &&
        isStyleAppropriate(item),
    ),
    bottoms: clothingDatabase.filter(
      (item) =>
        item.type === "bottom" &&
        isWeatherAppropriate(item) &&
        isGenderAppropriate(item) &&
        isFormalityAppropriate(item) &&
        isStyleAppropriate(item),
    ),
    footwear: clothingDatabase.filter(
      (item) =>
        item.type === "footwear" &&
        isWeatherAppropriate(item) &&
        isGenderAppropriate(item) &&
        isFormalityAppropriate(item) &&
        isStyleAppropriate(item),
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

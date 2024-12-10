import { db } from "@/lib/firebase";
import {
  collection,
  addDoc,
  query,
  where,
  getDocs,
  orderBy,
  limit,
  Timestamp,
  doc,
  setDoc,
} from "firebase/firestore";
import type { OutfitRecommendation } from "@/lib/outfitLogic";

interface OutfitHistoryEntry {
  userId: string;
  outfit: OutfitRecommendation;
  weather: {
    temperature: number;
    isRaining: boolean;
    isSnowing: boolean;
    windSpeed: number;
  };
  date: Date;
  feedback?: "like" | "dislike";
}

export async function saveOutfitToHistory(
  userId: string,
  outfit: OutfitRecommendation,
  weatherData: WeatherResponse,
) {
  try {
    // Create a unique ID based on user and date
    const today = new Date();
    const dateString = today.toISOString().split("T")[0]; // YYYY-MM-DD format
    const docId = `${userId}_${dateString}`;

    const historyEntry: OutfitHistoryEntry = {
      userId,
      outfit,
      weather: {
        temperature: weatherData.temperature.current,
        isRaining: weatherData.weather.main.toLowerCase().includes("rain"),
        isSnowing: weatherData.weather.main.toLowerCase().includes("snow"),
        windSpeed: weatherData.wind.speed,
      },
      date: today,
    };

    // Use setDoc instead of addDoc to handle duplicates
    await setDoc(
      doc(db, "outfitHistory", docId),
      {
        ...historyEntry,
        date: Timestamp.fromDate(historyEntry.date),
      },
      { merge: true }, // This will update existing documents instead of throwing an error
    );
  } catch (error) {
    console.error("Error saving outfit to history:", error);
    throw error;
  }
}

export async function getOutfitHistory(userId: string) {
  try {
    const q = query(
      collection(db, "outfitHistory"),
      where("userId", "==", userId),
      orderBy("date", "desc"),
    );

    const querySnapshot = await getDocs(q);
    return querySnapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
      date: doc.data().date?.toDate(), // Convert Timestamp back to Date
    }));
  } catch (error) {
    console.error("Error fetching outfit history:", error);
    throw error;
  }
}

export async function getSimilarOutfits(
  userId: string,
  currentWeather: WeatherResponse,
) {
  try {
    if (!currentWeather?.temperature?.current) {
      return [];
    }

    // Get outfits from similar weather conditions
    const tempRange = 5; // Consider outfits within 5 degrees
    const currentTemp = currentWeather.temperature.current;

    const q = query(
      collection(db, "outfitHistory"),
      where("userId", "==", userId),
      where("weather.temperature", ">=", currentTemp - tempRange),
      where("weather.temperature", "<=", currentTemp + tempRange),
      where("feedback", "==", "like"),
      limit(5),
    );

    const querySnapshot = await getDocs(q);
    return querySnapshot.docs.map((doc) => ({
      ...doc.data(),
      date: doc.data().date?.toDate(), // Convert Timestamp back to Date
    }));
  } catch (error) {
    console.error("Error fetching similar outfits:", error);
    throw error;
  }
}

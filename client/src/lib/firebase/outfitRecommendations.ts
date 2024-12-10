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
  updateDoc,
  doc,
} from "firebase/firestore";
import type { OutfitRecommendation } from "@/lib/outfitLogic";

interface RecommendationEntry {
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
  notes?: string;
}

export async function saveOutfitRecommendation(
  userId: string,
  outfit: OutfitRecommendation,
  weatherData: WeatherResponse,
  notes?: string,
) {
  try {
    const recommendationEntry: RecommendationEntry = {
      userId,
      outfit,
      weather: {
        temperature: weatherData.temperature.current,
        isRaining: weatherData.weather.main.toLowerCase().includes("rain"),
        isSnowing: weatherData.weather.main.toLowerCase().includes("snow"),
        windSpeed: weatherData.wind.speed,
      },
      date: new Date(),
      // Only include notes if it's defined
      ...(notes && { notes }),
    };

    const docRef = await addDoc(collection(db, "outfitRecommendations"), {
      ...recommendationEntry,
      date: Timestamp.fromDate(recommendationEntry.date),
    });

    return docRef.id;
  } catch (error) {
    console.error("Error saving recommendation:", error);
    throw error;
  }
}

export async function updateFeedback(
  recommendationId: string,
  feedback: "like" | "dislike",
) {
  try {
    const docRef = doc(db, "outfitRecommendations", recommendationId);
    await updateDoc(docRef, { feedback });
  } catch (error) {
    console.error("Error updating feedback:", error);
    throw error;
  }
}

export async function getRecommendations(userId: string) {
  try {
    const q = query(
      collection(db, "outfitRecommendations"),
      where("userId", "==", userId),
      orderBy("date", "desc"),
      limit(10),
    );

    const querySnapshot = await getDocs(q);
    return querySnapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
      date: doc.data().date?.toDate(),
    }));
  } catch (error) {
    console.error("Error fetching recommendations:", error);
    throw error;
  }
}

export async function getLikedRecommendations(userId: string) {
  try {
    const q = query(
      collection(db, "outfitRecommendations"),
      where("userId", "==", userId),
      where("feedback", "==", "like"),
      orderBy("date", "desc"),
      limit(5),
    );

    const querySnapshot = await getDocs(q);
    return querySnapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
      date: doc.data().date?.toDate(),
    }));
  } catch (error) {
    console.error("Error fetching liked recommendations:", error);
    throw error;
  }
}

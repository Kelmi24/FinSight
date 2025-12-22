"use server"

import { auth } from "@/auth"
import { categorizationService } from "@/lib/services/categorizationService"

/**
 * Predict categories for a list of transaction descriptions
 */
export async function predictCategories(descriptions: string[]) {
  const session = await auth()
  
  // Basic rate limiting or auth check
  if (!session?.user?.id) {
    return { error: "Unauthorized" }
  }

  try {
    const predictions = await categorizationService.predictBatch(descriptions);
    return { predictions };
  } catch (error) {
    console.error("AI Prediction Error:", error);
    return { error: "Failed to predict categories" };
  }
}

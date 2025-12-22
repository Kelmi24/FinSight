import { INDONESIAN_CATEGORY_KEYWORDS } from "@/lib/parsers/indonesian/categoryMappings";

/**
 * Service to handle intelligent transaction categorization
 */
export class CategorizationService {
  /**
   * Predict categories for a batch of transaction descriptions
   */
  async predictBatch(descriptions: string[]): Promise<(string | null)[]> {
    return Promise.all(descriptions.map(desc => this.categorize(desc)));
  }

  /**
   * Categorize a single transaction description
   */
  async categorize(description: string): Promise<string | null> {
    if (!description) return null;
    
    // 1. Rule-based matching (Fast, Zero-cost)
    const ruleBasedPrediction = this.categorizeByRules(description);
    if (ruleBasedPrediction) {
      return ruleBasedPrediction;
    }

    // 2. AI-based matching (Slower, Costly)
    // Only fetch if rules failed
    return await this.categorizeByAI(description);
  }

  /**
   * Existing keyword-based matching
   */
  private categorizeByRules(description: string): string | null {
    const lowerDesc = description.toLowerCase();

    for (const [category, keywords] of Object.entries(INDONESIAN_CATEGORY_KEYWORDS)) {
      // Check if any keyword matches
      if (keywords.some(keyword => lowerDesc.includes(keyword.toLowerCase()))) {
        return category;
      }
    }

    return null;
  }

  /**
   * Placeholder for AI integration (OpenAI / Python Microservice)
   */
  private async categorizeByAI(description: string): Promise<string | null> {
    // TODO: Integrate actual AI Model here
    // Example: Call OpenAI API with:
    // "Classify this transaction description into one of: Makanan, Transportasi, etc.: '${description}'"
    
    // For now, return null to fallback to "Uncategorized" or manual user input
    // We can simulate "smart" guessing here if needed for demo
    
    return null; 
  }
}

export const categorizationService = new CategorizationService();

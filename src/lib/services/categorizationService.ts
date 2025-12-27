import { INDONESIAN_CATEGORY_KEYWORDS } from "@/lib/parsers/indonesian/categoryMappings";

export class CategorizationService {
  async predictBatch(descriptions: string[]): Promise<(string | null)[]> {
    return Promise.all(descriptions.map(desc => this.categorize(desc)));
  }

  async categorize(description: string): Promise<string | null> {
    if (!description) return null;
    
    const ruleBasedPrediction = this.categorizeByRules(description);
    if (ruleBasedPrediction) {
      return ruleBasedPrediction;
    }

    return await this.categorizeByAI(description);
  }

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

  private async categorizeByAI(description: string): Promise<string | null> {
    return null;
  }
}

export const categorizationService = new CategorizationService();

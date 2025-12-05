/**
 * OCR Extraction Service
 * Parses raw OCR text to extract transaction details
 */

export interface ParsedTransaction {
  amount: {
    value: number | null
    currency: string
    confidence: number
  }
  date: {
    value: string | null
    confidence: number
  }
  type: {
    value: "income" | "expense" | null
    confidence: number
  }
  category: {
    primary: string | null
    confidence: number
    alternatives: Array<{ name: string; confidence: number }>
  }
  merchant: string | null
  description: string | null
  totalConfidence: number
}

// Regex patterns for amount detection
const AMOUNT_PATTERNS = [
  /(?:total|subtotal|amount|price|cost|paid|charge)[\s:]*\$?([0-9]+[.,][0-9]{2})/gi,
  /\$([0-9]+[.,][0-9]{2})/g,
  /([0-9]+[.,][0-9]{2})\s*(?:usd|eur|gbp|jpy|cad|aud|inr)/gi,
  /(?:usd|eur|gbp|jpy|cad|aud|inr)\s*([0-9]+[.,][0-9]{2})/gi,
]

// Currency symbols
const CURRENCY_MAP: Record<string, string> = {
  $: "USD",
  "€": "EUR",
  "£": "GBP",
  "¥": "JPY",
  usd: "USD",
  eur: "EUR",
  gbp: "GBP",
  jpy: "JPY",
  cad: "CAD",
  aud: "AUD",
  inr: "INR",
}

// Keywords for expense classification
const EXPENSE_KEYWORDS = [
  "paid",
  "charged",
  "purchase",
  "bought",
  "order",
  "delivery",
  "shipping",
  "transaction",
  "debit",
  "withdraw",
]

// Keywords for income classification
const INCOME_KEYWORDS = [
  "deposit",
  "credit",
  "received",
  "refund",
  "rebate",
  "reimbursement",
  "salary",
  "wage",
  "income",
  "earnings",
  "transfer in",
]

// Date patterns
const DATE_PATTERNS = [
  // MM/DD/YYYY or DD/MM/YYYY
  /(\d{1,2})[/-](\d{1,2})[/-](\d{4})/,
  // MMM DD, YYYY or DD MMM YYYY
  /(?:jan|feb|mar|apr|may|jun|jul|aug|sep|oct|nov|dec)[a-z]*\s+\d{1,2},?\s+\d{4}/i,
  // YYYY-MM-DD
  /(\d{4})[/-](\d{1,2})[/-](\d{1,2})/,
]

// Category keywords
const CATEGORY_KEYWORDS: Record<string, string[]> = {
  "Food & Dining": ["restaurant", "cafe", "coffee", "pizza", "burger", "grocery", "food", "lunch", "dinner", "breakfast", "starbucks", "mcdonald", "whole foods"],
  Transportation: ["uber", "lyft", "taxi", "gas", "fuel", "parking", "transit", "train", "bus", "car", "vehicle", "metro"],
  Shopping: ["amazon", "walmart", "target", "mall", "store", "shop", "retail", "clothing", "apparel", "shoes", "dress"],
  Entertainment: ["movie", "cinema", "theater", "concert", "event", "spotify", "netflix", "game", "gaming", "sports"],
  Utilities: ["electric", "water", "gas", "internet", "phone", "telecom", "power", "bill"],
  Healthcare: ["pharmacy", "doctor", "hospital", "medical", "clinic", "medicine", "dentist", "cvs", "walgreens"],
  Housing: ["rent", "mortgage", "landlord", "apartment", "house", "property", "real estate"],
  Education: ["school", "university", "college", "tuition", "course", "training", "lesson"],
}

/**
 * Parse raw OCR text to extract transaction details
 */
export function parseTransactionFromOCR(rawText: string): ParsedTransaction {
  const text = rawText.toLowerCase()

  const amount = parseAmount(text)
  const date = parseDate(text)
  const type = parseTransactionType(text)
  const { category, confidence: categoryCond, alternatives } = parseCategory(text)
  const { merchant, description } = extractMerchantAndDescription(rawText, text)

  // Calculate overall confidence
  const confidences = [amount.confidence, date.confidence, type.confidence, categoryCond]
  const totalConfidence = confidences.reduce((a, b) => a + b, 0) / confidences.length

  return {
    amount,
    date,
    type,
    category: {
      primary: category,
      confidence: categoryCond,
      alternatives,
    },
    merchant,
    description,
    totalConfidence: Math.round(totalConfidence * 100) / 100,
  }
}

/**
 * Extract amount and currency from text
 */
function parseAmount(text: string): ParsedTransaction["amount"] {
  const amounts: Array<{ value: number; confidence: number }> = []

  for (const pattern of AMOUNT_PATTERNS) {
    const matches = text.matchAll(pattern)
    for (const match of matches) {
      const valueStr = match[1]
      if (valueStr) {
        const value = parseFloat(valueStr.replace(",", "."))
        if (value > 0 && value < 1000000) {
          // Reasonable transaction amount
          amounts.push({
            value,
            confidence: 0.9,
          })
        }
      }
    }
  }

  // Detect currency
  let currency = "IDR"
  for (const [symbol, code] of Object.entries(CURRENCY_MAP)) {
    if (text.includes(symbol) || text.includes(code.toLowerCase())) {
      currency = code
      break
    }
  }

  if (amounts.length === 0) {
    return {
      value: null,
      currency,
      confidence: 0,
    }
  }

  // Return the largest amount (likely the total)
  const largestAmount = amounts.reduce((max, curr) => (curr.value > max.value ? curr : max))

  return {
    value: largestAmount.value,
    currency,
    confidence: Math.min(largestAmount.confidence, 0.98),
  }
}

/**
 * Extract date from text
 */
function parseDate(text: string): ParsedTransaction["date"] {
  for (const pattern of DATE_PATTERNS) {
    const match = text.match(pattern)
    if (match) {
      try {
        // Try to parse the matched date
        const dateStr = match[0]
        const parsed = new Date(dateStr)

        if (!isNaN(parsed.getTime())) {
          return {
            value: parsed.toISOString().split("T")[0],
            confidence: 0.95,
          }
        }
      } catch (e) {
        // Continue to next pattern
      }
    }
  }

  // Fallback: use today's date
  const today = new Date().toISOString().split("T")[0]
  return {
    value: today,
    confidence: 0.3,
  }
}

/**
 * Determine if transaction is income or expense
 */
function parseTransactionType(text: string): ParsedTransaction["type"] {
  const expenseMatches = EXPENSE_KEYWORDS.filter((kw) => text.includes(kw)).length
  const incomeMatches = INCOME_KEYWORDS.filter((kw) => text.includes(kw)).length

  if (expenseMatches > incomeMatches) {
    return {
      value: "expense",
      confidence: Math.min(0.7 + expenseMatches * 0.05, 0.99),
    }
  } else if (incomeMatches > expenseMatches) {
    return {
      value: "income",
      confidence: Math.min(0.7 + incomeMatches * 0.05, 0.99),
    }
  }

  // Default to expense if no keywords match
  return {
    value: "expense",
    confidence: 0.6,
  }
}

/**
 * Match category based on keywords
 */
function parseCategory(text: string): {
  category: string | null
  confidence: number
  alternatives: Array<{ name: string; confidence: number }>
} {
  const scores: Record<string, number> = {}

  for (const [category, keywords] of Object.entries(CATEGORY_KEYWORDS)) {
    const matches = keywords.filter((kw) => text.includes(kw)).length
    if (matches > 0) {
      scores[category] = matches
    }
  }

  if (Object.keys(scores).length === 0) {
    return {
      category: null,
      confidence: 0,
      alternatives: [],
    }
  }

  // Sort by score
  const sorted = Object.entries(scores)
    .sort(([, a], [, b]) => b - a)
    .map(([cat, score]) => ({
      name: cat,
      confidence: Math.min(0.5 + score * 0.15, 0.95),
    }))

  return {
    category: sorted[0].name,
    confidence: sorted[0].confidence,
    alternatives: sorted.slice(1),
  }
}

/**
 * Extract merchant name and description
 */
function extractMerchantAndDescription(
  originalText: string,
  lowerText: string
): { merchant: string | null; description: string | null } {
  // Common merchant patterns
  const merchantPatterns = [
    /merchant:\s*([^\n]+)/i,
    /^([A-Z][A-Za-z\s&.]+)/m,
    /([A-Z][A-Za-z\s&.]{2,})\s+(?:store|coffee|restaurant|market)/i,
  ]

  let merchant: string | null = null

  for (const pattern of merchantPatterns) {
    const match = originalText.match(pattern)
    if (match) {
      merchant = match[1].trim()
      if (merchant.length > 50) merchant = merchant.substring(0, 50)
      break
    }
  }

  // Generate description
  let description: string | null = null
  if (merchant) {
    description = merchant
  } else {
    // Take first line with content
    const lines = originalText.split("\n").filter((l) => l.trim().length > 0)
    if (lines.length > 0) {
      description = lines[0].trim().substring(0, 50)
    }
  }

  return { merchant, description }
}

/**
 * Get confidence-based color for display
 */
export function getConfidenceColor(confidence: number): "green" | "yellow" | "red" {
  if (confidence >= 0.9) return "green"
  if (confidence >= 0.7) return "yellow"
  return "red"
}

/**
 * Format confidence as percentage
 */
export function formatConfidence(confidence: number): string {
  return `${Math.round(confidence * 100)}%`
}

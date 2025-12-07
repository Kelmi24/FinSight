/**
 * Amount parsing utilities with support for Indonesian IDR format
 */

/**
 * Parse IDR amount format: Rp 1.500.000,00
 * - Dot (.) for thousands separator
 * - Comma (,) for decimal separator
 */
export function parseIDRAmount(value: string): number | null {
  if (!value || typeof value !== "string") return null;

  // Remove currency symbols and whitespace
  let cleaned = value
    .replace(/Rp\.?/gi, "")
    .replace(/\s/g, "")
    .trim();

  // Handle parentheses as negative (accounting format)
  const isNegative = cleaned.startsWith("(") && cleaned.endsWith(")");
  if (isNegative) {
    cleaned = cleaned.slice(1, -1);
  }

  // Convert IDR format to standard: replace dots with empty, comma with dot
  cleaned = cleaned.replace(/\./g, "").replace(/,/g, ".");

  const parsed = parseFloat(cleaned);

  if (isNaN(parsed)) return null;

  return isNegative ? -parsed : parsed;
}

/**
 * Parse standard amount format: 1,500,000.00
 * - Comma (,) for thousands separator
 * - Dot (.) for decimal separator
 */
export function parseStandardAmount(value: string): number | null {
  if (!value || typeof value !== "string") return null;

  // Remove currency symbols and whitespace
  let cleaned = value.replace(/[$€£¥₹]/g, "").replace(/\s/g, "").trim();

  // Handle parentheses as negative
  const isNegative = cleaned.startsWith("(") && cleaned.endsWith(")");
  if (isNegative) {
    cleaned = cleaned.slice(1, -1);
  }

  // Remove thousands separators (commas)
  cleaned = cleaned.replace(/,/g, "");

  const parsed = parseFloat(cleaned);

  if (isNaN(parsed)) return null;

  return isNegative ? -parsed : parsed;
}

/**
 * Auto-detect and parse amount (tries IDR format first, then standard)
 */
export function parseAmount(value: string): number | null {
  if (!value) return null;

  // Check if it looks like IDR format (has dots for thousands)
  const hasDotsForThousands = /\d{1,3}\.\d{3}/.test(value);

  if (hasDotsForThousands) {
    const idrResult = parseIDRAmount(value);
    if (idrResult !== null) return idrResult;
  }

  // Try standard format
  return parseStandardAmount(value);
}

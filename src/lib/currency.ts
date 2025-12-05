/**
 * Currency Configuration & Formatting Utilities
 * 
 * This module provides:
 * - Supported currency types and configurations
 * - Centralized currency formatting function
 * - Currency symbol/metadata lookup
 */

export type CurrencyCode = "IDR" | "USD" | "SGD" | "MYR" | "THB" | "INR"

export const DEFAULT_CURRENCY: CurrencyCode = "IDR"

export interface CurrencyConfig {
  code: CurrencyCode
  name: string
  locale: string
  symbol: string
  minimumFractionDigits: number
  maximumFractionDigits: number
}

/**
 * Supported currencies with their formatting configurations
 */
export const SUPPORTED_CURRENCIES: Record<CurrencyCode, CurrencyConfig> = {
  IDR: {
    code: "IDR",
    name: "Indonesian Rupiah",
    locale: "id-ID",
    symbol: "Rp",
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  },
  USD: {
    code: "USD",
    name: "US Dollar",
    locale: "en-US",
    symbol: "$",
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  },
  SGD: {
    code: "SGD",
    name: "Singapore Dollar",
    locale: "en-SG",
    symbol: "S$",
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  },
  MYR: {
    code: "MYR",
    name: "Malaysian Ringgit",
    locale: "ms-MY",
    symbol: "RM",
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  },
  THB: {
    code: "THB",
    name: "Thai Baht",
    locale: "th-TH",
    symbol: "฿",
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  },
  INR: {
    code: "INR",
    name: "Indian Rupee",
    locale: "en-IN",
    symbol: "₹",
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  },
}

/**
 * Get list of all supported currencies for dropdowns
 */
export function getSupportedCurrencyList(): CurrencyConfig[] {
  return Object.values(SUPPORTED_CURRENCIES)
}

/**
 * Format a number as currency with proper locale and symbol
 * 
 * @param amount - The numeric amount to format
 * @param currency - Currency code (defaults to IDR)
 * @param opts - Optional Intl.NumberFormatOptions overrides
 * @returns Formatted currency string (e.g., "Rp 1.500.000" or "$1,500.00")
 * 
 * @example
 * formatCurrency(1500000, "IDR") // "Rp 1.500.000"
 * formatCurrency(1500.50, "USD") // "$1,500.50"
 * formatCurrency(1500.50, "SGD") // "S$1,500.50"
 */
export function formatCurrency(
  amount: number,
  currency: CurrencyCode = DEFAULT_CURRENCY,
  opts?: Intl.NumberFormatOptions
): string {
  const config = SUPPORTED_CURRENCIES[currency] || SUPPORTED_CURRENCIES[DEFAULT_CURRENCY]
  
  const minimumFractionDigits = opts?.minimumFractionDigits ?? config.minimumFractionDigits
  const maximumFractionDigits = opts?.maximumFractionDigits ?? config.maximumFractionDigits

  return new Intl.NumberFormat(config.locale, {
    style: "currency",
    currency: config.code,
    minimumFractionDigits,
    maximumFractionDigits,
    ...opts,
  }).format(amount)
}

/**
 * Get the symbol for a currency code
 * 
 * @param code - Currency code
 * @returns Currency symbol (e.g., "$", "Rp", "S$")
 */
export function getCurrencySymbol(code: CurrencyCode): string {
  return SUPPORTED_CURRENCIES[code]?.symbol || code
}

/**
 * Get the full currency config for a code
 * 
 * @param code - Currency code
 * @returns Currency configuration object
 */
export function getCurrencyConfig(code: CurrencyCode): CurrencyConfig {
  return SUPPORTED_CURRENCIES[code] || SUPPORTED_CURRENCIES[DEFAULT_CURRENCY]
}

/**
 * Check if a string is a valid currency code
 * 
 * @param code - String to check
 * @returns Boolean indicating if it's a valid CurrencyCode
 */
export function isValidCurrencyCode(code: string): code is CurrencyCode {
  return code in SUPPORTED_CURRENCIES
}

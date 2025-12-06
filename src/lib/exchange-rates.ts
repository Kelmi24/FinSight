/**
 * Exchange Rate Service
 * 
 * Provides currency conversion functionality with static rates.
 * Can be extended with live API integration in the future.
 */

import { CurrencyCode } from "@/lib/currency"

/**
 * Exchange rate matrix: amount in FROM currency * rate = amount in TO currency
 * 
 * Rates as of: December 2024 (approximate mid-market rates)
 * Source: Real-world market averages
 * 
 * Update these periodically or integrate with live API for production
 */
export type ExchangeRateMatrix = Record<CurrencyCode, Record<CurrencyCode, number>>

export const EXCHANGE_RATES: ExchangeRateMatrix = {
  USD: {
    USD: 1,
    IDR: 16600, // 1 USD = 16,600 IDR
    SGD: 1.35, // 1 USD = 1.35 SGD
    MYR: 4.20, // 1 USD = 4.20 MYR
    THB: 35.50, // 1 USD = 35.50 THB
    INR: 83.20, // 1 USD = 83.20 INR
  },
  IDR: {
    USD: 1 / 16600, // 1 IDR = ~0.00006 USD
    IDR: 1,
    SGD: 1.35 / 16600, // 1 IDR = ~0.0000813 SGD
    MYR: 4.20 / 16600, // 1 IDR = ~0.000253 MYR
    THB: 35.50 / 16600, // 1 IDR = ~0.00214 THB
    INR: 83.20 / 16600, // 1 IDR = ~0.00501 INR
  },
  SGD: {
    USD: 1 / 1.35, // 1 SGD = ~0.74 USD
    IDR: 16600 / 1.35, // 1 SGD = ~12,296 IDR
    SGD: 1,
    MYR: 4.20 / 1.35, // 1 SGD = ~3.11 MYR
    THB: 35.50 / 1.35, // 1 SGD = ~26.30 THB
    INR: 83.20 / 1.35, // 1 SGD = ~61.63 INR
  },
  MYR: {
    USD: 1 / 4.20, // 1 MYR = ~0.238 USD
    IDR: 16600 / 4.20, // 1 MYR = ~3,952 IDR
    SGD: 1.35 / 4.20, // 1 MYR = ~0.321 SGD
    MYR: 1,
    THB: 35.50 / 4.20, // 1 MYR = ~8.45 THB
    INR: 83.20 / 4.20, // 1 MYR = ~19.81 INR
  },
  THB: {
    USD: 1 / 35.50, // 1 THB = ~0.0282 USD
    IDR: 16600 / 35.50, // 1 THB = ~467 IDR
    SGD: 1.35 / 35.50, // 1 THB = ~0.038 SGD
    MYR: 4.20 / 35.50, // 1 THB = ~0.118 MYR
    THB: 1,
    INR: 83.20 / 35.50, // 1 THB = ~2.34 INR
  },
  INR: {
    USD: 1 / 83.20, // 1 INR = ~0.012 USD
    IDR: 16600 / 83.20, // 1 INR = ~199 IDR
    SGD: 1.35 / 83.20, // 1 INR = ~0.0162 SGD
    MYR: 4.20 / 83.20, // 1 INR = ~0.0505 MYR
    THB: 35.50 / 83.20, // 1 INR = ~0.427 THB
    INR: 1,
  },
}

/**
 * Convert an amount from one currency to another
 * 
 * @param amount - The amount to convert
 * @param fromCurrency - Source currency code
 * @param toCurrency - Target currency code
 * @returns Converted amount
 * 
 * @throws Error if conversion rate not found
 * 
 * @example
 * convertCurrency(1000, 'USD', 'IDR') // Returns ~16,600,000
 * convertCurrency(16600, 'IDR', 'USD') // Returns ~1
 */
export function convertCurrency(
  amount: number,
  fromCurrency: CurrencyCode,
  toCurrency: CurrencyCode
): number {
  // No conversion needed if same currency
  if (fromCurrency === toCurrency) {
    return amount
  }

  // Get conversion rate
  const rate = EXCHANGE_RATES[fromCurrency]?.[toCurrency]
  if (rate === undefined) {
    throw new Error(`No exchange rate found for ${fromCurrency} → ${toCurrency}`)
  }

  // Convert and round to 2 decimal places
  return Math.round(amount * rate * 100) / 100
}

/**
 * Get the exchange rate from one currency to another
 * 
 * @param fromCurrency - Source currency code
 * @param toCurrency - Target currency code
 * @returns Exchange rate (1 unit of fromCurrency = rate units of toCurrency)
 * 
 * @throws Error if rate not found
 * 
 * @example
 * getExchangeRate('USD', 'IDR') // Returns 16600
 * getExchangeRate('IDR', 'USD') // Returns 0.00006
 */
export function getExchangeRate(
  fromCurrency: CurrencyCode,
  toCurrency: CurrencyCode
): number {
  if (fromCurrency === toCurrency) {
    return 1
  }

  const rate = EXCHANGE_RATES[fromCurrency]?.[toCurrency]
  if (rate === undefined) {
    throw new Error(`No exchange rate found for ${fromCurrency} → ${toCurrency}`)
  }

  return rate
}

/**
 * Format exchange rate for display
 * 
 * @param from - Source currency
 * @param to - Target currency
 * @returns Formatted rate string (e.g., "1 USD = 16,600 IDR")
 * 
 * @example
 * formatExchangeRate('USD', 'IDR') // "1 USD = 16,600 IDR"
 */
export function formatExchangeRate(from: CurrencyCode, to: CurrencyCode): string {
  const rate = getExchangeRate(from, to)
  return `1 ${from} = ${rate.toLocaleString()} ${to}`
}

/**
 * Batch convert multiple amounts
 * Useful for converting arrays of transactions
 * 
 * @param amounts - Array of amounts to convert
 * @param fromCurrency - Source currency for all amounts
 * @param toCurrency - Target currency for all amounts
 * @returns Array of converted amounts
 * 
 * @example
 * batchConvertCurrency([100, 200, 300], 'USD', 'IDR')
 * // Returns [1660000, 3320000, 4980000]
 */
export function batchConvertCurrency(
  amounts: number[],
  fromCurrency: CurrencyCode,
  toCurrency: CurrencyCode
): number[] {
  return amounts.map(amount => convertCurrency(amount, fromCurrency, toCurrency))
}

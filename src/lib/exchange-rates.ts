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

// Base USD-per-unit values (approximate Dec 2024 mid-market). This lets us derive a
// complete matrix so every currency pair is present and TypeScript stays satisfied.
const USD_PER_UNIT: Record<CurrencyCode, number> = {
  USD: 1,
  EUR: 1.08,   // 1 EUR ≈ 1.08 USD
  GBP: 1.26,   // 1 GBP ≈ 1.26 USD
  JPY: 0.007,  // 1 JPY ≈ 0.007 USD
  CAD: 0.74,   // 1 CAD ≈ 0.74 USD
  AUD: 0.67,   // 1 AUD ≈ 0.67 USD
  SGD: 0.74,   // 1 SGD ≈ 0.74 USD
  MYR: 0.238,  // 1 MYR ≈ 0.238 USD
  THB: 0.0282, // 1 THB ≈ 0.0282 USD
  INR: 0.012,  // 1 INR ≈ 0.012 USD
  IDR: 1 / 16600, // 1 IDR ≈ 0.00006024 USD
}

export const EXCHANGE_RATES: ExchangeRateMatrix = Object.keys(USD_PER_UNIT).reduce(
  (matrix, fromCode) => {
    const from = fromCode as CurrencyCode
    matrix[from] = Object.keys(USD_PER_UNIT).reduce((row, toCode) => {
      const to = toCode as CurrencyCode
      // amount * rate = converted amount
      row[to] = USD_PER_UNIT[from] / USD_PER_UNIT[to]
      return row
    }, {} as Record<CurrencyCode, number>)
    return matrix
  },
  {} as ExchangeRateMatrix
)

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

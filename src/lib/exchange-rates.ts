import { CurrencyCode } from "@/lib/currency"

export type ExchangeRateMatrix = Record<CurrencyCode, Record<CurrencyCode, number>>

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

export function convertCurrency(
  amount: number,
  fromCurrency: CurrencyCode,
  toCurrency: CurrencyCode
): number {
  if (fromCurrency === toCurrency) {
    return amount
  }

  const rate = EXCHANGE_RATES[fromCurrency]?.[toCurrency]
  if (rate === undefined) {
    throw new Error(`No exchange rate found for ${fromCurrency} → ${toCurrency}`)
  }

  return Math.round(amount * rate * 100) / 100
}

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

export function formatExchangeRate(from: CurrencyCode, to: CurrencyCode): string {
  const rate = getExchangeRate(from, to)
  return `1 ${from} = ${rate.toLocaleString()} ${to}`
}

export function batchConvertCurrency(
  amounts: number[],
  fromCurrency: CurrencyCode,
  toCurrency: CurrencyCode
): number[] {
  return amounts.map(amount => convertCurrency(amount, fromCurrency, toCurrency))
}

export type CurrencyCode = "IDR" | "USD" | "SGD" | "MYR" | "THB" | "INR"

export const DEFAULT_CURRENCY: CurrencyCode = "IDR"

export const SUPPORTED_CURRENCIES: Record<CurrencyCode, {
  code: CurrencyCode
  name: string
  locale: string
  symbol: string
  minimumFractionDigits?: number
  maximumFractionDigits?: number
}> = {
  IDR: { code: "IDR", name: "Indonesian Rupiah", locale: "id-ID", symbol: "Rp", minimumFractionDigits: 0, maximumFractionDigits: 0 },
  USD: { code: "USD", name: "US Dollar", locale: "en-US", symbol: "$", minimumFractionDigits: 2, maximumFractionDigits: 2 },
  SGD: { code: "SGD", name: "Singapore Dollar", locale: "en-SG", symbol: "S$", minimumFractionDigits: 2, maximumFractionDigits: 2 },
  MYR: { code: "MYR", name: "Malaysian Ringgit", locale: "ms-MY", symbol: "RM", minimumFractionDigits: 2, maximumFractionDigits: 2 },
  THB: { code: "THB", name: "Thai Baht", locale: "th-TH", symbol: "฿", minimumFractionDigits: 2, maximumFractionDigits: 2 },
  INR: { code: "INR", name: "Indian Rupee", locale: "en-IN", symbol: "₹", minimumFractionDigits: 2, maximumFractionDigits: 2 },
}

export function formatCurrency(amount: number, currency: CurrencyCode = DEFAULT_CURRENCY, opts?: Intl.NumberFormatOptions) {
  const meta = SUPPORTED_CURRENCIES[currency] || SUPPORTED_CURRENCIES[DEFAULT_CURRENCY]
  const minimumFractionDigits = opts?.minimumFractionDigits ?? meta.minimumFractionDigits ?? 0
  const maximumFractionDigits = opts?.maximumFractionDigits ?? meta.maximumFractionDigits ?? Math.max(2, minimumFractionDigits)

  return new Intl.NumberFormat(meta.locale, {
    style: "currency",
    currency,
    minimumFractionDigits,
    maximumFractionDigits,
    ...opts,
  }).format(amount)
}

export function getCurrencySymbol(code: CurrencyCode): string {
  return SUPPORTED_CURRENCIES[code]?.symbol || code
}

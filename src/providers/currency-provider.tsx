"use client"

import { createContext, useContext, useState, useTransition, useMemo, ReactNode } from "react"
import { toast } from "sonner"
import { updateCurrencyPreference } from "@/lib/actions/user"
import {
  CurrencyCode,
  DEFAULT_CURRENCY,
  formatCurrency as baseFormatCurrency,
} from "@/lib/currency"
import { convertCurrency, getExchangeRate } from "@/lib/exchange-rates"

interface CurrencyContextValue {
  /** Current selected currency code */
  currency: CurrencyCode
  /** Update the currency preference (persists to database) */
  setCurrency: (currency: CurrencyCode) => Promise<void>
  /** Format an amount using the current currency */
  formatCurrency: (amount: number, opts?: Intl.NumberFormatOptions) => string
  /** Convert an amount from one currency to another at current exchange rates */
  convertAmount: (amount: number, fromCurrency: CurrencyCode, toCurrency?: CurrencyCode) => number
  /** Get the exchange rate between two currencies */
  getConversionRate: (fromCurrency: CurrencyCode, toCurrency?: CurrencyCode) => number
  /** Whether currency update is in progress */
  isUpdating: boolean
}

const CurrencyContext = createContext<CurrencyContextValue | undefined>(undefined)

interface CurrencyProviderProps {
  /** Initial currency from server (user preference) */
  initialCurrency?: CurrencyCode
  children: ReactNode
}

/**
 * CurrencyProvider wraps the app to provide global currency context
 * 
 * - Reads initial currency from user's database preference
 * - Provides formatCurrency function that uses selected currency
 * - Persists currency changes to database via server action
 */
export function CurrencyProvider({
  initialCurrency = DEFAULT_CURRENCY,
  children,
}: CurrencyProviderProps) {
  const [currency, setCurrencyState] = useState<CurrencyCode>(initialCurrency)
  const [isPending, startTransition] = useTransition()

  // Memoized format function that uses current currency
  const formatCurrency = useMemo(() => {
    return (amount: number, opts?: Intl.NumberFormatOptions) =>
      baseFormatCurrency(amount, currency, opts)
  }, [currency])

  // Convert amount from one currency to another
  const convertAmount = useMemo(() => {
    return (amount: number, fromCurrency: CurrencyCode, toCurrency?: CurrencyCode) => {
      const targetCurrency = toCurrency || currency
      return convertCurrency(amount, fromCurrency, targetCurrency)
    }
  }, [currency])

  // Get conversion rate between currencies
  const getConversionRate = useMemo(() => {
    return (fromCurrency: CurrencyCode, toCurrency?: CurrencyCode) => {
      const targetCurrency = toCurrency || currency
      return getExchangeRate(fromCurrency, targetCurrency)
    }
  }, [currency])

  // Update currency and persist to database
  const setCurrency = async (nextCurrency: CurrencyCode) => {
    if (nextCurrency === currency) return

    const previousCurrency = currency
    setCurrencyState(nextCurrency)

    startTransition(async () => {
      const result = await updateCurrencyPreference(nextCurrency)
      if (result?.error) {
        toast.error(result.error)
        // Revert on error
        setCurrencyState(previousCurrency)
      } else {
        toast.success("Currency updated successfully")
      }
    })
  }

  const value: CurrencyContextValue = {
    currency,
    setCurrency,
    formatCurrency,
    convertAmount,
    getConversionRate,
    isUpdating: isPending,
  }

  return (
    <CurrencyContext.Provider value={value}>
      {children}
    </CurrencyContext.Provider>
  )
}

/**
 * Hook to access currency context
 * 
 * @throws Error if used outside CurrencyProvider
 * @returns CurrencyContextValue with:
 *   - currency: Current selected currency code
 *   - setCurrency: Update currency preference
 *   - formatCurrency: Format amount in current currency
 *   - convertAmount: Convert between currencies
 *   - getConversionRate: Get exchange rate
 * 
 * @example
 * const { currency, formatCurrency, convertAmount } = useCurrency()
 * const formatted = formatCurrency(1500) // "Rp 1.500" or "$1,500.00"
 * const converted = convertAmount(1000, 'USD', 'IDR') // 16,600,000
 */
export function useCurrency(): CurrencyContextValue {
  const context = useContext(CurrencyContext)
  if (context === undefined) {
    throw new Error("useCurrency must be used within a CurrencyProvider")
  }
  return context
}

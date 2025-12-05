"use client"

import { createContext, useContext, useState, useTransition, useMemo, ReactNode } from "react"
import { toast } from "sonner"
import { updateCurrencyPreference } from "@/lib/actions/user"
import {
  CurrencyCode,
  DEFAULT_CURRENCY,
  formatCurrency as baseFormatCurrency,
} from "@/lib/currency"

interface CurrencyContextValue {
  /** Current selected currency code */
  currency: CurrencyCode
  /** Update the currency preference (persists to database) */
  setCurrency: (currency: CurrencyCode) => Promise<void>
  /** Format an amount using the current currency */
  formatCurrency: (amount: number, opts?: Intl.NumberFormatOptions) => string
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
 * @returns CurrencyContextValue with currency, setCurrency, formatCurrency
 * 
 * @example
 * const { currency, formatCurrency } = useCurrency()
 * return <span>{formatCurrency(1500)}</span> // "Rp 1.500" or "$1,500.00"
 */
export function useCurrency(): CurrencyContextValue {
  const context = useContext(CurrencyContext)
  if (context === undefined) {
    throw new Error("useCurrency must be used within a CurrencyProvider")
  }
  return context
}

"use client"

import React, { createContext, useContext, useMemo, useState, useTransition } from "react"
import { DEFAULT_CURRENCY, CurrencyCode, formatCurrency as baseFormatCurrency } from "@/lib/currency"
import { updateCurrencyPreference } from "@/lib/actions/user"
import { toast } from "sonner"

interface CurrencyContextValue {
  currency: CurrencyCode
  setCurrency: (currency: CurrencyCode) => Promise<void>
  formatCurrency: (amount: number, opts?: Intl.NumberFormatOptions) => string
  isUpdating: boolean
}

const CurrencyContext = createContext<CurrencyContextValue | undefined>(undefined)

interface CurrencyProviderProps {
  initialCurrency?: CurrencyCode
  children: React.ReactNode
}

export function CurrencyProvider({ initialCurrency = DEFAULT_CURRENCY, children }: CurrencyProviderProps) {
  const [currency, setCurrencyState] = useState<CurrencyCode>(initialCurrency)
  const [isPending, startTransition] = useTransition()

  const formatCurrency = useMemo(() => {
    return (amount: number, opts?: Intl.NumberFormatOptions) => baseFormatCurrency(amount, currency, opts)
  }, [currency])

  const setCurrency = async (next: CurrencyCode) => {
    if (next === currency) return
    setCurrencyState(next)
    startTransition(async () => {
      const result = await updateCurrencyPreference(next)
      if (result?.error) {
        toast.error(result.error)
        // revert
        setCurrencyState(currency)
      } else {
        toast.success("Currency updated")
      }
    })
  }

  const value: CurrencyContextValue = {
    currency,
    setCurrency,
    formatCurrency,
    isUpdating: isPending,
  }

  return <CurrencyContext.Provider value={value}>{children}</CurrencyContext.Provider>
}

export function useCurrency() {
  const ctx = useContext(CurrencyContext)
  if (!ctx) {
    throw new Error("useCurrency must be used within a CurrencyProvider")
  }
  return ctx
}

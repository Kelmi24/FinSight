"use client"

import { useCurrency } from "@/providers/currency-provider"
import { SUPPORTED_CURRENCIES, CurrencyCode, DEFAULT_CURRENCY } from "@/lib/currency"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { useMemo } from "react"

interface PreferencesSectionProps {
  initialCurrency?: CurrencyCode
}

export function PreferencesSection({ initialCurrency = DEFAULT_CURRENCY }: PreferencesSectionProps) {
  const { currency, setCurrency, isUpdating } = useCurrency()

  const options = useMemo(() => {
    return Object.values(SUPPORTED_CURRENCIES)
  }, [])

  const handleChange = async (next: string) => {
    await setCurrency(next as CurrencyCode)
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Preferences</CardTitle>
        <CardDescription>Choose your default currency.</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="space-y-2">
          <Label className="text-sm font-medium text-gray-700">Currency</Label>
          <Select defaultValue={initialCurrency} value={currency} onValueChange={handleChange} disabled={isUpdating}>
            <SelectTrigger className="w-full">
              <SelectValue placeholder="Select currency" />
            </SelectTrigger>
            <SelectContent>
              {options.map((opt) => (
                <SelectItem key={opt.code} value={opt.code}>
                  {opt.symbol} {opt.code} — {opt.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          <p className="text-xs text-gray-500">Default is IDR (Indonesian Rupiah). Changing this updates formatting across the app.</p>
        </div>
      </CardContent>
    </Card>
  )
}

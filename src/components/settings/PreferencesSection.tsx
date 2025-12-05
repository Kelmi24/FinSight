"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Loader2, Globe } from "lucide-react"
import { useCurrency } from "@/providers/currency-provider"
import { getSupportedCurrencyList, CurrencyCode } from "@/lib/currency"

interface PreferencesSectionProps {
  initialCurrency?: CurrencyCode
}

export function PreferencesSection({ initialCurrency }: PreferencesSectionProps) {
  const { currency, setCurrency, isUpdating } = useCurrency()
  const currencies = getSupportedCurrencyList()

  const handleCurrencyChange = async (value: string) => {
    await setCurrency(value as CurrencyCode)
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Globe className="h-5 w-5" />
          Preferences
        </CardTitle>
        <CardDescription>
          Customize how financial data is displayed throughout the app.
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Currency Selector */}
        <div className="space-y-2">
          <Label htmlFor="currency">Display Currency</Label>
          <div className="flex items-center gap-3">
            <Select
              value={currency}
              onValueChange={handleCurrencyChange}
              disabled={isUpdating}
            >
              <SelectTrigger id="currency" className="w-full max-w-xs">
                <SelectValue placeholder="Select currency" />
              </SelectTrigger>
              <SelectContent>
                {currencies.map((curr) => (
                  <SelectItem key={curr.code} value={curr.code}>
                    <span className="flex items-center gap-2">
                      <span className="font-medium">{curr.symbol}</span>
                      <span>{curr.name}</span>
                      <span className="text-gray-400">({curr.code})</span>
                    </span>
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            {isUpdating && (
              <Loader2 className="h-4 w-4 animate-spin text-gray-400" />
            )}
          </div>
          <p className="text-sm text-gray-500">
            This will update how all monetary values are displayed across the app.
          </p>
        </div>

        {/* Preview */}
        <div className="rounded-lg bg-gray-50 p-4 border border-gray-200">
          <p className="text-sm font-medium text-gray-700 mb-2">Preview</p>
          <div className="grid grid-cols-2 gap-4 text-sm">
            <div>
              <span className="text-gray-500">Example amount:</span>
            </div>
            <div className="font-semibold text-gray-900">
              {/* Show preview with selected currency */}
              {new Intl.NumberFormat(
                currencies.find(c => c.code === currency)?.locale || "en-US",
                {
                  style: "currency",
                  currency: currency,
                  minimumFractionDigits: currencies.find(c => c.code === currency)?.minimumFractionDigits ?? 0,
                  maximumFractionDigits: currencies.find(c => c.code === currency)?.maximumFractionDigits ?? 2,
                }
              ).format(1500000)}
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}

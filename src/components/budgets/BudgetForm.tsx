"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { createBudget, updateBudget } from "@/lib/actions/budgets"
import { CategorySelect } from "@/components/categories/CategorySelect"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { useRouter } from "next/navigation"
import { formatAmountPreview, type CurrencyCode } from "@/lib/currency"

interface BudgetFormProps {
  budget?: any
  onSuccess?: () => void
}

export function BudgetForm({ budget, onSuccess }: BudgetFormProps) {
  const router = useRouter()
  const [selectedCurrency, setSelectedCurrency] = useState(budget?.currency || "USD")
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [period, setPeriod] = useState(budget?.period || "monthly")
  const [amountInput, setAmountInput] = useState(budget?.amount?.toString() || "")

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    setError(null)
    setIsSubmitting(true)

    const formData = new FormData(e.currentTarget)

    try {
      let result
      if (budget) {
        result = await updateBudget(budget.id, formData)
      } else {
        result = await createBudget(formData)
      }

      if (result.error) {
        setError(result.error)
      } else {
        router.refresh()
        onSuccess?.()
      }
    } catch (err) {
      setError("Failed to save budget")
    } finally {
      setIsSubmitting(false)
    }
  }

  const amountPreview = formatAmountPreview(amountInput, (selectedCurrency as CurrencyCode) || "USD")

  return (
    <form onSubmit={handleSubmit} className="space-y-4 rounded-xl bg-white p-4 sm:p-6 border border-gray-200 transition-all">
      {/* Hidden input for period - Radix Select doesn't submit via FormData */}
      <input type="hidden" name="period" value={period} />
      <input type="hidden" name="currency" value={selectedCurrency} />
      
      {error && (
        <div className="text-sm text-red-600 bg-red-50 p-3 rounded-lg">
          {error}
        </div>
      )}

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div>
          <Label htmlFor="category">Category</Label>
          <CategorySelect
            name="category"
            id="category"
            type="expense"
            defaultValue={budget?.category || ""}
            required
          />
        </div>

        <div className="flex gap-2">
          <div className="w-24">
            <Label htmlFor="currency">Currency</Label>
            <Select value={selectedCurrency} onValueChange={setSelectedCurrency}>
              <SelectTrigger id="currency">
                <SelectValue placeholder="USD" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="USD">USD</SelectItem>
                <SelectItem value="EUR">EUR</SelectItem>
                <SelectItem value="GBP">GBP</SelectItem>
                <SelectItem value="JPY">JPY</SelectItem>
                <SelectItem value="CAD">CAD</SelectItem>
                <SelectItem value="AUD">AUD</SelectItem>
                <SelectItem value="IDR">IDR</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div className="flex-1">
            <Label htmlFor="amount">Monthly Limit</Label>
            <Input
              id="amount"
              name="amount"
              type="text"
              inputMode="decimal"
              value={amountInput}
              onChange={(e) => setAmountInput(e.target.value)}
              placeholder="100.00"
              required
            />
            {amountPreview && (
              <p className="mt-1 text-xs text-gray-500">{amountPreview}</p>
            )}
          </div>
        </div>
      </div>

      <div>
        <Label htmlFor="period">Period</Label>
        <Select value={period} onValueChange={setPeriod}>
          <SelectTrigger id="period">
            <SelectValue placeholder="Select period" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="weekly">Weekly</SelectItem>
            <SelectItem value="monthly">Monthly</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div className="flex gap-3 justify-end pt-4">
        <Button variant="outline" type="button" onClick={() => onSuccess?.()} disabled={isSubmitting}>
          Cancel
        </Button>
        <Button type="submit" disabled={isSubmitting}>
          {isSubmitting ? "Saving..." : budget ? "Update" : "Create"}
        </Button>
      </div>
    </form>
  )
}

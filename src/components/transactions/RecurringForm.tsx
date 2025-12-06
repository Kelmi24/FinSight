"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { DatePicker } from "@/components/ui/date-picker"
import { createRecurringTransaction, updateRecurringTransaction } from "@/lib/actions/recurring"
import { CategorySelect } from "@/components/categories/CategorySelect"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { useRouter } from "next/navigation"
import { useCurrency } from "@/providers/currency-provider"
import { getCurrencySymbol } from "@/lib/currency"

interface RecurringFormProps {
  recurring?: any
  onSuccess?: () => void
}

export function RecurringForm({ recurring, onSuccess }: RecurringFormProps) {
  const router = useRouter()
  const { currency } = useCurrency()
  const [selectedCurrency, setSelectedCurrency] = useState(recurring?.currency || "USD")
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [transactionType, setTransactionType] = useState<"income" | "expense">(
    recurring?.type || "expense"
  )
  const [frequency, setFrequency] = useState(recurring?.frequency || "monthly")

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    setError(null)
    setIsSubmitting(true)

    const formData = new FormData(e.currentTarget)

    try {
      let result
      if (recurring) {
        result = await updateRecurringTransaction(recurring.id, formData)
      } else {
        result = await createRecurringTransaction(formData)
      }

      if (result.error) {
        setError(result.error)
      } else {
        router.refresh()
        onSuccess?.()
      }
    } catch (err) {
      setError("Failed to save recurring transaction")
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      {/* Hidden inputs for Select values - Radix Select doesn't submit via FormData */}
      <input type="hidden" name="type" value={transactionType} />
      <input type="hidden" name="frequency" value={frequency} />
      <input type="hidden" name="currency" value={selectedCurrency} />
      
      {error && (
        <div className="text-sm text-red-600 bg-red-50 p-3 rounded-lg">
          {error}
        </div>
      )}

      <div>
        <Label htmlFor="description">Description</Label>
        <Input
          id="description"
          name="description"
          defaultValue={recurring?.description || ""}
          placeholder="e.g., Monthly Netflix subscription"
          required
        />
      </div>

      <div className="grid grid-cols-2 gap-3">
        <div>
          <Label htmlFor="type">Type</Label>
          <Select
            value={transactionType}
            onValueChange={(val) => setTransactionType(val as "income" | "expense")}
          >
            <SelectTrigger id="type">
              <SelectValue placeholder="Select type" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="expense">Expense</SelectItem>
              <SelectItem value="income">Income</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div>
          <Label htmlFor="category">Category</Label>
          <CategorySelect
            name="category"
            id="category"
            type={transactionType}
            defaultValue={recurring?.category || ""}
            required
          />
        </div>
      </div>

      <div className="grid grid-cols-1 gap-3">
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
            <Label htmlFor="amount">Amount</Label>
            <Input
              id="amount"
              name="amount"
              type="number"
              step="0.01"
              min="0"
              defaultValue={recurring?.amount || ""}
              placeholder="0.00"
              required
            />
          </div>
        </div>

        <div>
          <Label htmlFor="frequency">Frequency</Label>
          <Select value={frequency} onValueChange={setFrequency}>
            <SelectTrigger id="frequency">
              <SelectValue placeholder="Select frequency" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="daily">Daily</SelectItem>
              <SelectItem value="weekly">Weekly</SelectItem>
              <SelectItem value="biweekly">Bi-weekly</SelectItem>
              <SelectItem value="monthly">Monthly</SelectItem>
              <SelectItem value="yearly">Yearly</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-3">
        <div>
          <Label htmlFor="startDate">Start Date</Label>
          <DatePicker
            id="startDate"
            name="startDate"
            value={recurring?.startDate?.toISOString().split("T")[0] || ""}
            required
            placeholder="Select start date"
          />
        </div>

        <div>
          <Label htmlFor="endDate">End Date (optional)</Label>
          <DatePicker
            id="endDate"
            name="endDate"
            value={recurring?.endDate?.toISOString().split("T")[0] || ""}
            placeholder="Select end date"
          />
        </div>
      </div>

      <div className="flex gap-3 justify-end pt-4">
        <Button variant="outline" type="button" onClick={() => onSuccess?.()} disabled={isSubmitting}>
          Cancel
        </Button>
        <Button type="submit" disabled={isSubmitting}>
          {isSubmitting ? "Saving..." : recurring ? "Update" : "Create"}
        </Button>
      </div>
    </form>
  )
}

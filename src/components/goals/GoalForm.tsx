"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { DatePicker } from "@/components/ui/date-picker"
import { createGoal, updateGoal } from "@/lib/actions/goals"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { formatAmountPreview, type CurrencyCode } from "@/lib/currency"

interface Goal {
  id: string
  name: string
  targetAmount: number
  currentAmount: number
  currency?: string
  deadline: Date | null
}

interface GoalFormProps {
  goal?: Goal
  onSuccess: () => void
}

export function GoalForm({ goal, onSuccess }: GoalFormProps) {
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [selectedCurrency, setSelectedCurrency] = useState(goal?.currency || "USD")
  const [targetAmountInput, setTargetAmountInput] = useState(goal?.targetAmount?.toString() || "")
  const [currentAmountInput, setCurrentAmountInput] = useState(goal?.currentAmount?.toString() || "")

  const targetAmountPreview = formatAmountPreview(targetAmountInput, selectedCurrency as CurrencyCode)
  const currentAmountPreview = formatAmountPreview(currentAmountInput, selectedCurrency as CurrencyCode)

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setIsLoading(true)
    setError(null)

    const formData = new FormData(e.currentTarget)
    
    try {
      let result
      if (goal) {
        result = await updateGoal(goal.id, formData)
      } else {
        result = await createGoal(formData)
      }
      
      if (result?.error) {
        setError(result.error)
        return
      }
      
      onSuccess()
    } catch (error) {
      console.error("Failed to save goal:", error)
      setError("Failed to save goal. Please try again.")
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <input type="hidden" name="currency" value={selectedCurrency} />
      <div className="space-y-2">
        <Label htmlFor="name">Goal Name</Label>
        <Input
          id="name"
          name="name"
          placeholder="e.g. New Laptop"
          defaultValue={goal?.name}
          required
        />
      </div>

      <div className="space-y-2">
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

      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="targetAmount">Target Amount</Label>
          <Input
            id="targetAmount"
            name="targetAmount"
            type="text"
            inputMode="decimal"
            placeholder="0.00"
            value={targetAmountInput}
            onChange={(e) => setTargetAmountInput(e.target.value)}
            required
          />
          {targetAmountPreview && (
            <p className="mt-1 text-xs text-gray-500">{targetAmountPreview}</p>
          )}
        </div>
        <div className="space-y-2">
          <Label htmlFor="currentAmount">Current Saved</Label>
          <Input
            id="currentAmount"
            name="currentAmount"
            type="text"
            inputMode="decimal"
            placeholder="0.00"
            value={currentAmountInput}
            onChange={(e) => setCurrentAmountInput(e.target.value)}
          />
          {currentAmountPreview && (
            <p className="mt-1 text-xs text-gray-500">{currentAmountPreview}</p>
          )}
        </div>
      </div>

      <div className="space-y-2">
        <Label htmlFor="deadline">Target Date (Optional)</Label>
        <DatePicker
          id="deadline"
          name="deadline"
          value={goal?.deadline ? new Date(goal.deadline).toISOString().split('T')[0] : ''}
          placeholder="Select target date"
        />
      </div>

      {error && (
        <div className="rounded-lg bg-red-50 p-3">
          <p className="text-sm text-red-600">{error}</p>
        </div>
      )}

      <div className="flex justify-end pt-4">
        <Button type="submit" disabled={isLoading}>
          {isLoading ? "Saving..." : goal ? "Update Goal" : "Create Goal"}
        </Button>
      </div>
    </form>
  )
}

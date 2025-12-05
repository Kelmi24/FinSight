"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { DatePicker } from "@/components/ui/date-picker"
import { createGoal, updateGoal } from "@/lib/actions/goals"

interface Goal {
  id: string
  name: string
  targetAmount: number
  currentAmount: number
  deadline: Date | null
}

interface GoalFormProps {
  goal?: Goal
  onSuccess: () => void
}

export function GoalForm({ goal, onSuccess }: GoalFormProps) {
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

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

      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="targetAmount">Target Amount</Label>
          <Input
            id="targetAmount"
            name="targetAmount"
            type="number"
            step="0.01"
            placeholder="0.00"
            defaultValue={goal?.targetAmount}
            required
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="currentAmount">Current Saved</Label>
          <Input
            id="currentAmount"
            name="currentAmount"
            type="number"
            step="0.01"
            placeholder="0.00"
            defaultValue={goal?.currentAmount || 0}
          />
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

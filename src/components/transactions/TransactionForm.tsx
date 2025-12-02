"use client"

import * as React from "react"
import { createTransaction } from "@/lib/actions/transactions"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select } from "@/components/ui/select"
import { Loader2 } from "lucide-react"

interface TransactionFormProps {
  onSuccess?: () => void
}

export function TransactionForm({ onSuccess }: TransactionFormProps) {
  const [isPending, startTransition] = React.useTransition()
  const [error, setError] = React.useState<string | null>(null)

  async function handleSubmit(formData: FormData) {
    setError(null)
    startTransition(async () => {
      const result = await createTransaction(formData)
      if (result.error) {
        setError(result.error)
      } else {
        onSuccess?.()
      }
    })
  }

  return (
    <form action={handleSubmit} className="space-y-4">
      <div className="grid gap-2">
        <Label htmlFor="type">Type</Label>
        <Select name="type" id="type" required defaultValue="expense">
          <option value="expense">Expense</option>
          <option value="income">Income</option>
        </Select>
      </div>

      <div className="grid gap-2">
        <Label htmlFor="amount">Amount</Label>
        <Input
          type="number"
          name="amount"
          id="amount"
          placeholder="0.00"
          step="0.01"
          min="0"
          required
        />
      </div>

      <div className="grid gap-2">
        <Label htmlFor="description">Description</Label>
        <Input
          type="text"
          name="description"
          id="description"
          placeholder="Groceries, Rent, Salary..."
          required
        />
      </div>

      <div className="grid gap-2">
        <Label htmlFor="category">Category</Label>
        <Select name="category" id="category" required defaultValue="Food">
          <option value="Food">Food</option>
          <option value="Housing">Housing</option>
          <option value="Transportation">Transportation</option>
          <option value="Utilities">Utilities</option>
          <option value="Entertainment">Entertainment</option>
          <option value="Healthcare">Healthcare</option>
          <option value="Income">Income</option>
          <option value="Other">Other</option>
        </Select>
      </div>

      <div className="grid gap-2">
        <Label htmlFor="date">Date</Label>
        <Input
          type="date"
          name="date"
          id="date"
          required
          defaultValue={new Date().toISOString().split("T")[0]}
        />
      </div>

      {error && <p className="text-sm text-red-500">{error}</p>}

      <div className="flex justify-end">
        <Button type="submit" disabled={isPending}>
          {isPending && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
          Add Transaction
        </Button>
      </div>
    </form>
  )
}

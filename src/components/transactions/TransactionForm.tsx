"use client"

import * as React from "react"
import { createTransaction, updateTransaction } from "@/lib/actions/transactions"
import { createRecurringTransaction } from "@/lib/actions/recurring"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { CategorySelect } from "@/components/categories/CategorySelect"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { DatePicker } from "@/components/ui/date-picker"
import { Loader2 } from "lucide-react"
import { useCurrency } from "@/providers/currency-provider"
import { formatAmountPreview } from "@/lib/currency"

interface TransactionFormProps {
  transaction?: any
  onSuccess?: () => void
}

export function TransactionForm({ transaction, onSuccess }: TransactionFormProps) {
  const [isPending, startTransition] = React.useTransition()
  const [error, setError] = React.useState<string | null>(null)
  const [transactionType, setTransactionType] = React.useState<"income" | "expense">(
    transaction?.type || "expense"
  )
  const { currency } = useCurrency()
  const [amountInput, setAmountInput] = React.useState(transaction?.amount?.toString() || "")
  
  // Recurring state
  const [isRecurring, setIsRecurring] = React.useState(false)
  const [frequency, setFrequency] = React.useState("monthly")
  const [date, setDate] = React.useState(
    transaction
      ? new Date(transaction.date).toISOString().split("T")[0]
      : new Date().toISOString().split("T")[0]
  )

  async function handleSubmit(formData: FormData) {
    setError(null)
    startTransition(async () => {
      let result;
      
      if (isRecurring && !transaction) {
        // Create recurring transaction
        // Append recurring fields to formData
        formData.append("frequency", frequency)
        formData.append("startDate", date)
        formData.append("type", transactionType)
        
        result = await createRecurringTransaction(formData)
      } else {
        // Create/Update one-time transaction
        result = transaction
          ? await updateTransaction(transaction.id, formData)
          : await createTransaction(formData)
      }
      
      if (result.error) {
        setError(result.error)
      } else {
        onSuccess?.()
        // Trigger a hard refresh to ensure data updates
        setTimeout(() => window.location.reload(), 300)
      }
    })
  }

  const amountPreview = formatAmountPreview(amountInput, currency)

  return (
    <form action={handleSubmit} className="space-y-4 rounded-xl bg-white p-4 sm:p-6 border border-gray-200 transition-all">
      {/* Hidden input for type - Radix Select doesn't submit via FormData */}
      <input type="hidden" name="type" value={transactionType} />
      {/* Use user's preferred currency from settings; no picker on form */}
      <input type="hidden" name="currency" value={currency} />
      
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
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
          <Label htmlFor="amount">Amount</Label>
          <Input
            type="text"
            inputMode="decimal"
            name="amount"
            id="amount"
            placeholder="0.00"
            value={amountInput}
            onChange={(e) => setAmountInput(e.target.value)}
            required
          />
          {amountPreview && (
            <p className="mt-1 text-xs text-gray-500">{amountPreview}</p>
          )}
        </div>
      </div>

      <div className="grid gap-4">
        <div>
          <Label htmlFor="description">Description</Label>
          <Input
            type="text"
            name="description"
            id="description"
            placeholder="Groceries, Rent, Salary..."
            defaultValue={transaction?.description || ""}
            required
          />
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <Label htmlFor="category">Category</Label>
            <CategorySelect
              name="category"
              id="category"
              type={transactionType}
              defaultValue={transaction?.category || ""}
              required
            />
          </div>

          <div>
            <Label htmlFor="date">Date</Label>
            <DatePicker
              name="date"
              id="date"
              required
              value={date}
              onChange={setDate}
              placeholder="Select transaction date"
              isRecurring={isRecurring}
              onRecurringChange={setIsRecurring}
              frequency={frequency}
              onFrequencyChange={setFrequency}
            />
          </div>
        </div>
      </div>

      {error && <p className="text-sm text-red-500">{error}</p>}

      <div className="flex justify-end">
        <Button type="submit" disabled={isPending} className="inline-flex items-center gap-2">
          {isPending && <Loader2 className="h-4 w-4 animate-spin" />}
          {transaction 
            ? "Update Transaction" 
            : isRecurring 
              ? "Create Recurring Transaction" 
              : "Add Transaction"}
        </Button>
      </div>
    </form>
  )
}

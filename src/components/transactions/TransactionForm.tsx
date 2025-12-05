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
import { FileUploadZone } from "@/components/ui/file-upload-zone"
import { ExtractionPreview } from "@/components/transactions/ExtractionPreview"
import { useOCRExtraction } from "@/hooks/useOCRExtraction"
import { Loader2 } from "lucide-react"
import type { ParsedTransaction } from "@/lib/services/ocr-parser"

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
  
  // Recurring state
  const [isRecurring, setIsRecurring] = React.useState(false)
  const [frequency, setFrequency] = React.useState("monthly")
  const [date, setDate] = React.useState(
    transaction
      ? new Date(transaction.date).toISOString().split("T")[0]
      : new Date().toISOString().split("T")[0]
  )

  // OCR extraction state
  const ocr = useOCRExtraction()
  const [amount, setAmount] = React.useState(transaction?.amount || "")
  const [description, setDescription] = React.useState(transaction?.description || "")
  const [category, setCategory] = React.useState(transaction?.category || "")
  const [autoFilledFields, setAutoFilledFields] = React.useState<Set<string>>(new Set())

  // Apply extraction to form
  const handleApplyExtraction = React.useCallback(() => {
    const extraction = ocr.handleApplyExtraction()
    if (!extraction) return

    const newAutoFilled = new Set<string>()

    // Apply amount
    if (extraction.amount.value) {
      setAmount(extraction.amount.value.toString())
      newAutoFilled.add("amount")
    }

    // Apply date
    if (extraction.date.value) {
      setDate(extraction.date.value)
      newAutoFilled.add("date")
    }

    // Apply type
    if (extraction.type.value) {
      setTransactionType(extraction.type.value)
      newAutoFilled.add("type")
    }

    // Apply category
    if (extraction.category.primary) {
      setCategory(extraction.category.primary)
      newAutoFilled.add("category")
    }

    // Apply description
    if (extraction.description) {
      setDescription(extraction.description)
      newAutoFilled.add("description")
    }

    setAutoFilledFields(newAutoFilled)
    ocr.handleReset()

    // Clear highlighting after 2 seconds
    setTimeout(() => {
      setAutoFilledFields(new Set())
    }, 2000)
  }, [ocr])

  async function handleSubmit(formData: FormData) {
    setError(null)
    
    // Update formData with current state values
    formData.set("amount", amount)
    formData.set("description", description)
    formData.set("category", category)
    formData.set("date", date)
    
    startTransition(async () => {
      let result;
      
      if (isRecurring && !transaction) {
        // Create recurring transaction
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

  return (
    <form action={handleSubmit} className="space-y-4 rounded-xl bg-white p-4 sm:p-6 border border-gray-200 transition-all">
      {/* Hidden input for type - Radix Select doesn't submit via FormData */}
      <input type="hidden" name="type" value={transactionType} />
      
      {/* OCR Extraction Preview */}
      {ocr.step === "preview" && ocr.extraction && (
        <div className="mb-6 rounded-lg bg-blue-50 border border-blue-200 p-4">
          <ExtractionPreview
            extraction={ocr.extraction}
            processingTimeMs={ocr.processingTimeMs || undefined}
            onApply={handleApplyExtraction}
            onBack={ocr.handleBack}
            isApplying={false}
          />
        </div>
      )}

      {/* Processing state */}
      {ocr.step === "processing" && (
        <div className="mb-6 rounded-lg bg-blue-50 border border-blue-200 p-4 flex items-center gap-3">
          <Loader2 className="h-5 w-5 animate-spin text-blue-600" />
          <div>
            <p className="font-medium text-blue-900">Processing document...</p>
            <p className="text-sm text-blue-700">Extracting transaction details with OCR</p>
          </div>
        </div>
      )}

      {/* Error state */}
      {ocr.step === "error" && ocr.error && (
        <div className="mb-6 rounded-lg bg-red-50 border border-red-200 p-4">
          <p className="font-medium text-red-900">Extraction failed</p>
          <p className="text-sm text-red-700 mt-1">{ocr.error}</p>
          <button
            type="button"
            onClick={ocr.handleReset}
            className="mt-3 text-sm text-red-600 hover:text-red-700 font-medium"
          >
            Try again
          </button>
        </div>
      )}

      {/* Upload zone - only show if not in preview mode */}
      {ocr.step === "idle" && (
        <div className="mb-6">
          <Label className="block mb-2 text-sm font-medium">📎 Upload Receipt (Optional)</Label>
          <FileUploadZone
            onFileSelect={ocr.handleFileSelect}
            isLoading={false}
            disabled={false}
          />
        </div>
      )}
      
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
            type="number"
            name="amount"
            id="amount"
            placeholder="0.00"
            step="0.01"
            min="0"
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
            required
            className={autoFilledFields.has("amount") ? "border-indigo-500 bg-indigo-50" : ""}
          />
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
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            required
            className={autoFilledFields.has("description") ? "border-indigo-500 bg-indigo-50" : ""}
          />
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <Label htmlFor="category">Category</Label>
            <CategorySelect
              name="category"
              id="category"
              type={transactionType}
              defaultValue={category}
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

"use client"

import { useState, useRef, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Upload, AlertCircle, CheckCircle, ArrowRight, ArrowLeft, FileText, Trash2 } from "lucide-react"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { parseCSV, ParsedTransaction } from "@/lib/parsers/csvParser"
import { bulkCreateTransactions } from "@/lib/actions/transactions"
import { getCategories } from "@/lib/actions/categories"
import { predictCategories } from "@/lib/actions/ai"
import { format } from "date-fns"
import { useCurrency } from "@/providers/currency-provider"
interface Category {
  id: string
  name: string
  type: string
  color: string | null
}

interface ImportDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
}

type Step = "upload" | "preview" | "mapping" | "confirm"

export function ImportDialog({ open, onOpenChange }: ImportDialogProps) {
  const router = useRouter()
  const fileInputRef = useRef<HTMLInputElement>(null)
  const [step, setStep] = useState<Step>("upload")
  const [file, setFile] = useState<File | null>(null)
  const [parsedData, setParsedData] = useState<ParsedTransaction[]>([])
  const [editableData, setEditableData] = useState<ParsedTransaction[]>([])
  const [errors, setErrors] = useState<string[]>([])
  const [warnings, setWarnings] = useState<string[]>([])
  const [bankDetected, setBankDetected] = useState<string | undefined>()
  const [isLoading, setIsLoading] = useState(false)
  const { currency, formatCurrency } = useCurrency()
  const [incomeCategories, setIncomeCategories] = useState<Category[]>([])
  const [expenseCategories, setExpenseCategories] = useState<Category[]>([])
  const [categoriesLoaded, setCategoriesLoaded] = useState(false)

  // Load categories when dialog opens
  useEffect(() => {
    if (open && !categoriesLoaded) {
      loadCategories()
    }
  }, [open, categoriesLoaded])

  async function loadCategories() {
    const [incomeResult, expenseResult] = await Promise.all([
      getCategories("income"),
      getCategories("expense")
    ])
    
    if (incomeResult.categories) {
      setIncomeCategories(incomeResult.categories)
    }
    if (expenseResult.categories) {
      setExpenseCategories(expenseResult.categories)
    }
    setCategoriesLoaded(true)
  }

  // Match parsed category to canonical categories
  const matchCategory = (parsedCategory: string | undefined, type: "income" | "expense"): string | undefined => {
    if (!parsedCategory) return undefined
    
    const categories = type === "income" ? incomeCategories : expenseCategories
    const lowerParsed = parsedCategory.toLowerCase().trim()
    
    // Exact match (case-insensitive)
    const exactMatch = categories.find(cat => cat.name.toLowerCase() === lowerParsed)
    if (exactMatch) return exactMatch.name
    
    // Normalized match (remove punctuation and extra spaces)
    const normalized = lowerParsed.replace(/[^\w\s]/g, '').replace(/\s+/g, ' ')
    const normalizedMatch = categories.find(cat => 
      cat.name.toLowerCase().replace(/[^\w\s]/g, '').replace(/\s+/g, ' ') === normalized
    )
    if (normalizedMatch) return normalizedMatch.name
    
    // No match - return undefined to leave blank
    return undefined
  }

  const handleFileSelect = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0]
    if (!selectedFile) return

    const isCSV = selectedFile.name.endsWith(".csv")

    if (!isCSV) {
      setErrors(["Please select a valid CSV file"])
      return
    }

    setFile(selectedFile)
    setIsLoading(true)
    setErrors([])
    setWarnings([])

    try {
      // Read CSV directly
      const csvContent = await selectedFile.text()

      // Parse CSV content
      const result = parseCSV(csvContent, currency)

      // Enhance with AI/Server-side categorization
      const descriptions = result.transactions.map(t => t.description);
      let predictions: (string | null)[] = [];
      try {
        const predResult = await predictCategories(descriptions);
        if (predResult.predictions) {
            predictions = predResult.predictions;
        }
      } catch (err) {
        console.error("AI prediction failed, falling back to local rules", err);
      }

      // Validate and match categories to canonical list
      const validatedTransactions = result.transactions.map((txn, index) => {
        // Use local prediction > Server prediction
        // Or if local is missing, use server.
        // Currently result.transactions already has local rule applied by parseCSV internals.
        // So we only overwrite if result.transactions[index].category is undefined
        const candidateCategory = txn.category || predictions[index] || undefined;
        
        return {
        ...txn,
        category: matchCategory(candidateCategory, txn.type as "income" | "expense")
      }});

      setParsedData(validatedTransactions)
      setEditableData(validatedTransactions) // Initialize editable copy
      setErrors(result.errors)
      setWarnings([...warnings, ...result.warnings])
      setBankDetected(result.bankDetected)

      if (validatedTransactions.length > 0) {
        setStep("preview")
      } else {
        // Show feedback even when no transactions parsed
        setErrors([
          ...result.errors,
          result.errors.length === 0 ? "No valid transactions found in the file. Please check the format and try again." : ""
        ].filter(Boolean))
      }
    } catch (error) {
      setErrors([`Failed to process file: ${error instanceof Error ? error.message : "Unknown error"}`])
    } finally {
      setIsLoading(false)
    }
  }

  const handleEditTransaction = (index: number, field: keyof ParsedTransaction, value: any) => {
    const updated = [...editableData]
    updated[index] = { ...updated[index], [field]: value }
    setEditableData(updated)
  }

  const handleDeleteTransaction = (index: number) => {
    const updated = editableData.filter((_, i) => i !== index)
    setEditableData(updated)
  }

  const handleImport = async () => {
    setIsLoading(true)
    try {
      const result = await bulkCreateTransactions(editableData)
      
      if (result.error) {
        setErrors([result.error])
        setIsLoading(false)
        return
      }

      // Success - close dialog and refresh
      onOpenChange(false)
      router.refresh()
      
      // Reset state
      setStep("upload")
      setFile(null)
      setParsedData([])
      setErrors([])
      setWarnings([])
      setBankDetected(undefined)
    } catch (error) {
      setErrors([`Failed to import: ${error instanceof Error ? error.message : "Unknown error"}`])
    } finally {
      setIsLoading(false)
    }
  }

  const handleClose = () => {
    onOpenChange(false)
    // Reset state when closing
    setTimeout(() => {
      setStep("upload")
      setFile(null)
      setParsedData([])
      setEditableData([])
      setErrors([])
      setWarnings([])
      setBankDetected(undefined)
      if (fileInputRef.current) {
        fileInputRef.current.value = ""
      }
    }, 300)
  }

  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Import Transactions</DialogTitle>
          <DialogDescription>
            Upload your bank statement CSV file (supports Indonesian & English formats)
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-6">
          {/* Step Indicator */}
          <div className="flex items-center justify-center space-x-2 text-sm">
            <div className={`flex items-center ${step === "upload" ? "text-primary font-medium" : "text-muted-foreground"}`}>
              <span className={`flex h-6 w-6 items-center justify-center rounded-full border-2 ${step === "upload" ? "border-primary bg-primary text-primary-foreground" : "border-muted"}`}>
                1
              </span>
              <span className="ml-2">Upload</span>
            </div>
            <ArrowRight className="h-4 w-4 text-muted-foreground" />
            <div className={`flex items-center ${step === "preview" ? "text-primary font-medium" : "text-muted-foreground"}`}>
              <span className={`flex h-6 w-6 items-center justify-center rounded-full border-2 ${step === "preview" ? "border-primary bg-primary text-primary-foreground" : "border-muted"}`}>
                2
              </span>
              <span className="ml-2">Preview</span>
            </div>
            <ArrowRight className="h-4 w-4 text-muted-foreground" />
            <div className={`flex items-center ${step === "confirm" ? "text-primary font-medium" : "text-muted-foreground"}`}>
              <span className={`flex h-6 w-6 items-center justify-center rounded-full border-2 ${step === "confirm" ? "border-primary bg-primary text-primary-foreground" : "border-muted"}`}>
                3
              </span>
              <span className="ml-2">Confirm</span>
            </div>
          </div>

          {/* Step: Upload */}
          {step === "upload" && (
            <div className="space-y-4">
              <div className="flex flex-col items-center justify-center rounded-2xl border-2 border-dashed border-border p-12 text-center">
                <Upload className="h-12 w-12 text-muted-foreground mb-4" />
                <h3 className="text-lg font-medium mb-2">Upload CSV File</h3>
                <p className="text-sm text-muted-foreground mb-4">
                  Supports CSV exports from Indonesian banks (BCA, Mandiri, BNI, BRI)
                </p>
                <input
                  ref={fileInputRef}
                  type="file"
                  accept=".csv"
                  onChange={handleFileSelect}
                  className="hidden"
                  id="file-upload"
                />
                <Button 
                  onClick={() => fileInputRef.current?.click()}
                  disabled={isLoading}
                >
                  {isLoading ? "Processing..." : "Choose File"}
                </Button>
                {file && (
                  <p className="text-sm text-muted-foreground mt-2">
                    Selected: {file.name}
                  </p>
                )}
              </div>

              {/* Help Text */}
              <div className="rounded-lg bg-muted p-4 text-sm space-y-2">
                <h4 className="font-medium flex items-center">
                  <FileText className="h-4 w-4 mr-2" />
                  Supported CSV Formats
                </h4>
                <div className="ml-6">
                  <ul className="list-disc list-inside space-y-1 text-muted-foreground">
                    <li><strong>BCA:</strong> Tanggal, Keterangan, CBG, Mutasi, Saldo</li>
                    <li><strong>Mandiri:</strong> Tanggal Transaksi, Keterangan, Jenis, Jumlah (IDR), Saldo</li>
                    <li><strong>BNI:</strong> TGL, URAIAN, DEBIT, KREDIT, SALDO</li>
                    <li><strong>BRI:</strong> Tanggal, Deskripsi, Nominal, Jenis, Saldo</li>
                    <li><strong>Custom:</strong> Date, Description, Amount (or Debit/Credit columns)</li>
                  </ul>
                </div>
              </div>

              {errors.length > 0 && (
                <div className="rounded-lg bg-destructive/10 p-4 text-sm">
                  <div className="flex items-center text-destructive font-medium mb-2">
                    <AlertCircle className="h-4 w-4 mr-2" />
                    Errors
                  </div>
                  <ul className="list-disc list-inside space-y-1 text-destructive">
                    {errors.map((error, i) => (
                      <li key={i}>{error}</li>
                    ))}
                  </ul>
                </div>
              )}
            </div>
          )}

          {/* Step: Preview */}
          {step === "preview" && (
            <div className="flex flex-col max-h-[85vh] overflow-hidden">
              {/* Fixed Header Section */}
              <div className="flex-none space-y-4">
                {bankDetected && (
                  <div className="rounded-lg bg-primary/10 p-3 text-sm flex items-center text-primary">
                    <CheckCircle className="h-4 w-4 mr-2" />
                    <span>{bankDetected} format detected</span>
                  </div>
                )}

                {warnings.length > 0 && (
                  <div className="rounded-lg bg-yellow-500/10 p-4 text-sm">
                    <div className="flex items-center text-yellow-600 dark:text-yellow-500 font-medium mb-2">
                      <AlertCircle className="h-4 w-4 mr-2" />
                      Warnings ({warnings.length})
                    </div>
                    <ul className="list-disc list-inside space-y-1 text-yellow-600 dark:text-yellow-500 max-h-24 overflow-y-auto">
                      {warnings.slice(0, 10).map((warning, i) => (
                        <li key={i}>{warning}</li>
                      ))}
                      {warnings.length > 10 && (
                        <li>... and {warnings.length - 10} more warnings</li>
                      )}
                    </ul>
                  </div>
                )}

                {/* Table with Scrollable Body */}
                <div className="rounded-lg border">
                  <div className="p-4 border-b">
                    <h3 className="font-medium">Preview & Edit ({editableData.length} transactions)</h3>
                    <p className="text-sm text-muted-foreground">Review, edit, or delete transactions before importing</p>
                  </div>
                  <div className="overflow-x-auto">
                    <div className="min-w-full">
                      {/* Fixed Table Header */}
                      <div className="bg-muted/50 border-b grid grid-cols-[120px_1fr_100px_120px_150px_60px] gap-2">
                        <div className="text-left p-3 text-sm font-medium">Date</div>
                        <div className="text-left p-3 text-sm font-medium">Description</div>
                        <div className="text-left p-3 text-sm font-medium">Amount</div>
                        <div className="text-left p-3 text-sm font-medium">Type</div>
                        <div className="text-left p-3 text-sm font-medium">Category</div>
                        <div className="text-center p-3 text-sm font-medium">Delete</div>
                      </div>
                      
                      {/* Scrollable Table Body - max 7 rows visible (~385px) */}
                      <div className="max-h-[385px] overflow-y-auto">
                        {editableData.map((txn, index) => {
                      const categories = txn.type === "income" ? incomeCategories : expenseCategories
                      
                      return (
                        <div key={index} className="border-t hover:bg-muted/30">
                          <div className="grid grid-cols-[120px_1fr_100px_120px_150px_60px] gap-2 items-center py-2 px-2">
                            {/* Date */}
                            <div>
                              <input
                                type="date"
                                value={format(txn.date, "yyyy-MM-dd")}
                                onChange={(e) => handleEditTransaction(index, "date", new Date(e.target.value))}
                                className="w-full px-2 py-1.5 text-sm rounded-md border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-900 focus:ring-2 focus:ring-primary-500 focus:border-primary-500 transition-colors"
                              />
                            </div>
                            
                            {/* Description */}
                            <div>
                              <input
                                type="text"
                                value={txn.description}
                                onChange={(e) => handleEditTransaction(index, "description", e.target.value)}
                                className="w-full px-2 py-1.5 text-sm rounded-md border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-900 focus:ring-2 focus:ring-primary-500 focus:border-primary-500 transition-colors"
                              />
                            </div>
                            
                            {/* Amount */}
                            <div>
                              <input
                                type="number"
                                value={txn.amount}
                                onChange={(e) => handleEditTransaction(index, "amount", parseFloat(e.target.value) || 0)}
                                className="w-full px-2 py-1.5 text-sm rounded-md border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-900 focus:ring-2 focus:ring-primary-500 focus:border-primary-500 transition-colors"
                                step="0.01"
                              />
                            </div>
                            
                            {/* Type */}
                            <div>
                              <Select
                                value={txn.type}
                                onValueChange={(val) => {
                                  handleEditTransaction(index, "type", val as "income" | "expense")
                                  // Clear category when type changes
                                  handleEditTransaction(index, "category", "")
                                }}
                              >
                                <SelectTrigger className="w-full h-9 text-sm">
                                  <SelectValue />
                                </SelectTrigger>
                                <SelectContent>
                                  <SelectItem value="expense">Expense</SelectItem>
                                  <SelectItem value="income">Income</SelectItem>
                                </SelectContent>
                              </Select>
                            </div>
                            
                            {/* Category */}
                            <div>
                              <Select
                                value={txn.category || ""}
                                onValueChange={(val) => handleEditTransaction(index, "category", val)}
                              >
                                <SelectTrigger className="w-full h-9 text-sm">
                                  <SelectValue placeholder="Select category..." />
                                </SelectTrigger>
                                <SelectContent>
                                  {categories.map(cat => (
                                    <SelectItem key={cat.id} value={cat.name}>
                                      {cat.name}
                                    </SelectItem>
                                  ))}
                                </SelectContent>
                              </Select>
                            </div>
                            
                            {/* Delete Button */}
                            <div className="text-center">
                              <Button
                                size="sm"
                                variant="ghost"
                                onClick={() => handleDeleteTransaction(index)}
                                className="h-8 w-8 p-0 text-destructive hover:text-destructive hover:bg-destructive/10"
                              >
                                <Trash2 className="h-4 w-4" />
                              </Button>
                            </div>
                          </div>
                        </div>
                      )
                    })}
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Fixed Footer Section */}
              <div className="flex-none space-y-4 pt-4">
                {editableData.length > 7 && (
                  <div className="p-3 border rounded-lg bg-muted/50 text-sm text-center text-muted-foreground">
                    Showing all {editableData.length} transactions - scroll to view more
                  </div>
                )}
                
                <div className="flex justify-between">
                  <Button variant="outline" onClick={() => setStep("upload")}>
                    <ArrowLeft className="mr-2 h-4 w-4" />
                    Back
                  </Button>
                  <Button onClick={() => setStep("confirm")}>
                    Continue
                    <ArrowRight className="ml-2 h-4 w-4" />
                  </Button>
                </div>
              </div>
            </div>
          )}

          {/* Step: Confirm */}
          {step === "confirm" && (
            <div className="space-y-4">
              <div className="rounded-lg border p-4">
                <h3 className="font-medium mb-2">Ready to Import</h3>
                <p className="text-sm text-muted-foreground mb-4">
                  {editableData.length} transaction{editableData.length === 1 ? '' : 's'} will be added to your account
                </p>
                {parsedData.length !== editableData.length && (
                  <p className="text-sm text-yellow-600 dark:text-yellow-500">
                    Note: You edited {parsedData.length - editableData.length} transaction{parsedData.length - editableData.length === 1 ? '' : 's'}
                  </p>
                )}
              </div>

              <div className="flex justify-between">
                <Button variant="outline" onClick={() => setStep("preview")}>
                  <ArrowLeft className="mr-2 h-4 w-4" />
                  Back
                </Button>
                <Button onClick={handleImport} disabled={isLoading}>
                  {isLoading ? (
                    <>
                      <span className="animate-spin mr-2">⏳</span>
                      Importing...
                    </>
                  ) : (
                    <>
                      Add {editableData.length} Transaction{editableData.length === 1 ? '' : 's'}
                    </>
                  )}
                </Button>
              </div>
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  )
}

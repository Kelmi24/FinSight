"use client"

import { useState, useRef } from "react"
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
import { parseCSV, ParsedTransaction } from "@/lib/parsers/csvParser"
import { bulkCreateTransactions } from "@/lib/actions/transactions"
import { format } from "date-fns"
import { useCurrency } from "@/providers/currency-provider"
import { extractTextFromPDF } from "@/lib/parsers/pdfParser"
import { convertPDFTextToCSV } from "@/lib/parsers/pdfToCSV"

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

  const handleFileSelect = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0]
    if (!selectedFile) return

    const isCSV = selectedFile.name.endsWith(".csv")
    const isPDF = selectedFile.name.endsWith(".pdf")

    if (!isCSV && !isPDF) {
      setErrors(["Please select a valid CSV or PDF file"])
      return
    }

    setFile(selectedFile)
    setIsLoading(true)
    setErrors([])
    setWarnings([])

    try {
      let csvContent: string

      if (isPDF) {
        // Extract text from PDF
        const pdfResult = await extractTextFromPDF(selectedFile)
        
        if (pdfResult.error) {
          setErrors([`PDF extraction failed: ${pdfResult.error}`])
          setIsLoading(false)
          return
        }

        // Convert PDF text to CSV
        const conversionResult = convertPDFTextToCSV(pdfResult.text)
        
        if (conversionResult.error) {
          setErrors([`PDF conversion failed: ${conversionResult.error}`])
          setIsLoading(false)
          return
        }

        csvContent = conversionResult.csv
        
        // Add info about PDF processing
        setWarnings([
          `PDF processed: ${pdfResult.pageCount} pages, ${conversionResult.rowCount} rows detected`
        ])
      } else {
        // Read CSV directly
        csvContent = await selectedFile.text()
      }

      // Parse CSV content
      const result = parseCSV(csvContent, currency)

      setParsedData(result.transactions)
      setEditableData(result.transactions) // Initialize editable copy
      setErrors(result.errors)
      setWarnings([...warnings, ...result.warnings])
      setBankDetected(result.bankDetected)

      if (result.transactions.length > 0) {
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
                <h3 className="text-lg font-medium mb-2">Upload CSV or PDF File</h3>
                <p className="text-sm text-muted-foreground mb-4">
                  Supports CSV exports and PDF statements from Indonesian banks
                </p>
                <input
                  ref={fileInputRef}
                  type="file"
                  accept=".csv,.pdf"
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
                  Supported Formats
                </h4>
                <div className="space-y-3 ml-6">
                  <div>
                    <p className="font-medium text-foreground">CSV Files:</p>
                    <ul className="list-disc list-inside space-y-1 text-muted-foreground">
                      <li><strong>BCA:</strong> Tanggal, Keterangan, Debet, Kredit, Saldo</li>
                      <li><strong>Mandiri:</strong> Tanggal Transaksi, Keterangan, Jenis, Jumlah (IDR), Saldo</li>
                      <li><strong>BNI:</strong> TGL, URAIAN, DEBIT, KREDIT, SALDO</li>
                      <li><strong>BRI:</strong> Tanggal, Deskripsi, Nominal, Jenis, Saldo</li>
                      <li><strong>Custom:</strong> Date, Description, Amount (or Debit/Credit columns)</li>
                    </ul>
                  </div>
                  <div>
                    <p className="font-medium text-foreground">PDF Files:</p>
                    <ul className="list-disc list-inside space-y-1 text-muted-foreground">
                      <li>Bank statement PDFs with transaction tables</li>
                      <li>Multi-page statements supported</li>
                      <li>Automatically converted to CSV format</li>
                    </ul>
                  </div>
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
            <div className="space-y-4">
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
                  <ul className="list-disc list-inside space-y-1 text-yellow-600 dark:text-yellow-500 max-h-32 overflow-y-auto">
                    {warnings.slice(0, 10).map((warning, i) => (
                      <li key={i}>{warning}</li>
                    ))}
                    {warnings.length > 10 && (
                      <li>... and {warnings.length - 10} more warnings</li>
                    )}
                  </ul>
                </div>
              )}

              <div className="rounded-lg border">
                <div className="p-4 border-b">
                  <h3 className="font-medium">Preview & Edit ({editableData.length} transactions)</h3>
                  <p className="text-sm text-muted-foreground">Review, edit, or delete transactions before importing</p>
                </div>
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead className="bg-muted/50">
                      <tr>
                        <th className="text-left p-3 text-sm font-medium">Date</th>
                        <th className="text-left p-3 text-sm font-medium">Description</th>
                        <th className="text-left p-3 text-sm font-medium">Amount</th>
                        <th className="text-left p-3 text-sm font-medium">Type</th>
                        <th className="text-left p-3 text-sm font-medium">Category</th>
                        <th className="text-center p-3 text-sm font-medium w-16">Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      {editableData.slice(0, 10).map((txn, i) => (
                        <tr key={i} className="border-t hover:bg-muted/30">
                          <td className="p-2">
                            <input
                              type="date"
                              value={format(txn.date, "yyyy-MM-dd")}
                              onChange={(e) => handleEditTransaction(i, "date", new Date(e.target.value))}
                              className="w-full px-2 py-1 text-sm rounded border bg-background"
                            />
                          </td>
                          <td className="p-2">
                            <input
                              type="text"
                              value={txn.description}
                              onChange={(e) => handleEditTransaction(i, "description", e.target.value)}
                              className="w-full px-2 py-1 text-sm rounded border bg-background"
                            />
                          </td>
                          <td className="p-2">
                            <input
                              type="number"
                              value={txn.amount}
                              onChange={(e) => handleEditTransaction(i, "amount", parseFloat(e.target.value) || 0)}
                              className="w-24 px-2 py-1 text-sm rounded border bg-background"
                              step="0.01"
                            />
                          </td>
                          <td className="p-2">
                            <select
                              value={txn.type}
                              onChange={(e) => handleEditTransaction(i, "type", e.target.value as "income" | "expense")}
                              className="w-full px-2 py-1 text-sm rounded border bg-background"
                            >
                              <option value="income">Income</option>
                              <option value="expense">Expense</option>
                            </select>
                          </td>
                          <td className="p-2">
                            <input
                              type="text"
                              value={txn.category || ""}
                              onChange={(e) => handleEditTransaction(i, "category", e.target.value)}
                              placeholder="Category"
                              className="w-full px-2 py-1 text-sm rounded border bg-background"
                            />
                          </td>
                          <td className="p-2 text-center">
                            <Button
                              size="sm"
                              variant="ghost"
                              onClick={() => handleDeleteTransaction(i)}
                              className="h-8 w-8 p-0 text-destructive hover:text-destructive hover:bg-destructive/10"
                            >
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
                {editableData.length > 10 && (
                  <div className="p-3 border-t bg-muted/50 text-sm text-center text-muted-foreground">
                    ... and {editableData.length - 10} more transactions (scroll in confirm step to edit all)
                  </div>
                )}
              </div>

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
          )}

          {/* Step: Confirm */}
          {step === "confirm" && (
            <div className="space-y-4">
              <div className="rounded-lg border p-6 text-center space-y-4">
                <CheckCircle className="h-12 w-12 text-green-600 dark:text-green-500 mx-auto" />
                <div>
                  <h3 className="text-lg font-medium mb-2">Ready to Import</h3>
                  <p className="text-sm text-muted-foreground">
                    You are about to import <strong>{editableData.length} transactions</strong>
                  </p>
                  {parsedData.length !== editableData.length && (
                    <p className="text-sm text-yellow-600 dark:text-yellow-500 mt-1">
                      ({parsedData.length - editableData.length} transactions removed)
                    </p>
                  )}
                  {bankDetected && (
                    <p className="text-sm text-muted-foreground mt-1">
                      From: <strong>{bankDetected}</strong>
                    </p>
                  )}
                </div>

                {/* Summary */}
                <div className="grid grid-cols-3 gap-4 pt-4">
                  <div className="rounded-lg bg-muted p-4">
                    <div className="text-2xl font-bold">{editableData.length}</div>
                    <div className="text-sm text-muted-foreground">Total</div>
                  </div>
                  <div className="rounded-lg bg-green-500/10 p-4">
                    <div className="text-2xl font-bold text-green-600 dark:text-green-500">
                      {editableData.filter(t => t.type === "income").length}
                    </div>
                    <div className="text-sm text-muted-foreground">Income</div>
                  </div>
                  <div className="rounded-lg bg-red-500/10 p-4">
                    <div className="text-2xl font-bold text-red-600 dark:text-red-500">
                      {editableData.filter(t => t.type === "expense").length}
                    </div>
                    <div className="text-sm text-muted-foreground">Expense</div>
                  </div>
                </div>
              </div>

              <div className="flex justify-between">
                <Button variant="outline" onClick={() => setStep("preview")} disabled={isLoading}>
                  <ArrowLeft className="mr-2 h-4 w-4" />
                  Back
                </Button>
                <Button onClick={handleImport} disabled={isLoading}>
                  {isLoading ? "Importing..." : "Import Transactions"}
                </Button>
              </div>
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  )
}

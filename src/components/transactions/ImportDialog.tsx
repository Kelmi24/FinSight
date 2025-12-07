"use client"

import { useState, useRef } from "react"
import { useRouter } from "next/navigation"
import { Upload, AlertCircle, CheckCircle, ArrowRight, ArrowLeft, FileText } from "lucide-react"
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
  const [errors, setErrors] = useState<string[]>([])
  const [warnings, setWarnings] = useState<string[]>([])
  const [bankDetected, setBankDetected] = useState<string | undefined>()
  const [isLoading, setIsLoading] = useState(false)
  const { currency, formatCurrency } = useCurrency()

  const handleFileSelect = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0]
    if (!selectedFile) return

    if (!selectedFile.name.endsWith(".csv")) {
      setErrors(["Please select a valid CSV file"])
      return
    }

    setFile(selectedFile)
    setIsLoading(true)
    setErrors([])
    setWarnings([])

    try {
      const content = await selectedFile.text()
      const result = parseCSV(content, currency)

      setParsedData(result.transactions)
      setErrors(result.errors)
      setWarnings(result.warnings)
      setBankDetected(result.bankDetected)

      if (result.transactions.length > 0) {
        setStep("preview")
      }
    } catch (error) {
      setErrors([`Failed to parse CSV: ${error instanceof Error ? error.message : "Unknown error"}`])
    } finally {
      setIsLoading(false)
    }
  }

  const handleImport = async () => {
    setIsLoading(true)
    try {
      const result = await bulkCreateTransactions(parsedData)
      
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
                  Supports Indonesian banks: BCA, Mandiri, BNI, BRI
                </p>
                <input
                  ref={fileInputRef}
                  type="file"
                  accept=".csv"
                  onChange={handleFileSelect}
                  className="hidden"
                  id="csv-upload"
                />
                <Button 
                  onClick={() => fileInputRef.current?.click()}
                  disabled={isLoading}
                >
                  {isLoading ? "Processing..." : "Choose File"}
                </Button>
              </div>

              {/* Help Text */}
              <div className="rounded-lg bg-muted p-4 text-sm space-y-2">
                <h4 className="font-medium flex items-center">
                  <FileText className="h-4 w-4 mr-2" />
                  Supported CSV Formats
                </h4>
                <ul className="list-disc list-inside space-y-1 text-muted-foreground ml-6">
                  <li><strong>BCA:</strong> Tanggal, Keterangan, Debet, Kredit, Saldo</li>
                  <li><strong>Mandiri:</strong> Tanggal Transaksi, Keterangan, Jenis, Jumlah (IDR), Saldo</li>
                  <li><strong>BNI:</strong> TGL, URAIAN, DEBIT, KREDIT, SALDO</li>
                  <li><strong>BRI:</strong> Tanggal, Deskripsi, Nominal, Jenis, Saldo</li>
                  <li><strong>Custom:</strong> Date, Description, Amount (or Debit/Credit columns)</li>
                </ul>
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
                  <h3 className="font-medium">Preview ({parsedData.length} transactions)</h3>
                  <p className="text-sm text-muted-foreground">Review the first 10 transactions</p>
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
                      </tr>
                    </thead>
                    <tbody>
                      {parsedData.slice(0, 10).map((txn, i) => (
                        <tr key={i} className="border-t">
                          <td className="p-3 text-sm">{format(txn.date, "dd/MM/yyyy")}</td>
                          <td className="p-3 text-sm">{txn.description}</td>
                          <td className="p-3 text-sm">{formatCurrency(txn.amount)}</td>
                          <td className="p-3 text-sm">
                            <span className={`inline-flex items-center rounded-full px-2 py-1 text-xs font-medium ${
                              txn.type === "income" 
                                ? "bg-green-500/10 text-green-600 dark:text-green-500"
                                : "bg-red-500/10 text-red-600 dark:text-red-500"
                            }`}>
                              {txn.type}
                            </span>
                          </td>
                          <td className="p-3 text-sm text-muted-foreground">
                            {txn.category || "Uncategorized"}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
                {parsedData.length > 10 && (
                  <div className="p-3 border-t bg-muted/50 text-sm text-center text-muted-foreground">
                    ... and {parsedData.length - 10} more transactions
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
                    You are about to import <strong>{parsedData.length} transactions</strong>
                  </p>
                  {bankDetected && (
                    <p className="text-sm text-muted-foreground mt-1">
                      From: <strong>{bankDetected}</strong>
                    </p>
                  )}
                </div>

                {/* Summary */}
                <div className="grid grid-cols-3 gap-4 pt-4">
                  <div className="rounded-lg bg-muted p-4">
                    <div className="text-2xl font-bold">{parsedData.length}</div>
                    <div className="text-sm text-muted-foreground">Total</div>
                  </div>
                  <div className="rounded-lg bg-green-500/10 p-4">
                    <div className="text-2xl font-bold text-green-600 dark:text-green-500">
                      {parsedData.filter(t => t.type === "income").length}
                    </div>
                    <div className="text-sm text-muted-foreground">Income</div>
                  </div>
                  <div className="rounded-lg bg-red-500/10 p-4">
                    <div className="text-2xl font-bold text-red-600 dark:text-red-500">
                      {parsedData.filter(t => t.type === "expense").length}
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

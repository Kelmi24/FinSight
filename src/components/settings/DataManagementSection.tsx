"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Database, Download, Trash2, AlertTriangle } from "lucide-react"
import { deleteAllTransactions, deleteAllGoals, exportUserData } from "@/lib/actions/settings"
import { useRouter } from "next/navigation"

export function DataManagementSection() {
  const router = useRouter()
  const [isExporting, setIsExporting] = useState(false)
  const [isDeletingTransactions, setIsDeletingTransactions] = useState(false)
  const [isDeletingGoals, setIsDeletingGoals] = useState(false)

  const handleExport = async () => {
    setIsExporting(true)
    const result = await exportUserData()

    if (result.success && result.data) {
      // Create JSON file and download
      const dataStr = JSON.stringify(result.data, null, 2)
      const blob = new Blob([dataStr], { type: "application/json" })
      const url = URL.createObjectURL(blob)
      const link = document.createElement("a")
      link.href = url
      link.download = `finsight-data-${new Date().toISOString().split("T")[0]}.json`
      document.body.appendChild(link)
      link.click()
      document.body.removeChild(link)
      URL.revokeObjectURL(url)
    } else {
      alert(result.error || "Failed to export data")
    }

    setIsExporting(false)
  }

  const handleDeleteTransactions = async () => {
    if (
      !confirm(
        "Are you sure you want to delete ALL transactions? This action cannot be undone."
      )
    ) {
      return
    }

    setIsDeletingTransactions(true)
    const result = await deleteAllTransactions()

    if (result.success) {
      router.refresh()
      alert("All transactions deleted successfully")
    } else {
      alert(result.error || "Failed to delete transactions")
    }

    setIsDeletingTransactions(false)
  }

  const handleDeleteGoals = async () => {
    if (
      !confirm(
        "Are you sure you want to delete ALL goals? This action cannot be undone."
      )
    ) {
      return
    }

    setIsDeletingGoals(true)
    const result = await deleteAllGoals()

    if (result.success) {
      router.refresh()
      alert("All goals deleted successfully")
    } else {
      alert(result.error || "Failed to delete goals")
    }

    setIsDeletingGoals(false)
  }

  return (
    <div className="rounded-lg border bg-white p-6 shadow-sm dark:bg-gray-950 dark:border-gray-800">
      <div className="flex items-center gap-3 mb-6">
        <div className="rounded-full bg-purple-100 p-2 dark:bg-purple-900">
          <Database className="h-5 w-5 text-purple-600 dark:text-purple-400" />
        </div>
        <div>
          <h2 className="text-xl font-semibold">Data Management</h2>
          <p className="text-sm text-gray-500 dark:text-gray-400">
            Export or delete your data
          </p>
        </div>
      </div>

      <div className="space-y-4">
        <div className="flex items-center justify-between rounded-lg border border-gray-200 p-4 dark:border-gray-800">
          <div>
            <h3 className="font-medium">Export Data</h3>
            <p className="text-sm text-gray-500 dark:text-gray-400">
              Download all your data as JSON
            </p>
          </div>
          <Button
            variant="outline"
            onClick={handleExport}
            disabled={isExporting}
          >
            <Download className="mr-2 h-4 w-4" />
            {isExporting ? "Exporting..." : "Export"}
          </Button>
        </div>

        <div className="flex items-center justify-between rounded-lg border border-orange-200 bg-orange-50 p-4 dark:border-orange-900 dark:bg-orange-900/20">
          <div>
            <h3 className="font-medium flex items-center gap-2">
              <AlertTriangle className="h-4 w-4 text-orange-600" />
              Delete All Transactions
            </h3>
            <p className="text-sm text-gray-500 dark:text-gray-400">
              Permanently remove all transaction data
            </p>
          </div>
          <Button
            variant="outline"
            onClick={handleDeleteTransactions}
            disabled={isDeletingTransactions}
            className="border-orange-300 text-orange-700 hover:bg-orange-100 dark:border-orange-800 dark:text-orange-400 dark:hover:bg-orange-900/40"
          >
            <Trash2 className="mr-2 h-4 w-4" />
            {isDeletingTransactions ? "Deleting..." : "Delete"}
          </Button>
        </div>

        <div className="flex items-center justify-between rounded-lg border border-red-200 bg-red-50 p-4 dark:border-red-900 dark:bg-red-900/20">
          <div>
            <h3 className="font-medium flex items-center gap-2">
              <AlertTriangle className="h-4 w-4 text-red-600" />
              Delete All Goals
            </h3>
            <p className="text-sm text-gray-500 dark:text-gray-400">
              Permanently remove all savings goals
            </p>
          </div>
          <Button
            variant="outline"
            onClick={handleDeleteGoals}
            disabled={isDeletingGoals}
            className="border-red-300 text-red-700 hover:bg-red-100 dark:border-red-800 dark:text-red-400 dark:hover:bg-red-900/40"
          >
            <Trash2 className="mr-2 h-4 w-4" />
            {isDeletingGoals ? "Deleting..." : "Delete"}
          </Button>
        </div>
      </div>
    </div>
  )
}

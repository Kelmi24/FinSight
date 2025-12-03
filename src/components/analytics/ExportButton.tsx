"use client"

import { Download } from "lucide-react"
import { Button } from "@/components/ui/button"

interface Transaction {
  id: string
  date: Date
  description: string
  category: string
  amount: number
  type: string
}

interface ExportButtonProps {
  transactions: Transaction[]
}

export function ExportButton({ transactions }: ExportButtonProps) {
  const handleExport = () => {
    if (transactions.length === 0) {
      alert("No transactions to export")
      return
    }

    // Convert to CSV
    const headers = ["Date", "Description", "Category", "Type", "Amount"]
    const rows = transactions.map((tx) => [
      new Date(tx.date).toLocaleDateString(),
      tx.description,
      tx.category,
      tx.type,
      tx.amount.toFixed(2),
    ])

    const csvContent = [
      headers.join(","),
      ...rows.map((row) => row.map((cell) => `"${cell}"`).join(",")),
    ].join("\n")

    // Create download link
    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" })
    const link = document.createElement("a")
    const url = URL.createObjectURL(blob)

    link.setAttribute("href", url)
    link.setAttribute("download", `transactions_${new Date().toISOString().split("T")[0]}.csv`)
    link.style.visibility = "hidden"

    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
  }

  return (
    <Button onClick={handleExport} variant="outline">
      <Download className="mr-2 h-4 w-4" />
      Export CSV ({transactions.length})
    </Button>
  )
}

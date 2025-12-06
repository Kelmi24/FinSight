"use client"

import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { EmptyState } from "@/components/ui/empty-state"
import { SearchX } from "lucide-react"
import { useCurrency } from "@/providers/currency-provider"

interface Transaction {
  id: string
  date: Date
  description: string
  category: string
  amount: number
  type: string
}

interface TransactionTableProps {
  transactions: Transaction[]
}

export function TransactionTable({ transactions }: TransactionTableProps) {
  const { formatCurrency } = useCurrency()

  const formatDate = (date: Date) => {
    return new Date(date).toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
    })
  }

  if (transactions.length === 0) {
    return (
      <EmptyState
        title="No transactions found"
        description="No transactions match your selected filters."
        icon={SearchX}
        className="border-0"
      />
    )
  }

  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead className="whitespace-nowrap">Date</TableHead>
          <TableHead className="whitespace-nowrap">Description</TableHead>
          <TableHead className="whitespace-nowrap">Category</TableHead>
          <TableHead className="whitespace-nowrap">Type</TableHead>
          <TableHead className="text-right whitespace-nowrap">Amount</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {transactions.map((transaction) => (
          <TableRow key={transaction.id}>
            <TableCell className="font-medium">
              {formatDate(transaction.date)}
            </TableCell>
            <TableCell>{transaction.description}</TableCell>
            <TableCell>
              <span className="inline-flex items-center rounded-full bg-primary-50 px-2 py-1 text-xs font-medium text-primary-700">
                {transaction.category}
              </span>
            </TableCell>
            <TableCell>
              <span
                className={`inline-flex items-center rounded-full px-2 py-1 text-xs font-medium ${
                  transaction.type === "income"
                    ? "bg-green-50 text-green-700"
                    : "bg-red-50 text-red-700"
                }`}
              >
                {transaction.type}
              </span>
            </TableCell>
            <TableCell
              className={`text-right font-medium ${
                transaction.type === "income" ? "text-green-600" : "text-red-600"
              }`}
            >
              {transaction.type === "income" ? "+" : "-"}
              {formatCurrency(transaction.amount)}
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  )
}

"use client"

import { useState } from "react"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { Button } from "@/components/ui/button"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Trash2, Edit2, Receipt } from "lucide-react"
import { deleteTransaction } from "@/lib/actions/transactions"
import { useRouter } from "next/navigation"
import { TransactionForm } from "./TransactionForm"
import { EmptyState } from "@/components/ui/empty-state"
import { formatCurrency } from "@/lib/currency"

// Simple date formatter if date-fns not installed yet
const formatDate = (date: Date) => {
  return new Intl.DateTimeFormat("en-US", {
    dateStyle: "medium",
  }).format(new Date(date))
}

interface Transaction {
  id: string
  date: Date
  description: string
  category: string
  type: string
  amount: number
  currency?: string
}

interface TransactionListProps {
  transactions: Transaction[]
  onDeleteSuccess?: () => void
}

export function TransactionList({ transactions, onDeleteSuccess }: TransactionListProps) {
  const [deleteId, setDeleteId] = useState<string | null>(null)
  const [editingId, setEditingId] = useState<string | null>(null)
  const [isDeleting, setIsDeleting] = useState(false)

  const router = useRouter()

  async function handleDelete(id: string) {
    setIsDeleting(true)
    const result = await deleteTransaction(id)
    setIsDeleting(false)
    setDeleteId(null)
    
    if (result.error) {
      alert(result.error)
    } else {
      router.refresh()
      if (onDeleteSuccess) {
        onDeleteSuccess()
      }
    }
  }

  const editingTransaction = editingId
    ? transactions.find(t => t.id === editingId)
    : null

  return (
    <>
      {transactions.length === 0 ? (
        <EmptyState
          title="No transactions found"
          description="Add a transaction to start tracking your income and expenses."
          icon={Receipt}
          action={
            <Button onClick={() => document.getElementById("add-transaction-trigger")?.click()}>
              Add Transaction
            </Button>
          }
        />
      ) : (
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="whitespace-nowrap">Date</TableHead>
                <TableHead className="whitespace-nowrap">Description</TableHead>
                <TableHead className="whitespace-nowrap">Category</TableHead>
                <TableHead className="whitespace-nowrap">Type</TableHead>
                <TableHead className="text-right whitespace-nowrap">Amount</TableHead>
                <TableHead className="w-[100px]"></TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {transactions.map((transaction) => (
                <TableRow key={transaction.id}>
                  <TableCell>{formatDate(transaction.date)}</TableCell>
                  <TableCell>{transaction.description}</TableCell>
                  <TableCell>{transaction.category}</TableCell>
                  <TableCell className="capitalize">{transaction.type}</TableCell>
                  <TableCell
                    className={`text-right font-medium ${
                      transaction.type === "income"
                        ? "text-green-600"
                        : "text-red-600"
                    }`}
                  >
                    {transaction.type === "income" ? "+" : "-"}
                    {formatCurrency(transaction.amount, transaction.currency as any)}
                  </TableCell>
                  <TableCell className="flex gap-2 items-center justify-end">
                    <Button
                      variant="outline"
                      size="icon"
                      onClick={() => setEditingId(transaction.id)}
                      className="h-8 w-8 text-gray-600 hover:text-primary-600"
                      title="Edit transaction"
                    >
                      <Edit2 className="h-4 w-4" />
                      <span className="sr-only">Edit</span>
                    </Button>
                    <Button
                      variant="destructive"
                      size="icon"
                      onClick={() => setDeleteId(transaction.id)}
                      className="h-8 w-8 text-white"
                      title="Delete transaction"
                    >
                      <Trash2 className="h-4 w-4" />
                      <span className="sr-only">Delete</span>
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
      )}

      {/* Edit Dialog */}
      <Dialog open={editingId !== null} onOpenChange={(open) => !open && setEditingId(null)}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Edit Transaction</DialogTitle>
          </DialogHeader>
          {editingTransaction && (
            <TransactionForm
              transaction={editingTransaction}
              onSuccess={() => setEditingId(null)}
            />
          )}
        </DialogContent>
      </Dialog>

      {/* Delete Dialog */}
      <Dialog open={deleteId !== null} onOpenChange={(open) => !open && setDeleteId(null)}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Delete transaction?</DialogTitle>
          </DialogHeader>
          <p className="text-sm text-gray-600">
            Are you sure you want to delete this transaction? This action cannot be undone.
          </p>
          <div className="flex gap-3 justify-end pt-4">
            <Button
              variant="outline"
              onClick={() => setDeleteId(null)}
              disabled={isDeleting}
            >
              Cancel
            </Button>
            <Button
              variant="destructive"
              onClick={() => deleteId && handleDelete(deleteId)}
              disabled={isDeleting}
            >
              {isDeleting ? "Deleting..." : "Delete"}
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </>
  )
}

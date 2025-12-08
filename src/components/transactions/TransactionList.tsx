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
import { Checkbox } from "@/components/ui/checkbox"
import { Trash2, Edit2, Receipt } from "lucide-react"
import { bulkDeleteTransactions } from "@/lib/actions/transactions"
import { useRouter } from "next/navigation"
import { TransactionForm } from "./TransactionForm"
import { EmptyState } from "@/components/ui/empty-state"
import { TableSkeleton } from "@/components/ui/skeleton"
import { formatCurrency } from "@/lib/currency"
import { toast } from "sonner"

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
  selectedIds: Set<string>
  onSelectionChange: (ids: Set<string>) => void
  showDeleteDialog?: boolean
  onDeleteDialogChange?: (show: boolean) => void
}

export function TransactionList({ 
  transactions, 
  onDeleteSuccess,
  selectedIds,
  onSelectionChange,
  showDeleteDialog: externalShowDeleteDialog,
  onDeleteDialogChange
}: TransactionListProps) {
  const [internalShowDeleteDialog, setInternalShowDeleteDialog] = useState(false)
  const [editingId, setEditingId] = useState<string | null>(null)
  const [isDeleting, setIsDeleting] = useState(false)

  const router = useRouter()

  // Use external dialog state if provided, otherwise use internal
  const showDeleteDialog = externalShowDeleteDialog ?? internalShowDeleteDialog
  const setShowDeleteDialog = (show: boolean) => {
    if (onDeleteDialogChange) {
      onDeleteDialogChange(show)
    } else {
      setInternalShowDeleteDialog(show)
    }
  }

  // Select/deselect all visible transactions
  const handleSelectAll = (checked: boolean) => {
    if (checked) {
      const allIds = new Set(transactions.map(t => t.id))
      onSelectionChange(allIds)
    } else {
      onSelectionChange(new Set())
    }
  }

  // Toggle individual transaction selection
  const handleSelectOne = (id: string, checked: boolean) => {
    const newSelection = new Set(selectedIds)
    if (checked) {
      newSelection.add(id)
    } else {
      newSelection.delete(id)
    }
    onSelectionChange(newSelection)
  }

  // Bulk delete selected transactions
  async function handleBulkDelete() {
    if (selectedIds.size === 0) return

    setIsDeleting(true)
    const result = await bulkDeleteTransactions(Array.from(selectedIds))
    setIsDeleting(false)
    setShowDeleteDialog(false)
    
    if (result.error) {
      toast.error(result.error)
    } else {
      toast.success(`Successfully deleted ${result.count} transaction${result.count === 1 ? '' : 's'}`)
      onSelectionChange(new Set()) // Clear selection
      router.refresh()
      if (onDeleteSuccess) {
        onDeleteSuccess()
      }
    }
  }

  // Check if all visible transactions are selected
  const isAllSelected = transactions.length > 0 && selectedIds.size === transactions.length
  const isIndeterminate = selectedIds.size > 0 && selectedIds.size < transactions.length

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
                <TableHead className="w-[50px]">
                  <Checkbox
                    checked={isAllSelected}
                    onCheckedChange={handleSelectAll}
                    aria-label="Select all transactions"
                    disabled={isDeleting}
                  />
                </TableHead>
                <TableHead className="whitespace-nowrap">Date</TableHead>
                <TableHead className="whitespace-nowrap">Description</TableHead>
                <TableHead className="whitespace-nowrap">Category</TableHead>
                <TableHead className="whitespace-nowrap">Type</TableHead>
                <TableHead className="text-right whitespace-nowrap">Amount</TableHead>
                <TableHead className="w-[80px]"></TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {transactions.map((transaction) => (
                <TableRow key={transaction.id}>
                  <TableCell>
                    <Checkbox
                      checked={selectedIds.has(transaction.id)}
                      onCheckedChange={(checked) => handleSelectOne(transaction.id, checked as boolean)}
                      aria-label={`Select transaction ${transaction.description}`}
                      disabled={isDeleting}
                    />
                  </TableCell>
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
                      aria-label={`Edit transaction: ${transaction.description}`}
                    >
                      <Edit2 className="h-4 w-4" />
                      <span className="sr-only">Edit</span>
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

      {/* Bulk Delete Dialog */}
      <Dialog open={showDeleteDialog} onOpenChange={setShowDeleteDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Delete {selectedIds.size} transaction{selectedIds.size === 1 ? '' : 's'}?</DialogTitle>
          </DialogHeader>
          <p className="text-sm text-gray-600 dark:text-gray-400">
            Are you sure you want to delete <strong>{selectedIds.size}</strong> transaction{selectedIds.size === 1 ? '' : 's'}? This action cannot be undone.
          </p>
          <div className="flex gap-3 justify-end pt-4">
            <Button
              variant="outline"
              onClick={() => setShowDeleteDialog(false)}
              disabled={isDeleting}
            >
              Cancel
            </Button>
            <Button
              variant="destructive"
              onClick={handleBulkDelete}
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

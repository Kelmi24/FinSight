"use client"

import { useState } from "react"
import { Trash2, Edit2, Repeat2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { RecurringDialog } from "./RecurringDialog"
import { EmptyState } from "@/components/ui/empty-state"
import { deleteRecurringTransaction } from "@/lib/actions/recurring"
import { useRouter } from "next/navigation"
import { useCurrency } from "@/providers/currency-provider"

interface RecurringListProps {
  recurring: any[]
  onDeleteSuccess?: () => void
}

export function RecurringList({ recurring, onDeleteSuccess }: RecurringListProps) {
  const router = useRouter()
  const { formatCurrency } = useCurrency()
  const [editingRecurring, setEditingRecurring] = useState<any | null>(null)
  const [deleteId, setDeleteId] = useState<string | null>(null)
  const [isDeleting, setIsDeleting] = useState(false)

  const handleDelete = async (id: string) => {
    setIsDeleting(true)
    const result = await deleteRecurringTransaction(id)
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

  const frequencyLabel = (freq: string) => {
    switch (freq) {
      case "weekly":
        return "Every week"
      case "monthly":
        return "Every month"
      case "yearly":
        return "Every year"
      default:
        return freq
    }
  }

  if (recurring.length === 0) {
    return (
      <EmptyState
        title="No recurring transactions"
        description="Set up recurring transactions to track your regular income and expenses automatically."
        icon={Repeat2}
        action={
          <Button onClick={() => document.getElementById("add-recurring-trigger")?.click()}>
            Create Recurring Transaction
          </Button>
        }
      />
    )
  }

  return (
    <>
      <div className="space-y-3">
        <h3 className="font-semibold text-lg flex items-center gap-2">
          <Repeat2 className="h-5 w-5" />
          Recurring Transactions
        </h3>
        <div className="grid gap-3">
          {recurring.map((rec) => (
            <div
              key={rec.id}
              className="rounded-xl border border-primary-100 bg-primary-50 p-4 flex items-center justify-between"
            >
              <div>
                <p className="font-medium text-gray-900">{rec.description}</p>
                <div className="flex items-center gap-3 text-sm text-gray-600 mt-1">
                  <span>{frequencyLabel(rec.frequency)}</span>
                  <span>•</span>
                  <span className={rec.type === "income" ? "text-green-600" : "text-red-600"}>
                    {rec.type === "income" ? "+" : "-"}
                    {formatCurrency(rec.amount)}
                  </span>
                  <span>•</span>
                  <span className="text-xs bg-primary-100 px-2 py-1 rounded">
                    {rec.category}
                  </span>
                </div>
              </div>
              <div className="flex gap-2">
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => setEditingRecurring(rec)}
                  className="h-8 w-8"
                >
                  <Edit2 className="h-4 w-4" />
                </Button>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => setDeleteId(rec.id)}
                  className="h-8 w-8 text-red-600 hover:text-red-700"
                >
                  <Trash2 className="h-4 w-4" />
                </Button>
              </div>
            </div>
          ))}
        </div>
      </div>

      {editingRecurring && (
        <RecurringDialog
          open={!!editingRecurring}
          onOpenChange={(open) => !open && setEditingRecurring(null)}
          recurring={editingRecurring}
          onSuccess={onDeleteSuccess}
        />
      )}

      <Dialog open={deleteId !== null} onOpenChange={(open) => !open && setDeleteId(null)}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Delete recurring transaction?</DialogTitle>
          </DialogHeader>
          <p className="text-sm text-gray-600">
            Are you sure you want to delete this recurring transaction? This action cannot be undone.
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

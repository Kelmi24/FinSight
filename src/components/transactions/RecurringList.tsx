"use client"

import { useState, useTransition } from "react"
import { Trash2, Edit2, Repeat2, CheckCircle2, Clock3 } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { RecurringDialog } from "./RecurringDialog"
import { EmptyState } from "@/components/ui/empty-state"
import { confirmRecurringTransaction, deleteRecurringTransaction } from "@/lib/actions/recurring"
import { useRouter } from "next/navigation"
import { formatCurrency } from "@/lib/currency"
import { cn } from "@/lib/utils"

interface RecurringListProps {
  recurring: any[]
  onDeleteSuccess?: () => void
}

export function RecurringList({ recurring, onDeleteSuccess }: RecurringListProps) {
  const router = useRouter()
  const [editingRecurring, setEditingRecurring] = useState<any | null>(null)
  const [deleteId, setDeleteId] = useState<string | null>(null)
  const [isDeleting, setIsDeleting] = useState(false)
  const [confirmingId, setConfirmingId] = useState<string | null>(null)
  const [isPending, startTransition] = useTransition()

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
      case "daily":
        return "Every day"
      case "weekly":
        return "Every week"
      case "biweekly":
        return "Every 2 weeks"
      case "monthly":
        return "Every month"
      case "yearly":
        return "Every year"
      default:
        return freq
    }
  }

  const nextDueLabel = (date?: string | Date | null) => {
    if (!date) return ""
    return new Intl.DateTimeFormat("en-US", { dateStyle: "medium" }).format(new Date(date))
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
          {recurring.map((rec) => {
            const isIncome = rec.type === "income"
            const actionLabel = isIncome ? "Received" : "Paid"
            const badgeClass = isIncome ? "bg-emerald-50 text-emerald-700" : "bg-rose-50 text-rose-700"
            const overdue = rec.isOverdue || rec.status === "overdue"
            return (
              <div
                key={rec.id}
                className="rounded-xl border border-gray-200 bg-white p-4 shadow-sm"
              >
                <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
                  <div className="space-y-2">
                    <div className="flex flex-wrap items-center gap-2">
                      <span className="font-semibold text-gray-900">
                        {rec.name || rec.description}
                      </span>
                      <span className={cn("rounded-full px-2 py-0.5 text-xs font-medium", badgeClass)}>
                        {isIncome ? "Income" : "Expense"}
                      </span>
                      {overdue && (
                        <span className="rounded-full bg-amber-100 px-2 py-0.5 text-xs font-medium text-amber-800">
                          Overdue
                        </span>
                      )}
                    </div>
                    <div className="flex flex-wrap items-center gap-2 text-sm text-gray-600">
                      <span className="font-medium text-gray-900">
                        {formatCurrency(rec.amount, rec.currency)}
                      </span>
                      <span>•</span>
                      <span>{frequencyLabel(rec.frequency)}</span>
                      <span>•</span>
                      <span className="flex items-center gap-1">
                        <Clock3 className="h-4 w-4 text-gray-400" />
                        Next due {nextDueLabel(rec.nextDueDate)}
                      </span>
                      <span>•</span>
                      <span className="text-xs bg-primary-50 px-2 py-1 rounded border border-primary-100">
                        {rec.category}
                      </span>
                    </div>
                    {rec.notes && <p className="text-xs text-gray-500">{rec.notes}</p>}
                    {rec.lastConfirmedAt && (
                      <p className="text-xs text-gray-500 flex items-center gap-1">
                        <CheckCircle2 className="h-3.5 w-3.5 text-primary-500" />
                        Last confirmed {nextDueLabel(rec.lastConfirmedAt)}
                      </p>
                    )}
                  </div>
                  <div className="flex items-center gap-2 sm:flex-col sm:items-end">
                    <Button
                      size="sm"
                      variant={overdue ? "destructive" : "default"}
                      disabled={isPending && confirmingId === rec.id}
                      onClick={() => {
                        setConfirmingId(rec.id)
                        startTransition(async () => {
                          const res = await confirmRecurringTransaction(rec.id)
                          setConfirmingId(null)
                          if (res.error) {
                            alert(res.error)
                          } else {
                            router.refresh()
                            onDeleteSuccess?.()
                          }
                        })
                      }}
                      className="min-w-[110px]"
                    >
                      {isPending && confirmingId === rec.id ? "Confirming..." : actionLabel}
                    </Button>
                    <div className="flex gap-1">
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => setEditingRecurring(rec)}
                        className="h-8 w-8"
                        title="Edit recurring"
                      >
                        <Edit2 className="h-4 w-4" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => setDeleteId(rec.id)}
                        className="h-8 w-8 text-red-600 hover:text-red-700"
                        title="Delete recurring"
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                </div>
              </div>
            )
          })}
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

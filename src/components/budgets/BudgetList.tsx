"use client"

import { useState } from "react"
import { Trash2, Edit2, Wallet } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { BudgetDialog } from "./BudgetDialog"
import { EmptyState } from "@/components/ui/empty-state"
import { deleteBudget } from "@/lib/actions/budgets"
import { useRouter } from "next/navigation"

const formatCurrency = (amount: number) => {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
  }).format(amount)
}

interface BudgetWithSpending {
  id: string
  category: string
  amount: number
  spent: number
  remaining: number
  percentUsed: string
}

interface BudgetListProps {
  budgets: any[]
}

export function BudgetList({ budgets }: BudgetListProps) {
  const router = useRouter()
  const [editingBudget, setEditingBudget] = useState<any | null>(null)
  const [deleteId, setDeleteId] = useState<string | null>(null)
  const [isDeleting, setIsDeleting] = useState(false)

  const handleDelete = async (id: string) => {
    setIsDeleting(true)
    const result = await deleteBudget(id)
    setIsDeleting(false)
    setDeleteId(null)
    router.refresh()
  }

  const getProgressColor = (percentUsed: number) => {
    if (percentUsed >= 100) return "from-red-500 to-red-600"
    if (percentUsed >= 80) return "from-yellow-400 to-yellow-500"
    return "from-green-400 to-green-600"
  }

  if (budgets.length === 0) {
    return (
      <EmptyState
        title="No budgets yet"
        description="Create a budget to start tracking your spending and saving goals."
        icon={Wallet}
        action={
          <Button onClick={() => document.getElementById("create-budget-trigger")?.click()}>
            Create Budget
          </Button>
        }
      />
    )
  }

  return (
    <>
      <div className="grid gap-4">
        {budgets.map((budget) => {
          const percentUsed = parseFloat(budget.percentUsed)
          return (
            <div key={budget.id}>
              <div className="rounded-md border bg-white dark:bg-gray-950 dark:border-gray-800 p-6 space-y-4 hover:shadow-lg transition-all duration-medium">
                <div className="flex items-start justify-between">
                  <div>
                    <h3 className="font-semibold text-lg">{budget.category}</h3>
                    <p className="text-sm text-gray-600 dark:text-gray-400">
                      {formatCurrency(budget.spent)} of {formatCurrency(budget.amount)}
                    </p>
                  </div>
                  <div className="flex gap-2">
                    <Button
                      variant="outline"
                      size="icon"
                      onClick={() => setEditingBudget(budget)}
                      className="h-8 w-8"
                      title="Edit budget"
                    >
                      <Edit2 className="h-4 w-4" />
                    </Button>
                    <Button
                      variant="destructive"
                      size="icon"
                      onClick={() => setDeleteId(budget.id)}
                      className="h-8 w-8 text-white"
                      title="Delete budget"
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </div>

                <div>
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center gap-2">
                      <span className="text-xs font-medium text-gray-600 dark:text-gray-400">
                        {percentUsed}% Used
                      </span>
                      {percentUsed >= 100 && (
                        <span className="px-2 py-1 text-xs font-semibold rounded-full bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400">
                          Over Budget
                        </span>
                      )}
                      {percentUsed >= 80 && percentUsed < 100 && (
                        <span className="px-2 py-1 text-xs font-semibold rounded-full bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-400">
                          Warning
                        </span>
                      )}
                    </div>
                    <span
                      className={`text-xs font-semibold ${
                        percentUsed >= 100
                          ? "text-red-600 dark:text-red-400"
                          : percentUsed >= 80
                            ? "text-yellow-600 dark:text-yellow-400"
                            : "text-green-600 dark:text-green-400"
                      }`}
                    >
                      {budget.remaining >= 0
                        ? `$${Math.abs(budget.remaining).toFixed(2)} remaining`
                        : `$${Math.abs(budget.remaining).toFixed(2)} over`}
                    </span>
                  </div>
                  <div className="w-full h-3 bg-gray-100 dark:bg-gray-800 rounded-full overflow-hidden">
                    <div
                      className={`h-full bg-gradient-to-r ${getProgressColor(percentUsed)} transition-all duration-500`}
                      style={{ width: `${Math.min(percentUsed, 100)}%` }}
                    />
                  </div>
                </div>
              </div>
            </div>
          )
        })}
      </div>

      {editingBudget && (
        <BudgetDialog
          open={!!editingBudget}
          onOpenChange={(open) => !open && setEditingBudget(null)}
          budget={editingBudget}
        />
      )}

      <Dialog open={deleteId !== null} onOpenChange={(open) => !open && setDeleteId(null)}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Delete budget?</DialogTitle>
          </DialogHeader>
          <p className="text-sm text-gray-600 dark:text-gray-400">
            Are you sure you want to delete this budget? This action cannot be undone.
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

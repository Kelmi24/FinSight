"use client"

import { useState } from "react"
import { Pencil, Trash2, Target } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { GoalDialog } from "./GoalDialog"
import { deleteGoal } from "@/lib/actions/goals"
import { useRouter } from "next/navigation"
import { Card } from "@/components/ui/card"
import { useCurrency } from "@/providers/currency-provider"

interface Goal {
  id: string
  name: string
  targetAmount: number
  currentAmount: number
  deadline: Date | null
}

interface GoalCardProps {
  goal: Goal
}

export function GoalCard({ goal }: GoalCardProps) {
  const router = useRouter()
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const [isDeleting, setIsDeleting] = useState(false)
  const [deleteOpen, setDeleteOpen] = useState(false)
  const { formatCurrency } = useCurrency()

  const progress = Math.min((goal.currentAmount / goal.targetAmount) * 100, 100)
  const remaining = goal.targetAmount - goal.currentAmount

  const handleDelete = async () => {
    setIsDeleting(true)
    await deleteGoal(goal.id)
    setIsDeleting(false)
    setDeleteOpen(false)
    router.refresh()
  }

  const formatDate = (date: Date) => {
    return new Intl.DateTimeFormat("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
    }).format(new Date(date))
  }

  return (
    <>
      <Card>
        <div className="flex items-start justify-between mb-4">
          <div className="flex items-center gap-3">
            <div className="rounded-full bg-primary-50 p-2">
              <Target className="h-5 w-5 text-primary-600" />
            </div>
            <div>
              <h3 className="text-lg font-semibold text-gray-900">{goal.name}</h3>
              {goal.deadline && (
                <p className="text-xs text-gray-500">
                  Target: {formatDate(goal.deadline)}
                </p>
              )}
            </div>
          </div>
          <div className="flex gap-1">
            <Button
              variant="ghost"
              size="sm"
              className="h-8 w-8 p-0"
              onClick={() => setIsDialogOpen(true)}
            >
              <Pencil className="h-4 w-4" />
            </Button>
            <Button
              variant="ghost"
              size="sm"
              className="h-8 w-8 p-0 text-red-600 hover:text-red-700 hover:bg-red-50"
              onClick={() => setDeleteOpen(true)}
              disabled={isDeleting}
            >
              <Trash2 className="h-4 w-4" />
            </Button>
          </div>
        </div>

        <div className="space-y-2">
          <div className="flex justify-between text-sm">
            <span className="text-gray-500">
              {formatCurrency(goal.currentAmount)} saved
            </span>
            <span className="font-medium text-gray-900">
              {formatCurrency(goal.targetAmount)} goal
            </span>
          </div>

          <div className="h-2 w-full rounded-full bg-gray-100">
            <div
              className="h-2 rounded-full bg-primary-600 transition-all duration-500"
              style={{ width: `${progress}%` }}
            />
          </div>

          <div className="flex justify-between text-xs text-gray-500 pt-1">
            <span>{progress.toFixed(0)}%</span>
            <span>{remaining > 0 ? `${formatCurrency(remaining)} to go` : "Goal reached!"}</span>
          </div>
        </div>
      </Card>

      <GoalDialog
        open={isDialogOpen}
        onOpenChange={setIsDialogOpen}
        goal={goal}
      />

      <Dialog open={deleteOpen} onOpenChange={setDeleteOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Delete goal?</DialogTitle>
          </DialogHeader>
          <p className="text-sm text-gray-600">
            Are you sure you want to delete "{goal.name}"? This action cannot be undone.
          </p>
          <div className="flex gap-3 justify-end pt-4">
            <Button
              onClick={handleDelete}
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

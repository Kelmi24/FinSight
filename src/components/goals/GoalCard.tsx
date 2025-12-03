"use client"

import { useState } from "react"
import { Pencil, Trash2, Target } from "lucide-react"
import { Button } from "@/components/ui/button"
import { GoalDialog } from "./GoalDialog"
import { deleteGoal } from "@/lib/actions/goals"

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
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const [isDeleting, setIsDeleting] = useState(false)

  const progress = Math.min((goal.currentAmount / goal.targetAmount) * 100, 100)
  const remaining = goal.targetAmount - goal.currentAmount

  const handleDelete = async () => {
    if (confirm("Are you sure you want to delete this goal?")) {
      setIsDeleting(true)
      await deleteGoal(goal.id)
      setIsDeleting(false)
    }
  }

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(amount)
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
      <div className="rounded-lg border bg-white p-6 shadow-sm dark:bg-gray-950 dark:border-gray-800">
        <div className="flex items-start justify-between mb-4">
          <div className="flex items-center gap-3">
            <div className="rounded-full bg-purple-100 p-2 dark:bg-purple-900">
              <Target className="h-5 w-5 text-purple-600 dark:text-purple-400" />
            </div>
            <div>
              <h3 className="font-semibold">{goal.name}</h3>
              {goal.deadline && (
                <p className="text-xs text-gray-500 dark:text-gray-400">
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
              className="h-8 w-8 p-0 text-red-600 hover:text-red-700 hover:bg-red-50 dark:hover:bg-red-950/20"
              onClick={handleDelete}
              disabled={isDeleting}
            >
              <Trash2 className="h-4 w-4" />
            </Button>
          </div>
        </div>

        <div className="space-y-2">
          <div className="flex justify-between text-sm">
            <span className="text-gray-500 dark:text-gray-400">
              {formatCurrency(goal.currentAmount)} saved
            </span>
            <span className="font-medium">
              {formatCurrency(goal.targetAmount)} goal
            </span>
          </div>
          
          <div className="h-2 w-full rounded-full bg-gray-100 dark:bg-gray-800">
            <div
              className="h-2 rounded-full bg-purple-600 transition-all duration-500"
              style={{ width: `${progress}%` }}
            />
          </div>

          <div className="flex justify-between text-xs text-gray-500 dark:text-gray-400 pt-1">
            <span>{progress.toFixed(0)}%</span>
            <span>{remaining > 0 ? `${formatCurrency(remaining)} to go` : "Goal reached!"}</span>
          </div>
        </div>
      </div>

      <GoalDialog
        open={isDialogOpen}
        onOpenChange={setIsDialogOpen}
        goal={goal}
      />
    </>
  )
}

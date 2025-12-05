"use client"

import { GoalCard } from "./GoalCard"
import { Button } from "@/components/ui/button"
import { EmptyState } from "@/components/ui/empty-state"
import { Target } from "lucide-react"

interface Goal {
  id: string
  name: string
  targetAmount: number
  currentAmount: number
  deadline: Date | null
}

interface GoalListProps {
  goals: Goal[]
}

export function GoalList({ goals }: GoalListProps) {
  if (goals.length === 0) {
    return (
      <EmptyState
        title="No goals yet"
        description="Create your first financial goal to start tracking your progress."
        icon={Target}
        action={
          <Button onClick={() => document.getElementById("create-goal-trigger")?.click()}>
            Create Goal
          </Button>
        }
      />
    )
  }

  return (
    <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
      {goals.map((goal) => (
        <GoalCard key={goal.id} goal={goal} />
      ))}
    </div>
  )
}

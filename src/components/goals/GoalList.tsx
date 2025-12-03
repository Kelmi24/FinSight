"use client"

import { GoalCard } from "./GoalCard"

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
      <div className="flex h-[400px] flex-col items-center justify-center rounded-lg border border-dashed border-gray-300 bg-gray-50 dark:border-gray-700 dark:bg-gray-900">
        <div className="rounded-full bg-gray-100 p-4 dark:bg-gray-800 mb-4">
          <svg
            className="h-8 w-8 text-gray-400"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            aria-hidden="true"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M13 10V3L4 14h7v7l9-11h-7z"
            />
          </svg>
        </div>
        <h3 className="text-lg font-medium text-gray-900 dark:text-gray-100">
          No goals yet
        </h3>
        <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
          Create your first financial goal to start tracking your progress.
        </p>
      </div>
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

import { GoalList } from "@/components/goals/GoalList"
import { GoalPageHeader } from "@/components/goals/GoalPageHeader"
import { getGoals } from "@/lib/actions/goals"

export default async function GoalsPage() {
  const goals = await getGoals()

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Goals</h1>
          <p className="text-gray-500 dark:text-gray-400">
            Set and track your financial targets.
          </p>
        </div>
        <GoalPageHeader />
      </div>

      <GoalList goals={goals} />
    </div>
  )
}

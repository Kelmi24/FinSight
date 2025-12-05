import { BudgetList } from "@/components/budgets/BudgetList"
import { BudgetPageHeader } from "@/components/budgets/BudgetPageHeader"
import { getBudgets } from "@/lib/actions/budgets"

export default async function BudgetsPage() {
  const budgets = await getBudgets()

  return (
    <div className="space-y-6 max-w-7xl mx-auto">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Budgets</h1>
          <p className="mt-1 text-sm text-gray-600 dark:text-gray-400">
            Create and manage budgets by category. Track your spending vs limits.
          </p>
        </div>
        <BudgetPageHeader />
      </div>

      <div className="space-y-4">
        <BudgetList budgets={budgets} />
      </div>
    </div>
  )
}

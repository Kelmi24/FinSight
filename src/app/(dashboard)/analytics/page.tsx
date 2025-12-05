import { getFilteredTransactions, getSpendingTrends } from "@/lib/actions/analytics"
import { AnalyticsClient } from "@/components/analytics/AnalyticsClient"
import { Card } from "@/components/ui/card"
import { db } from "@/lib/db"

export default async function AnalyticsPage() {
  const userId = "mock-user-id"

  // Get initial data
  const [transactions, trends] = await Promise.all([
    getFilteredTransactions({}),
    getSpendingTrends({}),
  ])

  // Get unique categories for filter dropdown
  const allTransactions = await db.transaction.findMany({
    where: { userId },
    select: { category: true },
  })

  const categories = Array.from(
    new Set(allTransactions.map((t) => t.category))
  ).sort()

  return (
    <div className="space-y-6 max-w-7xl mx-auto">
      <AnalyticsClient
        initialTransactions={transactions}
        initialTrends={trends}
        categories={categories}
      />
    </div>
  )
}

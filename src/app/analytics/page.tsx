import { redirect } from "next/navigation"
import { auth } from "@/auth"
import { getFilteredTransactions, getSpendingTrends } from "@/lib/actions/analytics"
import { AnalyticsClient } from "@/components/analytics/AnalyticsClient"
import { db } from "@/lib/db"

export default async function AnalyticsPage() {
  const session = await auth()

  if (!session?.user?.id) {
    redirect("/api/auth/signin?callbackUrl=/analytics")
  }

  // Get initial data
  const [transactions, trends] = await Promise.all([
    getFilteredTransactions({}),
    getSpendingTrends({}),
  ])

  // Get unique categories for filter dropdown
  const allTransactions = await db.transaction.findMany({
    where: { userId: session.user.id },
    select: { category: true },
  })

  const categories = Array.from(
    new Set(allTransactions.map((t) => t.category))
  ).sort()

  return (
    <AnalyticsClient
      initialTransactions={transactions}
      initialTrends={trends}
      categories={categories}
    />
  )
}

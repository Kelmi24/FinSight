import {
  getDashboardSummary,
  getCashFlowData,
  getCategoryBreakdown,
} from "@/lib/actions/dashboard"
import { getTransactions } from "@/lib/actions/transactions"
import { KpiCard } from "@/components/dashboard/KpiCard"
import { CashFlowChart } from "@/components/dashboard/CashFlowChart"
import { CategoryChart } from "@/components/dashboard/CategoryChart"
import { RecentTransactions } from "@/components/dashboard/RecentTransactions"
import { DollarSign, TrendingUp, TrendingDown, Receipt } from "lucide-react"

import { auth } from "@/auth"
import { db } from "@/lib/db"
import { ConnectedAccount } from "@/components/plaid/ConnectedAccount"
import { ConnectBankButton } from "@/components/plaid/ConnectBankButton"

import { redirect } from "next/navigation"

export default async function DashboardPage() {
  const session = await auth()
  
  if (!session?.user?.id) {
    redirect("/api/auth/signin?callbackUrl=/dashboard")
  }

  const user = await db.user.findUnique({
    where: { id: session.user.id },
  })

  const [summary, cashFlowData, categoryData, transactions] = await Promise.all([
    getDashboardSummary(),
    getCashFlowData(),
    getCategoryBreakdown(),
    getTransactions(),
  ])

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(amount)
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Dashboard</h1>
          <p className="text-gray-500 dark:text-gray-400">
            Your financial overview at a glance.
          </p>
        </div>
        <div className="flex items-center gap-2">
          {user?.institutionName ? (
            <ConnectedAccount institutionName={user.institutionName} />
          ) : (
            <ConnectBankButton />
          )}
        </div>
      </div>

      {/* KPI Cards */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <KpiCard
          title="Total Income"
          value={formatCurrency(summary.totalIncome)}
          icon={TrendingUp}
        />
        <KpiCard
          title="Total Expenses"
          value={formatCurrency(summary.totalExpenses)}
          icon={TrendingDown}
        />
        <KpiCard
          title="Net Balance"
          value={formatCurrency(summary.netBalance)}
          icon={DollarSign}
        />
        <KpiCard
          title="Transactions"
          value={summary.transactionCount}
          icon={Receipt}
        />
      </div>

      {/* Charts */}
      <div className="grid gap-6 lg:grid-cols-2">
        <CashFlowChart data={cashFlowData} />
        <CategoryChart data={categoryData} />
      </div>

      {/* Recent Transactions */}
      <RecentTransactions transactions={transactions} />
    </div>
  )
}

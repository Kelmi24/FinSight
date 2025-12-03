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

export default async function DashboardPage() {
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
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Dashboard</h1>
        <p className="text-gray-500 dark:text-gray-400">
          Your financial overview at a glance.
        </p>
      </div>

      {/* KPI Cards */}
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
        <KpiCard
          title="Total Income"
          value={formatCurrency(summary.totalIncome)}
          icon={TrendingUp}
          gradient="from-emerald-500 to-teal-500"
        />
        <KpiCard
          title="Total Expenses"
          value={formatCurrency(summary.totalExpenses)}
          icon={TrendingDown}
          gradient="from-rose-500 to-pink-500"
        />
        <KpiCard
          title="Net Balance"
          value={formatCurrency(summary.netBalance)}
          icon={DollarSign}
          gradient="from-blue-500 to-cyan-500"
        />
        <KpiCard
          title="Transactions"
          value={summary.transactionCount}
          icon={Receipt}
          gradient="from-purple-500 to-indigo-500"
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

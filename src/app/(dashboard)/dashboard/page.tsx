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
import { ConnectedAccount } from "@/components/plaid/ConnectedAccount"
import { ConnectBankButton } from "@/components/plaid/ConnectBankButton"

export default async function DashboardPage() {
  const user = {
    institutionName: null,
  }

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
    <div className="space-y-6 max-w-7xl mx-auto">
      <div className="flex flex-col gap-3 sm:gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Dashboard</h1>
          <p className="mt-1 text-sm text-gray-600 dark:text-gray-400 sm:text-base">
            A quick overview of your recent activity, balances and trends.
          </p>
        </div>
        <div className="w-full sm:w-auto flex items-center gap-3">
          <div className="hidden sm:block text-sm text-gray-500 dark:text-gray-400">Connected accounts</div>
          <div>
            {user?.institutionName ? (
              <ConnectedAccount institutionName={user.institutionName} />
            ) : (
              <ConnectBankButton />
            )}
          </div>
        </div>
      </div>

      {/* KPI Cards */}
      <div className="grid gap-3 sm:gap-4 grid-cols-1 sm:grid-cols-2 lg:grid-cols-4">
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

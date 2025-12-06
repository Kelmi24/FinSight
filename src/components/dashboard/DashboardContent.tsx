"use client"

import { useEffect, useState } from "react"
import { useFilter } from "@/providers/filter-provider"
import { useCurrency } from "@/providers/currency-provider"
import {
  getSummaryMetrics,
  getCashFlowDataFiltered,
  getCategoryBreakdownFiltered,
  getSpendingTrendsFiltered,
  getRecentTransactionsFiltered,
} from "@/lib/actions/dashboard-filtered"
import { KpiCard } from "@/components/dashboard/KpiCard"
import { CashFlowChart } from "@/components/dashboard/CashFlowChart"
import { CategoryChart } from "@/components/dashboard/CategoryChart"
import { TrendChart } from "@/components/analytics/TrendChart"
import { MonthOverMonthComparison } from "@/components/analytics/MonthOverMonthComparison"
import { RecentTransactions } from "@/components/dashboard/RecentTransactions"
import { DollarSign, TrendingUp, TrendingDown, Receipt } from "lucide-react"

interface SummaryMetrics {
  totalIncome: number
  totalExpenses: number
  netBalance: number
  transactionCount: number
}

interface CashFlowData {
  month: string
  income: number
  expenses: number
}

interface CategoryData {
  category: string
  amount: number
}

interface TrendData {
  month: string
  income: number
  expenses: number
  net: number
}

interface Transaction {
  id: string
  date: Date
  description: string
  category: string
  amount: number
  type: string
}

export function DashboardContent() {
  const { filters } = useFilter()
  const { formatCurrency: baseCurrency } = useCurrency()
  
  const [summary, setSummary] = useState<SummaryMetrics | null>(null)
  const [cashFlowData, setCashFlowData] = useState<CashFlowData[]>([])
  const [categoryData, setCategoryData] = useState<CategoryData[]>([])
  const [trendData, setTrendData] = useState<TrendData[]>([])
  const [recentTransactions, setRecentTransactions] = useState<Transaction[]>([])
  const [isLoading, setIsLoading] = useState(true)

  const formatCurrency = (amount: number) => {
    // Amount is already converted, just format it
    return baseCurrency(amount)
  }

  // Fetch all data whenever filters change
  useEffect(() => {
    const fetchData = async () => {
      setIsLoading(true)
      try {
        const [summaryData, cashFlow, categories, trends, recentTxns] = await Promise.all([
          getSummaryMetrics(filters),
          getCashFlowDataFiltered(filters),
          getCategoryBreakdownFiltered(filters),
          getSpendingTrendsFiltered(filters),
          getRecentTransactionsFiltered(filters, 10),
        ])
        // Use stored amounts directly (what you type is what you save)
        setSummary({
          totalIncome: summaryData.totalIncome,
          totalExpenses: summaryData.totalExpenses,
          netBalance: summaryData.netBalance,
          transactionCount: summaryData.transactionCount,
        })
        setCashFlowData(cashFlow)
        setCategoryData(categories)
        setTrendData(trends)
        setRecentTransactions(recentTxns as Transaction[])
      } catch (error) {
        console.error("Failed to fetch dashboard data:", error)
      } finally {
        setIsLoading(false)
      }
    }

    fetchData()
  }, [filters])

  if (isLoading) {
    return (
      <div className="flex items-center justify-center p-12">
        <div className="h-8 w-8 animate-spin rounded-full border-4 border-gray-300 dark:border-gray-600 border-t-indigo-600"></div>
      </div>
    )
  }

  if (!summary) {
    return <div>No data available</div>
  }

  return (
    <div className="space-y-6">
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

      {/* Analytics Charts */}
      <div className="grid gap-6 lg:grid-cols-2">
        <TrendChart data={trendData} />
        <MonthOverMonthComparison />
      </div>

      {/* Recent Transactions */}
      <RecentTransactions transactions={recentTransactions} />
    </div>
  )
}

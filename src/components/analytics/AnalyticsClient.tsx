"use client"

import { useState, useEffect } from "react"
import { AnalyticsFilters, FilterValues } from "@/components/analytics/AnalyticsFilters"
import { TrendChart } from "@/components/analytics/TrendChart"
import { TransactionTable } from "@/components/analytics/TransactionTable"
import { ExportButton } from "@/components/analytics/ExportButton"
import { MonthOverMonthComparison } from "@/components/analytics/MonthOverMonthComparison"
import { Card } from "@/components/ui/card"
import { getFilteredTransactions, getSpendingTrends } from "@/lib/actions/analytics"

interface Transaction {
  id: string
  date: Date
  description: string
  category: string
  amount: number
  type: string
}

interface TrendData {
  month: string
  income: number
  expenses: number
  net: number
}

export function AnalyticsClient({ initialTransactions, initialTrends, categories }: {
  initialTransactions: Transaction[]
  initialTrends: TrendData[]
  categories: string[]
}) {
  const [transactions, setTransactions] = useState<Transaction[]>(initialTransactions)
  const [trends, setTrends] = useState<TrendData[]>(initialTrends)
  const [isLoading, setIsLoading] = useState(false)

  const handleFilterChange = async (filters: FilterValues) => {
    setIsLoading(true)
    
    const analyticsFilters = {
      startDate: filters.startDate || undefined,
      endDate: filters.endDate || undefined,
      category: filters.category !== "all" ? filters.category : undefined,
      type: filters.type !== "all" ? filters.type : undefined,
      minAmount: filters.minAmount ? parseFloat(filters.minAmount) : undefined,
      maxAmount: filters.maxAmount ? parseFloat(filters.maxAmount) : undefined,
    }

    const [newTransactions, newTrends] = await Promise.all([
      getFilteredTransactions(analyticsFilters),
      getSpendingTrends(analyticsFilters),
    ])

    setTransactions(newTransactions)
    setTrends(newTrends)
    setIsLoading(false)
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-3 sm:gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Analytics</h1>
          <p className="mt-1 text-sm text-gray-600 dark:text-gray-400">
            Deep insights into your spending patterns.
          </p>
        </div>
        <div className="w-full sm:w-auto">
          <ExportButton transactions={transactions} />
        </div>
      </div>

      {/* Filters Section */}
      <Card>
        <AnalyticsFilters onFilterChange={handleFilterChange} categories={categories} />
      </Card>

      {isLoading ? (
        <div className="flex items-center justify-center p-12">
          <div className="h-8 w-8 animate-spin rounded-full border-4 border-gray-300 border-t-blue-600" />
        </div>
      ) : (
        <div className="space-y-6">
          {/* Charts Section */}
          <div className="grid gap-6 md:grid-cols-2">
            <TrendChart data={trends} />
            <MonthOverMonthComparison />
          </div>

          {/* Transactions Section */}
          <div className="space-y-4">
            <h2 className="text-2xl font-semibold tracking-tight">
              Transactions ({transactions.length})
            </h2>
            <TransactionTable transactions={transactions} />
          </div>
        </div>
      )}
    </div>
  )
}

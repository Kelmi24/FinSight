"use client"

import { getSpendingTrends } from "@/lib/actions/analytics"
import { useEffect, useState } from "react"
import { TrendingUp, TrendingDown } from "lucide-react"

interface MonthComparison {
  month: string
  currentSpending: number
  previousSpending: number
  change: number
  changePercent: number
}

export function MonthOverMonthComparison() {
  const [comparison, setComparison] = useState<MonthComparison | null>(null)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    const loadData = async () => {
      setIsLoading(true)
      const trends = await getSpendingTrends({})
      
      if (trends.length >= 2) {
        const current = trends[trends.length - 1]
        const previous = trends[trends.length - 2]
        
        const changePercent = previous.expenses
          ? ((current.expenses - previous.expenses) / previous.expenses) * 100
          : 0
        
        setComparison({
          month: current.month,
          currentSpending: current.expenses,
          previousSpending: previous.expenses,
          change: current.expenses - previous.expenses,
          changePercent,
        })
      }
      setIsLoading(false)
    }
    loadData()
  }, [])

  if (isLoading || !comparison) {
    return null
  }

  const isIncrease = comparison.change > 0
  const formattedChange = Math.abs(comparison.change).toFixed(2)
  const formattedPercent = Math.abs(comparison.changePercent).toFixed(1)

  return (
    <div className="rounded-lg border bg-white dark:bg-gray-950 dark:border-gray-800 p-6">
      <h3 className="font-semibold text-lg mb-4">Month-over-Month Comparison</h3>
      
      <div className="space-y-4">
        <div>
          <p className="text-sm text-gray-600 dark:text-gray-400">{comparison.month}</p>
          <p className="text-2xl font-bold">${comparison.currentSpending.toFixed(2)}</p>
        </div>

        <div className={`flex items-center gap-2 p-3 rounded-lg ${
          isIncrease 
            ? 'bg-red-50 dark:bg-red-950/20' 
            : 'bg-green-50 dark:bg-green-950/20'
        }`}>
          {isIncrease ? (
            <TrendingUp className="h-5 w-5 text-red-600 dark:text-red-400" />
          ) : (
            <TrendingDown className="h-5 w-5 text-green-600 dark:text-green-400" />
          )}
          <div>
            <p className={`font-semibold ${
              isIncrease 
                ? 'text-red-600 dark:text-red-400' 
                : 'text-green-600 dark:text-green-400'
            }`}>
              {isIncrease ? '↑' : '↓'} ${formattedChange} ({formattedPercent}%)
            </p>
            <p className="text-xs text-gray-600 dark:text-gray-400">
              vs previous month
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}

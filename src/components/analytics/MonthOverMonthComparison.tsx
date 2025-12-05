"use client"

import { getSpendingTrends } from "@/lib/actions/analytics"
import { useEffect, useState } from "react"
import { TrendingUp, TrendingDown } from "lucide-react"
import { useCurrency } from "@/providers/currency-provider"

interface MonthComparison {
  month: string
  currentSpending: number
  previousSpending: number
  change: number
  changePercent: number
}

export function MonthOverMonthComparison() {
  const { formatCurrency } = useCurrency()
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
  const formattedChange = formatCurrency(Math.abs(comparison.change))
  const formattedPercent = Math.abs(comparison.changePercent).toFixed(1)

  return (
    <div className="rounded-xl border border-gray-200 bg-white p-6">
      <h3 className="font-semibold text-lg text-gray-900 mb-4">Month-over-Month Comparison</h3>
      
      <div className="space-y-4">
        <div>
          <p className="text-sm text-gray-600">{comparison.month}</p>
          <p className="text-2xl font-bold text-gray-900">{formatCurrency(comparison.currentSpending)}</p>
        </div>

        <div className={`flex items-center gap-2 p-3 rounded-lg ${
          isIncrease 
            ? 'bg-red-50' 
            : 'bg-green-50'
        }`}>
          {isIncrease ? (
            <TrendingUp className="h-5 w-5 text-red-600" />
          ) : (
            <TrendingDown className="h-5 w-5 text-green-600" />
          )}
          <div>
            <p className={`font-semibold ${
              isIncrease 
                ? 'text-red-600' 
                : 'text-green-600'
            }`}>
              {isIncrease ? '↑' : '↓'} {formattedChange} ({formattedPercent}%)
            </p>
            <p className="text-xs text-gray-600">
              vs previous month
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}

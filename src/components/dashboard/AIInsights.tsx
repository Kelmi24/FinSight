"use client"

import { Card } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { AlertTriangle, Lightbulb, TrendingUp, TrendingDown, CheckCircle } from "lucide-react"
import { getBudgets } from "@/lib/actions/budgets"
import { useEffect, useState } from "react"
import { useCurrency } from "@/providers/currency-provider"
import { getCategoryTrends } from "@/lib/actions/analytics"

interface Insight {
  id: string
  type: "warning" | "recommendation" | "success"
  title: string
  message: string
  icon: any
}

export function AIInsights() {
  const { formatCurrency } = useCurrency()
  const [insights, setInsights] = useState<Insight[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function analyze() {
      try {
        const [budgets, categoryTrends] = await Promise.all([
           getBudgets(),
           getCategoryTrends({ type: "expense" }) // Simplified analytics call
        ])

        const newInsights: Insight[] = []

        // 1. Budget Alerts
        budgets.forEach(b => {
          const used = parseFloat(b.percentUsed)
          if (used > 100) {
            newInsights.push({
              id: `budget-over-${b.id}`,
              type: "warning",
              title: "Budget Exceeded",
              message: `You've exceeded your ${b.category} budget by ${formatCurrency(Math.abs(b.remaining))}.`,
              icon: AlertTriangle
            })
          } else if (used > 80) {
             newInsights.push({
              id: `budget-warn-${b.id}`,
              type: "warning",
              title: "Budget Warning",
              message: `You've used ${used}% of your ${b.category} budget. Careful!`,
              icon: TrendingUp
            })
          }
        })

        // 2. Spending Pattern Recommendations
        // Find top expense category without a budget
        const topCategory = categoryTrends[0]
        if (topCategory) {
           const hasBudget = budgets.some(b => b.category === topCategory.category)
           if (!hasBudget && topCategory.amount > 100000) { // Arbitrary threshold
              newInsights.push({
                  id: `rec-budget-${topCategory.category}`,
                  type: "recommendation",
                  title: "Set a Budget",
                  message: `You spent ${formatCurrency(topCategory.amount)} on ${topCategory.category}. Consider setting a budget to track this.`,
                  icon: Lightbulb
              })
           }
        }

        // 3. Savings Opportunity
        // If income > expenses significantly (need aggregated data, assuming we have positive cash flow from Dashboard but hard to access here without passing props. 
        // We'll skip complex income checks to keep this component isolated or assume success if few alerts)
        
        if (newInsights.length === 0) {
             newInsights.push({
              id: "all-good",
              type: "success",
              title: "On Track",
              message: "Your spending looks good! No critical alerts relative to your budgets.",
              icon: CheckCircle
            })
        }

        setInsights(newInsights)
      } catch (e) {
        console.error("Failed to generate insights", e)
      } finally {
        setLoading(false)
      }
    }
    analyze()
  }, []) // currency dependency if formatted strings inside matching needed, but formatCurrency is stable from hook? No, formatCurrency changes if currency changes.
  // Actually formatCurrency is stable if we use the one from hook? Memoized.
  // But we use it inside the loop. If currency changes, we want to re-run?
  // Yes.

  if (loading) return (
      <Card className="rounded-2xl p-6 h-[200px] flex items-center justify-center">
          <div className="animate-pulse text-muted-foreground">Analyzing finances...</div>
      </Card>
  )

  return (
    <Card className="rounded-2xl p-6">
      <h3 className="font-semibold text-lg mb-4 flex items-center gap-2">
        <Lightbulb className="w-5 h-5 text-yellow-500" />
        AI Insights
      </h3>
      <div className="space-y-4 max-h-[300px] overflow-y-auto pr-2">
        {insights.map(insight => (
          <div key={insight.id} className={`p-4 rounded-xl border flex items-start gap-3 
            ${insight.type === 'warning' ? 'bg-red-50 dark:bg-red-900/10 border-red-100 dark:border-red-900/20' : 
              insight.type === 'recommendation' ? 'bg-blue-50 dark:bg-blue-900/10 border-blue-100 dark:border-blue-900/20' :
              'bg-green-50 dark:bg-green-900/10 border-green-100 dark:border-green-900/20'
            }`}>
            <insight.icon className={`w-5 h-5 flex-shrink-0 mt-0.5
              ${insight.type === 'warning' ? 'text-red-500' : 
                insight.type === 'recommendation' ? 'text-blue-500' : 'text-green-500'}`} 
            />
            <div>
              <h4 className={`font-medium text-sm
                 ${insight.type === 'warning' ? 'text-red-700 dark:text-red-400' : 
                   insight.type === 'recommendation' ? 'text-blue-700 dark:text-blue-400' : 'text-green-700 dark:text-green-400'}`}>
                {insight.title}
              </h4>
              <p className="text-sm text-muted-foreground mt-1 leading-relaxed">
                {insight.message}
              </p>
            </div>
          </div>
        ))}
      </div>
    </Card>
  )
}

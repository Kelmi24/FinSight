"use client"

import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts"
import { Card, CardContent } from "@/components/ui/card"

interface CashFlowChartProps {
  data: Array<{
    month: string
    income: number
    expenses: number
  }>
}

export function CashFlowChart({ data }: CashFlowChartProps) {
  if (data.length === 0) {
    return (
      <div className="flex h-[300px] items-center justify-center rounded-md border-2 border-dashed border-gray-300 bg-gradient-to-br from-gray-50 to-gray-100 dark:border-gray-700 dark:from-gray-900 dark:to-gray-950">
        <p className="text-gray-600 dark:text-gray-400 font-medium">
          No data available. Add transactions to see your cash flow.
        </p>
      </div>
    )
  }

  return (
    <Card>
      <CardContent>
        <h3 className="text-lg font-semibold mb-4">💹 Cash Flow Trends</h3>
        <ResponsiveContainer width="100%" height={300}>
          <LineChart data={data}>
            <CartesianGrid strokeDasharray="3 3" className="stroke-gray-200 dark:stroke-gray-800" />
            <XAxis
              dataKey="month"
              className="text-xs text-gray-600 dark:text-gray-400"
              stroke="#d1d5db"
            />
            <YAxis
              className="text-xs text-gray-600 dark:text-gray-400"
              stroke="#d1d5db"
              tickFormatter={(value) => `$${value.toLocaleString()}`}
            />
            <Tooltip
              contentStyle={{
                backgroundColor: "rgba(255, 255, 255, 0.95)",
                border: "2px solid #e5e7eb",
                borderRadius: "0.875rem",
                boxShadow: "0 10px 25px rgba(0, 0, 0, 0.1)",
              }}
              formatter={(value: number) => `$${value.toLocaleString()}`}
            />
            <Legend wrapperStyle={{ paddingTop: "1rem" }} />
            <Line
              type="monotone"
              dataKey="income"
              stroke="#10b981"
              strokeWidth={3}
              name="Income"
              dot={{ r: 5, fill: "#10b981", strokeWidth: 2, stroke: "#fff" }}
              activeDot={{ r: 7 }}
            />
            <Line
              type="monotone"
              dataKey="expenses"
              stroke="#ef4444"
              strokeWidth={3}
              name="Expenses"
              dot={{ r: 5, fill: "#ef4444", strokeWidth: 2, stroke: "#fff" }}
              activeDot={{ r: 7 }}
            />
          </LineChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  )
}

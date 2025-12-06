"use client"

import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from "recharts"
import { Card } from "@/components/ui/card"
import { useCurrency } from "@/providers/currency-provider"

interface TrendData {
  month: string
  income: number
  expenses: number
  net: number
}

interface TrendChartProps {
  data: TrendData[]
}

export function TrendChart({ data }: TrendChartProps) {
  const { formatCurrency } = useCurrency()
  
  if (data.length === 0) {
    return (
      <Card>
        <h3 className="font-semibold text-lg text-gray-900 mb-4">Spending Trends</h3>
        <div className="flex h-[300px] items-center justify-center text-gray-500">
          No data available for the selected filters
        </div>
      </Card>
    )
  }

  return (
    <Card>
      <h3 className="font-semibold text-lg text-gray-900 mb-4">Spending Trends</h3>
      <ResponsiveContainer width="100%" height={300}>
        <LineChart data={data}>
          <CartesianGrid strokeDasharray="3 3" stroke="#E5E7EB" />
          <XAxis
            dataKey="month"
            className="text-xs"
            tick={{ fill: "currentColor" }}
          />
          <YAxis
            className="text-xs"
            tick={{ fill: "currentColor" }}
            tickFormatter={(value) => formatCurrency(value)}
          />
          <Tooltip
            contentStyle={{
              backgroundColor: "#ffffff",
              border: "1px solid #E5E7EB",
              borderRadius: "12px",
              boxShadow: "0 4px 6px -1px rgba(0, 0, 0, 0.1)",
            }}
            formatter={(value: number) => formatCurrency(value)}
          />
          <Legend />
          <Line
            type="monotone"
            dataKey="income"
            stroke="#10b981"
            strokeWidth={2}
            name="Income"
          />
          <Line
            type="monotone"
            dataKey="expenses"
            stroke="#ef4444"
            strokeWidth={2}
            name="Expenses"
          />
          <Line
            type="monotone"
            dataKey="net"
            stroke="#4F46E5"
            strokeWidth={2}
            name="Net"
          />
        </LineChart>
      </ResponsiveContainer>
    </Card>
  )
}

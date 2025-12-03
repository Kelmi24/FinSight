"use client"

import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from "recharts"

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
  if (data.length === 0) {
    return (
      <div className="rounded-lg border bg-white p-6 shadow-sm dark:bg-gray-950 dark:border-gray-800">
        <h3 className="font-semibold text-lg mb-4">Spending Trends</h3>
        <div className="flex h-[300px] items-center justify-center text-gray-500 dark:text-gray-400">
          No data available for the selected filters
        </div>
      </div>
    )
  }

  return (
    <div className="rounded-lg border bg-white p-6 shadow-sm dark:bg-gray-950 dark:border-gray-800">
      <h3 className="font-semibold text-lg mb-4">Spending Trends</h3>
      <ResponsiveContainer width="100%" height={300}>
        <LineChart data={data}>
          <CartesianGrid strokeDasharray="3 3" className="stroke-gray-200 dark:stroke-gray-800" />
          <XAxis
            dataKey="month"
            className="text-xs"
            tick={{ fill: "currentColor" }}
          />
          <YAxis
            className="text-xs"
            tick={{ fill: "currentColor" }}
            tickFormatter={(value) => `$${value.toLocaleString()}`}
          />
          <Tooltip
            contentStyle={{
              backgroundColor: "hsl(var(--background))",
              border: "1px solid hsl(var(--border))",
              borderRadius: "0.5rem",
            }}
            formatter={(value: number) => `$${value.toFixed(2)}`}
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
            stroke="#3b82f6"
            strokeWidth={2}
            name="Net"
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  )
}

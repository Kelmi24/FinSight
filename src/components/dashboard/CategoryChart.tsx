"use client"

import { PieChart, Pie, Cell, ResponsiveContainer, Legend, Tooltip } from "recharts"
import { Card, CardContent } from "@/components/ui/card"

interface CategoryChartProps {
  data: Array<{
    category: string
    amount: number
  }>
}

const COLORS = [
  "#3b82f6", // blue
  "#10b981", // green
  "#f59e0b", // amber
  "#ef4444", // red
  "#8b5cf6", // purple
  "#ec4899", // pink
  "#06b6d4", // cyan
  "#84cc16", // lime
]

export function CategoryChart({ data }: CategoryChartProps) {
  if (data.length === 0) {
    return (
      <div className="flex h-[300px] items-center justify-center rounded-md border-2 border-dashed border-gray-300 bg-gradient-to-br from-gray-50 to-gray-100 dark:border-gray-700 dark:from-gray-900 dark:to-gray-950">
        <p className="text-gray-600 dark:text-gray-400 font-medium">
          No expense data available.
        </p>
      </div>
    )
  }

  return (
    <Card>
      <CardContent>
        <h3 className="text-lg font-semibold mb-4">📊 Spending Breakdown</h3>
        <ResponsiveContainer width="100%" height={300}>
          <PieChart>
            <Pie
              data={data}
              cx="50%"
              cy="50%"
              labelLine={false}
              label={({ name, percent }) =>
                percent ? `${name} ${(percent * 100).toFixed(0)}%` : name
              }
              outerRadius={90}
              innerRadius={45}
              fill="#8884d8"
              dataKey="amount"
              nameKey="category"
            >
              {data.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
              ))}
            </Pie>
            <Tooltip 
              contentStyle={{
                backgroundColor: "rgba(255, 255, 255, 0.95)",
                border: "2px solid #e5e7eb",
                borderRadius: "0.875rem",
                boxShadow: "0 10px 25px rgba(0, 0, 0, 0.1)",
              }}
              formatter={(value: number) => `$${value.toLocaleString()}`} 
            />
          </PieChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  )
}

"use client"

import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, Area, ComposedChart } from "recharts"
import { Card } from "@/components/ui/card"
import { useCurrency } from "@/providers/currency-provider"
import { useEffect, useState } from "react"
import { getForecastData } from "@/lib/actions/analytics"

interface ForecastPoint {
  date: string
  actual?: number
  predicted: number
  lowerBound: number
  upperBound: number
}

export function ForecastChart() {
  const { formatCurrency } = useCurrency()
  const [data, setData] = useState<ForecastPoint[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function load() {
      try {
        const result = await getForecastData(30);
        setData(result);
      } catch (e) {
        console.error("Failed to load forecast", e);
      } finally {
        setLoading(false);
      }
    }
    load();
  }, []);

  if (loading) {
    return (
      <Card className="rounded-2xl p-6 h-[400px] flex items-center justify-center">
        <div className="text-muted-foreground animate-pulse">Loading Forecast AI...</div>
      </Card>
    )
  }
  
  if (data.length === 0) {
    return (
      <Card className="rounded-2xl p-6 h-[400px] flex items-center justify-center">
        <div className="text-muted-foreground">Not enough data for AI forecasting (Need ~30 days)</div>
      </Card>
    )
  }

  return (
    <Card className="rounded-2xl p-6">
      <div className="flex justify-between items-center mb-6">
        <div>
           <h3 className="font-semibold text-lg text-foreground">AI Spending Forecast</h3>
           <p className="text-sm text-muted-foreground">Predicted expenses for next 30 days based on your history</p>
        </div>
      </div>

      <ResponsiveContainer width="100%" height={300}>
        <ComposedChart data={data}>
          <defs>
            <linearGradient id="colorPredicted" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor="#8884d8" stopOpacity={0.8}/>
              <stop offset="95%" stopColor="#8884d8" stopOpacity={0}/>
            </linearGradient>
          </defs>
          <CartesianGrid strokeDasharray="3 3" stroke="#E5E7EB" vertical={false} />
          <XAxis 
            dataKey="date" 
            tickFormatter={(value) => {
              const date = new Date(value);
              return `${date.getDate()}/${date.getMonth() + 1}`;
            }}
            className="text-xs text-muted-foreground"
            tick={{ fill: "currentColor" }}
            minTickGap={30}
          />
          <YAxis 
            className="text-xs text-muted-foreground"
            tick={{ fill: "currentColor" }}
            tickFormatter={(value) => formatCurrency(value, { maximumFractionDigits: 0 })}
          />
          <Tooltip 
             contentStyle={{ 
               backgroundColor: "hsl(var(--background))", 
               borderColor: "hsl(var(--border))",
               borderRadius: "8px"
             }}
             formatter={(value: number) => formatCurrency(value)}
             labelFormatter={(label) => new Date(label).toLocaleDateString()}
          />
          <Legend />
          
          {/* Actual Spending (Historical) */}
          <Line 
            type="monotone" 
            dataKey="actual" 
            stroke="#10b981" 
            strokeWidth={2} 
            dot={false}
            name="Actual Spending"
          />

          {/* Predicted (Future) */}
          <Line 
            type="monotone" 
            dataKey="predicted" 
            stroke="#8884d8" 
            strokeDasharray="5 5" 
            strokeWidth={2}
            dot={false}
            name="AI Prediction"
          />

          {/* Confidence Interval (Visualized as area or range) */}
          {/* Using Area for bounds if needed, but composed lines are cleaner for now */}
          
        </ComposedChart>
      </ResponsiveContainer>
    </Card>
  )
}

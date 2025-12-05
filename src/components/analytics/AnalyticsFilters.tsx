"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { DatePicker } from "@/components/ui/date-picker"
import { Card, CardContent } from "@/components/ui/card"

export interface FilterValues {
  startDate: string
  endDate: string
  category: string
  type: "income" | "expense" | "all"
  minAmount: string
  maxAmount: string
}

interface AnalyticsFiltersProps {
  onFilterChange: (filters: FilterValues) => void
  categories: string[]
}

export function AnalyticsFilters({ onFilterChange, categories }: AnalyticsFiltersProps) {
  const [filters, setFilters] = useState<FilterValues>({
    startDate: "",
    endDate: "",
    category: "all",
    type: "all",
    minAmount: "",
    maxAmount: "",
  })

  const handleChange = (key: keyof FilterValues, value: string) => {
    const newFilters = { ...filters, [key]: value }
    setFilters(newFilters)
    onFilterChange(newFilters)
  }

  const handleReset = () => {
    const resetFilters: FilterValues = {
      startDate: "",
      endDate: "",
      category: "all",
      type: "all",
      minAmount: "",
      maxAmount: "",
    }
    setFilters(resetFilters)
    onFilterChange(resetFilters)
  }

  return (
    <>
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-lg font-semibold">Filters</h3>
        <Button variant="ghost" size="sm" onClick={handleReset}>
          Reset
        </Button>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        <div className="space-y-2">
          <Label htmlFor="startDate">Start Date</Label>
          <DatePicker
            id="startDate"
            name="startDate"
            value={filters.startDate}
            onChange={(value) => handleChange("startDate", value)}
            placeholder="Select start date"
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="endDate">End Date</Label>
          <DatePicker
            id="endDate"
            name="endDate"
            value={filters.endDate}
            onChange={(value) => handleChange("endDate", value)}
            placeholder="Select end date"
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="type">Type</Label>
          <Select value={filters.type} onValueChange={(value) => handleChange("type", value)}>
            <SelectTrigger id="type">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All</SelectItem>
              <SelectItem value="income">Income</SelectItem>
              <SelectItem value="expense">Expense</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-2">
          <Label htmlFor="category">Category</Label>
          <Select value={filters.category} onValueChange={(value) => handleChange("category", value)}>
            <SelectTrigger id="category">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Categories</SelectItem>
              {categories.map((cat) => (
                <SelectItem key={cat} value={cat}>
                  {cat}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-2">
          <Label htmlFor="minAmount">Min Amount</Label>
          <Input
            id="minAmount"
            type="number"
            step="0.01"
            placeholder="0.00"
            value={filters.minAmount}
            onChange={(e) => handleChange("minAmount", e.target.value)}
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="maxAmount">Max Amount</Label>
          <Input
            id="maxAmount"
            type="number"
            step="0.01"
            placeholder="0.00"
            value={filters.maxAmount}
            onChange={(e) => handleChange("maxAmount", e.target.value)}
          />
        </div>
      </div>
    </>
  )
}

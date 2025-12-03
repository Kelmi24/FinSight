"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { CustomSelect as Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/custom-select"

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
    <div className="rounded-lg border bg-white p-6 shadow-sm dark:bg-gray-950 dark:border-gray-800">
      <div className="flex items-center justify-between mb-4">
        <h3 className="font-semibold text-lg">Filters</h3>
        <Button variant="ghost" size="sm" onClick={handleReset}>
          Reset
        </Button>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        <div className="space-y-2">
          <Label htmlFor="startDate">Start Date</Label>
          <Input
            id="startDate"
            type="date"
            value={filters.startDate}
            onChange={(e) => handleChange("startDate", e.target.value)}
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="endDate">End Date</Label>
          <Input
            id="endDate"
            type="date"
            value={filters.endDate}
            onChange={(e) => handleChange("endDate", e.target.value)}
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
    </div>
  )
}

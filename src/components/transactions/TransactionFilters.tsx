"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { DateRangePicker } from "@/components/ui/date-range-picker"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { X } from "lucide-react"

const CATEGORIES = [
  "Food & Drink",
  "Transport",
  "Shopping",
  "Entertainment",
  "Utilities",
  "Healthcare",
  "Education",
  "Income",
  "Other",
]

interface TransactionFiltersProps {
  onFilter: (filters: {
    startDate?: Date
    endDate?: Date
    category?: string
    type?: string
  }) => void
}

export function TransactionFilters({ onFilter }: TransactionFiltersProps) {
  const [startDate, setStartDate] = useState<string | null>(null)
  const [endDate, setEndDate] = useState<string | null>(null)
  const [category, setCategory] = useState("")
  const [type, setType] = useState("")
  const [isOpen, setIsOpen] = useState(false)

  const handleDateRangeChange = (range: { startDate: string | null; endDate: string | null }) => {
    setStartDate(range.startDate)
    setEndDate(range.endDate)
  }

  const handleApplyFilters = () => {
    const filters: any = {}
    if (startDate) filters.startDate = new Date(startDate)
    if (endDate) filters.endDate = new Date(endDate)
    if (category && category !== "all") filters.category = category
    if (type && type !== "all") filters.type = type
    onFilter(filters)
    setIsOpen(false)
  }

  const handleReset = () => {
    setStartDate(null)
    setEndDate(null)
    setCategory("")
    setType("")
    onFilter({})
  }

  const hasFilters = startDate || endDate || category || type

  return (
    <div className="space-y-3 sm:space-y-4">
      <div className="flex gap-2 items-center">
        <Button
          variant="outline"
          onClick={() => setIsOpen(!isOpen)}
          className={`text-sm flex items-center gap-2 ${hasFilters ? "ring-2 ring-primary-500" : ""}`}
          size="sm"
        >
          <svg className="h-4 w-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 10H7"/><path d="M21 6H3"/><path d="M21 14H11"/></svg>
          <span>Filters</span>
          {hasFilters && <span className="ml-2 text-xs">({[startDate, endDate, category, type].filter(Boolean).length})</span>}
        </Button>
        {hasFilters && (
          <Button variant="ghost" size="sm" onClick={handleReset} className="text-gray-600 text-xs sm:text-sm">
            <X className="h-4 w-4 mr-1" />
            Clear
          </Button>
        )}
      </div>

      {isOpen && (
        <Card className="animate-in fade-in">
          <CardContent>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {/* Date Range Picker - Single Component */}
              <div className="sm:col-span-2">
                <label className="text-xs sm:text-sm font-medium">Date Range</label>
                <DateRangePicker
                  startDate={startDate}
                  endDate={endDate}
                  onChange={handleDateRangeChange}
                  placeholder="Select date range"
                  className="mt-1"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-4">
              <div>
                <label className="text-sm font-medium">Category</label>
                <Select
                  value={category}
                  onValueChange={setCategory}
                >
                  <SelectTrigger className="mt-1">
                    <SelectValue placeholder="All Categories" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Categories</SelectItem>
                    {CATEGORIES.map((cat) => (
                      <SelectItem key={cat} value={cat}>
                        {cat}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div>
                <label className="text-sm font-medium">Type</label>
                <Select
                  value={type}
                  onValueChange={setType}
                >
                  <SelectTrigger className="mt-1">
                    <SelectValue placeholder="All Types" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Types</SelectItem>
                    <SelectItem value="income">Income</SelectItem>
                    <SelectItem value="expense">Expense</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="flex gap-2 pt-4 justify-end">
              <Button
                variant="outline"
                onClick={() => setIsOpen(false)}
              >
                Cancel
              </Button>
              <Button onClick={handleApplyFilters}>
                Apply Filters
              </Button>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  )
}

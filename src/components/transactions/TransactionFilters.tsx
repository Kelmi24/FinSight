"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent } from "@/components/ui/card"
import { DatePicker } from "@/components/ui/date-picker"
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
  const [startDate, setStartDate] = useState("")
  const [endDate, setEndDate] = useState("")
  const [category, setCategory] = useState("")
  const [type, setType] = useState("")
  const [isOpen, setIsOpen] = useState(false)

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
    setStartDate("")
    setEndDate("")
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
          className={`text-sm flex items-center gap-2 ${hasFilters ? "ring-2 ring-blue-500" : ""}`}
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
            <div>
              <label className="text-xs sm:text-sm font-medium">Start Date</label>
              <DatePicker
                name="startDate"
                value={startDate}
                onChange={setStartDate}
                className="mt-1"
                placeholder="Select start date"
              />
            </div>

            <div>
              <label className="text-xs sm:text-sm font-medium">End Date</label>
              <DatePicker
                name="endDate"
                value={endDate}
                onChange={setEndDate}
                className="mt-1"
                placeholder="Select end date"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
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

          <div className="flex gap-2 pt-2 justify-end">
            <Button
              variant="outline"
              onClick={() => setIsOpen(false)}
              className=""
            >
              Cancel
            </Button>
            <Button onClick={handleApplyFilters} className="">
              Apply Filters
            </Button>
          </div>
          </CardContent>
        </Card>
      )}
    </div>
  )
}

"use client"

import { useFilter } from "@/providers/filter-provider"
import { getFilterSummary } from "@/lib/filterUtils"
import { Button } from "@/components/ui/button"
import { DatePicker } from "@/components/ui/date-picker"
import { Card } from "@/components/ui/card"
import { X } from "lucide-react"

interface DashboardFiltersProps {
  categories: string[]
}

export function DashboardFilters({ categories }: DashboardFiltersProps) {
  const { filters, updateFilter, resetFilters, hasActiveFilters, getActiveFilterCount } = useFilter()

  const handleResetFilters = () => {
    resetFilters()
  }

  const activeCount = getActiveFilterCount()
  const filterSummary = getFilterSummary(filters)

  const handleCategoryChange = (category: string) => {
    if (filters.categories.includes(category)) {
      updateFilter('categories', filters.categories.filter(c => c !== category))
    } else {
      updateFilter('categories', [...filters.categories, category])
    }
  }

  return (
    <div className="space-y-4">
      {/* Filter Summary */}
      {hasActiveFilters() && (
        <div className="flex items-center justify-between bg-blue-50 dark:bg-blue-950 border border-blue-200 dark:border-blue-800 rounded-lg px-4 py-3">
          <div className="flex items-center gap-2">
            <span className="text-sm font-medium text-blue-900 dark:text-blue-100">
              {activeCount} filter{activeCount === 1 ? '' : 's'} applied:
            </span>
            <span className="text-sm text-blue-700 dark:text-blue-200">{filterSummary}</span>
          </div>
          <Button
            variant="ghost"
            size="sm"
            onClick={handleResetFilters}
            className="h-8 px-2 text-blue-600 dark:text-blue-300 hover:text-blue-900 dark:hover:text-blue-100"
          >
            <X className="h-4 w-4 mr-1" />
            Clear
          </Button>
        </div>
      )}

      {/* Filter Controls */}
      <Card className="p-4">
        <div className="grid gap-4 grid-cols-1 sm:grid-cols-2 lg:grid-cols-5">
          {/* Start Date */}
          <div className="space-y-2">
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
              From Date
            </label>
            <DatePicker
              value={filters.startDate || undefined}
              onChange={(date) => updateFilter('startDate', date || null)}
              placeholder="Select start date"
            />
          </div>

          {/* End Date */}
          <div className="space-y-2">
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
              To Date
            </label>
            <DatePicker
              value={filters.endDate || undefined}
              onChange={(date) => updateFilter('endDate', date || null)}
              placeholder="Select end date"
            />
          </div>

          {/* Category Filter - Simple Dropdown */}
          <div className="space-y-2">
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
              Category
            </label>
            <select
              value={filters.categories[0] || ''}
              onChange={(e) => {
                if (e.target.value) {
                  updateFilter('categories', [e.target.value])
                } else {
                  updateFilter('categories', [])
                }
              }}
              className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 text-sm"
            >
              <option value="">All categories</option>
              {categories.map((cat) => (
                <option key={cat} value={cat}>
                  {cat}
                </option>
              ))}
            </select>
          </div>

          {/* Type Filter */}
          <div className="space-y-2">
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
              Type
            </label>
            <select
              value={filters.type}
              onChange={(e) =>
                updateFilter('type', e.target.value as 'all' | 'income' | 'expense')
              }
              className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 text-sm"
            >
              <option value="all">All Types</option>
              <option value="income">Income</option>
              <option value="expense">Expenses</option>
            </select>
          </div>

          {/* Min Amount */}
          <div className="space-y-2">
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
              Min Amount
            </label>
            <input
              type="number"
              value={filters.minAmount ?? ''}
              onChange={(e) => updateFilter('minAmount', e.target.value ? parseFloat(e.target.value) : null)}
              placeholder="0"
              className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 text-sm"
            />
          </div>
        </div>

        {/* Second Row for Max Amount */}
        <div className="mt-4 grid gap-4 grid-cols-1 sm:grid-cols-2 lg:grid-cols-5">
          {/* Max Amount - Span 1 column */}
          <div className="space-y-2">
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
              Max Amount
            </label>
            <input
              type="number"
              value={filters.maxAmount ?? ''}
              onChange={(e) => updateFilter('maxAmount', e.target.value ? parseFloat(e.target.value) : null)}
              placeholder="No limit"
              className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 text-sm"
            />
          </div>

          {/* Reset Button - Span remaining columns */}
          <div className="sm:col-span-1 lg:col-span-4 flex items-end">
            <Button
              onClick={handleResetFilters}
              variant="outline"
              size="sm"
              className="w-full sm:w-auto"
            >
              Reset All Filters
            </Button>
          </div>
        </div>
      </Card>
    </div>
  )
}

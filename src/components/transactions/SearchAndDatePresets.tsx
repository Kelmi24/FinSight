"use client"

import { useState } from "react"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Search, Calendar, X } from "lucide-react"
import { useFilter } from "@/providers/filter-provider"
import { DATE_PRESETS, DATE_PRESET_LABELS, applyDatePreset } from "@/lib/date-presets"
import { useDebouncedCallback } from "use-debounce"

interface SearchAndDatePresetsProps {
  placeholder?: string
}

/**
 * Search input with date range presets
 * Provides quick filtering for transactions
 */
export function SearchAndDatePresets({
  placeholder = "Search transactions...",
}: SearchAndDatePresetsProps) {
  const { filters, updateFilter, setFilters } = useFilter()
  const [localSearchQuery, setLocalSearchQuery] = useState(filters.searchQuery)

  // Debounce search input to avoid excessive filtering
  const debouncedSearch = useDebouncedCallback((value: string) => {
    updateFilter("searchQuery", value)
  }, 300)

  const handleSearchChange = (value: string) => {
    setLocalSearchQuery(value)
    debouncedSearch(value)
  }

  const handlePresetChange = (preset: string) => {
    if (preset === "custom") {
      // Keep current dates - user will adjust manually
      return
    }

    const range = applyDatePreset(preset as keyof typeof DATE_PRESETS)
    setFilters({
      ...filters,
      startDate: range.startDate,
      endDate: range.endDate,
    })
  }

  const clearSearch = () => {
    setLocalSearchQuery("")
    updateFilter("searchQuery", "")
  }

  const clearDates = () => {
    setFilters({
      ...filters,
      startDate: null,
      endDate: null,
    })
  }

  const hasDateFilter = filters.startDate || filters.endDate

  return (
    <div className="flex flex-col sm:flex-row gap-3">
      {/* Search Input */}
      <div className="relative flex-1">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
        <Input
          type="text"
          placeholder={placeholder}
          value={localSearchQuery}
          onChange={(e) => handleSearchChange(e.target.value)}
          className="pl-9 pr-9"
          aria-label="Search transactions"
        />
        {localSearchQuery && (
          <button
            onClick={clearSearch}
            className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
            aria-label="Clear search"
          >
            <X className="h-4 w-4" />
          </button>
        )}
      </div>

      {/* Date Range Presets */}
      <div className="flex gap-2">
        <Select onValueChange={handlePresetChange}>
          <SelectTrigger className="w-[160px]" aria-label="Select date range">
            <Calendar className="h-4 w-4 mr-2" />
            <SelectValue placeholder="Date range" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="today">{DATE_PRESET_LABELS.today}</SelectItem>
            <SelectItem value="yesterday">{DATE_PRESET_LABELS.yesterday}</SelectItem>
            <SelectItem value="last7Days">{DATE_PRESET_LABELS.last7Days}</SelectItem>
            <SelectItem value="last30Days">{DATE_PRESET_LABELS.last30Days}</SelectItem>
            <SelectItem value="thisMonth">{DATE_PRESET_LABELS.thisMonth}</SelectItem>
            <SelectItem value="lastMonth">{DATE_PRESET_LABELS.lastMonth}</SelectItem>
            <SelectItem value="thisYear">{DATE_PRESET_LABELS.thisYear}</SelectItem>
            <SelectItem value="lastYear">{DATE_PRESET_LABELS.lastYear}</SelectItem>
            <SelectItem value="allTime">{DATE_PRESET_LABELS.allTime}</SelectItem>
            <SelectItem value="custom">Custom Range</SelectItem>
          </SelectContent>
        </Select>

        {hasDateFilter && (
          <Button
            variant="ghost"
            size="icon"
            onClick={clearDates}
            aria-label="Clear date filter"
          >
            <X className="h-4 w-4" />
          </Button>
        )}
      </div>
    </div>
  )
}

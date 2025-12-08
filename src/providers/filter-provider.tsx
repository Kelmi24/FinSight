"use client";

import React, { createContext, useContext, useState, useCallback, useEffect } from "react";
import { useDebouncedCallback } from 'use-debounce';

/**
 * Dashboard filter interface for consistent filter structure across app
 */
export interface DashboardFilters {
  startDate: string | null;
  endDate: string | null;
  categories: string[];
  type: "all" | "income" | "expense";
  minAmount: number | null;
  maxAmount: number | null;
  searchQuery: string;
}

/**
 * Default filters (no filters applied)
 */
export const DEFAULT_FILTERS: DashboardFilters = {
  startDate: null,
  endDate: null,
  categories: [],
  type: "all",
  minAmount: null,
  maxAmount: null,
  searchQuery: "",
};

/**
 * Filter context type
 */
interface FilterContextType {
  filters: DashboardFilters;
  setFilters: (filters: DashboardFilters) => void;
  updateFilter: <K extends keyof DashboardFilters>(key: K, value: DashboardFilters[K]) => void;
  resetFilters: () => void;
  hasActiveFilters: () => boolean;
  getActiveFilterCount: () => number;
}

/**
 * Create filter context
 */
const FilterContext = createContext<FilterContextType | undefined>(undefined);

/**
 * Storage key for localStorage
 */
const FILTER_STORAGE_KEY = "finsight-dashboard-filters";

/**
 * FilterProvider component - wraps dashboard with global filter state
 */
export function FilterProvider({ children }: { children: React.ReactNode }) {
  const [filters, setFiltersState] = useState<DashboardFilters>(DEFAULT_FILTERS);
  const [isHydrated, setIsHydrated] = useState(false);

  // Load filters from localStorage on mount
  useEffect(() => {
    try {
      const stored = localStorage.getItem(FILTER_STORAGE_KEY);
      if (stored) {
        const parsed = JSON.parse(stored);
        setFiltersState(parsed);
      }
    } catch (error) {
      console.error("Failed to load filters from localStorage:", error);
    }
    setIsHydrated(true);
  }, []);

  // Debounced localStorage save - prevents excessive writes and re-renders
  const debouncedSave = useDebouncedCallback((filters: DashboardFilters) => {
    try {
      localStorage.setItem(FILTER_STORAGE_KEY, JSON.stringify(filters));
    } catch (error) {
      console.error("Failed to save filters to localStorage:", error);
    }
  }, 500); // Wait 500ms after last change before saving

  // Save filters to localStorage whenever they change (debounced)
  useEffect(() => {
    if (isHydrated) {
      debouncedSave(filters);
    }
  }, [filters, isHydrated, debouncedSave]);

  /**
   * Set all filters at once
   */
  const setFilters = useCallback((newFilters: DashboardFilters) => {
    setFiltersState(newFilters);
  }, []);

  /**
   * Update a single filter field
   */
  const updateFilter = useCallback(<K extends keyof DashboardFilters>(
    key: K,
    value: DashboardFilters[K]
  ) => {
    setFiltersState((prev: DashboardFilters) => ({
      ...prev,
      [key]: value,
    }));
  }, []);

  /**
   * Reset all filters to default
   */
  const resetFilters = useCallback(() => {
    setFiltersState(DEFAULT_FILTERS);
  }, []);

  /**
   * Check if any filters are active
   */
  const hasActiveFilters = useCallback(() => {
    return (
      filters.startDate !== null ||
      filters.endDate !== null ||
      filters.categories.length > 0 ||
      filters.type !== "all" ||
      filters.minAmount !== null ||
      filters.maxAmount !== null
    );
  }, [filters]);

  /**
   * Get count of active filters
   */
  const getActiveFilterCount = useCallback(() => {
    let count = 0;
    if (filters.startDate) count++;
    if (filters.endDate) count++;
    if (filters.categories.length > 0) count += filters.categories.length;
    if (filters.type !== "all") count++;
    if (filters.minAmount !== null) count++;
    if (filters.maxAmount !== null) count++;
    return count;
  }, [filters]);

  // Always provide context, even during hydration (use default values until hydrated)
  return (
    <FilterContext.Provider
      value={{
        filters,
        setFilters,
        updateFilter,
        resetFilters,
        hasActiveFilters,
        getActiveFilterCount,
      }}
    >
      {children}
    </FilterContext.Provider>
  );
}

/**
 * Hook to use filter context in components
 * @throws Error if used outside FilterProvider
 */
export function useFilter() {
  const context = useContext(FilterContext);
  if (context === undefined) {
    throw new Error("useFilter must be used within a FilterProvider");
  }
  return context;
}

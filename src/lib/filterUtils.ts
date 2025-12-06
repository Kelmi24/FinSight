import { DashboardFilters, DEFAULT_FILTERS } from "@/providers/filter-provider";

/**
 * Check if filters object is empty (all default values)
 */
export function isFiltersEmpty(filters: DashboardFilters): boolean {
  return JSON.stringify(filters) === JSON.stringify(DEFAULT_FILTERS);
}

/**
 * Check if filter has any date filters
 */
export function hasDateFilters(filters: DashboardFilters): boolean {
  return filters.startDate !== null || filters.endDate !== null;
}

/**
 * Get date range description (e.g., "Dec 1 - Dec 31, 2024")
 */
export function getDateRangeDescription(startDate: string | null, endDate: string | null): string {
  if (!startDate && !endDate) return "";

  const formatDate = (dateStr: string) => {
    const date = new Date(dateStr);
    return new Intl.DateTimeFormat("en-US", { month: "short", day: "numeric" }).format(date);
  };

  if (startDate && endDate) {
    const start = formatDate(startDate);
    const end = formatDate(endDate);
    return `${start} - ${end}, ${new Date(endDate).getFullYear()}`;
  }

  if (startDate) {
    return `From ${formatDate(startDate)}`;
  }

  return `Until ${formatDate(endDate!)}`;
}

/**
 * Build URL query string from filters (optional for URL routing)
 */
export function serializeFiltersToUrl(filters: DashboardFilters): string {
  const params = new URLSearchParams();

  if (filters.startDate) params.append("startDate", filters.startDate);
  if (filters.endDate) params.append("endDate", filters.endDate);
  if (filters.categories.length > 0) params.append("categories", filters.categories.join(","));
  if (filters.type !== "all") params.append("type", filters.type);
  if (filters.minAmount !== null) params.append("minAmount", String(filters.minAmount));
  if (filters.maxAmount !== null) params.append("maxAmount", String(filters.maxAmount));

  return params.toString();
}

/**
 * Parse URL query string back to filters
 */
export function deserializeFiltersFromUrl(queryString: string): Partial<DashboardFilters> {
  const params = new URLSearchParams(queryString);
  const filters: Partial<DashboardFilters> = {};

  const startDate = params.get("startDate");
  if (startDate) filters.startDate = startDate;

  const endDate = params.get("endDate");
  if (endDate) filters.endDate = endDate;

  const categories = params.get("categories");
  if (categories) filters.categories = categories.split(",");

  const type = params.get("type");
  if (type && ["all", "income", "expense"].includes(type)) {
    filters.type = type as "all" | "income" | "expense";
  }

  const minAmount = params.get("minAmount");
  if (minAmount) filters.minAmount = parseFloat(minAmount);

  const maxAmount = params.get("maxAmount");
  if (maxAmount) filters.maxAmount = parseFloat(maxAmount);

  return filters;
}

/**
 * Merge partial filters with defaults
 */
export function mergeFilters(
  partialFilters: Partial<DashboardFilters>,
  defaults: DashboardFilters = DEFAULT_FILTERS
): DashboardFilters {
  return {
    ...defaults,
    ...partialFilters,
  };
}

/**
 * Get filter summary for display (e.g., "5 filters active")
 */
export function getFilterSummary(filters: DashboardFilters): string {
  const parts: string[] = [];

  if (filters.startDate && filters.endDate) {
    parts.push("Date range");
  } else if (filters.startDate || filters.endDate) {
    parts.push("Date filter");
  }

  if (filters.categories.length > 0) {
    parts.push(`${filters.categories.length} categor${filters.categories.length === 1 ? "y" : "ies"}`);
  }

  if (filters.type !== "all") {
    parts.push(filters.type.charAt(0).toUpperCase() + filters.type.slice(1));
  }

  if (filters.minAmount !== null || filters.maxAmount !== null) {
    parts.push("Amount range");
  }

  return parts.join(", ") || "No filters applied";
}

/**
 * Validate filters for data fetching
 */
export function validateFilters(filters: DashboardFilters): { valid: boolean; errors: string[] } {
  const errors: string[] = [];

  if (filters.startDate && filters.endDate) {
    const start = new Date(filters.startDate);
    const end = new Date(filters.endDate);
    if (start > end) {
      errors.push("Start date must be before end date");
    }
  }

  if (filters.minAmount !== null && filters.maxAmount !== null) {
    if (filters.minAmount > filters.maxAmount) {
      errors.push("Minimum amount must be less than maximum amount");
    }
  }

  if (filters.minAmount !== null && filters.minAmount < 0) {
    errors.push("Minimum amount cannot be negative");
  }

  if (filters.maxAmount !== null && filters.maxAmount < 0) {
    errors.push("Maximum amount cannot be negative");
  }

  return {
    valid: errors.length === 0,
    errors,
  };
}

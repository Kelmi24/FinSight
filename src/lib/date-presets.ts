/**
 * Date range presets for quick filtering
 * Provides common time periods with proper ISO date strings
 */

export interface DateRange {
  startDate: string;
  endDate: string;
}

/**
 * Get ISO date string for start of day
 */
function startOfDay(date: Date): string {
  const d = new Date(date);
  d.setHours(0, 0, 0, 0);
  return d.toISOString();
}

/**
 * Get ISO date string for end of day
 */
function endOfDay(date: Date): string {
  const d = new Date(date);
  d.setHours(23, 59, 59, 999);
  return d.toISOString();
}

/**
 * Date preset definitions
 */
export const DATE_PRESETS = {
  today: (): DateRange => {
    const now = new Date();
    return {
      startDate: startOfDay(now),
      endDate: endOfDay(now),
    };
  },

  yesterday: (): DateRange => {
    const yesterday = new Date();
    yesterday.setDate(yesterday.getDate() - 1);
    return {
      startDate: startOfDay(yesterday),
      endDate: endOfDay(yesterday),
    };
  },

  last7Days: (): DateRange => {
    const end = new Date();
    const start = new Date();
    start.setDate(start.getDate() - 6); // 6 days ago + today = 7 days
    return {
      startDate: startOfDay(start),
      endDate: endOfDay(end),
    };
  },

  last30Days: (): DateRange => {
    const end = new Date();
    const start = new Date();
    start.setDate(start.getDate() - 29); // 29 days ago + today = 30 days
    return {
      startDate: startOfDay(start),
      endDate: endOfDay(end),
    };
  },

  thisMonth: (): DateRange => {
    const now = new Date();
    const start = new Date(now.getFullYear(), now.getMonth(), 1);
    const end = new Date(now.getFullYear(), now.getMonth() + 1, 0);
    return {
      startDate: startOfDay(start),
      endDate: endOfDay(end),
    };
  },

  lastMonth: (): DateRange => {
    const now = new Date();
    const start = new Date(now.getFullYear(), now.getMonth() - 1, 1);
    const end = new Date(now.getFullYear(), now.getMonth(), 0);
    return {
      startDate: startOfDay(start),
      endDate: endOfDay(end),
    };
  },

  thisYear: (): DateRange => {
    const now = new Date();
    const start = new Date(now.getFullYear(), 0, 1);
    const end = new Date(now.getFullYear(), 11, 31);
    return {
      startDate: startOfDay(start),
      endDate: endOfDay(end),
    };
  },

  lastYear: (): DateRange => {
    const now = new Date();
    const start = new Date(now.getFullYear() - 1, 0, 1);
    const end = new Date(now.getFullYear() - 1, 11, 31);
    return {
      startDate: startOfDay(start),
      endDate: endOfDay(end),
    };
  },

  allTime: (): DateRange => {
    return {
      startDate: new Date(2000, 0, 1).toISOString(),
      endDate: endOfDay(new Date()),
    };
  },
} as const;

/**
 * Get preset label for display
 */
export const DATE_PRESET_LABELS: Record<keyof typeof DATE_PRESETS, string> = {
  today: "Today",
  yesterday: "Yesterday",
  last7Days: "Last 7 Days",
  last30Days: "Last 30 Days",
  thisMonth: "This Month",
  lastMonth: "Last Month",
  thisYear: "This Year",
  lastYear: "Last Year",
  allTime: "All Time",
};

/**
 * Apply a date preset to filters
 */
export function applyDatePreset(preset: keyof typeof DATE_PRESETS): DateRange {
  return DATE_PRESETS[preset]();
}

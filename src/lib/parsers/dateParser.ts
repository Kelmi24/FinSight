/**
 * Date parsing utilities with support for Indonesian date formats
 */

import { parse, isValid } from "date-fns";
import { getMonthNumber } from "./indonesian/monthMappings";

/**
 * Common date format patterns to try
 */
const DATE_FORMATS = [
  "dd/MM/yyyy",
  "dd-MM-yyyy",
  "yyyy-MM-dd",
  "MM/dd/yyyy",
  "dd/MM/yy",
  "dd-MM-yy",
  "yyyy/MM/dd",
  "dd.MM.yyyy",
];

/**
 * Parse Indonesian date with month name: "25 Desember 2023" or "25 Des 2023"
 */
export function parseIndonesianDate(value: string): Date | null {
  if (!value || typeof value !== "string") return null;

  const cleaned = value.trim();

  // Try pattern: "dd Month yyyy" or "dd Mon yyyy"
  const monthNamePattern = /^(\d{1,2})\s+([a-zA-Z]+)\s+(\d{4})$/i;
  const match = cleaned.match(monthNamePattern);

  if (match) {
    const day = parseInt(match[1], 10);
    const monthName = match[2];
    const year = parseInt(match[3], 10);

    const month = getMonthNumber(monthName);

    if (month && day >= 1 && day <= 31 && year >= 1900 && year <= 2100) {
      const date = new Date(year, month - 1, day);
      if (isValid(date)) return date;
    }
  }

  return null;
}

/**
 * Parse date with multiple format attempts
 */
export function parseDate(value: string): Date | null {
  if (!value || typeof value !== "string") return null;

  const trimmed = value.trim();

  // Handle dates without year (e.g., "01/09" or "31/12")
  // Assume current year or previous year if month is in the future
  if (/^\d{1,2}\/\d{1,2}$/.test(trimmed)) {
    const [day, month] = trimmed.split("/").map((n) => parseInt(n, 10));
    const currentDate = new Date();
    let year = currentDate.getFullYear();
    
    // If the month is in the future, assume it's from the previous year
    if (month > currentDate.getMonth() + 1) {
      year--;
    }
    
    const date = new Date(year, month - 1, day);
    if (isValid(date)) return date;
  }

  // Try Indonesian date format first
  const indonesianResult = parseIndonesianDate(trimmed);
  if (indonesianResult) return indonesianResult;

  // Try standard formats
  for (const format of DATE_FORMATS) {
    try {
      const parsed = parse(trimmed, format, new Date());
      if (isValid(parsed)) return parsed;
    } catch {
      continue;
    }
  }

  // Try native Date parsing as fallback
  const fallback = new Date(trimmed);
  if (isValid(fallback)) return fallback;

  return null;
}

/**
 * Indonesian month name mappings
 * Maps Indonesian month names to month numbers (1-12)
 */

export const INDONESIAN_MONTHS: Record<string, number> = {
  januari: 1,
  februari: 2,
  maret: 3,
  april: 4,
  mei: 5,
  juni: 6,
  juli: 7,
  agustus: 8,
  september: 9,
  oktober: 10,
  november: 11,
  desember: 12,
  // Short forms
  jan: 1,
  feb: 2,
  mar: 3,
  apr: 4,
  jun: 6,
  jul: 7,
  agu: 8,
  ags: 8,
  sep: 9,
  okt: 10,
  nov: 11,
  des: 12,
};

/**
 * Get month number from Indonesian month name
 */
export function getMonthNumber(monthName: string): number | undefined {
  const normalized = monthName.toLowerCase().trim();
  return INDONESIAN_MONTHS[normalized];
}

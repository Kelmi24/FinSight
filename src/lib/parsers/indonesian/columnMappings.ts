/**
 * Column name mappings for Indonesian bank CSV files
 * Maps Indonesian column headers to English field names
 */

export const COLUMN_MAPPINGS: Record<string, string> = {
  // Date columns
  tanggal: "date",
  "tanggal transaksi": "date",
  tgl: "date",
  date: "date",

  // Description columns
  keterangan: "description",
  uraian: "description",
  deskripsi: "description",
  description: "description",

  // Amount columns
  jumlah: "amount",
  "jumlah (idr)": "amount",
  nominal: "amount",
  amount: "amount",

  // Debit columns
  debet: "debit",
  debit: "debit",

  // Credit columns
  kredit: "credit",
  credit: "credit",

  // Type columns
  jenis: "type",
  type: "type",

  // Balance columns
  saldo: "balance",
  balance: "balance",
};

/**
 * Normalize column name to lowercase and trim whitespace
 */
export function normalizeColumnName(name: string): string {
  return name.toLowerCase().trim();
}

/**
 * Get English field name from Indonesian or English column name
 */
export function getFieldName(columnName: string): string | undefined {
  const normalized = normalizeColumnName(columnName);
  return COLUMN_MAPPINGS[normalized];
}

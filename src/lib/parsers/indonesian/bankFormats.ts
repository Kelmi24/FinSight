/**
 * Bank-specific CSV format definitions for Indonesian banks
 */

export interface BankFormat {
  name: string;
  code: string;
  columns: string[];
  hasHeader: boolean;
  dateFormat: string;
  amountFormat: "IDR" | "standard";
  debitCreditSeparate: boolean;
}

export const INDONESIAN_BANKS: Record<string, BankFormat> = {
  BCA: {
    name: "Bank Central Asia",
    code: "BCA",
    columns: ["Tanggal", "Keterangan", "Debet", "Kredit", "Saldo"],
    hasHeader: true,
    dateFormat: "dd/MM/yyyy",
    amountFormat: "IDR",
    debitCreditSeparate: true,
  },
  MANDIRI: {
    name: "Bank Mandiri",
    code: "MANDIRI",
    columns: [
      "Tanggal Transaksi",
      "Keterangan",
      "Jenis",
      "Jumlah (IDR)",
      "Saldo",
    ],
    hasHeader: true,
    dateFormat: "dd/MM/yyyy",
    amountFormat: "IDR",
    debitCreditSeparate: false,
  },
  BNI: {
    name: "Bank Negara Indonesia",
    code: "BNI",
    columns: ["TGL", "URAIAN", "DEBIT", "KREDIT", "SALDO"],
    hasHeader: true,
    dateFormat: "dd MMM yyyy",
    amountFormat: "IDR",
    debitCreditSeparate: true,
  },
  BRI: {
    name: "Bank Rakyat Indonesia",
    code: "BRI",
    columns: ["Tanggal", "Deskripsi", "Nominal", "Jenis", "Saldo"],
    hasHeader: true,
    dateFormat: "dd-MM-yyyy",
    amountFormat: "IDR",
    debitCreditSeparate: false,
  },
};

/**
 * Detect bank format from CSV columns
 */
export function detectBankFormat(columns: string[]): BankFormat | undefined {
  const normalizedColumns = columns.map((col) => col.toLowerCase().trim());

  for (const bank of Object.values(INDONESIAN_BANKS)) {
    const bankColumns = bank.columns.map((col) => col.toLowerCase().trim());

    // Check if columns match (order-independent)
    const allMatch = bankColumns.every((col) =>
      normalizedColumns.some((csvCol) => csvCol.includes(col) || col.includes(csvCol))
    );

    if (allMatch) {
      return bank;
    }
  }

  return undefined;
}

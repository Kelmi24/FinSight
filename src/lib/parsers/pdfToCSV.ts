/**
 * Convert PDF text content to CSV format
 * Handles Indonesian bank statement formats
 */

export interface PDFToCSVResult {
  csv: string;
  rowCount: number;
  detectedFormat?: string;
  error?: string;
}

/**
 * Detect if line contains common Indonesian bank headers
 */
function detectBankHeader(line: string): boolean {
  const lowerLine = line.toLowerCase();
  const headerKeywords = [
    "tanggal",
    "keterangan",
    "debet",
    "kredit",
    "saldo",
    "jumlah",
    "uraian",
    "deskripsi",
    "date",
    "description",
    "amount",
  ];

  let matchCount = 0;
  for (const keyword of headerKeywords) {
    if (lowerLine.includes(keyword)) {
      matchCount++;
    }
  }

  // If 3+ keywords found, likely a header row
  return matchCount >= 3;
}

/**
 * Parse table-like text structure from PDF
 * Handles both space-separated and tab-separated columns
 */
function parseTableStructure(text: string): string[][] {
  const lines = text.split("\n").map((l) => l.trim()).filter((l) => l.length > 0);

  const rows: string[][] = [];
  let headerFound = false;

  for (const line of lines) {
    // Skip empty lines
    if (!line.trim()) continue;

    // Check if this is a header row
    if (!headerFound && detectBankHeader(line)) {
      headerFound = true;
      // Split by multiple spaces or tabs
      const columns = line.split(/\s{2,}|\t/).map((c) => c.trim());
      rows.push(columns);
      continue;
    }

    // If header found, parse data rows
    if (headerFound) {
      // Try to split by multiple spaces (common in PDF tables)
      const columns = line.split(/\s{2,}|\t/).map((c) => c.trim());

      // Basic validation: should have at least 3 columns
      if (columns.length >= 3) {
        rows.push(columns);
      }
    }
  }

  return rows;
}

/**
 * Normalize column names to match CSV parser expectations
 */
function normalizeColumnNames(columns: string[]): string[] {
  return columns.map((col) => {
    const lower = col.toLowerCase().trim();

    // Date columns
    if (lower.includes("tanggal") || lower === "tgl") return "Tanggal";
    // Description columns
    if (lower.includes("keterangan") || lower.includes("uraian") || lower.includes("deskripsi"))
      return "Keterangan";
    // Debit columns
    if (lower.includes("debet") || lower === "debit") return "Debet";
    // Credit columns
    if (lower.includes("kredit") || lower === "credit") return "Kredit";
    // Amount columns
    if (lower.includes("jumlah") || lower === "nominal") return "Jumlah (IDR)";
    // Type columns
    if (lower === "jenis" || lower === "type") return "Jenis";
    // Balance columns
    if (lower.includes("saldo") || lower === "balance") return "Saldo";

    // Return original if no match
    return col;
  });
}

/**
 * Convert PDF text to CSV format
 */
export function convertPDFTextToCSV(pdfText: string): PDFToCSVResult {
  try {
    // Parse table structure
    const rows = parseTableStructure(pdfText);

    if (rows.length === 0) {
      return {
        csv: "",
        rowCount: 0,
        error: "No table structure detected in PDF. Please ensure the PDF contains a transaction table.",
      };
    }

    // Normalize header row
    const headers = normalizeColumnNames(rows[0]);
    const dataRows = rows.slice(1);

    if (dataRows.length === 0) {
      return {
        csv: "",
        rowCount: 0,
        error: "No data rows found after header. The PDF may be empty or formatted incorrectly.",
      };
    }

    // Build CSV
    const csvLines: string[] = [];

    // Add header
    csvLines.push(headers.join(","));

    // Add data rows
    for (const row of dataRows) {
      // Pad row to match header length
      const paddedRow = [...row];
      while (paddedRow.length < headers.length) {
        paddedRow.push("");
      }

      // Escape commas and quotes in values
      const escapedRow = paddedRow.slice(0, headers.length).map((cell) => {
        // Remove extra whitespace
        const cleaned = cell.trim();

        // If cell contains comma or quote, wrap in quotes
        if (cleaned.includes(",") || cleaned.includes('"')) {
          return `"${cleaned.replace(/"/g, '""')}"`;
        }

        return cleaned;
      });

      csvLines.push(escapedRow.join(","));
    }

    const csv = csvLines.join("\n");

    if (process.env.NODE_ENV === "development") {
      console.log("PDF to CSV Conversion:", {
        rowCount: dataRows.length,
        columnCount: headers.length,
        headers,
        preview: csv.substring(0, 300),
      });
    }

    return {
      csv,
      rowCount: dataRows.length,
      detectedFormat: "PDF Table",
    };
  } catch (error) {
    console.error("PDF to CSV conversion error:", error);
    return {
      csv: "",
      rowCount: 0,
      error:
        error instanceof Error
          ? error.message
          : "Failed to convert PDF to CSV format",
    };
  }
}

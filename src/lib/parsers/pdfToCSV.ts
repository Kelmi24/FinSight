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
 * Parse BCA bank statement PDF text
 * BCA PDFs have specific patterns we can detect
 */
function parseBCAStatement(text: string): string[][] {
  const lines = text.split("\n");
  const rows: string[][] = [];

  // BCA statement pattern: DATE DESCRIPTION AMOUNT BALANCE
  // Look for lines that contain a date pattern (DD/MM) - may not be at start due to spaces
  const datePattern = /(\d{2}\/\d{2})/;
  
  for (let i = 0; i < lines.length; i++) {
    const line = lines[i].trim();
    
    // Skip empty lines
    if (!line) continue;
    
    // Check if line contains a date
    const dateMatch = line.match(datePattern);
    if (dateMatch) {
      const date = dateMatch[1];
      const dateIndex = line.indexOf(date);
      
      // Extract the rest of the line after the date
      let remainder = line.substring(dateIndex + date.length).trim();
      
      // Try to extract description and amounts
      // Pattern: DATE DESCRIPTION AMOUNT BALANCE or DATE DESCRIPTION (negative amount)
      // BCA format: amounts can be negative (with minus) or positive
      
      // Look for amount patterns: numbers with dots/commas/spaces and optional minus
      // Match patterns like: 1.500.000,00 or -1.500.000,00 or 1500000
      const amountPattern = /-?\d+[\d.,\s]*\d*/g;
      const potentialAmounts = remainder.match(amountPattern) || [];
      
      // Filter out small numbers that are likely not amounts (like CBG codes)
      const amounts = potentialAmounts.filter(amt => {
        const cleanAmt = amt.replace(/[.,\s]/g, '');
        return cleanAmt.length >= 3; // At least 3 digits to be a real amount
      });
      
      // Description is everything before the last 1-2 numbers
      let description = remainder;
      let mutasi = "";
      let saldo = "";
      let cbg = "";
      
      if (amounts.length >= 2) {
        // Has both mutasi and saldo
        saldo = amounts[amounts.length - 1];
        mutasi = amounts[amounts.length - 2];
        
        // Check if there's a CBG code (3 digits between description and amounts)
        if (amounts.length >= 3 && amounts[amounts.length - 3].replace(/\D/g, '').length <= 4) {
          cbg = amounts[amounts.length - 3];
        }
        
        // Description is everything before the first amount we identified
        const firstAmountIndex = cbg ? remainder.indexOf(cbg) : remainder.indexOf(mutasi);
        description = remainder.substring(0, firstAmountIndex).trim();
      } else if (amounts.length === 1) {
        // Might be just balance or just amount
        const amt = amounts[0];
        const amtIndex = remainder.indexOf(amt);
        description = remainder.substring(0, amtIndex).trim();
        
        // Check if description mentions SALDO
        if (description.toLowerCase().includes("saldo") || description.toLowerCase().includes("balance")) {
          saldo = amt;
        } else {
          mutasi = amt;
        }
      }
      
      // Skip opening balance rows
      if (description.toLowerCase().includes("saldo awal")) {
        continue;
      }
      
      // Only add if we have a description and at least one amount
      if (description && (mutasi || saldo)) {
        rows.push([date, description, cbg, mutasi, saldo]);
      }
    }
  }
  
  return rows;
}

/**
 * Parse table-like text structure from PDF
 * Handles both space-separated and tab-separated columns
 */
function parseTableStructure(text: string): string[][] {
  // First try BCA-specific parsing
  const bcaRows = parseBCAStatement(text);
  
  if (process.env.NODE_ENV === "development") {
    console.log("BCA Parser Results:", {
      rowsFound: bcaRows.length,
      sampleRow: bcaRows[0],
      textPreview: text.substring(0, 500)
    });
  }
  
  if (bcaRows.length > 0) {
    return bcaRows;
  }

  // Fallback to generic table parsing
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

    // Check if this is BCA format (5 columns: date, desc, cbg, mutasi, saldo)
    const isBCAFormat = rows.length > 0 && rows[0].length === 5;

    // Build CSV
    const csvLines: string[] = [];
    let headers: string[];
    let dataRows: string[][];

    // Add header and determine data rows based on detected format
    if (isBCAFormat) {
      headers = ["TANGGAL", "KETERANGAN", "CBG", "MUTASI", "SALDO"];
      csvLines.push(headers.join(","));
      dataRows = rows; // All rows are data in BCA format
    } else {
      // Normalize header row for other formats
      headers = normalizeColumnNames(rows[0]);
      csvLines.push(headers.join(","));
      dataRows = rows.slice(1); // First row is header, rest are data
    }

    if (dataRows.length === 0) {
      return {
        csv: "",
        rowCount: 0,
        error: "No data rows found after header. The PDF may be empty or formatted incorrectly.",
      };
    }

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

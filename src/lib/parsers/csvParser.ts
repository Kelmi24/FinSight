/**
 * CSV parsing utilities with Indonesian language support
 */

import Papa from "papaparse";
import { parseAmount } from "./amountParser";
import { parseDate } from "./dateParser";
import { getFieldName, normalizeColumnName } from "./indonesian/columnMappings";
import { detectBankFormat } from "./indonesian/bankFormats";
import { suggestCategoryFromDescription } from "./indonesian/categoryMappings";

export interface ParsedTransaction {
  date: Date;
  description: string;
  amount: number;
  type: "income" | "expense";
  category?: string;
  currency: string;
}

export interface ParseResult {
  transactions: ParsedTransaction[];
  errors: string[];
  warnings: string[];
  bankDetected?: string;
}

/**
 * Detect transaction type from debit/credit columns or Jenis field
 */
function detectTransactionType(row: any, normalizedHeaders: string[]): "income" | "expense" | null {
  // Check for Type/Jenis field
  const typeField = getFieldName("jenis") || getFieldName("type");
  if (typeField && row[typeField]) {
    const typeValue = row[typeField].toLowerCase();
    if (typeValue.includes("debit") || typeValue.includes("keluar") || typeValue.includes("expense")) {
      return "expense";
    }
    if (typeValue.includes("credit") || typeValue.includes("masuk") || typeValue.includes("income")) {
      return "income";
    }
  }

  // Check for separate debit/credit columns
  const debitField = normalizedHeaders.find((h) => 
    ["debit", "debet"].includes(normalizeColumnName(h))
  );
  const creditField = normalizedHeaders.find((h) => 
    ["credit", "kredit"].includes(normalizeColumnName(h))
  );

  if (debitField && creditField) {
    const debitValue = row[debitField];
    const creditValue = row[creditField];

    // If debit has value, it's an expense
    if (debitValue && parseAmount(debitValue.toString()) !== null) {
      return "expense";
    }
    // If credit has value, it's income
    if (creditValue && parseAmount(creditValue.toString()) !== null) {
      return "income";
    }
  }

  return null;
}

/**
 * Parse CSV file content
 */
export function parseCSV(fileContent: string, currency: string = "IDR"): ParseResult {
  const errors: string[] = [];
  const warnings: string[] = [];
  const transactions: ParsedTransaction[] = [];

  // Parse CSV
  const parsed = Papa.parse(fileContent, {
    header: true,
    skipEmptyLines: true,
    transformHeader: (header) => header.trim(),
  });

  if (parsed.errors.length > 0) {
    errors.push(...parsed.errors.map((e) => `Row ${e.row}: ${e.message}`));
  }

  if (parsed.data.length === 0) {
    errors.push("No data found in CSV file");
    return { transactions, errors, warnings };
  }

  // Detect bank format
  const headers = parsed.meta.fields || [];
  const bankFormat = detectBankFormat(headers);
  const bankDetected = bankFormat?.name;

  if (bankFormat) {
    warnings.push(`Detected ${bankFormat.name} format`);
  }

  const normalizedHeaders = headers.map(normalizeColumnName);

  // Process each row
  parsed.data.forEach((row: any, index: number) => {
    try {
      // Find date field
      const dateField = headers.find((h) => getFieldName(h) === "date");
      if (!dateField || !row[dateField]) {
        warnings.push(`Row ${index + 2}: Missing date, skipping`);
        return;
      }

      const date = parseDate(row[dateField]);
      if (!date) {
        warnings.push(`Row ${index + 2}: Invalid date format "${row[dateField]}", skipping`);
        return;
      }

      // Find description field
      const descField = headers.find((h) => getFieldName(h) === "description");
      const description = descField ? row[descField]?.toString().trim() : "";
      if (!description) {
        warnings.push(`Row ${index + 2}: Missing description, skipping`);
        return;
      }

      // Detect transaction type
      let type = detectTransactionType(row, headers);
      
      // Find amount
      let amount: number | null = null;
      
      // Try debit/credit columns first
      const debitField = headers.find((h) => 
        ["debit", "debet"].includes(normalizeColumnName(h))
      );
      const creditField = headers.find((h) => 
        ["credit", "kredit"].includes(normalizeColumnName(h))
      );

      // Get values and handle empty strings explicitly
      const debitValue = debitField ? row[debitField] : null;
      const creditValue = creditField ? row[creditField] : null;

      if (debitValue && debitValue.toString().trim() !== "") {
        amount = parseAmount(debitValue.toString());
        if (amount !== null && !type) type = "expense";
      } else if (creditValue && creditValue.toString().trim() !== "") {
        amount = parseAmount(creditValue.toString());
        if (amount !== null && !type) type = "income";
      } else {
        // Try amount field
        const amountField = headers.find((h) => getFieldName(h) === "amount");
        const amountValue = amountField ? row[amountField] : null;
        if (amountValue && amountValue.toString().trim() !== "") {
          amount = parseAmount(amountValue.toString());
        }
      }

      if (amount === null || amount === 0) {
        warnings.push(`Row ${index + 2}: Invalid or zero amount, skipping`);
        return;
      }

      // Default type if not detected
      if (!type) {
        type = amount < 0 ? "expense" : "income";
      }

      // Ensure amount is positive
      amount = Math.abs(amount);

      // Suggest category
      const category = suggestCategoryFromDescription(description);

      transactions.push({
        date,
        description,
        amount,
        type,
        category,
        currency,
      });
    } catch (error) {
      errors.push(`Row ${index + 2}: ${error instanceof Error ? error.message : "Unknown error"}`);
    }
  });

  // Add feedback if no transactions parsed
  if (transactions.length === 0 && warnings.length > 0) {
    errors.push(`No valid transactions found. ${warnings.length} rows were skipped due to missing or invalid data.`);
  }

  // Debug logging in development
  if (process.env.NODE_ENV === "development") {
    console.log("CSV Parse Result:", {
      totalRows: parsed.data.length,
      validTransactions: transactions.length,
      warnings: warnings.length,
      errors: errors.length,
      bankDetected,
    });
  }

  return {
    transactions,
    errors,
    warnings,
    bankDetected,
  };
}

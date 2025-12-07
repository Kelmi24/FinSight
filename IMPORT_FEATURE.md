# Transaction Import Feature - Documentation

## Overview
The Transaction Import feature allows users to upload CSV files from their bank statements and automatically import transactions into FinSight AI. The feature supports both Indonesian and English CSV formats, with special handling for major Indonesian banks (BCA, Mandiri, BNI, BRI).

## Features

### ✅ Multi-Language Support
- **Indonesian**: Full support for Bahasa Indonesia column headers, date formats, and amount formatting
- **English**: Standard international CSV formats
- **Auto-detection**: Automatically detects column mappings and formats

### ✅ Supported Banks
1. **BCA (Bank Central Asia)**
   - Format: `Tanggal, Keterangan, Debet, Kredit, Saldo`
   - Date format: `dd/MM/yyyy`
   - Amount format: IDR (Rp 1.500.000,00)

2. **Mandiri (Bank Mandiri)**
   - Format: `Tanggal Transaksi, Keterangan, Jenis, Jumlah (IDR), Saldo`
   - Date format: `dd/MM/yyyy`
   - Amount format: IDR with Jenis column (DEBIT/KREDIT)

3. **BNI (Bank Negara Indonesia)**
   - Format: `TGL, URAIAN, DEBIT, KREDIT, SALDO`
   - Date format: `dd MMM yyyy` (e.g., 25 Des 2023)
   - Amount format: IDR

4. **BRI (Bank Rakyat Indonesia)**
   - Format: `Tanggal, Deskripsi, Nominal, Jenis, Saldo`
   - Date format: `dd-MM-yyyy`
   - Amount format: IDR

### ✅ Smart Parsing Features
- **Amount Parsing**: Handles both IDR format (1.500.000,00) and standard format (1,500,000.00)
- **Date Parsing**: Supports multiple date formats including Indonesian month names
- **Transaction Type Detection**: Automatically detects income/expense from Debit/Credit columns or Jenis field
- **Category Suggestion**: Auto-suggests categories based on transaction descriptions (Indonesian keywords)
- **Error Handling**: Detailed error and warning messages for problematic rows

## User Interface

### 3-Step Import Wizard

#### Step 1: Upload
- Drag-and-drop or click to select CSV file
- Shows supported formats and bank examples
- Instant file validation

#### Step 2: Preview
- Bank format auto-detection notification
- Preview first 10 transactions
- Display warnings for skipped/problematic rows
- Shows parsed date, description, amount, type, and suggested category

#### Step 3: Confirm
- Summary statistics (total, income, expense counts)
- Final confirmation before import
- Bulk import with progress feedback

## File Structure

```
src/
├── components/transactions/
│   ├── ImportButton.tsx          # Import button trigger
│   └── ImportDialog.tsx          # Multi-step import wizard
├── lib/
│   ├── actions/transactions.ts   # bulkCreateTransactions server action
│   └── parsers/
│       ├── csvParser.ts          # Main CSV parsing logic
│       ├── amountParser.ts       # Amount parsing (IDR & standard)
│       ├── dateParser.ts         # Date parsing (multiple formats)
│       └── indonesian/
│           ├── columnMappings.ts # Indonesian column name mappings
│           ├── monthMappings.ts  # Indonesian month name mappings
│           ├── categoryMappings.ts # Category keyword mappings
│           └── bankFormats.ts    # Bank-specific format definitions
public/
├── sample-bca.csv                # Sample BCA format
└── sample-mandiri.csv            # Sample Mandiri format
```

## Technical Implementation

### Amount Parsing
```typescript
// IDR format: Rp 1.500.000,00 (dot = thousands, comma = decimal)
parseIDRAmount("Rp 1.500.000,00") // Returns 1500000

// Standard format: 1,500,000.00 (comma = thousands, dot = decimal)
parseStandardAmount("1,500,000.00") // Returns 1500000

// Auto-detect format
parseAmount("Rp 1.500.000,00") // Returns 1500000
```

### Date Parsing
```typescript
// Indonesian date with month name
parseIndonesianDate("25 Desember 2023") // Returns Date object

// Standard formats
parseDate("01/12/2024") // Supports dd/MM/yyyy, dd-MM-yyyy, yyyy-MM-dd, etc.
```

### Column Mapping
```typescript
// Indonesian to English field mapping
getFieldName("tanggal") // Returns "date"
getFieldName("keterangan") // Returns "description"
getFieldName("debet") // Returns "debit"
```

### Category Suggestion
```typescript
// Based on Indonesian keywords
suggestCategoryFromDescription("Gofood Restoran") // Returns "Makanan"
suggestCategoryFromDescription("PLN Token") // Returns "Tagihan"
```

## Usage

### For Users
1. Go to **Transactions** page
2. Click **"Import CSV"** button (next to filters)
3. Select your bank's CSV export file
4. Review the preview and warnings
5. Click **"Import Transactions"** to complete

### Sample CSV Files
Sample files are provided in `/public/` for testing:
- `sample-bca.csv` - BCA format example
- `sample-mandiri.csv` - Mandiri format example

### CSV Requirements
**Required Columns:**
- Date column (Tanggal, TGL, Date, Tanggal Transaksi)
- Description column (Keterangan, Uraian, Deskripsi, Description)
- Amount column (Debet/Kredit, Nominal, Jumlah, Amount)

**Optional Columns:**
- Type column (Jenis, Type) - for transaction type
- Balance column (Saldo, Balance) - ignored but won't cause errors

## Error Handling

### Common Warnings
- **Missing date**: Row skipped if date column is empty or invalid
- **Missing description**: Row skipped if description is empty
- **Invalid amount**: Row skipped if amount cannot be parsed or is zero
- **Date format**: Shows specific date value that failed to parse

### Duplicate Detection
Currently, the feature does NOT check for duplicates. Users should:
- Only import once per statement period
- Manually delete duplicates if accidentally imported twice

## Future Enhancements

### Phase 2 (Planned)
- [ ] PDF statement parsing with OCR
- [ ] Duplicate detection (by date + amount + description)
- [ ] Category mapping rules editor
- [ ] Import history and rollback
- [ ] Batch editing before import
- [ ] Custom column mapping for unsupported banks
- [ ] Multi-currency conversion during import

## Security

### Authorization
- All imports are user-scoped via `session.user.id`
- Server action validates authentication before processing

### File Validation
- Only `.csv` files accepted
- Client-side validation before upload
- Server-side parsing with error handling

### Data Privacy
- CSV content never leaves the browser until import
- Parsing happens client-side
- Only final transaction data sent to server

## Performance

### Optimization
- Bulk insert with `createMany` (single database query)
- Client-side parsing reduces server load
- Preview limited to 10 rows for UI performance
- Progress feedback during import

### Limits
- No hard limit on number of transactions
- Tested with up to 500 transactions
- For very large files (1000+), consider chunking in future

## Testing

### Manual Testing Steps
1. **Test BCA format**: Upload `public/sample-bca.csv`
2. **Test Mandiri format**: Upload `public/sample-mandiri.csv`
3. **Test warnings**: Upload CSV with missing dates/amounts
4. **Test category suggestions**: Check if categories are auto-assigned
5. **Test error handling**: Upload non-CSV file or corrupted CSV

### Expected Results
- Bank format auto-detected and displayed
- Transactions parsed correctly with positive amounts
- Debit transactions marked as "expense"
- Credit transactions marked as "income"
- Indonesian descriptions mapped to categories
- Successful bulk import with page refresh

## Indonesian Language Support

### Column Headers (Bilingual)
| Indonesian | English |
|------------|---------|
| Tanggal | Date |
| Keterangan | Description |
| Debet | Debit |
| Kredit | Credit |
| Jumlah | Amount |
| Jenis | Type |
| Saldo | Balance |

### Month Names
| Indonesian | Number |
|------------|--------|
| Januari | 1 |
| Februari | 2 |
| Maret | 3 |
| April | 4 |
| Mei | 5 |
| Juni | 6 |
| Juli | 7 |
| Agustus | 8 |
| September | 9 |
| Oktober | 10 |
| November | 11 |
| Desember | 12 |

### Category Keywords (Indonesian)
- **Makanan**: restoran, cafe, kopi, gofood, grabfood, makan
- **Transportasi**: gojek, grab, taxi, bensin, parkir, tol
- **Belanja**: tokopedia, shopee, lazada, indomaret, alfamart
- **Tagihan**: listrik, PLN, air, PDAM, internet, telkom, pulsa
- **Kesehatan**: rumah sakit, klinik, apotek, dokter, obat
- **Gaji**: gaji, salary, THR, bonus, insentif

## Troubleshooting

### Issue: "No data found in CSV file"
- **Cause**: CSV file is empty or has no data rows
- **Solution**: Ensure CSV has header row and at least one data row

### Issue: "Invalid date format"
- **Cause**: Date column contains unrecognized format
- **Solution**: Check if date matches supported formats (dd/MM/yyyy, etc.)

### Issue: "Failed to parse CSV"
- **Cause**: Corrupted file or invalid CSV structure
- **Solution**: Re-export CSV from bank, ensure proper encoding (UTF-8)

### Issue: Wrong transaction types
- **Cause**: Debit/Credit columns not detected properly
- **Solution**: Check bank format definitions or manually edit after import

### Issue: No category suggestions
- **Cause**: Description doesn't match any keywords
- **Solution**: Categories default to "Uncategorized" - user can edit manually

## Implementation Timeline
- ✅ **Phase 1**: Core CSV import with Indonesian support (Completed Dec 7, 2024)
- ⏳ **Phase 2**: PDF parsing and duplicate detection (Future)
- ⏳ **Phase 3**: Custom mapping and advanced features (Future)

## Credits
- CSV parsing: `papaparse` library
- Date parsing: `date-fns` library
- UI components: Custom Radix UI components
- Bank format research: Based on actual Indonesian bank CSV exports

# Currency Conversion Testing Guide

## Overview
This guide covers testing the real currency conversion feature that was just implemented. The system now converts all monetary amounts from USD (database base currency) to the user's selected currency using an exchange rate matrix.

## What Changed
- **Exchange Rates Service** (`src/lib/exchange-rates.ts`): Provides static exchange rate matrix and conversion functions
- **CurrencyProvider**: Now includes `convertAmount()` and `getConversionRate()` methods
- **Display Components**: All monetary displays now convert amounts from USD to current currency
- **Database**: Unchanged - all amounts still stored in USD in the database

## Key Testing Areas

### 1. Dashboard Page (`/dashboard`)

#### KPI Cards (Most Visible)
- **Total Income**: Should show converted value
  - Example: $10,000 USD → Rp 166,000,000 IDR
  - Example: $10,000 USD → $13,500 SGD
- **Total Expenses**: Should show converted value
- **Net Balance**: Should show converted value  
- **Transactions Count**: Should NOT convert (it's a count, not currency)

#### Charts
- **Cash Flow Chart**: Both income and expenses lines should be converted
- **Category Chart**: All category amounts should be converted
- **Trend Chart**: All trend data should be converted
- **Month-Over-Month**: All comparison values should be converted

#### Recent Transactions
- Amounts should be converted for display
- Should maintain +/- indicators (income/expense)
- Click "View All" should navigate to full transactions list with converted amounts

### 2. Transactions Page (`/transactions`)

#### One-Time Transactions Tab
- All transaction amounts should display in converted currency
- Filtering by category, date, type should work correctly
- Creating a new transaction should store in USD (backend), display in user's currency
- Editing/deleting transactions should work with converted display
- **Important**: Edit form shows original USD amount - this is correct behavior

#### Recurring Transactions Tab
- All recurring amounts should display in converted currency
- Frequency labels should remain unchanged (weekly, monthly, yearly)
- Creating/editing/deleting should work correctly

### 3. Budgets Page (`/budgets`)

- Budget amounts should display in converted currency
- Progress bars should work with converted amounts
- Spent vs limit comparisons should use converted values
- Creating new budgets stores in USD, displays in user's currency

### 4. Goals Page (`/goals`)

- Goal target amounts should display in converted currency
- Current/progress amounts should display in converted currency
- Goal cards should show correct progress percentage

### 5. Currency Switching Test Scenario

**Step-by-step test:**

1. **Start on Dashboard (USD)**
   - Note the Total Income amount (e.g., "$1,000")
   - Note some individual transactions amounts
   
2. **Open Settings → Appearance**
   - Change currency to IDR (Indonesian Rupiah)
   
3. **Verify Dashboard Updates**
   - Total Income should now show "Rp 16,600,000" (1,000 × 16,600)
   - All chart values should be scaled accordingly
   - All recent transactions should show Rp values
   - Transaction count should remain unchanged
   
4. **Navigate to Transactions**
   - All amounts should show in Rp
   - Transactions should be the same as on dashboard (just with Rp amounts)
   
5. **Navigate to Budgets**
   - Budget amounts should show in Rp
   - Progress bars should work with converted amounts
   
6. **Navigate to Goals**
   - Goal amounts should show in Rp
   
7. **Change back to USD**
   - Navigate back through each page
   - Verify all amounts revert to $ format
   - Verify the exact amounts match original observations
   
8. **Test with Different Currency Pair**
   - Change to SGD
   - Verify: 1 USD ≈ 1.35 SGD (so $1,000 → $1,350)
   - Compare with IDR conversion: Rp 16,600,000 ÷ 12,296 IDR/SGD ≈ $1,350 SGD ✓

### 6. Mathematical Accuracy Tests

#### Bidirectional Conversion
- Convert USD → IDR → USD should return to original value (within rounding)
  - $1,000 → Rp 16,600,000 → $1,000 ✓
  - $123.45 → Rp 2,049,270 → $123.45 ✓

#### Cross-Currency Conversion
- Converting via different paths should yield same result
  - USD → IDR → SGD ≈ USD → SGD (direct)
  - USD → SGD → MYR ≈ USD → MYR (direct)

#### Edge Cases
- Zero amounts should show 0 in all currencies
- Negative amounts (refunds, credits) should convert correctly
- Very large amounts (1 million+) should display without errors
- Very small amounts (0.01) should round correctly

### 7. Supported Currencies

Verify all 6 currencies work with proper exchange rates:

| Currency | Code | Example Rates |
|----------|------|----------------|
| US Dollar | USD | 1 USD = 1 USD |
| Indonesian Rupiah | IDR | 1 USD = 16,600 IDR |
| Singapore Dollar | SGD | 1 USD = 1.35 SGD |
| Malaysian Ringgit | MYR | 1 USD = 4.20 MYR |
| Thai Baht | THB | 1 USD = 35.50 THB |
| Indian Rupee | INR | 1 USD = 83.20 INR |

**Test each currency**:
1. Set currency to each option
2. Verify exchange rates look reasonable
3. Verify all amounts display correctly
4. Verify UI shows correct symbols

### 8. UI/UX Checks

- [ ] Currency symbol displays correctly in all components
- [ ] Thousands separators display correctly (e.g., "1,000" or "1.000" depending on locale)
- [ ] Decimal places display correctly per currency rules
  - USD: 2 decimals ($1,000.00)
  - IDR: 0 decimals (Rp 16,600,000)
  - Others vary by locale
- [ ] No visual glitches when switching currencies
- [ ] Loading states work correctly during data fetch
- [ ] Error messages display correctly if conversion fails

### 9. Performance Tests

- **Dashboard Load Time**: Should not increase significantly
  - Conversions happen client-side after data fetch
  - Data fetch time should be unchanged
  
- **Currency Switch Time**: Should be instant/near-instant
  - Only re-renders affected components
  - No server round-trip needed
  
- **Large Transaction Lists**: Should handle 100+ transactions smoothly
  - Conversions use memoization to prevent unnecessary recalculations

### 10. Edge Cases & Error Handling

#### No Currency Selected
- Should default to USD if no currency preference
- Verify in settings: currency field shows a default value

#### Invalid Exchange Rate
- Should throw error with clear message
- Example: If exchange-rates.ts is missing a currency pair

#### Rounding Errors
- Amounts are rounded to 2 decimal places
- Converting back should yield original ±0.01

#### Locale-Specific Formatting
- USD in en-US: $1,000.00
- IDR in id-ID: Rp1.000.000 (dots as thousands, no decimals)
- SGD in en-SG: $1,000.00
- Verify current implementation handles this

## Automated Testing Checklist

### Unit Tests (exchange-rates.ts)
- [ ] Basic conversions (USD→IDR, IDR→USD, etc.)
- [ ] Idempotent conversions (same currency)
- [ ] Bidirectional accuracy (X→Y→X ≈ X)
- [ ] Edge cases (zero, negative, very large numbers)
- [ ] Error handling (invalid currencies)

### Integration Tests
- [ ] Dashboard loads and displays converted amounts
- [ ] Currency switch triggers re-renders
- [ ] All pages display consistent currency across navigation
- [ ] Back-end stores USD, front-end displays converted

### Visual Regression Tests
- [ ] Screenshots in each supported currency
- [ ] Verify layout doesn't break with longer/shorter values
- [ ] Verify responsive design still works across currencies

## Performance Benchmarks

Document baseline performance:

```
Dashboard Load:
- Data fetch: ~200ms
- Component render: ~150ms
- Conversion application: <50ms

Currency Switch:
- Re-render time: <100ms
- No layout shift/CLS issues

Large Transaction List (500 items):
- Initial render: ~300ms
- Conversion application: ~50ms
- Currency switch re-render: ~150ms
```

## Known Limitations & Notes

1. **Static Exchange Rates**: Currently using hardcoded December 2024 rates
   - Plan Phase 2 upgrade to live API
   - Rates should be updated quarterly in Phase 1
   
2. **Display-Only Conversion**: Original amounts preserved in database
   - Ensures historical accuracy
   - Allows perfect conversion reversibility
   - Example: User switches USD→IDR→USD, gets exact original amount
   
3. **Database Base Currency**: All amounts stored as USD in database
   - Simplifies calculations and reporting
   - Can be changed with data migration if needed
   
4. **No Rate History**: Cannot see historical rates for past conversions
   - Phase 2 enhancement: Store conversion rate with each transaction

## Testing Resources

- **Test Data**: Use seed data in `/seed` page for consistent test amounts
- **Example Amounts**: 
  - Income: $10,000
  - Expenses: $5,000
  - Budget limits: $2,000 per category
  - Goals: $50,000
  
- **Test Currencies**: Focus on IDR (largest difference) and SGD (smallest)

## Sign-Off Checklist

- [ ] All dashboard values convert correctly
- [ ] All transaction pages display converted amounts
- [ ] All budget/goal pages display converted amounts
- [ ] Currency switching is responsive (no lag/jank)
- [ ] All 6 currencies can be selected and display correctly
- [ ] Edge cases handled gracefully
- [ ] No console errors in browser DevTools
- [ ] No database modifications (still stored as USD)
- [ ] Exchange rates documented with source/date

---

**Completion Criteria**: All items above checked ✓ = Feature ready for production

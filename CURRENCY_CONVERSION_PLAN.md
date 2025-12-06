# Currency Conversion Implementation Plan

## 1. Current State Analysis

### Data Storage
- **Amounts stored as:** Raw float values (no currency tag) in database
  - `Transaction.amount`, `Budget.amount`, `Goal.targetAmount`, `Goal.currentAmount`, `RecurringTransaction.amount`
- **Currency tracking:** Only stored in `User.currencyPreference` (string code)
- **Implication:** All amounts are assumed to be in the user's preferred currency

### Current Currency System
- **Formatting only:** `formatCurrency()` applies symbol/locale but doesn't convert values
- **Global state:** `CurrencyProvider` stores current currency preference
- **Flow:** User changes currency → saved to DB → applied to display only

### Where Amounts Display
| Location | Component | File |
|----------|-----------|------|
| Dashboard KPIs | `KpiCard.tsx` | Shows totals |
| Transaction list | `TransactionList.tsx` | Shows individual amounts |
| Budget cards | `BudgetList.tsx` | Shows spent/remaining |
| Goal cards | `GoalCard.tsx` | Shows progress |
| Charts (axis labels) | `TrendChart.tsx`, `CashFlowChart.tsx` | Y-axis values |
| Recent transactions | `RecentTransactions.tsx` | Quick view amounts |
| Analytics tables | `TransactionTable.tsx` | Detailed view |

---

## 2. Conversion Strategy: Display-Only Approach (Recommended)

### Why Display-Only?
✅ Preserves historical data integrity
✅ Reversible (switch back without loss)
✅ No database migration needed
✅ Supports future "base currency" changes
✅ Cleaner UX (no permanent data modification)

### How It Works
1. **Original value stored in DB:** $1,000 (user's original currency = USD)
2. **User switches to:** IDR
3. **On display:** $1,000 × 16,600 = Rp 16,600,000
4. **Backend never touched:** DB still has $1,000
5. **Switch back to USD:** Rp 16,600,000 ÷ 16,600 = $1,000 ✓

---

## 3. Exchange Rate Service Architecture

### New File: `src/lib/exchange-rates.ts`

```typescript
type ExchangeRateMatrix = Record<CurrencyCode, Record<CurrencyCode, number>>

// Static rates (Phase 1 - no API calls)
export const EXCHANGE_RATES: ExchangeRateMatrix = {
  USD: { USD: 1, IDR: 16600, SGD: 1.35, MYR: 4.20, THB: 35.50, INR: 83.20 },
  IDR: { USD: 0.00006, IDR: 1, SGD: 0.0000813, MYR: 0.000253, THB: 0.00214, INR: 0.00501 },
  SGD: { USD: 0.74, IDR: 12340, SGD: 1, MYR: 3.11, THB: 26.30, INR: 61.60 },
  MYR: { USD: 0.238, IDR: 3950, SGD: 0.322, MYR: 1, THB: 8.45, INR: 19.80 },
  THB: { USD: 0.0281, IDR: 467, SGD: 0.038, MYR: 0.118, THB: 1, INR: 2.34 },
  INR: { USD: 0.012, IDR: 199, SGD: 0.0162, MYR: 0.0505, THB: 0.427, INR: 1 },
}

export function convertCurrency(
  amount: number,
  fromCurrency: CurrencyCode,
  toCurrency: CurrencyCode
): number {
  if (fromCurrency === toCurrency) return amount
  const rate = EXCHANGE_RATES[fromCurrency]?.[toCurrency]
  if (!rate) throw new Error(`No conversion rate for ${fromCurrency} → ${toCurrency}`)
  return amount * rate
}
```

### Future Enhancement: Live Rates
```typescript
// Phase 2 - Optional live API integration
async function fetchLiveExchangeRates(): Promise<ExchangeRateMatrix> {
  // Use ExchangeRate-API, OpenExchangeRates, or similar
  // Update via server action weekly/daily
}
```

---

## 4. CurrencyProvider Enhancement

### Current Interface
```typescript
interface CurrencyContextValue {
  currency: CurrencyCode
  setCurrency: (currency: CurrencyCode) => Promise<void>
  formatCurrency: (amount: number) => string
  isUpdating: boolean
}
```

### New Interface (Add conversion support)
```typescript
interface CurrencyContextValue {
  currency: CurrencyCode
  previousCurrency: CurrencyCode  // For reverting if needed
  setCurrency: (currency: CurrencyCode) => Promise<void>
  formatCurrency: (amount: number) => string
  convertAmount: (amount: number, fromCurrency?: CurrencyCode) => number
  getConversionRate: (from: CurrencyCode, to: CurrencyCode) => number
  isUpdating: boolean
}
```

### Implementation Pattern
```typescript
const convertAmount = useCallback((amount: number, fromCurrency?: CurrencyCode) => {
  const source = fromCurrency || previousCurrency
  return convertCurrency(amount, source, currency)
}, [currency, previousCurrency])
```

---

## 5. Integration Points

### Dashboard & Analytics (Server Actions)
Amounts already fetched via server actions (`dashboard-filtered.ts`). 

**Option 1:** Add conversion in server actions
```typescript
export async function getSummaryMetrics(filters: DashboardFilters, conversionRate: number) {
  const metrics = await db.transaction.aggregate({...})
  return {
    totalIncome: metrics._sum.amount * conversionRate,
    totalExpenses: metrics._sum.amount * conversionRate,
    // ...
  }
}
```

**Option 2:** Convert on client component ✅ RECOMMENDED
- Cleaner separation of concerns
- Client has all conversion logic
- No server action changes needed
- Instant UI updates without server round-trip

### Example: DashboardContent Component
```tsx
const { currency, convertAmount } = useCurrency()
const [summaryData, setSummaryData] = useState<SummaryMetrics | null>(null)

useEffect(() => {
  const fetchData = async () => {
    const data = await getSummaryMetrics(filters)
    setSummaryData({
      totalIncome: convertAmount(data.totalIncome),
      totalExpenses: convertAmount(data.totalExpenses),
      netBalance: convertAmount(data.netBalance),
    })
  }
  fetchData()
}, [filters, currency]) // Include currency in deps
```

---

## 6. Components Requiring Updates

| Component | Change | Priority |
|-----------|--------|----------|
| `KpiCard` | Display converted amounts | HIGH |
| `CashFlowChart` | Convert chart data + Y-axis labels | HIGH |
| `CategoryChart` | Convert category breakdown values | HIGH |
| `TrendChart` | Convert trend line data | HIGH |
| `MonthOverMonthComparison` | Convert comparison values | HIGH |
| `RecentTransactions` | Convert individual amounts | MEDIUM |
| `TransactionList` | Convert amounts in table | MEDIUM |
| `BudgetList` | Convert budget/spent values | MEDIUM |
| `GoalCard` | Convert goal amounts | MEDIUM |
| `RecurringList` | Convert recurring amounts | MEDIUM |
| `DashboardContent` | Hook in conversion logic | HIGH |
| `AnalyticsFilters` (if exists) | Wire currency changes | MEDIUM |

---

## 7. UX/UI Enhancements

### Conversion Indicator (Optional)
When currency is not the "original", show tooltip:
```
💡 Showing values in IDR (1 USD = 16,600 IDR)
   [Original currency was USD]
```

### Loading State
```tsx
{isUpdating && <Spinner>Converting to {currency}...</Spinner>}
```

### Confirmation Dialog (Optional)
First time changing currency:
```
🔄 Switch Currency?
"Your transaction amounts will be displayed in IDR using current exchange rates.
Original amounts remain unchanged."
[Cancel] [Switch]
```

---

## 8. Testing Plan

### Unit Tests
```typescript
// test: convertCurrency()
expect(convertCurrency(1000, 'USD', 'IDR')).toBe(16600000)
expect(convertCurrency(16600000, 'IDR', 'USD')).toBeCloseTo(1000, 0)

// test: Idempotence
expect(convertCurrency(1000, 'USD', 'USD')).toBe(1000)
```

### Integration Tests
| Test Case | Steps | Expected |
|-----------|-------|----------|
| Switch USD→IDR | Load dashboard, change currency in settings, observe dashboard | Amounts multiply by ~16,600 |
| Switch IDR→USD | Switch back | Amounts return to original |
| Chart updates | Change currency while viewing chart | Y-axis labels & data update |
| No data loss | Switch multiple times | Historical amounts unchanged |
| Refresh page | Change currency, refresh | Currency persists, amounts correct |

### Edge Cases
- Zero amounts
- Negative amounts (income vs expense)
- Very large numbers
- Floating point precision

---

## 9. Implementation Order

1. **Phase 1: Foundation**
   - Create `exchange-rates.ts` with static rates
   - Add `convertCurrency()` utility function
   - Update `CurrencyProvider` with conversion methods

2. **Phase 2: Core Integration**
   - Update `DashboardContent.tsx` to use conversion
   - Update `CashFlowChart.tsx`
   - Update `TrendChart.tsx`
   - Update `KpiCard.tsx`

3. **Phase 3: Full App Coverage**
   - Update list components (transactions, budgets, goals, recurring)
   - Update analytics components
   - Update charts

4. **Phase 4: Polish**
   - Add conversion indicator UI
   - Add loading states
   - Test all edge cases

---

## 10. Success Criteria

✅ $1,000 USD converts to ~Rp 16,600,000 (with configured rate)
✅ Dashboard, charts, lists all show converted values
✅ Switching back to USD shows original $1,000
✅ No database modifications
✅ Instant conversion without page reload
✅ Works across all currency pairs
✅ Historical data integrity maintained
✅ All components reflect current currency

---

## 11. Future Enhancements

- **Live exchange rates:** Fetch daily rates from API
- **Rate history:** Show historical exchange rates used
- **Base currency selection:** Allow users to choose which currency is "original"
- **Conversion logs:** Track when conversions happen
- **Rate notifications:** Alert if rates change significantly
- **Batch conversion:** Convert old transactions to new base currency (optional permanent feature)

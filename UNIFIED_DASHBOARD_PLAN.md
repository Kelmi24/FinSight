# Unified Dashboard Implementation Plan

**Status**: Planning Phase  
**Date**: December 6, 2025  
**Objective**: Merge Dashboard and Analytics pages into one unified Dashboard with global filter synchronization

---

## 1. Audit & Current State Analysis

### 1.1 Existing Pages
- **Dashboard Page**: `/src/app/(dashboard)/dashboard/page.tsx`
  - Displays: KPI cards, Cash Flow chart, Category chart, Recent Transactions
  - Uses: `getDashboardSummary()`, `getCashFlowData()`, `getCategoryBreakdown()`, `getTransactions()`
  - NO filtering capability

- **Analytics Page**: `/src/app/(dashboard)/analytics/page.tsx`
  - Displays: Trend chart, Month-over-month comparison, Transaction table
  - Has: `AnalyticsClient` component with filtering
  - Filters: Date range, category, type, amount range

- **Current Sidebar Navigation**:
  ```
  Dashboard (/dashboard)
  Transactions (/transactions)
  Budgets (/budgets)
  Analytics (/analytics)
  Goals (/goals)
  Settings (/settings)
  ```

### 1.2 Reusable Components

#### Dashboard Components
| Component | Location | Reusable | Purpose |
|-----------|----------|----------|---------|
| `KpiCard` | `src/components/dashboard/KpiCard.tsx` | ✅ Yes | Summary cards (income, expenses, balance) |
| `CashFlowChart` | `src/components/dashboard/CashFlowChart.tsx` | ✅ Yes | Line chart of cash flow over time |
| `CategoryChart` | `src/components/dashboard/CategoryChart.tsx` | ✅ Yes | Pie chart of spending by category |
| `RecentTransactions` | `src/components/dashboard/RecentTransactions.tsx` | ✅ Yes | Recent txns list with type/category badges |

#### Analytics Components
| Component | Location | Reusable | Purpose |
|-----------|----------|----------|---------|
| `AnalyticsClient` | `src/components/analytics/AnalyticsClient.tsx` | ⚠️ Partial | Client-side filter orchestration |
| `AnalyticsFilters` | `src/components/analytics/AnalyticsFilters.tsx` | ✅ Yes | Filter UI (date range, category, type, amount) |
| `TrendChart` | `src/components/analytics/TrendChart.tsx` | ✅ Yes | Line chart for spending trends |
| `MonthOverMonthComparison` | `src/components/analytics/MonthOverMonthComparison.tsx` | ✅ Yes | Month-to-month comparison card |
| `TransactionTable` | `src/components/analytics/TransactionTable.tsx` | ✅ Yes | Detailed transaction table |
| `ExportButton` | `src/components/analytics/ExportButton.tsx` | ✅ Yes | CSV export functionality |

### 1.3 Data Fetching Actions

#### Dashboard Actions
| Function | Location | Purpose |
|----------|----------|---------|
| `getDashboardSummary()` | `src/lib/actions/dashboard.ts` | Total income/expenses/balance |
| `getCashFlowData()` | `src/lib/actions/dashboard.ts` | Monthly cash flow data |
| `getCategoryBreakdown()` | `src/lib/actions/dashboard.ts` | Category-wise expense breakdown |

#### Analytics Actions
| Function | Location | Purpose |
|----------|----------|---------|
| `getFilteredTransactions()` | `src/lib/actions/analytics.ts` | Transactions with filters applied |
| `getSpendingTrends()` | `src/lib/actions/analytics.ts` | Monthly spending trends |

#### Transaction Actions
| Function | Location | Purpose |
|----------|----------|---------|
| `getTransactions()` | `src/lib/actions/transactions.ts` | Recent transactions (no filters) |

---

## 2. New Architecture Plan

### 2.1 Global Filter State (Context API)

**File**: `src/providers/filter-provider.tsx`

```typescript
interface DashboardFilters {
  startDate: string          // ISO date
  endDate: string            // ISO date
  category: string[]         // ["all"] or ["Food & Dining", ...]
  type: "all" | "income" | "expense"
  minAmount: number | null
  maxAmount: number | null
  account?: string           // future: for multi-account support
}

interface FilterContextValue {
  filters: DashboardFilters
  setFilters: (filters: DashboardFilters) => void
  resetFilters: () => void
  isLoading: boolean
}
```

**Key Features**:
- Persists to localStorage for session recall
- Available globally via `useFilter()` hook
- Accessed by Dashboard, Transactions, Budgets, Recurring pages

### 2.2 Centralized Analytics Service

**File**: `src/lib/services/analyticsService.ts`

Consolidate all data fetching logic:
- `getSummaryMetrics(filters)` - combines `getDashboardSummary()` + filtered data
- `getCashFlowData(filters)` - filtered cash flow
- `getCategoryBreakdown(filters)` - filtered category data
- `getSpendingTrends(filters)` - filtered trends
- `getFilteredTransactions(filters)` - transactions with filters
- `getMonthOverMonthComparison(filters)` - comparison data

### 2.3 New File Structure

```
/src
  /app/(dashboard)
    /page.tsx                          # Removed - redirect to /dashboard
    /dashboard
      /page.tsx                        # UNIFIED - New dashboard with all analytics
    /analytics                         # REMOVED - Route deleted
    /transactions/page.tsx             # Uses global filters
    /budgets/page.tsx                  # Uses global filters
    /recurring/page.tsx                # Uses global filters (if exists)
  
  /components
    /dashboard
      SummaryCards.tsx                 # NEW - KPI cards grid
      Charts/
        CashflowChart.tsx              # Existing + filter support
        CategoryChart.tsx              # Existing + filter support
        TrendChart.tsx                 # Move from analytics
      MonthOverMonthComparison.tsx      # Move from analytics
      DashboardFilters.tsx             # NEW - Unified filter component
      RecentTransactions.tsx           # Existing + filter support
    
    /analytics                         # DEPRECATED - Keep for reference, don't use
  
  /providers
    /filter-provider.tsx               # NEW - Global filter context
  
  /lib
    /services
      analyticsService.ts              # NEW - Centralized data layer
    /actions
      dashboard.ts                     # Existing - can be used by service
      analytics.ts                     # Existing - refactor to use service
      transactions.ts                  # Existing
```

---

## 3. Implementation Phases

### Phase 1: Setup Global State (30 mins)
**Goal**: Create filter context and provider

1. Create `src/providers/filter-provider.tsx`
   - Define `DashboardFilters` interface
   - Create `FilterContext` and `useFilter()` hook
   - Add localStorage persistence
   - Wrap in dashboard layout

2. Update `src/app/(dashboard)/layout.tsx`
   - Add `<FilterProvider>` wrapper
   - Load persisted filters on mount

3. Create filter utility functions in `src/lib/filterUtils.ts`
   - `getDefaultFilters()`
   - `applyFilters(transactions, filters)`
   - `isFiltersEmpty(filters)`

**Estimated Time**: 30 minutes

---

### Phase 2: Create Analytics Service Layer (45 mins)
**Goal**: Centralize all data fetching with filter support

1. Create `src/lib/services/analyticsService.ts`
   - Refactor existing dashboard/analytics queries
   - Add filter parameter to all functions
   - Implement efficient date/category/type filtering
   - Use memoization for performance

2. Update existing action files to use service:
   - `src/lib/actions/dashboard.ts` → call service functions
   - `src/lib/actions/analytics.ts` → call service functions

3. Add helper functions:
   - `formatChartData(transactions, groupBy)`
   - `calculateTrends(transactions, timeframe)`

**Estimated Time**: 45 minutes

---

### Phase 3: Create Unified Dashboard Component (60 mins)
**Goal**: Build new unified dashboard page

1. Create `src/components/dashboard/DashboardFilters.tsx`
   - Reuse `AnalyticsFilters` UI but connect to global context
   - Add reset/apply buttons
   - Handle date range, category, type, amount

2. Create `src/components/dashboard/SummaryCards.tsx`
   - Grid of KPI cards (income, expenses, balance, transactions)
   - Uses global filters
   - Responsive layout

3. Create `src/components/dashboard/DashboardContent.tsx`
   - Client component that uses `useFilter()` hook
   - Fetches data based on filters
   - Shows loading states
   - Renders all charts + transactions table

4. Update `/src/app/(dashboard)/dashboard/page.tsx`
   - Server component for initial data
   - Passes initial state to DashboardContent
   - Add title/description

**Estimated Time**: 60 minutes

---

### Phase 4: Update Other Pages for Filter Sync (45 mins)
**Goal**: Make Transactions, Budgets, etc. use global filters

1. Update `src/app/(dashboard)/transactions/page.tsx`
   - Read filters from context
   - Apply to transaction queries
   - Show applied filters badge

2. Update `src/app/(dashboard)/budgets/page.tsx`
   - Read category filter from context
   - Optional: Show budgets for selected categories

3. Update recurring page (if exists)
   - Apply filters to recurring transaction queries

4. Add visual indicator
   - Show "Filters applied" badge in sidebar/header
   - Show reset option globally

**Estimated Time**: 45 minutes

---

### Phase 5: Update Navigation & Routing (20 mins)
**Goal**: Remove Analytics route, update sidebar

1. Remove `/src/app/(dashboard)/analytics/` folder
   - Delete `analytics/page.tsx`
   - Delete any analytics-specific layouts

2. Update `src/components/layout/Sidebar.tsx`
   - Remove "Analytics" menu item
   - Rename "Dashboard" to something like "Dashboard & Analytics"
   - Or keep it simple as "Dashboard"

3. Update home redirect
   - `/` should redirect to `/dashboard` (not landing page)

4. Update any links to `/analytics`
   - Search for hardcoded `/analytics` links
   - Change to `/dashboard`

**Estimated Time**: 20 minutes

---

### Phase 6: Testing & Polish (30 mins)
**Goal**: Test filters, responsive design, performance

1. Test filter synchronization:
   - Apply filter on dashboard
   - Navigate to transactions page
   - Verify same filter is applied
   - Navigate to budgets
   - Verify filters persist

2. Test responsive design
   - Mobile: Filters should stack vertically
   - Tablet: 2-column layout
   - Desktop: Multi-column layout

3. Performance check:
   - Measure query time with large datasets
   - Check for N+1 queries
   - Optimize as needed

4. Visual polish:
   - Consistent spacing
   - Proper contrast/colors (CopperX theme)
   - Smooth transitions

**Estimated Time**: 30 minutes

---

## 4. Code Examples

### 4.1 Filter Context Hook

```typescript
// src/providers/filter-provider.tsx

"use client"

import { createContext, useContext, useState, useEffect } from "react"

export interface DashboardFilters {
  startDate: string
  endDate: string
  category: string[]
  type: "all" | "income" | "expense"
  minAmount: number | null
  maxAmount: number | null
}

const DEFAULT_FILTERS: DashboardFilters = {
  startDate: "",
  endDate: "",
  category: [],
  type: "all",
  minAmount: null,
  maxAmount: null,
}

const FilterContext = createContext<{
  filters: DashboardFilters
  setFilters: (filters: DashboardFilters) => void
  resetFilters: () => void
} | undefined>(undefined)

export function FilterProvider({ children }: { children: React.ReactNode }) {
  const [filters, setFiltersState] = useState<DashboardFilters>(DEFAULT_FILTERS)
  const [mounted, setMounted] = useState(false)

  // Load from localStorage on mount
  useEffect(() => {
    const saved = localStorage.getItem("dashboardFilters")
    if (saved) {
      try {
        setFiltersState(JSON.parse(saved))
      } catch (e) {
        console.error("Failed to load filters:", e)
      }
    }
    setMounted(true)
  }, [])

  // Save to localStorage when filters change
  useEffect(() => {
    if (mounted) {
      localStorage.setItem("dashboardFilters", JSON.stringify(filters))
    }
  }, [filters, mounted])

  const resetFilters = () => {
    setFiltersState(DEFAULT_FILTERS)
    localStorage.removeItem("dashboardFilters")
  }

  return (
    <FilterContext.Provider value={{ filters, setFilters: setFiltersState, resetFilters }}>
      {children}
    </FilterContext.Provider>
  )
}

export function useFilter() {
  const context = useContext(FilterContext)
  if (!context) {
    throw new Error("useFilter must be used within FilterProvider")
  }
  return context
}
```

### 4.2 Analytics Service

```typescript
// src/lib/services/analyticsService.ts

import { db } from "@/lib/db"
import { DashboardFilters } from "@/providers/filter-provider"

export class AnalyticsService {
  static async getSummaryMetrics(userId: string, filters: DashboardFilters) {
    const transactions = await this.getFilteredTransactions(userId, filters)
    
    const income = transactions
      .filter(t => t.type === "income")
      .reduce((sum, t) => sum + t.amount, 0)
    
    const expenses = transactions
      .filter(t => t.type === "expense")
      .reduce((sum, t) => sum + t.amount, 0)
    
    return {
      totalIncome: income,
      totalExpenses: expenses,
      netBalance: income - expenses,
      transactionCount: transactions.length,
    }
  }

  static async getFilteredTransactions(userId: string, filters: DashboardFilters) {
    const where: any = { userId }
    
    if (filters.startDate) {
      where.date = { ...where.date, gte: new Date(filters.startDate) }
    }
    if (filters.endDate) {
      where.date = { ...where.date, lte: new Date(filters.endDate) }
    }
    if (filters.category.length > 0 && !filters.category.includes("all")) {
      where.category = { in: filters.category }
    }
    if (filters.type !== "all") {
      where.type = filters.type
    }
    if (filters.minAmount !== null) {
      where.amount = { ...where.amount, gte: filters.minAmount }
    }
    if (filters.maxAmount !== null) {
      where.amount = { ...where.amount, lte: filters.maxAmount }
    }

    return await db.transaction.findMany({
      where,
      orderBy: { date: "desc" },
    })
  }

  static async getCashFlowData(userId: string, filters: DashboardFilters) {
    const transactions = await this.getFilteredTransactions(userId, filters)
    
    // Group by month and calculate income/expenses
    const monthlyData: Record<string, { month: string; income: number; expenses: number }> = {}
    
    transactions.forEach(txn => {
      const month = new Date(txn.date).toLocaleDateString("en-US", { 
        year: "numeric", 
        month: "short" 
      })
      
      if (!monthlyData[month]) {
        monthlyData[month] = { month, income: 0, expenses: 0 }
      }
      
      if (txn.type === "income") {
        monthlyData[month].income += txn.amount
      } else {
        monthlyData[month].expenses += txn.amount
      }
    })
    
    return Object.values(monthlyData).sort((a, b) => 
      new Date(a.month).getTime() - new Date(b.month).getTime()
    )
  }

  static async getCategoryBreakdown(userId: string, filters: DashboardFilters) {
    const transactions = await this.getFilteredTransactions(userId, filters)
    
    const categoryData: Record<string, number> = {}
    
    transactions
      .filter(t => t.type === "expense")
      .forEach(txn => {
        categoryData[txn.category] = (categoryData[txn.category] || 0) + txn.amount
      })
    
    return Object.entries(categoryData)
      .map(([category, amount]) => ({ category, amount }))
      .sort((a, b) => b.amount - a.amount)
  }
}
```

---

## 5. Testing Checklist

- [ ] Filter context loads and saves to localStorage
- [ ] Applying filters on dashboard updates all components
- [ ] Navigating to transactions shows same filters applied
- [ ] Navigating to budgets shows category filter applied
- [ ] Reset filters button clears all filters
- [ ] Charts re-render when filters change
- [ ] Performance is acceptable with 1000+ transactions
- [ ] Mobile layout is responsive
- [ ] Analytics route returns 404 (or redirects)
- [ ] Sidebar shows correct active page

---

## 6. Success Criteria

✅ **Merge completed**: One unified Dashboard page with all components  
✅ **Filters visible**: Filter UI prominently displayed  
✅ **Filters synchronized**: Applying filters syncs across Dashboard, Transactions, Budgets  
✅ **No broken links**: All routes work, no dead links  
✅ **Performance maintained**: Same or better than before  
✅ **Code organization**: Reusable components, centralized service layer  
✅ **Visual consistency**: CopperX design system applied  
✅ **Responsive design**: Works on mobile, tablet, desktop  

---

## 7. Timeline Estimate

| Phase | Duration | Total |
|-------|----------|-------|
| Phase 1: Global State | 30 min | 30 min |
| Phase 2: Service Layer | 45 min | 1h 15m |
| Phase 3: Dashboard Component | 60 min | 2h 15m |
| Phase 4: Update Other Pages | 45 min | 3h |
| Phase 5: Navigation Updates | 20 min | 3h 20m |
| Phase 6: Testing & Polish | 30 min | 3h 50m |
| **TOTAL** | | **~4 hours** |

---

## 8. Optional Enhancements (Future)

- Save filter presets (e.g., "This Month", "Last Quarter")
- Export dashboard as PDF
- AI-powered spending insights
- Custom date range presets
- Comparison mode (two date ranges side-by-side)
- Transaction notes/comments
- Budget forecasting

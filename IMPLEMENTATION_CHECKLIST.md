# Unified Dashboard - Implementation Checklist

## Phase 1: Global Filter State Setup ☐

- [ ] Create `src/providers/filter-provider.tsx`
  - Define `DashboardFilters` interface
  - Create `FilterContext` and `useFilter()` hook
  - Add localStorage persistence
  - Export filter constants

- [ ] Create `src/lib/filterUtils.ts`
  - `getDefaultFilters()` helper
  - `isFiltersEmpty()` checker
  - `serializeFilters()` for URLs (optional)

- [ ] Update `src/app/(dashboard)/layout.tsx`
  - Import `FilterProvider`
  - Wrap children with `<FilterProvider>`

**Status**: Not started  
**Estimated**: 30 mins  

---

## Phase 2: Analytics Service Layer ☐

- [ ] Create `src/lib/services/analyticsService.ts`
  - Class-based service with static methods
  - `getSummaryMetrics(userId, filters)`
  - `getFilteredTransactions(userId, filters)`
  - `getCashFlowData(userId, filters)`
  - `getCategoryBreakdown(userId, filters)`
  - `getSpendingTrends(userId, filters)`
  - `getMonthOverMonthComparison(userId, filters)`

- [ ] Refactor `src/lib/actions/dashboard.ts`
  - Import `AnalyticsService`
  - Update functions to accept filters
  - Call service methods instead of direct DB queries

- [ ] Refactor `src/lib/actions/analytics.ts`
  - Use `AnalyticsService` for data fetching
  - Keep API surface compatible

**Status**: Not started  
**Estimated**: 45 mins  

---

## Phase 3: Create Unified Dashboard ☐

- [ ] Create `src/components/dashboard/DashboardFilters.tsx`
  - Client component using `useFilter()` hook
  - Render: date range picker, category select, type select, amount range
  - Show active filter count
  - Reset button

- [ ] Create `src/components/dashboard/SummaryCards.tsx`
  - Accept `filters` prop
  - Render 4 KPI cards (income, expenses, balance, txn count)
  - Use `DashboardFilters` interface

- [ ] Create `src/components/dashboard/DashboardContent.tsx`
  - Client component
  - Use `useFilter()` for filters
  - Fetch data based on filters
  - Show loading skeleton
  - Render: SummaryCards, CashflowChart, CategoryChart, TrendChart, MonthOverMonthComparison, RecentTransactions

- [ ] Update `src/app/(dashboard)/dashboard/page.tsx`
  - Server component
  - Fetch categories for filter dropdown
  - Pass to `DashboardContent`

- [ ] Move/Update Chart Components
  - `src/components/dashboard/TrendChart.tsx` - move from analytics
  - `src/components/dashboard/MonthOverMonthComparison.tsx` - move from analytics
  - Update both to use filter-friendly data

- [ ] Move/Update Table Components
  - `src/components/dashboard/RecentTransactions.tsx` - already exists, update for filters

**Status**: Not started  
**Estimated**: 60 mins  

---

## Phase 4: Update Other Pages for Filter Sync ☐

- [ ] Update `src/app/(dashboard)/transactions/page.tsx`
  - Import `useFilter()` hook (if client component)
  - Or read filters in server component
  - Apply filters to transaction queries
  - Show applied filters badge

- [ ] Update `src/components/transactions/TransactionFilters.tsx`
  - Option 1: Connect to global filter context
  - Option 2: Keep local and sync on apply
  - Decide on sync strategy

- [ ] Update `src/app/(dashboard)/budgets/page.tsx`
  - Apply category filter to budget display
  - Optional: show budgets for selected categories only

- [ ] Update recurring page (if exists)
  - Apply filters to recurring transaction display

- [ ] Add global filter indicator
  - Show in navbar or header
  - "X filters applied" badge
  - Reset all button

**Status**: Not started  
**Estimated**: 45 mins  

---

## Phase 5: Update Navigation & Routing ☐

- [ ] Delete `/src/app/(dashboard)/analytics/` folder
  - Remove `page.tsx`
  - Remove any layout files

- [ ] Update `src/components/layout/Sidebar.tsx`
  - Remove "Analytics" route
  - Keep Dashboard only
  - Verify active state works

- [ ] Search for hardcoded `/analytics` links
  - Find: `grep -r "/analytics" src/`
  - Replace with `/dashboard` or remove

- [ ] Test redirect behavior
  - Visiting `/analytics` should 404 or redirect
  - No broken navigation

**Status**: Not started  
**Estimated**: 20 mins  

---

## Phase 6: Testing & Polish ☐

### Filter Synchronization Tests
- [ ] Apply date range on dashboard
  - Navigate to transactions
  - Verify same date range shown
  - Navigate to budgets
  - Verify filter persists

- [ ] Apply category filter
  - Dashboard shows only selected category
  - Transactions filtered by category
  - Charts reflect filtered data
  - Budget shows relevant categories

- [ ] Apply type filter (income/expense)
  - KPI cards update
  - Charts update
  - Transaction list updates

- [ ] Reset filters
  - Button clears all filters
  - All pages show all data again
  - localStorage cleared

### Performance Tests
- [ ] Measure query time with 1000+ transactions
- [ ] Check for N+1 query problems
- [ ] Verify memoization working
- [ ] Monitor memory usage
- [ ] Test with slow network (Chrome DevTools)

### Responsive Design Tests
- [ ] Mobile (375px)
  - Filters stack vertically
  - Cards full width
  - Charts readable
  - Tables scroll horizontally

- [ ] Tablet (768px)
  - 2-column layout where applicable
  - Filters in 2 columns
  - Charts side-by-side

- [ ] Desktop (1920px)
  - Filters in 4-5 columns
  - Charts side-by-side
  - Table showing all columns

### Visual/UX Tests
- [ ] Colors match CopperX theme
- [ ] Spacing consistent (4/8/12/16 px)
- [ ] Shadows applied correctly
- [ ] Borders and corners consistent (12px radius)
- [ ] Hover states on interactive elements
- [ ] Loading skeletons show
- [ ] Empty states have proper messaging
- [ ] Error states handled gracefully

### Browser Compatibility
- [ ] Chrome/Edge
- [ ] Firefox
- [ ] Safari
- [ ] Mobile Safari
- [ ] Chrome Mobile

**Status**: Not started  
**Estimated**: 30 mins  

---

## Phase 7: Code Quality & Documentation ☐

- [ ] Add TypeScript types for all functions
- [ ] Add JSDoc comments to service methods
- [ ] Update component prop interfaces
- [ ] Add error handling (try/catch, error boundaries)
- [ ] Add logging for debugging
- [ ] Create/update README for new structure

**Status**: Not started  
**Estimated**: 20 mins  

---

## File Inventory

### Files to Create
```
src/providers/filter-provider.tsx          (NEW)
src/lib/services/analyticsService.ts       (NEW)
src/lib/filterUtils.ts                     (NEW)
src/components/dashboard/DashboardFilters.tsx      (NEW)
src/components/dashboard/SummaryCards.tsx          (NEW)
src/components/dashboard/DashboardContent.tsx      (NEW)
src/components/dashboard/TrendChart.tsx    (MOVE from analytics)
src/components/dashboard/MonthOverMonthComparison.tsx (MOVE from analytics)
```

### Files to Update
```
src/app/(dashboard)/layout.tsx             (ADD FilterProvider)
src/app/(dashboard)/dashboard/page.tsx     (REFACTOR for new structure)
src/app/(dashboard)/page.tsx               (REMOVE or redirect)
src/lib/actions/dashboard.ts               (ADD filter support)
src/lib/actions/analytics.ts               (REFACTOR to use service)
src/components/layout/Sidebar.tsx          (UPDATE navigation)
```

### Files to Delete
```
src/app/(dashboard)/analytics/page.tsx     (DELETE)
```

### Files to Keep (For Reference)
```
src/components/analytics/AnalyticsClient.tsx   (ARCHIVE - don't delete yet)
src/components/analytics/AnalyticsFilters.tsx  (ARCHIVE - reference for UI)
src/components/analytics/ExportButton.tsx      (MOVE to dashboard or utils)
```

---

## Implementation Tips

### Best Practices
- ✅ Use TypeScript strict mode
- ✅ Add error boundaries in React
- ✅ Memoize expensive calculations
- ✅ Test filters with edge cases (empty data, all filters on, etc.)
- ✅ Use `useCallback` for filter change handlers
- ✅ Optimize images and charts
- ✅ Add loading states
- ✅ Add empty/no-data states

### Common Pitfalls to Avoid
- ❌ Don't forget to wrap layout with FilterProvider
- ❌ Don't use `useFilter()` in server components
- ❌ Don't make synchronous DB queries in client components
- ❌ Don't forget localStorage cleanup on logout
- ❌ Don't make filter state mutations shared between routes
- ❌ Don't over-memoize (can hurt performance)

### Performance Optimization Strategies
- Use pagination for large transaction lists
- Implement server-side filtering if dataset > 10k records
- Cache analytics queries (e.g., Redis)
- Debounce filter changes (wait before fetching)
- Use React.memo for chart components
- Lazy load analytics components

---

## Sign-Off

- [ ] Design review completed
- [ ] Architecture approved by team
- [ ] Performance targets agreed
- [ ] Testing strategy confirmed
- [ ] Timeline realistic and agreed

**Ready to implement**: `[ ]` (Check when ready to start)

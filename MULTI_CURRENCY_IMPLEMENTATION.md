# Multi-Currency Implementation Summary

## Overview
Implemented "What you type is what you save" architecture for multi-currency support. Transactions, budgets, and goals now store their original currency and are displayed in that currency, bypassing the global user preference for display.

## Changes

### Database
- Added `currency` field (String, default "USD") to:
  - `Transaction`
  - `RecurringTransaction`
  - `Budget`
  - `Goal`

### Backend (Server Actions)
Updated the following actions to accept and persist `currency` from FormData:
- `src/lib/actions/transactions.ts`: `createTransaction`, `updateTransaction`
- `src/lib/actions/recurring.ts`: `createRecurringTransaction`, `updateRecurringTransaction`
- `src/lib/actions/budgets.ts`: `createBudget`, `updateBudget`
- `src/lib/actions/goals.ts`: `createGoal`, `updateGoal`

### Frontend (Forms)
Added currency selector (defaulting to existing value or "USD") to:
- `src/components/transactions/TransactionForm.tsx`
- `src/components/transactions/RecurringForm.tsx`
- `src/components/budgets/BudgetForm.tsx`
- `src/components/goals/GoalForm.tsx`

### Frontend (Display)
Updated lists to display amounts in their stored currency using `formatCurrency` from `@/lib/currency`, removing automatic conversion to global preference:
- `src/components/transactions/TransactionList.tsx`
- `src/components/transactions/RecurringList.tsx`
- `src/components/budgets/BudgetList.tsx`
- `src/components/goals/GoalList.tsx`
- `src/components/dashboard/RecentTransactions.tsx`
- `src/components/goals/GoalCard.tsx`

### Library
- Updated `src/lib/currency.ts` to include: EUR, GBP, JPY, CAD, AUD.

## Notes
- Aggregation logic (e.g., total spending vs budget) currently sums raw amounts. Future improvements could include currency conversion for accurate totals across different currencies.
- The global currency preference (`useCurrency`) is now primarily used for:
  - Default currency selection in forms (if we wanted to, currently defaults to USD or saved value).
  - Dashboard totals (if they use `convertAmount`).

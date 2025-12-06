# File List for Multi-Currency Implementation

## Database Schema
- `prisma/schema.prisma`: Add `currency` String field (default "USD") to:
  - `Transaction`
  - `RecurringTransaction`
  - `Budget`
  - `Goal`

## Server Actions (Backend)
Update these files to accept and save the `currency` field:
- `src/lib/actions/transactions.ts`
- `src/lib/actions/recurring.ts`
- `src/lib/actions/budgets.ts`
- `src/lib/actions/goals.ts`

## Forms (Input)
Update these forms to read the current global currency and submit it with the data:
- `src/components/transactions/TransactionForm.tsx`
- `src/components/transactions/RecurringForm.tsx`
- `src/components/budgets/BudgetForm.tsx`
- `src/components/goals/GoalForm.tsx`

## Display & Logic (Frontend)
Update these components to use `txn.currency` as the source for conversion instead of hardcoded "USD":
- `src/app/(dashboard)/transactions/page.tsx` (Transaction loading & conversion)
- `src/components/dashboard/DashboardContent.tsx` (Dashboard metrics aggregation)
- `src/components/transactions/TransactionList.tsx`
- `src/components/transactions/RecurringList.tsx`
- `src/components/budgets/BudgetList.tsx`
- `src/components/goals/GoalList.tsx`

## Utilities
- `src/providers/currency-provider.tsx`: Ensure `currency` state is accessible to forms.

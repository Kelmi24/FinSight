# Audit Report: Currency Handling & Storage

## 1. Current Storage Model
The database schema (`prisma/schema.prisma`) for the `Transaction` model is:

```prisma
model Transaction {
  id          String   @id @default(cuid())
  amount      Float
  description String
  category    String
  date        DateTime
  type        String   // "income" or "expense"
  userId      String
  // ... relations and timestamps
}
```

**Critical Finding**: There is **no `currency` field** stored with the transaction. The system stores a raw float value (e.g., `1000`) but loses the context of what currency that value represents (e.g., was it $1,000 or Rp 1,000?).

## 2. Current Input & Save Flow
*   **Form**: `TransactionForm.tsx` uses a standard `<Input type="number">`.
*   **Submission**: The raw numeric value (e.g., `1`) is sent to `createTransaction` server action.
*   **Database**: The value `1` is saved to the `amount` column.
*   **Conclusion**: There is **no conversion happening during input or save**. The raw user input is preserved in the database.

## 3. Current Display & Conversion Logic
*   **Location**: `src/app/(dashboard)/transactions/page.tsx` (and `DashboardContent.tsx`, `BudgetList.tsx`, etc.)
*   **Logic**:
    ```typescript
    // src/app/(dashboard)/transactions/page.tsx
    const converted = data.map((t: any) => ({
      ...t,
      amount: convertAmount(t.amount, "USD", currency), // <--- PROBLEM
    }))
    ```
*   **The Issue**: The application **hardcodes "USD" as the source currency** for all conversions.
*   **Scenario**:
    1.  User sets app to **IDR**.
    2.  User enters `1` (intending 1 IDR).
    3.  DB saves `1`.
    4.  App loads `1`, assumes it is **1 USD**.
    5.  App converts 1 USD → 16,600 IDR.
    6.  User sees **Rp 16.600**.

## 4. Required Changes
To fix this, we must stop assuming all DB values are USD. We need to know the currency of each transaction.

1.  **Schema Change**: Add `currency String` to `Transaction` model.
2.  **Save Logic**: Save the user's current active currency code (e.g., "IDR") alongside the amount.
3.  **Display Logic**: Only convert if `transaction.currency !== user.displayCurrency`.

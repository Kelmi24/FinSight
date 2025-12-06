# Behavior Specification: Multi-Currency Support

## 1. Core Principle
**"What you type is what you save."**
If a user types `1000` while viewing the app in IDR, we save `1000 IDR`. We do not convert it to USD for storage.

## 2. Database Schema Changes
We will add a `currency` field to the `Transaction` model (and `RecurringTransaction`, `Budget`, `Goal`).

```prisma
model Transaction {
  // ... existing fields
  currency    String   @default("USD") // Store the currency code (e.g., "IDR", "USD")
}
```

*Migration Strategy*: Existing transactions will default to "USD" (or we can infer from user preference if needed, but "USD" is the safest assumption given the current codebase logic).

## 3. Input Behavior
*   **Transaction Form**:
    *   When opening the form, detect the user's **current global currency** (e.g., IDR).
    *   Display the currency symbol (Rp) as a prefix/label.
    *   User types `1000`.
    *   On Submit: Send `{ amount: 1000, currency: "IDR" }` to the server.
    *   **No conversion** is performed on the input value.

*   **Editing Transactions**:
    *   If editing a transaction that was saved as USD (e.g., `$10`), but the user is currently in IDR mode:
        *   **Option A (Strict)**: Show the form in USD mode for that transaction.
        *   **Option B (Flexible - Chosen)**: Show the amount `10` and a currency selector set to `USD`. If the user changes the currency selector to `IDR`, the amount remains `10` (unless they manually change it), effectively re-denominating the transaction.

## 4. Display Logic
When displaying a list of transactions (e.g., Dashboard, Transaction List):

1.  **Fetch** transactions (which now have mixed currencies: some USD, some IDR).
2.  **Get** user's current display currency (e.g., SGD).
3.  **Iterate** through transactions:
    *   If `txn.currency === displayCurrency`:
        *   Display `txn.amount` formatted (e.g., `S$ 100`).
    *   If `txn.currency !== displayCurrency`:
        *   Calculate `converted = convertAmount(txn.amount, txn.currency, displayCurrency)`.
        *   Display `converted` formatted.
        *   (Optional) Show visual indicator (e.g., `~` or tooltip) that this is a converted value.

## 5. Currency Switching
*   **Action**: User changes global currency from USD to IDR.
*   **Effect**:
    *   **Stored Data**: UNCHANGED. (A $10 transaction stays $10 USD).
    *   **UI**: Re-renders.
        *   The $10 USD transaction is now displayed as ~Rp 166,000 (converted on-the-fly).
        *   A Rp 50,000 IDR transaction is now displayed as Rp 50,000 (no conversion).

## 6. Component Updates Required

### Database & Actions
*   `prisma/schema.prisma`: Add `currency` field.
*   `src/lib/actions/transactions.ts`: Accept `currency` in `createTransaction`.
*   `src/lib/actions/recurring.ts`: Accept `currency`.
*   `src/lib/actions/budgets.ts`: Accept `currency`.
*   `src/lib/actions/goals.ts`: Accept `currency`.

### UI Components
*   `TransactionForm.tsx`: Pass current currency to server action.
*   `TransactionList.tsx` & `page.tsx`: Remove hardcoded "USD" source currency. Use `txn.currency`.
*   `DashboardContent.tsx`: Update aggregation logic to convert *before* summing if currencies differ.
*   `BudgetList.tsx`, `GoalList.tsx`: Similar updates.

## 7. Migration Plan
1.  **Schema Migration**: Add `currency` column, default to "USD".
2.  **Code Update**: Update all read/write paths to handle the new field.
3.  **Data Cleanup (Optional)**: If the user wants, we can provide a script/button to "Set all past transactions to [Current Currency]" if they were actually entered in IDR but saved as USD.

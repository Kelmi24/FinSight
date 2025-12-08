# Soft Delete Implementation

## Overview

FinSight AI now implements **soft delete** functionality for transactions. Instead of permanently deleting transactions immediately, they are marked as deleted and can be restored within a 5-second undo window via toast notifications.

## Features

### 1. **Soft Delete with Undo**
- Transactions are marked with `deletedAt` timestamp instead of being permanently deleted
- Wallet balances are immediately reverted when soft-deleted
- Toast notification appears with "Undo" button for 5 seconds
- Clicking "Undo" restores the transaction and wallet balance
- Soft-deleted transactions are excluded from all queries

### 2. **Automatic Cleanup**
- Transactions soft-deleted for more than 30 days are automatically purged
- Cleanup function in `src/lib/actions/cleanup.ts` (can be run via cron job)
- Reduces database bloat while providing recovery window

### 3. **Bulk Operations**
- Both single and bulk deletions support undo functionality
- Bulk restore available for multiple transactions
- All operations are atomic (database transactions ensure consistency)

## Database Schema

### Transaction Model Changes

```prisma
model Transaction {
  // ... existing fields
  
  // Soft delete support
  deletedAt   DateTime?
  
  // ... indexes
  @@index([userId, deletedAt])
}
```

## Server Actions

### Delete Functions

```typescript
// Soft delete (marks as deleted)
await deleteTransaction(id: string)

// Restore soft-deleted transaction
await restoreTransaction(id: string)

// Permanently delete (cannot be undone)
await permanentlyDeleteTransaction(id: string)

// Bulk operations
await bulkDeleteTransactions(ids: string[])
await bulkRestoreTransactions(ids: string[])
```

### Cleanup Functions

```typescript
// Permanently delete transactions older than 30 days
await cleanupOldDeletedTransactions()

// Get count of deleted transactions for user
await getDeletedTransactionsCount(userId: string)

// Get all deleted transactions for "Recently Deleted" view
await getDeletedTransactions(userId: string)
```

## Implementation Details

### Query Filtering

All transaction queries automatically exclude soft-deleted items:

```typescript
const where: any = { 
  userId,
  deletedAt: null // Exclude soft-deleted transactions
}
```

### Wallet Balance Updates

When deleting:
1. Transaction is marked with `deletedAt` timestamp
2. Wallet balance is reverted (income: subtract, expense: add)
3. Operations are atomic (wrapped in `db.$transaction`)

When restoring:
1. `deletedAt` is cleared (set to `null`)
2. Wallet balance is restored to original state
3. Operations are atomic

### Toast with Undo

```typescript
toast.success(
  `Deleted ${count} transaction${count === 1 ? '' : 's'}`,
  {
    duration: 5000, // 5-second undo window
    action: {
      label: "Undo",
      onClick: async () => {
        await bulkRestoreTransactions(deletedIds)
        toast.success("Restored successfully")
        router.refresh()
      },
    },
  }
)
```

## User Experience Flow

### Single Transaction Delete
1. User clicks delete button in TransactionList
2. Confirmation dialog appears
3. User confirms deletion
4. Transaction is soft-deleted
5. Toast notification shows with "Undo" button (5 seconds)
6. User can click "Undo" to restore
7. After 5 seconds, toast disappears but transaction can still be restored from "Recently Deleted" (future feature)
8. After 30 days, transaction is permanently deleted by cleanup job

### Bulk Transaction Delete
1. User selects multiple transactions
2. User clicks bulk delete button
3. Confirmation dialog shows count
4. User confirms
5. All selected transactions are soft-deleted atomically
6. Single toast shows with "Undo" button
7. Clicking "Undo" restores all deleted transactions
8. Same 30-day cleanup policy applies

## Future Enhancements

### Recently Deleted View (Optional)
- Add "Recently Deleted" section in settings
- Show all soft-deleted transactions for the user
- Allow manual restoration or permanent deletion
- Show days remaining until auto-deletion

### Settings Integration
- Add setting to adjust undo window duration (default: 5 seconds)
- Add setting to adjust auto-cleanup period (default: 30 days)
- Toggle soft delete on/off (immediate permanent delete)

### Audit Trail
- Keep track of who deleted/restored transactions
- Add `deletedBy` and `restoredBy` fields for multi-user accounts
- Log deletion/restoration events

## Cron Job Setup (Optional)

To automatically clean up old deleted transactions, add a cron job:

### Using Vercel Cron (Production)

1. Create `app/api/cron/cleanup/route.ts`:

```typescript
import { cleanupOldDeletedTransactions } from "@/lib/actions/cleanup"
import { NextResponse } from "next/server"

export async function GET(request: Request) {
  // Verify cron secret
  const authHeader = request.headers.get("authorization")
  if (authHeader !== `Bearer ${process.env.CRON_SECRET}`) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  }

  const count = await cleanupOldDeletedTransactions()
  return NextResponse.json({ success: true, deleted: count })
}
```

2. Add to `vercel.json`:

```json
{
  "crons": [
    {
      "path": "/api/cron/cleanup",
      "schedule": "0 0 * * *"
    }
  ]
}
```

3. Add `CRON_SECRET` to environment variables

### Using Node Cron (Self-hosted)

```typescript
import cron from "node-cron"
import { cleanupOldDeletedTransactions } from "@/lib/actions/cleanup"

// Run daily at midnight
cron.schedule("0 0 * * *", async () => {
  console.log("[Cron] Running cleanup job...")
  const count = await cleanupOldDeletedTransactions()
  console.log(`[Cron] Deleted ${count} old transactions`)
})
```

## Testing

### Manual Testing Steps

1. **Create transaction** → **Delete** → **Verify toast shows**
2. **Click Undo** → **Verify transaction restored**
3. **Select multiple** → **Bulk delete** → **Click Undo** → **Verify all restored**
4. **Check wallet balance** → **Should match before/after delete/restore**
5. **Check transaction list** → **Deleted items should not appear**

### Database Verification

```sql
-- Check soft-deleted transactions
SELECT * FROM "Transaction" WHERE "deletedAt" IS NOT NULL;

-- Check transactions older than 30 days
SELECT * FROM "Transaction" 
WHERE "deletedAt" IS NOT NULL 
  AND "deletedAt" < NOW() - INTERVAL '30 days';
```

## Migration

### Applied Changes

1. **Schema update**: Added `deletedAt DateTime?` field
2. **Index added**: `@@index([userId, deletedAt])` for efficient queries
3. **Actions updated**: All delete functions now use soft delete
4. **UI updated**: Toast notifications with undo button
5. **Cleanup utility**: Created for automatic purging

### Rollback Plan

If needed to revert:

1. Remove `deletedAt` field from schema
2. Restore old delete functions (hard delete)
3. Remove cleanup.ts
4. Run migration: `npx prisma migrate dev --name revert_soft_delete`

## Performance Considerations

- **Index on `deletedAt`**: Ensures fast filtering of active transactions
- **Compound index**: `[userId, deletedAt]` for user-specific queries
- **Cleanup job**: Prevents unbounded growth of soft-deleted records
- **Atomic operations**: All delete/restore wrapped in transactions

## Security

- **User isolation**: All operations verify `userId` ownership
- **No exposed endpoints**: Cleanup is internal, not exposed via API
- **Audit capability**: Can track who deleted/restored (future enhancement)

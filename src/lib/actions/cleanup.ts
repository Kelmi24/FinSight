"use server"

import { db } from "@/lib/db"

/**
 * Permanently delete soft-deleted transactions older than 30 days.
 * This should be called by a cron job or background task.
 * 
 * @returns Number of permanently deleted transactions
 */
export async function cleanupOldDeletedTransactions() {
  const thirtyDaysAgo = new Date()
  thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30)

  try {
    const result = await db.transaction.deleteMany({
      where: {
        deletedAt: {
          not: null,
          lt: thirtyDaysAgo,
        },
      } as any,
    })

    console.log(`[Cleanup] Permanently deleted ${result.count} transactions older than 30 days`)
    return result.count
  } catch (error) {
    console.error("[Cleanup] Failed to delete old transactions:", error)
    return 0
  }
}

/**
 * Get count of soft-deleted transactions for a user.
 * Can be used to show "trash" or "recently deleted" UI.
 */
export async function getDeletedTransactionsCount(userId: string) {
  try {
    const count = await db.transaction.count({
      where: {
        userId,
        deletedAt: { not: null },
      } as any,
    })
    return count
  } catch (error) {
    console.error("[Cleanup] Failed to get deleted transactions count:", error)
    return 0
  }
}

/**
 * Get soft-deleted transactions for a user (for "Recently Deleted" view).
 */
export async function getDeletedTransactions(userId: string) {
  try {
    const transactions = await db.transaction.findMany({
      where: {
        userId,
        deletedAt: { not: null },
      } as any,
      orderBy: { deletedAt: "desc" } as any,
      take: 50,
    })
    return transactions
  } catch (error) {
    console.error("[Cleanup] Failed to get deleted transactions:", error)
    return []
  }
}

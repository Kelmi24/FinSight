"use server"

import { db } from "@/lib/db"

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

    return result.count
  } catch (error) {
    console.error("[Cleanup] Failed to delete old transactions:", error)
    return 0
  }
}

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

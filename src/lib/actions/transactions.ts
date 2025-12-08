"use server"

import { db } from "@/lib/db"
import { auth } from "@/auth"
import { revalidatePath } from "next/cache"

/**
 * Get paginated transactions with optional filters.
 * Uses cursor-based pagination for efficient data fetching.
 * 
 * @param filters - Optional filters for date range, category, type
 * @param cursor - Cursor for pagination (transaction ID)
 * @param limit - Number of records per page (default: 50)
 * @returns Object with transactions array, nextCursor, and hasMore flag
 */
export async function getTransactions(filters?: {
  startDate?: Date
  endDate?: Date
  category?: string
  type?: string
  cursor?: string
  limit?: number
}) {
  const session = await auth()
  
  if (!session?.user?.id) {
    return { transactions: [], nextCursor: null, hasMore: false }
  }
  
  const userId = session.user.id
  const limit = filters?.limit || 50

  const where: any = { 
    userId,
    deletedAt: null as any // Exclude soft-deleted transactions
  }

  if (filters?.startDate || filters?.endDate) {
    where.date = {}
    if (filters.startDate) where.date.gte = filters.startDate
    if (filters.endDate) where.date.lte = filters.endDate
  }

  if (filters?.category) {
    where.category = filters.category
  }

  if (filters?.type) {
    where.type = filters.type
  }

  const transactions = await db.transaction.findMany({
    where,
    orderBy: { date: 'desc' },
    take: limit + 1, // Fetch one extra to check if there are more
    ...(filters?.cursor && {
      cursor: { id: filters.cursor },
      skip: 1, // Skip the cursor
    }),
  })

  const hasMore = transactions.length > limit
  const paginatedTransactions = hasMore ? transactions.slice(0, limit) : transactions
  const nextCursor = hasMore ? paginatedTransactions[paginatedTransactions.length - 1].id : null

  return {
    transactions: paginatedTransactions,
    nextCursor,
    hasMore,
  }
}

/**
 * Legacy function for backward compatibility.
 * Returns all transactions without pagination.
 * @deprecated Use getTransactions with pagination instead
 */
export async function getAllTransactions(filters?: {
  startDate?: Date
  endDate?: Date
  category?: string
  type?: string
}) {
  const session = await auth()
  
  if (!session?.user?.id) {
    return []
  }
  
  const userId = session.user.id

  const where: any = { userId }

  if (filters?.startDate || filters?.endDate) {
    where.date = {}
    if (filters.startDate) where.date.gte = filters.startDate
    if (filters.endDate) where.date.lte = filters.endDate
  }

  if (filters?.category) {
    where.category = filters.category
  }

  if (filters?.type) {
    where.type = filters.type
  }

  const transactions = await db.transaction.findMany({
    where,
    orderBy: { date: 'desc' },
  })

  return transactions
}

export async function createTransaction(formData: FormData) {
  const session = await auth()
  
  if (!session?.user?.id) {
    return { error: "Unauthorized" }
  }

  const userId = session.user.id

  const amount = parseFloat(formData.get("amount") as string)
  const currency = formData.get("currency") as string || "USD"
  const description = formData.get("description") as string
  const category = formData.get("category") as string
  const type = formData.get("type") as string
  const date = new Date(formData.get("date") as string)
  const walletId = formData.get("walletId") as string

  if (!amount || !description || !category || !type || !date) {
    return { error: "Missing required fields" }
  }

  try {
    const data: any = {
      userId,
      amount,
      currency,
      description,
      category,
      type,
      date,
    }
    
    if (walletId) {
      data.walletId = walletId
    }

    // Create transaction and update wallet balance atomically
    await db.$transaction(async (tx: any) => {
      // Create the transaction
      await tx.transaction.create({ data })
      
      // Update wallet balance if wallet is specified
      if (walletId) {
        const balanceChange = type === "income" ? amount : -amount
        await tx.wallet.update({
          where: { id: walletId },
          data: { balance: { increment: balanceChange } },
        })
      }
    })
    
    revalidatePath("/transactions")
    revalidatePath("/dashboard")
    revalidatePath("/")
    return { success: true }
  } catch (error) {
    return { error: "Failed to create transaction" }
  }
}

/**
 * Soft delete a transaction (marks as deleted, can be undone)
 */
export async function deleteTransaction(id: string) {
  const session = await auth()
  
  if (!session?.user?.id) {
    return { error: "Unauthorized" }
  }
  
  const userId = session.user.id

  try {
    // Get transaction first to revert wallet balance
    const transaction: any = await db.transaction.findUnique({
      where: { id, userId },
    })
    
    if (!transaction) {
      return { error: "Transaction not found" }
    }

    if (transaction.deletedAt) {
      return { error: "Transaction already deleted" }
    }
    
    // Soft delete: mark as deleted and revert wallet balance
    await db.$transaction(async (tx: any) => {
      // Mark as deleted
      await tx.transaction.update({
        where: { id, userId },
        data: { deletedAt: new Date() },
      })
      
      // Revert wallet balance if wallet is specified and not a transfer
      if (transaction.walletId && transaction.type !== "transfer") {
        const balanceChange = transaction.type === "income" ? -transaction.amount : transaction.amount
        await tx.wallet.update({
          where: { id: transaction.walletId },
          data: { balance: { increment: balanceChange } },
        })
      }
    })
    
    revalidatePath("/transactions")
    revalidatePath("/dashboard")
    revalidatePath("/")
    return { success: true }
  } catch (error) {
    return { error: "Failed to delete transaction" }
  }
}

/**
 * Restore a soft-deleted transaction (undo delete)
 */
export async function restoreTransaction(id: string) {
  const session = await auth()
  
  if (!session?.user?.id) {
    return { error: "Unauthorized" }
  }
  
  const userId = session.user.id

  try {
    // Get transaction to restore wallet balance
    const transaction: any = await db.transaction.findUnique({
      where: { id, userId },
    })
    
    if (!transaction) {
      return { error: "Transaction not found" }
    }

    if (!transaction.deletedAt) {
      return { error: "Transaction is not deleted" }
    }

    // Restore: clear deletedAt and restore wallet balance
    await db.$transaction(async (tx: any) => {
      await tx.transaction.update({
        where: { id, userId },
        data: { deletedAt: null },
      })
      
      // Restore wallet balance if transaction had a wallet
      if (transaction.walletId && transaction.type !== "transfer") {
        const balanceChange = transaction.type === "income" ? transaction.amount : -transaction.amount
        await tx.wallet.update({
          where: { id: transaction.walletId },
          data: { balance: { increment: balanceChange } },
        })
      }
    })
    
    revalidatePath("/transactions")
    revalidatePath("/dashboard")
    revalidatePath("/")
    return { success: true }
  } catch (error) {
    return { error: "Failed to restore transaction" }
  }
}

/**
 * Permanently delete a transaction (cannot be undone)
 */
export async function permanentlyDeleteTransaction(id: string) {
  const session = await auth()
  
  if (!session?.user?.id) {
    return { error: "Unauthorized" }
  }
  
  const userId = session.user.id

  try {
    await db.transaction.delete({
      where: { id, userId },
    })
    
    revalidatePath("/transactions")
    revalidatePath("/dashboard")
    revalidatePath("/")
    return { success: true }
  } catch (error) {
    return { error: "Failed to permanently delete transaction" }
  }
}

/**
 * Soft delete multiple transactions
 */
export async function bulkDeleteTransactions(ids: string[]) {
  const session = await auth()
  
  if (!session?.user?.id) {
    return { error: "Unauthorized" }
  }
  
  const userId = session.user.id

  if (ids.length === 0) {
    return { error: "No transactions selected" }
  }

  try {
    // Get transactions to revert wallet balances
    const transactions = await db.transaction.findMany({
      where: {
        id: { in: ids },
        userId,
        deletedAt: null,
      } as any,
    })

    // Soft delete and update wallet balances
    await db.$transaction(async (tx) => {
      // Mark all as deleted
      await tx.transaction.updateMany({
        where: {
          id: { in: ids },
          userId,
        },
        data: { deletedAt: new Date() } as any,
      })

      // Update wallet balances for each transaction
      for (const transaction of transactions) {
        if (transaction.walletId && transaction.type !== "transfer") {
          const balanceChange = transaction.type === "income" ? -transaction.amount : transaction.amount
          await tx.wallet.update({
            where: { id: transaction.walletId },
            data: { balance: { increment: balanceChange } },
          })
        }
      }
    })
    
    revalidatePath("/transactions")
    revalidatePath("/dashboard")
    revalidatePath("/")
    
    return { success: true, count: transactions.length }
  } catch (error) {
    return { error: "Failed to delete transactions" }
  }
}

/**
 * Restore multiple soft-deleted transactions
 */
export async function bulkRestoreTransactions(ids: string[]) {
  const session = await auth()
  
  if (!session?.user?.id) {
    return { error: "Unauthorized" }
  }
  
  const userId = session.user.id

  if (ids.length === 0) {
    return { error: "No transactions selected" }
  }

  try {
    // Get deleted transactions to restore wallet balances
    const transactions = await db.transaction.findMany({
      where: {
        id: { in: ids },
        userId,
        deletedAt: { not: null },
      } as any,
    })

    // Restore and update wallet balances
    await db.$transaction(async (tx) => {
      // Clear deletedAt
      await tx.transaction.updateMany({
        where: {
          id: { in: ids },
          userId,
        },
        data: { deletedAt: null } as any,
      })

      // Restore wallet balances for each transaction
      for (const transaction of transactions) {
        if (transaction.walletId && transaction.type !== "transfer") {
          const balanceChange = transaction.type === "income" ? transaction.amount : -transaction.amount
          await tx.wallet.update({
            where: { id: transaction.walletId },
            data: { balance: { increment: balanceChange } },
          })
        }
      }
    })
    
    revalidatePath("/transactions")
    revalidatePath("/dashboard")
    revalidatePath("/")
    
    return { success: true, count: transactions.length }
  } catch (error) {
    return { error: "Failed to restore transactions" }
  }
}

export async function updateTransaction(id: string, formData: FormData) {
  const session = await auth()
  
  if (!session?.user?.id) {
    return { error: "Unauthorized" }
  }

  const userId = session.user.id

  const amount = parseFloat(formData.get("amount") as string)
  const currency = formData.get("currency") as string // Optional update
  const description = formData.get("description") as string
  const category = formData.get("category") as string
  const type = formData.get("type") as string
  const date = new Date(formData.get("date") as string)
  const walletId = formData.get("walletId") as string

  if (!amount || !description || !category || !type || !date) {
    return { error: "Missing required fields" }
  }

  try {
    // Verify ownership before update
    const existingTransaction: any = await db.transaction.findFirst({
        where: { id, userId }
    })
    
    if (!existingTransaction) {
        return { error: "Transaction not found or unauthorized" }
    }

    const data: any = {
      amount,
      description,
      category,
      type,
      date,
    }
    
    if (walletId) {
      data.walletId = walletId
    }

    if (currency) {
      data.currency = currency
    }

    // Update transaction and adjust wallet balances atomically
    await db.$transaction(async (tx: any) => {
      // Revert old wallet balance if it exists and not a transfer
      if (existingTransaction.walletId && existingTransaction.type !== "transfer") {
        const oldBalanceChange = existingTransaction.type === "income" 
          ? -existingTransaction.amount 
          : existingTransaction.amount
        await tx.wallet.update({
          where: { id: existingTransaction.walletId },
          data: { balance: { increment: oldBalanceChange } },
        })
      }
      
      // Update the transaction
      await tx.transaction.update({
        where: { id },
        data,
      })
      
      // Apply new wallet balance if specified and not a transfer
      if (walletId && type !== "transfer") {
        const newBalanceChange = type === "income" ? amount : -amount
        await tx.wallet.update({
          where: { id: walletId },
          data: { balance: { increment: newBalanceChange } },
        })
      }
    })
    
    revalidatePath("/transactions")
    revalidatePath("/dashboard")
    revalidatePath("/")
    return { success: true }
  } catch (error) {
    return { error: `Failed to update transaction` }
  }
}

export async function bulkCreateTransactions(
  transactions: Array<{
    date: Date
    description: string
    amount: number
    type: "income" | "expense"
    category?: string
    currency: string
  }>
) {
  const session = await auth()
  
  if (!session?.user?.id) {
    return { error: "Unauthorized" }
  }
  
  const userId = session.user.id

  try {
    // Create transactions in bulk
    const result = await db.transaction.createMany({
      data: transactions.map((t) => ({
        ...t,
        userId,
        category: t.category || "Uncategorized",
      })),
    })

    revalidatePath("/transactions")
    revalidatePath("/dashboard")
    revalidatePath("/")
    
    return { success: true, count: result.count }
  } catch (error) {
    return { error: "Failed to import transactions" }
  }
}

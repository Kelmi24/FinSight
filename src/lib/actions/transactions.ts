"use server"

import { db } from "@/lib/db"
import { auth } from "@/auth"
import { revalidatePath } from "next/cache"

export async function getTransactions(filters?: {
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
    
    // Delete transaction and update wallet balance atomically
    await db.$transaction(async (tx: any) => {
      // Delete the transaction
      await tx.transaction.delete({
        where: { id, userId },
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
    const result = await db.transaction.deleteMany({
      where: {
        id: { in: ids },
        userId: userId, // Ensure user owns all transactions
      },
    })
    
    revalidatePath("/transactions")
    revalidatePath("/dashboard")
    revalidatePath("/")
    
    return { success: true, count: result.count }
  } catch (error) {
    return { error: "Failed to delete transactions" }
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

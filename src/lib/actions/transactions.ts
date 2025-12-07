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

    await db.transaction.create({ data })
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
    await db.transaction.delete({
      where: {
        id,
        userId: userId, // Ensure user owns transaction
      },
    })
    revalidatePath("/transactions")
    revalidatePath("/dashboard")
    revalidatePath("/")
    return { success: true }
  } catch (error) {
    return { error: "Failed to delete transaction" }
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

  if (!amount || !description || !category || !type || !date) {
    return { error: "Missing required fields" }
  }

  try {
    // Verify ownership before update
    const existingTransaction = await db.transaction.findFirst({
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

    if (currency) {
      data.currency = currency
    }

    await db.transaction.update({
      where: { id },
      data,
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

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
  // Force mock user ID for preview mode
  const userId = "mock-user-id"

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
  // Force mock user ID for preview mode to avoid stale session issues
  const userId = "mock-user-id"

  const amount = parseFloat(formData.get("amount") as string)
  const description = formData.get("description") as string
  const category = formData.get("category") as string
  const type = formData.get("type") as string
  const date = new Date(formData.get("date") as string)

  if (!amount || !description || !category || !type || !date) {
    return { error: "Missing required fields" }
  }

  try {
    await db.transaction.create({
      data: {
        userId,
        amount,
        description,
        category,
        type,
        date,
      },
    })
    revalidatePath("/transactions")
    revalidatePath("/dashboard")
    revalidatePath("/analytics")
    revalidatePath("/")
    return { success: true }
  } catch (error) {
    return { error: "Failed to create transaction" }
  }
}

export async function deleteTransaction(id: string) {
  const session = await auth()
  // Force mock user ID for preview mode
  const userId = "mock-user-id"

  try {
    await db.transaction.delete({
      where: {
        id,
        userId: userId, // Ensure user owns transaction
      },
    })
    revalidatePath("/transactions")
    revalidatePath("/dashboard")
    revalidatePath("/analytics")
    revalidatePath("/")
    return { success: true }
  } catch (error) {
    return { error: "Failed to delete transaction" }
  }
}

export async function updateTransaction(id: string, formData: FormData) {
  const session = await auth()
  const userId = "mock-user-id"

  const amount = parseFloat(formData.get("amount") as string)
  const description = formData.get("description") as string
  const category = formData.get("category") as string
  const type = formData.get("type") as string
  const date = new Date(formData.get("date") as string)

  if (!amount || !description || !category || !type || !date) {
    return { error: "Missing required fields" }
  }

  try {
    await db.transaction.update({
      where: { id },
      data: {
        amount,
        description,
        category,
        type,
        date,
      },
    })
    revalidatePath("/transactions")
    revalidatePath("/dashboard")
    revalidatePath("/analytics")
    revalidatePath("/")
    return { success: true }
  } catch (error) {
    return { error: `Failed to update transaction` }
  }
}

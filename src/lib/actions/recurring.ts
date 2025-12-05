"use server"

import { db } from "@/lib/db"
import { auth } from "@/auth"
import { revalidatePath } from "next/cache"

export async function getRecurringTransactions() {
  const session = await auth()
  
  if (!session?.user?.id) {
    return []
  }

  const userId = session.user.id

  const recurring = await db.recurringTransaction.findMany({
    where: { userId },
    orderBy: { createdAt: "desc" },
  })

  return recurring
}

export async function createRecurringTransaction(formData: FormData) {
  const session = await auth()
  
  if (!session?.user?.id) {
    return { error: "Unauthorized" }
  }

  const userId = session.user.id

  const description = formData.get("description") as string
  const amount = parseFloat(formData.get("amount") as string)
  const category = formData.get("category") as string
  const type = formData.get("type") as string
  const frequency = formData.get("frequency") as string
  const startDate = new Date(formData.get("startDate") as string)
  const endDate = formData.get("endDate") as string

  if (!description || isNaN(amount) || !category || !type || !frequency) {
    return { error: "Invalid input" }
  }

  await db.recurringTransaction.create({
    data: {
      userId,
      description,
      amount,
      category,
      type,
      frequency,
      startDate,
      endDate: endDate ? new Date(endDate) : null,
    },
  })

  revalidatePath("/transactions")
  revalidatePath("/dashboard")
  return { success: true }
}

export async function updateRecurringTransaction(id: string, formData: FormData) {
  const session = await auth()
  
  if (!session?.user?.id) {
    return { error: "Unauthorized" }
  }

  const userId = session.user.id

  const description = formData.get("description") as string
  const amount = parseFloat(formData.get("amount") as string)
  const category = formData.get("category") as string
  const type = formData.get("type") as string
  const frequency = formData.get("frequency") as string
  const startDate = new Date(formData.get("startDate") as string)
  const endDate = formData.get("endDate") as string

  if (!description || isNaN(amount) || !category || !type || !frequency) {
    return { error: "Invalid input" }
  }

  // Verify ownership
  const existing = await db.recurringTransaction.findFirst({ where: { id, userId } })
  if (!existing) {
      return { error: "Transaction not found or unauthorized" }
  }

  await db.recurringTransaction.update({
    where: {
      id,
    },
    data: {
      description,
      amount,
      category,
      type,
      frequency,
      startDate,
      endDate: endDate ? new Date(endDate) : null,
    },
  })

  revalidatePath("/transactions")
  revalidatePath("/dashboard")
  return { success: true }
}

export async function deleteRecurringTransaction(id: string) {
  const session = await auth()
  
  if (!session?.user?.id) {
    return { error: "Unauthorized" }
  }

  const userId = session.user.id

  try {
    // Verify ownership
    const existing = await db.recurringTransaction.findFirst({ where: { id, userId } })
    if (!existing) {
        return { error: "Transaction not found or unauthorized" }
    }

    await db.recurringTransaction.delete({
      where: {
        id,
      },
    })

    revalidatePath("/transactions")
    revalidatePath("/dashboard")
    return { success: true }
  } catch (error) {
    console.error("Error deleting recurring transaction:", error)
    return { error: "Failed to delete recurring transaction" }
  }
}

// Generate recurring transactions (run periodically)
export async function generateRecurringTransactions() {
  const recurring = await db.recurringTransaction.findMany({
    where: {
      endDate: { gt: new Date() },
    },
  })

  for (const rec of recurring) {
    const lastGen = rec.lastGenerated || rec.startDate
    const now = new Date()
    
    let nextDate = new Date(lastGen)
    
    // Calculate next occurrence
    switch (rec.frequency) {
      case "weekly":
        nextDate.setDate(nextDate.getDate() + 7)
        break
      case "monthly":
        nextDate.setMonth(nextDate.getMonth() + 1)
        break
      case "yearly":
        nextDate.setFullYear(nextDate.getFullYear() + 1)
        break
    }

    // Generate transactions until current date
    while (nextDate <= now && (!rec.endDate || nextDate <= rec.endDate)) {
      await db.transaction.create({
        data: {
          userId: rec.userId,
          amount: rec.amount,
          description: rec.description,
          category: rec.category,
          type: rec.type,
          date: nextDate,
        },
      })

      // Move to next occurrence
      const nextNextDate = new Date(nextDate)
      switch (rec.frequency) {
        case "weekly":
          nextNextDate.setDate(nextNextDate.getDate() + 7)
          break
        case "monthly":
          nextNextDate.setMonth(nextNextDate.getMonth() + 1)
          break
        case "yearly":
          nextNextDate.setFullYear(nextNextDate.getFullYear() + 1)
          break
      }
      nextDate = nextNextDate
    }

    // Update lastGenerated
    await db.recurringTransaction.update({
      where: { id: rec.id },
      data: { lastGenerated: now },
    })
  }

  revalidatePath("/transactions")
  revalidatePath("/dashboard")
  return { success: true }
}

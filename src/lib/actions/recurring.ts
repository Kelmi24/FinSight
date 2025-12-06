"use server"

import { db } from "@/lib/db"
import { auth } from "@/auth"
import { revalidatePath } from "next/cache"

function computeNextDueDate(current: Date, frequency: string): Date {
  const next = new Date(current)
  switch (frequency) {
    case "daily":
      next.setDate(next.getDate() + 1)
      break
    case "weekly":
      next.setDate(next.getDate() + 7)
      break
    case "biweekly":
      next.setDate(next.getDate() + 14)
      break
    case "monthly": {
      const day = next.getDate()
      next.setMonth(next.getMonth() + 1)
      // Ensure we don't overflow shorter months
      if (next.getDate() < day) {
        next.setDate(0)
      }
      break
    }
    case "yearly":
      next.setFullYear(next.getFullYear() + 1)
      break
    default:
      next.setMonth(next.getMonth() + 1)
  }
  return next
}

function statusForDate(nextDueDate: Date | null) {
  if (!nextDueDate) return "pending"
  const today = new Date()
  today.setHours(0, 0, 0, 0)
  const due = new Date(nextDueDate)
  due.setHours(0, 0, 0, 0)
  return due < today ? "overdue" : "pending"
}

export async function getRecurringTransactions() {
  const session = await auth()
  
  if (!session?.user?.id) {
    return []
  }

  const userId = session.user.id

  const recurring = await db.recurringTransaction.findMany({
    where: { userId },
    // nextDueDate is a new field; cast until Prisma client is regenerated
    orderBy: { nextDueDate: "asc" } as any,
  })

  return recurring.map((rec: any) => ({
    ...rec,
    status: statusForDate(rec.nextDueDate),
    isOverdue: statusForDate(rec.nextDueDate) === "overdue",
  }))
}

export async function createRecurringTransaction(formData: FormData) {
  const session = await auth()
  
  if (!session?.user?.id) {
    return { error: "Unauthorized" }
  }

  const userId = session.user.id

  const name = (formData.get("name") as string) || (formData.get("description") as string)
  const description = (formData.get("description") as string) || name
  const amount = parseFloat(formData.get("amount") as string)
  const currency = (formData.get("currency") as string) || "USD"
  const category = formData.get("category") as string
  const type = formData.get("type") as string
  const frequency = formData.get("frequency") as string
  const startDate = new Date(formData.get("startDate") as string)
  const endDate = formData.get("endDate") as string
  const notes = (formData.get("notes") as string) || null

  if (!description || isNaN(amount) || !category || !type || !frequency) {
    return { error: "Invalid input" }
  }

  const data: any = {
    userId,
    name,
    description,
    amount,
    currency,
    category,
    type,
    frequency,
    startDate,
    endDate: endDate ? new Date(endDate) : null,
    nextDueDate: startDate,
    notes,
    status: statusForDate(startDate),
  }

  await db.recurringTransaction.create({ data })

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

  const name = (formData.get("name") as string) || (formData.get("description") as string)
  const description = (formData.get("description") as string) || name
  const amount = parseFloat(formData.get("amount") as string)
  const currency = formData.get("currency") as string
  const category = formData.get("category") as string
  const type = formData.get("type") as string
  const frequency = formData.get("frequency") as string
  const startDate = new Date(formData.get("startDate") as string)
  const endDate = formData.get("endDate") as string
  const notes = (formData.get("notes") as string) || null

  if (!description || isNaN(amount) || !category || !type || !frequency) {
    return { error: "Invalid input" }
  }

  // Verify ownership
  const existing = await db.recurringTransaction.findFirst({ where: { id, userId } })
  if (!existing) {
      return { error: "Transaction not found or unauthorized" }
  }

  const data: any = {
    name,
    description,
    amount,
    category,
    type,
    frequency,
    startDate,
    endDate: endDate ? new Date(endDate) : null,
    notes,
  }

  if (currency) {
    data.currency = currency
  }

  // Update next due if start date changes
  if (existing.startDate.getTime() !== startDate.getTime()) {
    data.nextDueDate = startDate
  }

  await db.recurringTransaction.update({
    where: {
      id,
    },
    // Cast while Prisma client is not regenerated
    data: data as any,
  })

  revalidatePath("/transactions")
  revalidatePath("/dashboard")
  revalidatePath("/analytics")
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
    revalidatePath("/analytics")
    return { success: true }
  } catch (error) {
    console.error("Error deleting recurring transaction:", error)
    return { error: "Failed to delete recurring transaction" }
  }
}

export async function confirmRecurringTransaction(id: string) {
  const session = await auth()
  if (!session?.user?.id) {
    return { error: "Unauthorized" }
  }

  const userId = session.user.id
  const recurring: any = await db.recurringTransaction.findFirst({ where: { id, userId } })
  if (!recurring) {
    return { error: "Transaction not found or unauthorized" }
  }

  const now = new Date()

  // If endDate passed, prevent confirmation
  if (recurring.endDate && now > recurring.endDate) {
    return { error: "This recurring item has reached its end date." }
  }

  const nextDueBase = recurring.nextDueDate || recurring.startDate
  const nextDueDate = computeNextDueDate(nextDueBase, recurring.frequency)

  // Create actual transaction using template values
  await db.transaction.create({
    data: {
      userId,
      amount: recurring.amount,
      currency: recurring.currency,
      description: recurring.description,
      category: recurring.category,
      type: recurring.type,
      date: now,
    },
  })

  await db.recurringTransaction.update({
    where: { id: recurring.id },
    data: {
      lastConfirmedAt: now,
      lastGenerated: now,
      nextDueDate,
      status: statusForDate(nextDueDate),
    } as any,
  })

  revalidatePath("/transactions")
  revalidatePath("/dashboard")
  revalidatePath("/analytics")
  return { success: true }
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
      data: { lastGenerated: now, nextDueDate: computeNextDueDate(nextDate, rec.frequency) } as any,
    })
  }

  revalidatePath("/transactions")
  revalidatePath("/dashboard")
  revalidatePath("/analytics")
  return { success: true }
}

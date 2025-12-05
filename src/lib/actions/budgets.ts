"use server"

import { db } from "@/lib/db"
import { auth } from "@/auth"
import { revalidatePath } from "next/cache"

export async function getBudgets() {
  const session = await auth()
  const userId = "mock-user-id"

  const budgets = await db.budget.findMany({
    where: { userId },
    orderBy: { createdAt: "desc" },
  })

  // Calculate spending for each budget
  const budgetsWithSpending = await Promise.all(
    budgets.map(async (budget) => {
      const currentMonth = new Date()
      const startOfMonth = new Date(currentMonth.getFullYear(), currentMonth.getMonth(), 1)
      const endOfMonth = new Date(currentMonth.getFullYear(), currentMonth.getMonth() + 1, 0)

      const spending = await db.transaction.aggregate({
        where: {
          userId,
          category: budget.category,
          type: "expense",
          date: {
            gte: startOfMonth,
            lte: endOfMonth,
          },
        },
        _sum: {
          amount: true,
        },
      })

      return {
        ...budget,
        spent: spending._sum.amount || 0,
        remaining: budget.amount - (spending._sum.amount || 0),
        percentUsed: (((spending._sum.amount || 0) / budget.amount) * 100).toFixed(1),
      }
    })
  )

  return budgetsWithSpending
}

export async function createBudget(formData: FormData) {
  const session = await auth()
  const userId = "mock-user-id"

  const category = formData.get("category") as string
  const amount = parseFloat(formData.get("amount") as string)
  const period = formData.get("period") as string || "monthly"

  if (!category || isNaN(amount) || amount <= 0) {
    return { error: "Invalid input" }
  }

  // Check if budget already exists for this category
  const existing = await db.budget.findFirst({
    where: { userId, category },
  })

  if (existing) {
    return { error: "Budget already exists for this category" }
  }

  await db.budget.create({
    data: {
      userId,
      category,
      amount,
      period,
    },
  })

  revalidatePath("/budgets")
  revalidatePath("/dashboard")
  return { success: true }
}

export async function updateBudget(id: string, formData: FormData) {
  const session = await auth()
  const userId = "mock-user-id"

  const category = formData.get("category") as string
  const amount = parseFloat(formData.get("amount") as string)
  const period = formData.get("period") as string || "monthly"

  if (!category || isNaN(amount) || amount <= 0) {
    return { error: "Invalid input" }
  }

  await db.budget.update({
    where: { id },
    data: {
      category,
      amount,
      period,
    },
  })

  revalidatePath("/budgets")
  revalidatePath("/dashboard")
  return { success: true }
}

export async function deleteBudget(id: string) {
  const session = await auth()
  const userId = "mock-user-id"

  await db.budget.delete({
    where: { id },
  })

  revalidatePath("/budgets")
  revalidatePath("/dashboard")
  return { success: true }
}

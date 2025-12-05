"use server"

import { db } from "@/lib/db"
import { auth } from "@/auth"

export async function getDashboardSummary() {
  const session = await auth()
  // Force mock user ID for preview mode
  const userId = "mock-user-id"
  
  // if (!session?.user?.id) {
  //   return {
  //     totalIncome: 0,
  //     totalExpenses: 0,
  //     netBalance: 0,
  //     transactionCount: 0,
  //   }
  // }

  const transactions = await db.transaction.findMany({
    where: { userId: userId },
  })

  const totalIncome = transactions
    .filter((t) => t.type === "income")
    .reduce((sum, t) => sum + t.amount, 0)

  const totalExpenses = transactions
    .filter((t) => t.type === "expense")
    .reduce((sum, t) => sum + t.amount, 0)

  return {
    totalIncome,
    totalExpenses,
    netBalance: totalIncome - totalExpenses,
    transactionCount: transactions.length,
  }
}

export async function getCashFlowData() {
  const session = await auth()
  // Force mock user ID for preview mode
  const userId = "mock-user-id"

  const sixMonthsAgo = new Date()
  sixMonthsAgo.setMonth(sixMonthsAgo.getMonth() - 6)

  const transactions = await db.transaction.findMany({
    where: {
      userId: userId,
      date: {
        gte: sixMonthsAgo,
      },
    },
    orderBy: { date: "asc" },
  })

  // Group by month
  const monthlyData = new Map<string, { income: number; expenses: number }>()

  transactions.forEach((t) => {
    const monthKey = new Date(t.date).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
    })

    if (!monthlyData.has(monthKey)) {
      monthlyData.set(monthKey, { income: 0, expenses: 0 })
    }

    const data = monthlyData.get(monthKey)!
    if (t.type === "income") {
      data.income += t.amount
    } else {
      data.expenses += t.amount
    }
  })

  return Array.from(monthlyData.entries()).map(([month, data]) => ({
    month,
    income: data.income,
    expenses: data.expenses,
  }))
}

export async function getCategoryBreakdown() {
  const session = await auth()
  // Force mock user ID for preview mode
  const userId = "mock-user-id"

  const transactions = await db.transaction.findMany({
    where: {
      userId: userId,
      type: "expense",
    },
  })

  // Group by category
  const categoryTotals = new Map<string, number>()

  transactions.forEach((t) => {
    const current = categoryTotals.get(t.category) || 0
    categoryTotals.set(t.category, current + t.amount)
  })

  return Array.from(categoryTotals.entries())
    .map(([category, amount]) => ({
      category,
      amount,
    }))
    .sort((a, b) => b.amount - a.amount)
}

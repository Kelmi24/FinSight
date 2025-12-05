"use server"

import { db } from "@/lib/db"
import { auth } from "@/auth"

export interface AnalyticsFilters {
  startDate?: string
  endDate?: string
  category?: string
  type?: "income" | "expense" | "all"
  minAmount?: number
  maxAmount?: number
}

export async function getFilteredTransactions(filters: AnalyticsFilters) {
  const session = await auth()
  
  if (!session?.user?.id) {
    return []
  }

  const userId = session.user.id

  const where: any = {
    userId: userId,
  }

  if (filters.startDate) {
    where.date = { ...where.date, gte: new Date(filters.startDate) }
  }

  if (filters.endDate) {
    where.date = { ...where.date, lte: new Date(filters.endDate) }
  }

  if (filters.category && filters.category !== "all") {
    where.category = filters.category
  }

  if (filters.type && filters.type !== "all") {
    where.type = filters.type
  }

  if (filters.minAmount !== undefined) {
    where.amount = { ...where.amount, gte: filters.minAmount }
  }

  if (filters.maxAmount !== undefined) {
    where.amount = { ...where.amount, lte: filters.maxAmount }
  }

  const transactions = await db.transaction.findMany({
    where,
    orderBy: { date: "desc" },
  })

  return transactions
}

export async function getSpendingTrends(filters: AnalyticsFilters) {
  const transactions = await getFilteredTransactions(filters)

  // Group by month
  const monthlyData: Record<string, { income: number; expenses: number }> = {}

  transactions.forEach((tx) => {
    const monthKey = new Date(tx.date).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
    })

    if (!monthlyData[monthKey]) {
      monthlyData[monthKey] = { income: 0, expenses: 0 }
    }

    if (tx.type === "income") {
      monthlyData[monthKey].income += tx.amount
    } else {
      monthlyData[monthKey].expenses += tx.amount
    }
  })

  return Object.entries(monthlyData)
    .map(([month, data]) => ({
      month,
      income: data.income,
      expenses: data.expenses,
      net: data.income - data.expenses,
    }))
    .sort((a, b) => new Date(a.month).getTime() - new Date(b.month).getTime())
}

export async function getCategoryTrends(filters: AnalyticsFilters) {
  const transactions = await getFilteredTransactions({
    ...filters,
    type: "expense",
  })

  const categoryData: Record<string, number> = {}

  transactions.forEach((tx) => {
    categoryData[tx.category] = (categoryData[tx.category] || 0) + tx.amount
  })

  return Object.entries(categoryData)
    .map(([category, amount]) => ({ category, amount }))
    .sort((a, b) => b.amount - a.amount)
}

export async function getTopSpendingCategories(limit = 5) {
  const session = await auth()
  
  if (!session?.user?.id) {
    return []
  }

  const userId = session.user.id

  const transactions = await db.transaction.findMany({
    where: {
      userId: userId,
      type: "expense",
    },
  })

  const categoryTotals: Record<string, number> = {}

  transactions.forEach((tx) => {
    categoryTotals[tx.category] = (categoryTotals[tx.category] || 0) + tx.amount
  })

  return Object.entries(categoryTotals)
    .map(([category, total]) => ({ category, total }))
    .sort((a, b) => b.total - a.total)
    .slice(0, limit)
}

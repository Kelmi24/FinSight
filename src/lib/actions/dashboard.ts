"use server"

import { db } from "@/lib/db"
import { auth } from "@/auth"

/**
 * Optimized dashboard data fetcher that combines all queries into a single database call.
 * Fetches transactions once and computes all metrics in memory.
 * 
 * @returns Dashboard data including summary, cash flow, and category breakdown
 */
export async function getDashboardData() {
  const session = await auth()
  
  if (!session?.user?.id) {
    return {
      summary: {
        totalIncome: 0,
        totalExpenses: 0,
        netBalance: 0,
        transactionCount: 0,
      },
      cashFlow: [],
      categoryBreakdown: [],
      recentTransactions: [],
    }
  }

  const userId = session.user.id

  // Single query to fetch all needed transactions
  const sixMonthsAgo = new Date()
  sixMonthsAgo.setMonth(sixMonthsAgo.getMonth() - 6)

  const [allTransactions, recentTransactions] = await Promise.all([
    db.transaction.findMany({
      where: { userId },
      orderBy: { date: 'desc' },
    }),
    db.transaction.findMany({
      where: { userId },
      orderBy: { date: 'desc' },
      take: 10,
    }),
  ])

  // Compute summary metrics
  let totalIncome = 0
  let totalExpenses = 0
  
  allTransactions.forEach((t) => {
    if (t.type === "income") {
      totalIncome += t.amount
    } else if (t.type === "expense") {
      totalExpenses += t.amount
    }
  })

  const summary = {
    totalIncome,
    totalExpenses,
    netBalance: totalIncome - totalExpenses,
    transactionCount: allTransactions.length,
  }

  // Compute cash flow data (last 6 months)
  const monthlyData = new Map<string, { income: number; expenses: number }>()
  
  allTransactions
    .filter((t) => t.date >= sixMonthsAgo)
    .forEach((t) => {
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
      } else if (t.type === "expense") {
        data.expenses += t.amount
      }
    })

  const cashFlow = Array.from(monthlyData.entries()).map(([month, data]) => ({
    month,
    income: data.income,
    expenses: data.expenses,
  }))

  // Compute category breakdown (expenses only)
  const categoryTotals = new Map<string, number>()
  
  allTransactions
    .filter((t) => t.type === "expense")
    .forEach((t) => {
      const current = categoryTotals.get(t.category) || 0
      categoryTotals.set(t.category, current + t.amount)
    })

  const categoryBreakdown = Array.from(categoryTotals.entries())
    .map(([category, amount]) => ({ category, amount }))
    .sort((a, b) => b.amount - a.amount)

  return {
    summary,
    cashFlow,
    categoryBreakdown,
    recentTransactions,
  }
}

/**
 * Legacy functions for backward compatibility.
 * @deprecated Use getDashboardData instead for better performance
 */
export async function getDashboardSummary() {
  const session = await auth()
  
  if (!session?.user?.id) {
    return {
      totalIncome: 0,
      totalExpenses: 0,
      netBalance: 0,
      transactionCount: 0,
    }
  }

  const userId = session.user.id

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
  
  if (!session?.user?.id) {
    return []
  }

  const userId = session.user.id

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
      period: 'total', // Added to match expectation or just standard key
    }))
    .map(({category, amount}) => ({category, amount})) // Cleanup extra key if not needed, but sticking to logic
    .sort((a, b) => b.amount - a.amount)
}

export async function getCategories() {
  const session = await auth()
  
  if (!session?.user?.id) {
    return []
  }

  const userId = session.user.id

  const transactions = await db.transaction.findMany({
    where: { userId },
    select: { category: true },
    distinct: ['category'],
  })

  return transactions.map((t) => t.category).sort()
}

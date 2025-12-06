"use server";

import { db } from "@/lib/db";
import { auth } from "@/auth";

/**
 * Dashboard filter interface for server actions
 */
export interface ServerDashboardFilters {
  startDate: string | null;
  endDate: string | null;
  categories: string[];
  type: "all" | "income" | "expense";
  minAmount: number | null;
  maxAmount: number | null;
}

/**
 * Get filtered transactions based on dashboard filters
 */
async function getFilteredTransactionsInternal(userId: string, filters: ServerDashboardFilters) {
  const where: any = {
    userId,
  };

  // Date range filter
  if (filters.startDate || filters.endDate) {
    where.date = {};
    if (filters.startDate) {
      where.date.gte = new Date(filters.startDate);
    }
    if (filters.endDate) {
      where.date.lte = new Date(filters.endDate);
    }
  }

  // Category filter
  if (filters.categories && filters.categories.length > 0) {
    where.category = {
      in: filters.categories,
    };
  }

  // Type filter (income/expense)
  if (filters.type && filters.type !== "all") {
    where.type = filters.type;
  }

  // Amount range filter
  if (filters.minAmount !== null || filters.maxAmount !== null) {
    where.amount = {};
    if (filters.minAmount !== null) {
      where.amount.gte = filters.minAmount;
    }
    if (filters.maxAmount !== null) {
      where.amount.lte = filters.maxAmount;
    }
  }

  return await db.transaction.findMany({
    where,
    orderBy: { date: "desc" },
  });
}

/**
 * Get summary metrics (income, expenses, balance, transaction count)
 */
export async function getSummaryMetrics(filters: ServerDashboardFilters) {
  const session = await auth();
  if (!session?.user?.id) {
    return {
      totalIncome: 0,
      totalExpenses: 0,
      netBalance: 0,
      transactionCount: 0,
    };
  }

  const transactions = await getFilteredTransactionsInternal(session.user.id, filters);

  const totalIncome = transactions
    .filter((t) => t.type === "income")
    .reduce((sum, t) => sum + t.amount, 0);

  const totalExpenses = transactions
    .filter((t) => t.type === "expense")
    .reduce((sum, t) => sum + t.amount, 0);

  return {
    totalIncome,
    totalExpenses,
    netBalance: totalIncome - totalExpenses,
    transactionCount: transactions.length,
  };
}

/**
 * Get cash flow data (income vs expenses by month)
 */
export async function getCashFlowDataFiltered(filters: ServerDashboardFilters) {
  const session = await auth();
  if (!session?.user?.id) {
    return [];
  }

  const transactions = await getFilteredTransactionsInternal(session.user.id, filters);

  // Group by month
  const monthlyData = new Map<string, { income: number; expenses: number }>();

  transactions.forEach((t) => {
    const monthKey = new Date(t.date).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
    });

    if (!monthlyData.has(monthKey)) {
      monthlyData.set(monthKey, { income: 0, expenses: 0 });
    }

    const data = monthlyData.get(monthKey)!;
    if (t.type === "income") {
      data.income += t.amount;
    } else {
      data.expenses += t.amount;
    }
  });

  return Array.from(monthlyData.entries())
    .map(([month, data]) => ({
      month,
      income: data.income,
      expenses: data.expenses,
    }))
    .sort((a, b) => new Date(a.month).getTime() - new Date(b.month).getTime());
}

/**
 * Get category breakdown (expenses by category)
 */
export async function getCategoryBreakdownFiltered(filters: ServerDashboardFilters) {
  const session = await auth();
  if (!session?.user?.id) {
    return [];
  }

  const transactions = await getFilteredTransactionsInternal(session.user.id, {
    ...filters,
    type: "expense",
  });

  // Group by category
  const categoryTotals = new Map<string, number>();

  transactions.forEach((t) => {
    const current = categoryTotals.get(t.category) || 0;
    categoryTotals.set(t.category, current + t.amount);
  });

  return Array.from(categoryTotals.entries())
    .map(([category, amount]) => ({
      category,
      amount,
    }))
    .sort((a, b) => b.amount - a.amount);
}

/**
 * Get spending trends (income/expenses/net by month)
 */
export async function getSpendingTrendsFiltered(filters: ServerDashboardFilters) {
  const session = await auth();
  if (!session?.user?.id) {
    return [];
  }

  const transactions = await getFilteredTransactionsInternal(session.user.id, filters);

  // Group by month
  const monthlyData: Record<string, { income: number; expenses: number }> = {};

  transactions.forEach((tx) => {
    const monthKey = new Date(tx.date).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
    });

    if (!monthlyData[monthKey]) {
      monthlyData[monthKey] = { income: 0, expenses: 0 };
    }

    if (tx.type === "income") {
      monthlyData[monthKey].income += tx.amount;
    } else {
      monthlyData[monthKey].expenses += tx.amount;
    }
  });

  return Object.entries(monthlyData)
    .map(([month, data]) => ({
      month,
      income: data.income,
      expenses: data.expenses,
      net: data.income - data.expenses,
    }))
    .sort((a, b) => new Date(a.month).getTime() - new Date(b.month).getTime());
}

/**
 * Get recent transactions (limited)
 */
export async function getRecentTransactionsFiltered(filters: ServerDashboardFilters, limit = 10) {
  const session = await auth();
  if (!session?.user?.id) {
    return [];
  }

  const transactions = await getFilteredTransactionsInternal(session.user.id, filters);
  return transactions.slice(0, limit);
}

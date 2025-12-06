import { db } from "@/lib/db";
import { DashboardFilters } from "@/providers/filter-provider";

/**
 * Analytics Service - Centralized data fetching for dashboard and analytics
 * Provides consistent filtering and data transformation across the app
 */
export class AnalyticsService {
  /**
   * Get summary metrics (income, expenses, balance, transaction count)
   */
  static async getSummaryMetrics(userId: string, filters: DashboardFilters) {
    const transactions = await this.getFilteredTransactions(userId, filters);

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
   * Get filtered transactions based on dashboard filters
   */
  static async getFilteredTransactions(userId: string, filters: DashboardFilters) {
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
   * Get cash flow data (income vs expenses by month)
   */
  static async getCashFlowData(userId: string, filters: DashboardFilters) {
    const transactions = await this.getFilteredTransactions(userId, filters);

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
  static async getCategoryBreakdown(userId: string, filters: DashboardFilters) {
    const transactions = await this.getFilteredTransactions(userId, {
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
  static async getSpendingTrends(userId: string, filters: DashboardFilters) {
    const transactions = await this.getFilteredTransactions(userId, filters);

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
   * Get month-over-month comparison
   */
  static async getMonthOverMonthComparison(userId: string, filters: DashboardFilters) {
    const spendingTrends = await this.getSpendingTrends(userId, filters);

    if (spendingTrends.length < 2) {
      return {
        current: { month: "", expenses: 0, income: 0, net: 0 },
        previous: { month: "", expenses: 0, income: 0, net: 0 },
        expensesChange: 0,
        incomeChange: 0,
      };
    }

    const current = spendingTrends[spendingTrends.length - 1];
    const previous = spendingTrends[spendingTrends.length - 2];

    const expensesChange = previous.expenses > 0 ? ((current.expenses - previous.expenses) / previous.expenses) * 100 : 0;
    const incomeChange = previous.income > 0 ? ((current.income - previous.income) / previous.income) * 100 : 0;

    return {
      current,
      previous,
      expensesChange,
      incomeChange,
    };
  }

  /**
   * Get top spending categories with limit
   */
  static async getTopSpendingCategories(userId: string, filters: DashboardFilters, limit = 5) {
    const categoryBreakdown = await this.getCategoryBreakdown(userId, filters);
    return categoryBreakdown.slice(0, limit);
  }

  /**
   * Get recent transactions (limited)
   */
  static async getRecentTransactions(userId: string, filters: DashboardFilters, limit = 10) {
    const transactions = await this.getFilteredTransactions(userId, filters);
    return transactions.slice(0, limit);
  }
}

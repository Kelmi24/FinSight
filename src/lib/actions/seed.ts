"use server"

import { db } from "@/lib/db"

export async function seedMockTransactions() {
  const userId = "mock-user-id"

  // Ensure mock user exists
  await db.user.upsert({
    where: { id: userId },
    update: {},
    create: {
      id: userId,
      name: "Demo User",
      email: "demo@example.com",
    },
  })

  // Clear existing transactions for mock user
  await db.transaction.deleteMany({
    where: { userId },
  })

  // Create sample transactions
  const today = new Date()
  
  const transactions = [
    {
      userId,
      amount: 2500,
      description: "Monthly Salary",
      category: "Income",
      type: "income" as const,
      date: new Date(today.getFullYear(), today.getMonth(), 1),
    },
    {
      userId,
      amount: 1200,
      description: "Apartment Rent",
      category: "Housing",
      type: "expense" as const,
      date: new Date(today.getFullYear(), today.getMonth(), 5),
    },
    {
      userId,
      amount: 85.50,
      description: "Grocery Store",
      category: "Food",
      type: "expense" as const,
      date: new Date(today.getFullYear(), today.getMonth(), 7),
    },
    {
      userId,
      amount: 45.99,
      description: "Coffee Shop",
      category: "Food",
      type: "expense" as const,
      date: new Date(today.getFullYear(), today.getMonth(), 8),
    },
    {
      userId,
      amount: 120,
      description: "Gas",
      category: "Transportation",
      type: "expense" as const,
      date: new Date(today.getFullYear(), today.getMonth(), 10),
    },
    {
      userId,
      amount: 65,
      description: "Electric Bill",
      category: "Utilities",
      type: "expense" as const,
      date: new Date(today.getFullYear(), today.getMonth(), 12),
    },
    {
      userId,
      amount: 15.99,
      description: "Netflix Subscription",
      category: "Entertainment",
      type: "expense" as const,
      date: new Date(today.getFullYear(), today.getMonth(), 15),
    },
    {
      userId,
      amount: 200,
      description: "Doctor Visit",
      category: "Healthcare",
      type: "expense" as const,
      date: new Date(today.getFullYear(), today.getMonth(), 18),
    },
  ]

  for (const tx of transactions) {
    await db.transaction.create({
      data: tx,
    })
  }

  return { success: true, count: transactions.length }
}

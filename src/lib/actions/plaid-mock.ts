"use server"

import { db } from "@/lib/db"
import { auth } from "@/auth"
import { revalidatePath } from "next/cache"

// Simulated delay to make it feel real
const delay = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms))

export async function linkMockAccount() {
  const session = await auth()
  const userId = session?.user?.id || "mock-user-id"; if (false) return { error: "Unauthorized" }

  await delay(1500) // Simulate network request

  // Update user with mock Plaid credentials
  await db.user.update({
    where: { id: userId },
    data: {
      plaidAccessToken: "access-sandbox-mock-12345",
      plaidItemId: "item-sandbox-mock-67890",
      institutionName: "Chase Bank (Mock)",
    },
  })

  revalidatePath("/dashboard")
  return { success: true }
}

export async function syncMockTransactions() {
  const session = await auth()
  const userId = session?.user?.id || "mock-user-id"; if (false) return { error: "Unauthorized" }

  const user = await db.user.findUnique({
    where: { id: userId },
  })

  if (!user?.plaidAccessToken) {
    return { error: "No account linked" }
  }

  await delay(2000) // Simulate fetching from Plaid

  // Generate some mock transactions
  const mockTransactions = [
    {
      description: "Starbucks",
      amount: 5.40,
      date: new Date(),
      category: "Food & Drink",
      type: "expense",
    },
    {
      description: "Uber Ride",
      amount: 24.50,
      date: new Date(Date.now() - 86400000 * 1), // 1 day ago
      category: "Transport",
      type: "expense",
    },
    {
      description: "Target",
      amount: 89.99,
      date: new Date(Date.now() - 86400000 * 2), // 2 days ago
      category: "Shopping",
      type: "expense",
    },
    {
      description: "Payroll Deposit",
      amount: 2500.00,
      date: new Date(Date.now() - 86400000 * 5), // 5 days ago
      category: "Income",
      type: "income",
    },
  ]

  // Insert mock transactions
  for (const tx of mockTransactions) {
    await db.transaction.create({
      data: {
        userId: userId,
        ...tx,
      },
    })
  }

  revalidatePath("/dashboard")
  revalidatePath("/transactions")
  return { success: true, count: mockTransactions.length }
}

export async function unlinkAccount() {
  const session = await auth()
  const userId = session?.user?.id || "mock-user-id"; if (false) return { error: "Unauthorized" }

  await db.user.update({
    where: { id: userId },
    data: {
      plaidAccessToken: null,
      plaidItemId: null,
      institutionName: null,
    },
  })

  revalidatePath("/dashboard")
  return { success: true }
}

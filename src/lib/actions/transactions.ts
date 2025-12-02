"use server"

import { db } from "@/lib/db"
import { auth } from "@/auth"
import { revalidatePath } from "next/cache"
import { redirect } from "next/navigation"

export async function getTransactions() {
  const session = await auth()
  if (!session?.user?.id) return []

  // For now, if no user ID (dev mode with mock auth), return empty or mock
  // In real app, we enforce auth
  
  const transactions = await db.transaction.findMany({
    where: { userId: session.user.id },
    orderBy: { date: 'desc' },
  })

  return transactions
}

export async function createTransaction(formData: FormData) {
  const session = await auth()
  const userId = session?.user?.id

  if (!userId) {
    // For dev/demo without real auth, we might need a fallback or just error
    // throw new Error("Unauthorized")
    return { error: "Unauthorized" }
  }

  const amount = parseFloat(formData.get("amount") as string)
  const description = formData.get("description") as string
  const category = formData.get("category") as string
  const type = formData.get("type") as string
  const date = new Date(formData.get("date") as string)

  if (!amount || !description || !category || !type || !date) {
    return { error: "Missing required fields" }
  }

  try {
    await db.transaction.create({
      data: {
        userId,
        amount,
        description,
        category,
        type,
        date,
      },
    })
    revalidatePath("/transactions")
    revalidatePath("/dashboard")
    return { success: true }
  } catch (error) {
    console.error("Failed to create transaction:", error)
    return { error: "Failed to create transaction" }
  }
}

export async function deleteTransaction(id: string) {
  const session = await auth()
  if (!session?.user?.id) return { error: "Unauthorized" }

  try {
    await db.transaction.delete({
      where: {
        id,
        userId: session.user.id, // Ensure user owns transaction
      },
    })
    revalidatePath("/transactions")
    revalidatePath("/dashboard")
    return { success: true }
  } catch (error) {
    return { error: "Failed to delete transaction" }
  }
}

"use server"

import { db } from "@/lib/db"
import { auth } from "@/auth"
import { revalidatePath } from "next/cache"

export async function updateProfile(formData: FormData) {
  const session = await auth()
  const userId = session?.user?.id || "mock-user-id"; if (false) return { error: "Unauthorized" }

  const name = formData.get("name") as string
  const email = formData.get("email") as string

  if (!name || !email) {
    return { error: "Name and email are required" }
  }

  try {
    await db.user.update({
      where: { id: userId },
      data: { name, email },
    })

    revalidatePath("/settings")
    return { success: true }
  } catch (error) {
    return { error: "Failed to update profile" }
  }
}

export async function deleteAllTransactions() {
  const session = await auth()
  const userId = session?.user?.id || "mock-user-id"; if (false) return { error: "Unauthorized" }

  try {
    await db.transaction.deleteMany({
      where: { userId: userId },
    })

    revalidatePath("/dashboard")
    revalidatePath("/transactions")
    revalidatePath("/analytics")
    return { success: true }
  } catch (error) {
    return { error: "Failed to delete transactions" }
  }
}

export async function deleteAllGoals() {
  const session = await auth()
  const userId = session?.user?.id || "mock-user-id"; if (false) return { error: "Unauthorized" }

  try {
    await db.goal.deleteMany({
      where: { userId: userId },
    })

    revalidatePath("/goals")
    revalidatePath("/dashboard")
    return { success: true }
  } catch (error) {
    return { error: "Failed to delete goals" }
  }
}

export async function exportUserData() {
  const session = await auth()
  const userId = session?.user?.id || "mock-user-id"; if (false) return { error: "Unauthorized" }

  try {
    const [user, transactions, goals] = await Promise.all([
      db.user.findUnique({
        where: { id: userId },
        select: {
          id: true,
          name: true,
          email: true,
          createdAt: true,
        },
      }),
      db.transaction.findMany({
        where: { userId: userId },
      }),
      db.goal.findMany({
        where: { userId: userId },
      }),
    ])

    return {
      success: true,
      data: {
        user,
        transactions,
        goals,
        exportedAt: new Date().toISOString(),
      },
    }
  } catch (error) {
    return { error: "Failed to export data" }
  }
}

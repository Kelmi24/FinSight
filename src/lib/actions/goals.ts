"use server"

import { db } from "@/lib/db"
import { auth } from "@/auth"
import { revalidatePath } from "next/cache"

export async function getGoals() {
  const session = await auth()
  const userId = session?.user?.id || "mock-user-id"; if (false) return []

  const goals = await db.goal.findMany({
    where: { userId: userId },
    orderBy: { createdAt: "desc" },
  })

  return goals
}

export async function createGoal(formData: FormData) {
  const session = await auth()
  const userId = session?.user?.id || "mock-user-id"; if (false) return { error: "Unauthorized" }

  const name = formData.get("name") as string
  const targetAmount = parseFloat(formData.get("targetAmount") as string)
  const currentAmount = parseFloat(formData.get("currentAmount") as string) || 0
  const deadline = formData.get("deadline") as string

  console.log("Creating goal with data:", { name, targetAmount, currentAmount, deadline, userId })

  if (!name || isNaN(targetAmount)) {
    console.error("Invalid input:", { name, targetAmount })
    return { error: "Invalid input" }
  }

  try {
    await db.goal.create({
      data: {
        userId: userId,
        name,
        targetAmount,
        currentAmount,
        deadline: deadline ? new Date(deadline) : null,
      },
    })

    revalidatePath("/goals")
    revalidatePath("/dashboard")
    console.log("Goal created successfully")
    return { success: true }
  } catch (error) {
    console.error("Database error creating goal:", error)
    return { error: "Database error: " + (error as Error).message }
  }
}

export async function updateGoal(id: string, formData: FormData) {
  const session = await auth()
  const userId = session?.user?.id || "mock-user-id"; if (false) return { error: "Unauthorized" }

  const name = formData.get("name") as string
  const targetAmount = parseFloat(formData.get("targetAmount") as string)
  const currentAmount = parseFloat(formData.get("currentAmount") as string)
  const deadline = formData.get("deadline") as string

  if (!name || isNaN(targetAmount) || isNaN(currentAmount)) {
    return { error: "Invalid input" }
  }

  await db.goal.update({
    where: {
      id,
      userId: userId,
    },
    data: {
      name,
      targetAmount,
      currentAmount,
      deadline: deadline ? new Date(deadline) : null,
    },
  })

  revalidatePath("/goals")
  revalidatePath("/dashboard")
  return { success: true }
}

export async function deleteGoal(id: string) {
  const session = await auth()
  const userId = session?.user?.id || "mock-user-id"; if (false) return { error: "Unauthorized" }

  await db.goal.delete({
    where: {
      id,
      userId: userId,
    },
  })

  revalidatePath("/goals")
  revalidatePath("/dashboard")
  return { success: true }
}

"use server"

import { db } from "@/lib/db"
import { auth } from "@/auth"
import { revalidatePath } from "next/cache"

export async function getGoals() {
  const session = await auth()
  
  if (!session?.user?.id) {
    return []
  }
  
  const userId = session.user.id

  const goals = await db.goal.findMany({
    where: { userId: userId },
    orderBy: { createdAt: "desc" },
  })

  return goals
}

export async function createGoal(formData: FormData) {
  const session = await auth()
  
  if (!session?.user?.id) {
    return { error: "Unauthorized" }
  }

  const userId = session.user.id

  const name = formData.get("name") as string
  const targetAmount = parseFloat(formData.get("targetAmount") as string)
  const currentAmount = parseFloat(formData.get("currentAmount") as string) || 0
  const currency = (formData.get("currency") as string) || "USD"
  const deadline = formData.get("deadline") as string

  if (!name || isNaN(targetAmount)) {
    return { error: "Invalid input" }
  }

  try {
    await db.goal.create({
      data: {
        userId: userId,
        name,
        targetAmount,
        currentAmount,
        currency,
        deadline: deadline ? new Date(deadline) : null,
      },
    })

    revalidatePath("/goals")
    revalidatePath("/dashboard")
    return { success: true }
  } catch (error) {
    return { error: "Database error: " + (error as Error).message }
  }
}

export async function updateGoal(id: string, formData: FormData) {
  const session = await auth()
  
  if (!session?.user?.id) {
    return { error: "Unauthorized" }
  }
  
  const userId = session.user.id

  const name = formData.get("name") as string
  const targetAmount = parseFloat(formData.get("targetAmount") as string)
  const currentAmount = parseFloat(formData.get("currentAmount") as string)
  const currency = formData.get("currency") as string
  const deadline = formData.get("deadline") as string

  if (!name || isNaN(targetAmount) || isNaN(currentAmount)) {
    return { error: "Invalid input" }
  }

  // Verify ownership
  const existing = await db.goal.findFirst({ where: { id, userId } })
  if (!existing) {
      return { error: "Goal not found or unauthorized" }
  }

  const data: any = {
    name,
    targetAmount,
    currentAmount,
    deadline: deadline ? new Date(deadline) : null,
  }

  if (currency) {
    data.currency = currency
  }

  await db.goal.update({
    where: {
      id,
    },
    data,
  })

  revalidatePath("/goals")
  revalidatePath("/dashboard")
  return { success: true }
}

export async function deleteGoal(id: string) {
  const session = await auth()
  
  if (!session?.user?.id) {
    return { error: "Unauthorized" }
  }
  
  const userId = session.user.id
  
  // Verify ownership
  const existing = await db.goal.findFirst({ where: { id, userId } })
  if (!existing) {
      return { error: "Goal not found or unauthorized" }
  }

  await db.goal.delete({
    where: {
      id,
    },
  })

  revalidatePath("/goals")
  revalidatePath("/dashboard")
  return { success: true }
}

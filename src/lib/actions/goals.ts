"use server"

import { db } from "@/lib/db"
import { auth } from "@/auth"
import { revalidatePath } from "next/cache"

export async function getGoals() {
  const session = await auth()
  if (!session?.user?.id) return []

  const goals = await db.goal.findMany({
    where: { userId: session.user.id },
    orderBy: { createdAt: "desc" },
  })

  return goals
}

export async function createGoal(formData: FormData) {
  const session = await auth()
  if (!session?.user?.id) return { error: "Unauthorized" }

  const name = formData.get("name") as string
  const targetAmount = parseFloat(formData.get("targetAmount") as string)
  const currentAmount = parseFloat(formData.get("currentAmount") as string) || 0
  const deadline = formData.get("deadline") as string

  if (!name || isNaN(targetAmount)) {
    return { error: "Invalid input" }
  }

  await db.goal.create({
    data: {
      userId: session.user.id,
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

export async function updateGoal(id: string, formData: FormData) {
  const session = await auth()
  if (!session?.user?.id) return { error: "Unauthorized" }

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
      userId: session.user.id,
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
  if (!session?.user?.id) return { error: "Unauthorized" }

  await db.goal.delete({
    where: {
      id,
      userId: session.user.id,
    },
  })

  revalidatePath("/goals")
  revalidatePath("/dashboard")
  return { success: true }
}

"use server"

import { db } from "@/lib/db"
import { auth } from "@/auth"
import { revalidatePath } from "next/cache"

const DEFAULT_CATEGORIES = [
  { name: "Food & Dining", type: "expense", color: "#F97316", icon: "utensils" },
  { name: "Transportation", type: "expense", color: "#3B82F6", icon: "car" },
  { name: "Shopping", type: "expense", color: "#EC4899", icon: "shopping-bag" },
  { name: "Entertainment", type: "expense", color: "#8B5CF6", icon: "film" },
  { name: "Utilities", type: "expense", color: "#06B6D4", icon: "zap" },
  { name: "Healthcare", type: "expense", color: "#EF4444", icon: "heart" },
  { name: "Housing", type: "expense", color: "#10B981", icon: "home" },
  { name: "Education", type: "expense", color: "#6366F1", icon: "book" },
  { name: "Salary", type: "income", color: "#22C55E", icon: "briefcase" },
  { name: "Freelance", type: "income", color: "#14B8A6", icon: "laptop" },
  { name: "Investments", type: "income", color: "#F59E0B", icon: "trending-up" },
  { name: "Other Income", type: "income", color: "#84CC16", icon: "plus-circle" },
  { name: "Other Expense", type: "expense", color: "#9CA3AF", icon: "more-horizontal" },
]

export async function getCategories(type?: "income" | "expense") {
  const session = await auth()
  
  if (!session?.user?.id) {
    return { categories: [] }
  }
  
  const userId = session.user.id

  try {
    const whereClause: any = { userId }
    if (type) {
      whereClause.OR = [{ type }, { type: "both" }]
    }

    const categories = await db.category.findMany({
      where: whereClause,
      orderBy: [{ isDefault: "desc" }, { name: "asc" }],
    })

    // If no categories exist, seed defaults
    if (categories.length === 0) {
      await seedDefaultCategories(userId)
      // Refetch after seeding
      const newCategories = await db.category.findMany({
        where: whereClause,
        orderBy: [{ isDefault: "desc" }, { name: "asc" }],
      })
      return { categories: newCategories }
    }

    return { categories }
  } catch (error) {
    console.error("Failed to fetch categories:", error)
    return { error: "Failed to fetch categories", categories: [] }
  }
}

export async function createCategory(formData: FormData) {
  const session = await auth()
  
  if (!session?.user?.id) {
    return { error: "Unauthorized" }
  }
  
  const userId = session.user.id

  const name = formData.get("name") as string
  const type = formData.get("type") as string
  const color = formData.get("color") as string | null

  console.log("Creating category:", { name, type, color, userId })

  if (!name || !type) {
    console.log("Validation failed: name or type missing")
    return { error: "Name and type are required" }
  }

  try {
    const category = await db.category.create({
      data: {
        name: name.trim(),
        type,
        color: color || null,
        isDefault: false,
        userId,
      },
    })

    console.log("Category created successfully:", category)

    // Don't revalidate here - it causes the parent dialog to close
    // The CategorySelect component will refresh its own list

    return { category }
  } catch (error: any) {
    console.error("Full error object:", error)
    console.error("Error message:", error?.message)
    console.error("Error code:", error?.code)
    
    if (error.code === "P2002") {
      return { error: "A category with this name already exists" }
    }
    if (error.code === "P2003") {
      return { error: "User not found. Please sign in again." }
    }
    return { error: `Failed to create category: ${error?.message || 'Unknown error'}` }
  }
}

export async function updateCategory(id: string, formData: FormData) {
  const session = await auth()
  if (!session?.user?.id) {
    return { error: "Unauthorized" }
  }

  const name = formData.get("name") as string
  const type = formData.get("type") as string
  const color = formData.get("color") as string | null

  if (!name || !type) {
    return { error: "Name and type are required" }
  }

  try {
    // Verify ownership
    const existing = await db.category.findFirst({
      where: { id, userId: session.user.id },
    })

    if (!existing) {
      return { error: "Category not found" }
    }

    const category = await db.category.update({
      where: { id },
      data: {
        name: name.trim(),
        type,
        color: color || null,
      },
    })

    revalidatePath("/settings")
    revalidatePath("/transactions")
    revalidatePath("/budgets")
    revalidatePath("/recurring")

    return { category }
  } catch (error: any) {
    if (error.code === "P2002") {
      return { error: "A category with this name already exists" }
    }
    console.error("Failed to update category:", error)
    return { error: "Failed to update category" }
  }
}

export async function deleteCategory(id: string) {
  const session = await auth()
  if (!session?.user?.id) {
    return { error: "Unauthorized" }
  }

  try {
    // Verify ownership and check if it's not a default
    const existing = await db.category.findFirst({
      where: { id, userId: session.user.id },
    })

    if (!existing) {
      return { error: "Category not found" }
    }

    if (existing.isDefault) {
      return { error: "Cannot delete default categories" }
    }

    await db.category.delete({
      where: { id },
    })

    revalidatePath("/settings")
    revalidatePath("/transactions")
    revalidatePath("/budgets")
    revalidatePath("/recurring")

    return { success: true }
  } catch (error) {
    console.error("Failed to delete category:", error)
    return { error: "Failed to delete category" }
  }
}

export async function seedDefaultCategories(userId: string) {
  try {
    // Check if user already has categories
    const existingCount = await db.category.count({
      where: { userId },
    })

    if (existingCount > 0) {
      return { message: "Categories already exist" }
    }

    // Create default categories for the user
    await db.category.createMany({
      data: DEFAULT_CATEGORIES.map((cat) => ({
        ...cat,
        userId,
        isDefault: true,
      })),
    })

    return { success: true }
  } catch (error) {
    console.error("Failed to seed default categories:", error)
    return { error: "Failed to seed default categories" }
  }
}

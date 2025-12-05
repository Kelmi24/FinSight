"use server"

import { auth, signOut } from "@/auth"
import { db } from "@/lib/db"
import { revalidatePath } from "next/cache"
import { redirect } from "next/navigation"

export async function updateProfile(formData: FormData) {
  const session = await auth()
  
  if (!session?.user?.id) {
    return { error: "Not authenticated" }
  }

  const name = formData.get("name") as string
  
  if (!name || name.trim().length === 0) {
    return { error: "Name is required" }
  }

  try {
    await db.user.update({
      where: { id: session.user.id },
      data: { name },
    })
    
    revalidatePath("/settings")
    return { success: "Profile updated successfully" }
  } catch (error) {
    console.error("Failed to update profile:", error)
    return { error: "Failed to update profile" }
  }
}

export async function deleteAccount() {
  const session = await auth()

  if (!session?.user?.id) {
    return { error: "Not authenticated" }
  }

  try {
    await db.user.delete({
      where: { id: session.user.id },
    })
  } catch (error) {
    console.error("Failed to delete account:", error)
    return { error: "Failed to delete account" }
  }

  // Sign out and redirect
  await signOut({ redirect: false })
  redirect("/")
}

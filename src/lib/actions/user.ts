"use server"

import { auth, signOut } from "@/auth"
import { db } from "@/lib/db"
import { revalidatePath } from "next/cache"
import { redirect } from "next/navigation"
import { hash, compare } from "bcryptjs"

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

export async function changePassword(formData: FormData) {
  const session = await auth()

  if (!session?.user?.id) {
    return { error: "Not authenticated" }
  }

  const currentPassword = formData.get("currentPassword") as string
  const newPassword = formData.get("newPassword") as string
  const confirmPassword = formData.get("confirmPassword") as string

  if (!currentPassword || !newPassword || !confirmPassword) {
    return { error: "All fields are required" }
  }

  if (newPassword.length < 6) {
    return { error: "New password must be at least 6 characters" }
  }

  if (newPassword !== confirmPassword) {
    return { error: "New passwords do not match" }
  }

  try {
    // Get user with password
    const user = await db.user.findUnique({
      where: { id: session.user.id },
    })

    if (!user || !(user as any).password) {
      return { error: "Password change not available for this account type" }
    }

    // Verify current password
    const isValidPassword = await compare(currentPassword, (user as any).password)
    if (!isValidPassword) {
      return { error: "Current password is incorrect" }
    }

    // Hash new password and update
    const hashedPassword = await hash(newPassword, 10)
    await db.user.update({
      where: { id: session.user.id },
      data: { password: hashedPassword } as any,
    })

    return { success: "Password changed successfully" }
  } catch (error) {
    console.error("Failed to change password:", error)
    return { error: "Failed to change password" }
  }
}

export async function updateProfileImage(imageData: string) {
  const session = await auth()

  if (!session?.user?.id) {
    return { error: "Not authenticated" }
  }

  try {
    // Validate base64 image data
    if (!imageData.startsWith('data:image/')) {
      return { error: "Invalid image format" }
    }

    // Check approximate size (base64 is ~33% larger than original)
    const sizeInBytes = (imageData.length * 3) / 4
    const maxSize = 2 * 1024 * 1024 // 2MB
    if (sizeInBytes > maxSize) {
      return { error: "Image must be less than 2MB" }
    }

    await db.user.update({
      where: { id: session.user.id },
      data: { image: imageData },
    })

    revalidatePath("/settings")
    revalidatePath("/dashboard")
    return { success: "Profile photo updated successfully" }
  } catch (error) {
    console.error("Failed to update profile image:", error)
    return { error: "Failed to update profile photo" }
  }
}

export async function removeProfileImage() {
  const session = await auth()

  if (!session?.user?.id) {
    return { error: "Not authenticated" }
  }

  try {
    await db.user.update({
      where: { id: session.user.id },
      data: { image: null },
    })

    revalidatePath("/settings")
    revalidatePath("/dashboard")
    return { success: "Profile photo removed successfully" }
  } catch (error) {
    console.error("Failed to remove profile image:", error)
    return { error: "Failed to remove profile photo" }
  }
}

export async function logout() {
  await signOut({ redirect: false })
  redirect("/login")
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

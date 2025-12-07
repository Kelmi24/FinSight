"use server"

import { signIn } from "@/auth"
import { AuthError } from "next-auth"
import { db } from "@/lib/db"
import { hash } from "bcryptjs"
import { redirect } from "next/navigation"
import { isRedirectError } from "next/dist/client/components/redirect"

export async function authenticate(formData: FormData) {
  try {
    await signIn("credentials", {
      email: formData.get("email") as string,
      password: formData.get("password") as string,
      redirectTo: "/dashboard",
    })
  } catch (error) {
    // NextAuth throws NEXT_REDIRECT on success - let it bubble up
    if (isRedirectError(error)) {
      throw error
    }
    if (error instanceof AuthError) {
      switch (error.type) {
        case "CredentialsSignin":
          return "Invalid email or password."
        default:
          return "Something went wrong. Please try again."
      }
    }
    return "An unexpected error occurred."
  }
}

export async function registerUser(formData: FormData) {
  const name = formData.get("name") as string
  const email = formData.get("email") as string
  const password = formData.get("password") as string

  if (!email || !password) {
    return { error: "Email and password are required" }
  }

  try {
    // Check if user exists
    const existingUser = await db.user.findUnique({
      where: { email },
    })

    if (existingUser) {
      return { error: "User already exists" }
    }

    // Hash password
    const hashedPassword = await hash(password, 10)

    // Create user
    await db.user.create({
      data: {
        name: name || email.split("@")[0],
        email,
        password: hashedPassword,
      },
    })
  } catch (error) {
    console.error("Registration error:", error)
    return { error: "Failed to create account. Please try again." }
  }

  redirect("/login?success=true")
}

// Generate a secure random token
function generateToken(): string {
  const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789'
  let token = ''
  for (let i = 0; i < 48; i++) {
    token += chars.charAt(Math.floor(Math.random() * chars.length))
  }
  return token
}

export async function requestPasswordReset(formData: FormData) {
  const email = formData.get("email") as string

  if (!email) {
    return { error: "Email is required" }
  }

  // Find user by email
  const user = await db.user.findUnique({
    where: { email },
  })

  // Always return success to prevent email enumeration attacks
  // But only actually send reset if user exists
  if (!user) {
    // Simulate delay to prevent timing attacks
    await new Promise(resolve => setTimeout(resolve, 500))
    return { 
      success: "If an account exists with this email, you will receive a password reset link shortly." 
    }
  }

  // Generate reset token
  const resetToken = generateToken()
  const resetTokenExpiry = new Date(Date.now() + 3600000) // 1 hour from now

  // Save token to database
  await db.user.update({
    where: { id: user.id },
    data: {
      resetToken,
      resetTokenExpiry,
    },
  })

  // In production, you would send an email here
  // For development, the reset link is: ${process.env.NEXTAUTH_URL}/reset-password/${resetToken}
  const resetUrl = `${process.env.NEXTAUTH_URL}/reset-password/${resetToken}`

  return { 
    success: "If an account exists with this email, you will receive a password reset link shortly. Check your console for the reset link (development mode)." 
  }
}

export async function resetPassword(formData: FormData) {
  const token = formData.get("token") as string
  const password = formData.get("password") as string
  const confirmPassword = formData.get("confirmPassword") as string

  if (!token) {
    return { error: "Invalid reset link" }
  }

  if (!password || !confirmPassword) {
    return { error: "Password is required" }
  }

  if (password.length < 6) {
    return { error: "Password must be at least 6 characters" }
  }

  if (password !== confirmPassword) {
    return { error: "Passwords do not match" }
  }

  // Find user by reset token
  const user = await db.user.findUnique({
    where: { resetToken: token },
  })

  if (!user) {
    return { error: "Invalid or expired reset link" }
  }

  // Check if token has expired
  if (!user.resetTokenExpiry || user.resetTokenExpiry < new Date()) {
    return { error: "Reset link has expired. Please request a new one." }
  }

  // Hash new password
  const hashedPassword = await hash(password, 10)

  // Update password and clear reset token
  await db.user.update({
    where: { id: user.id },
    data: {
      password: hashedPassword,
      resetToken: null,
      resetTokenExpiry: null,
    },
  })

  return { success: "Password reset successfully!" }
}

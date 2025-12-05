import { AuthCard } from "@/components/auth/AuthCard"
import { ResetPasswordForm } from "@/components/auth/ResetPasswordForm"
import { db } from "@/lib/db"
import { Metadata } from "next"
import Link from "next/link"
import { AlertCircle } from "lucide-react"
import { Button } from "@/components/ui/button"

export const metadata: Metadata = {
  title: "Reset Password - FinSight",
  description: "Create a new password for your FinSight account",
}

interface ResetPasswordPageProps {
  params: {
    token: string
  }
}

export default async function ResetPasswordPage({ params }: ResetPasswordPageProps) {
  const { token } = params

  // Validate token exists and hasn't expired
  const user = await db.user.findUnique({
    where: { resetToken: token },
    select: { resetTokenExpiry: true },
  })

  const isValidToken = user && user.resetTokenExpiry && user.resetTokenExpiry > new Date()

  if (!isValidToken) {
    return (
      <div className="bg-background">
        <AuthCard
          title="Invalid or expired link"
          description="This password reset link is no longer valid."
        >
          <div className="space-y-6">
            <div className="flex flex-col items-center text-center space-y-4">
              <div className="flex h-16 w-16 items-center justify-center rounded-full bg-red-100 dark:bg-red-900/30">
                <AlertCircle className="h-8 w-8 text-red-600 dark:text-red-400" />
              </div>
              <p className="text-sm text-gray-600 dark:text-gray-400">
                The password reset link may have expired or already been used. 
                Please request a new reset link.
              </p>
            </div>
            
            <Link href="/forgot-password" className="block">
              <Button className="w-full">
                Request New Link
              </Button>
            </Link>
            
            <div className="text-center">
              <Link 
                href="/login" 
                className="text-sm font-medium text-gray-600 hover:text-gray-900 dark:text-gray-400 dark:hover:text-gray-200"
              >
                Back to login
              </Link>
            </div>
          </div>
        </AuthCard>
      </div>
    )
  }

  return (
    <div className="bg-background">
      <AuthCard
        title="Reset your password"
        description="Enter your new password below."
      >
        <ResetPasswordForm token={token} />
      </AuthCard>
    </div>
  )
}

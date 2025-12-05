import { AuthCard } from "@/components/auth/AuthCard"
import { ForgotPasswordForm } from "@/components/auth/ForgotPasswordForm"
import { Metadata } from "next"

export const metadata: Metadata = {
  title: "Forgot Password - FinSight",
  description: "Reset your FinSight password",
}

export default function ForgotPasswordPage() {
  return (
    <div className="bg-background">
      <AuthCard
        title="Forgot password?"
        description="No worries, we'll send you reset instructions."
      >
        <ForgotPasswordForm />
      </AuthCard>
    </div>
  )
}

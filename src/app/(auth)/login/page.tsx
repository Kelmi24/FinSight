import { AuthCard } from "@/components/auth/AuthCard"
import { LoginForm } from "@/components/auth/LoginForm"
import { Metadata } from "next"

export const metadata: Metadata = {
  title: "Login - FinSight",
  description: "Sign in to your FinSight account",
}

export default function LoginPage({
  searchParams,
}: {
  searchParams: { success?: string }
}) {
  return (
    <div className="bg-background">
      <AuthCard
        title="Welcome back"
        description="Enter your credentials to sign in to your project."
      >
        <div className="flex flex-col gap-6">
          {searchParams.success && (
            <div className="text-sm text-green-600 bg-green-50 p-3 rounded-md text-center">
              Account created successfully. Please sign in.
            </div>
          )}
          <LoginForm />
        </div>
      </AuthCard>
    </div>
  )
}

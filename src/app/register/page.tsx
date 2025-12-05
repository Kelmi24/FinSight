import { AuthCard } from "@/components/auth/AuthCard"
import { RegisterForm } from "@/components/auth/RegisterForm"
import { Metadata } from "next"

export const metadata: Metadata = {
  title: "Create an Account - FinSight",
  description: "Create an account to get started with FinSight",
}

export default function RegisterPage() {
  return (
    <div className="bg-background">
      <AuthCard
        title="Create an account"
        description="Enter your information to create an account."
      >
        <RegisterForm />
      </AuthCard>
    </div>
  )
}

import { redirect } from "next/navigation"
import { auth } from "@/auth"
import { db } from "@/lib/db"
import { ProfileSection } from "@/components/settings/ProfileSection"
import { SecuritySection } from "@/components/settings/SecuritySection"
import { AppearanceSection } from "@/components/settings/AppearanceSection"
import { AccountsSection } from "@/components/settings/AccountsSection"
import { DataManagementSection } from "@/components/settings/DataManagementSection"
import { PreferencesSection } from "@/components/settings/PreferencesSection"

export default async function SettingsPage() {
  const session = await auth()
  
  console.log("Settings page - Session:", JSON.stringify(session, null, 2))
  
  if (!session?.user?.id) {
    console.log("Settings page - No user ID in session, redirecting to login")
    redirect("/login?callbackUrl=/settings")
  }

  console.log("Settings page - Looking for user with ID:", session.user.id)
  
  let user = await db.user.findUnique({
    where: { id: session.user.id },
    select: {
      name: true,
      email: true,
      image: true,
      password: true,
      institutionName: true,
      currencyPreference: true,
    },
  })

  // Fallback: if user not found by ID, try finding by email
  if (!user && session.user.email) {
    console.log("Settings page - User not found by ID, trying email:", session.user.email)
    user = await db.user.findUnique({
      where: { email: session.user.email },
      select: {
        name: true,
        email: true,
        image: true,
        password: true,
        institutionName: true,
        currencyPreference: true,
      },
    })
    console.log("Settings page - User found by email:", !!user)
  }

  if (!user) {
    console.log("Settings page - No user found, redirecting to login")
    redirect("/login")
  }

  console.log("Settings page - User found:", user.email)
  
  // Check if user has a password (credentials auth vs OAuth)
  const hasPassword = !!(user as any).password

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Settings</h1>
        <p className="text-gray-500 dark:text-gray-400">
          Manage your account and preferences.
        </p>
      </div>

      <div className="grid gap-6">
        <ProfileSection user={user} />
        
        {hasPassword && <SecuritySection />}
        
        <AppearanceSection />

        <PreferencesSection initialCurrency={(user as any).currencyPreference} />
        
        <AccountsSection institutionName={user.institutionName} />
        
        <DataManagementSection />
      </div>
    </div>
  )
}

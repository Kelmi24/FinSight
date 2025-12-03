import { redirect } from "next/navigation"
import { auth } from "@/auth"
import { db } from "@/lib/db"
import { ProfileSection } from "@/components/settings/ProfileSection"
import { AppearanceSection } from "@/components/settings/AppearanceSection"
import { AccountsSection } from "@/components/settings/AccountsSection"
import { DataManagementSection } from "@/components/settings/DataManagementSection"

export default async function SettingsPage() {
  const session = await auth()

  if (!session?.user?.id) {
    redirect("/api/auth/signin?callbackUrl=/settings")
  }

  const user = await db.user.findUnique({
    where: { id: session.user.id },
    select: {
      name: true,
      email: true,
      institutionName: true,
    },
  })

  if (!user) {
    redirect("/api/auth/signin")
  }

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
        
        <AppearanceSection />
        
        <AccountsSection institutionName={user.institutionName} />
        
        <DataManagementSection />
      </div>
    </div>
  )
}

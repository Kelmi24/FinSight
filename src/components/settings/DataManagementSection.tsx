"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { DeleteAccountModal } from "@/components/auth/DeleteAccountModal"

export function DataManagementSection() {
  return (
    <Card className="border-destructive/20 bg-destructive/5">
      <CardHeader>
        <CardTitle className="text-destructive">Danger Zone</CardTitle>
        <CardDescription>
          Irreversible actions related to your account and data.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="flex items-center justify-between">
            <div className="space-y-1">
                <p className="font-medium">Delete Account</p>
                <p className="text-sm text-muted-foreground">
                    Permanently delete your account and all associated data.
                </p>
            </div>
            <DeleteAccountModal />
        </div>
      </CardContent>
    </Card>
  )
}

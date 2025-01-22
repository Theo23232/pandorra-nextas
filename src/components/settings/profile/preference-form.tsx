"use client"

import { EditLangage } from "@/components/settings/profile/edit-langage"
import { EditTheme } from "@/components/settings/profile/editTheme"
import {
  Card,
  CardContent,
  CardDescription,
  CardTitle,
} from "@/components/tremor/ui/card"

export function PreferencesForm() {
  return (
    <Card>
      <CardTitle>Preferences</CardTitle>
      <CardDescription>Modify the default language and theme</CardDescription>
      <CardContent className="space-y-4 p-0">
        <EditLangage />
        <EditTheme />
      </CardContent>
    </Card>
  )
}

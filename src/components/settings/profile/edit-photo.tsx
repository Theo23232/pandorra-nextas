"use client"

import { useTranslation } from "react-i18next"

import { EditImage } from "@/components/settings/profile/image-form"
import {
  Card,
  CardContent,
  CardDescription,
  CardTitle,
} from "@/components/tremor/ui/card"
import { useUser } from "@/hooks/use-user"

export function EditImageForm() {
  const { t } = useTranslation()
  const { user } = useUser()

  if (user) {
    return (
      <Card>
        <CardTitle>{t(`Personal Information`)}</CardTitle>
        <CardDescription>
          {t(`Update your personal information here.`)}
        </CardDescription>
        <CardContent className="p-0">
          <EditImage
            image={user.image ?? ""}
            email={user.email}
            name={user.username}
          />
        </CardContent>
      </Card>
    )
  }
  return <></>
}

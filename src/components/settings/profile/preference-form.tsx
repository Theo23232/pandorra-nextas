"use client"

import { useTranslation } from 'react-i18next';

import { EditLangage } from '@/components/settings/profile/edit-langage';
import { EditTheme } from '@/components/settings/profile/editTheme';
import { Card, CardContent, CardDescription, CardTitle } from '@/components/tremor/ui/card';

export function PreferencesForm() {
  const { t } = useTranslation()
  return (
    <Card>
      <CardTitle>{t(`Preferences`)}</CardTitle>
      <CardDescription>
        {t(`Modify the default language and theme`)}
      </CardDescription>
      <CardContent className="space-y-4 p-0">
        <EditLangage />
        <EditTheme />
      </CardContent>
    </Card>
  )
}

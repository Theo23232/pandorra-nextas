"use client"
import { useTranslation } from 'react-i18next';

import { editLangange } from '@/actions/user.ations';
import {
    Select, SelectContent, SelectItem, SelectTrigger, SelectValue
} from '@/components/tremor/inputs/select';
import { useToast } from '@/hooks/use-toast';
import { useUser } from '@/hooks/use-user';

export function EditTheme() {
  const { t } = useTranslation()
  const { user } = useUser()
  const { toast } = useToast()
  const data = [
    {
      value: "dark",
      label: "Dark",
    },
    {
      value: "light",
      label: "Light",
    },
    {
      value: "system",
      label: "System",
    },
  ]

  const handleEdit = async (value: string) => {
    await editLangange(value)
      .then(() => {
        toast({
          title: t(`success`),
          description: t(`Your preferred theme has been updated successfully.`),
          variant: "success",
          duration: 3000,
        })
      })
      .catch((e) => {
        toast({
          title: t(`Error`),
          description: t(e.message),
          variant: "error",
          duration: 3000,
        })
      })
  }
  if (user) {
    return (
      <Select
        onValueChange={(value) => handleEdit(value)}
        defaultValue={user.theme}
      >
        <SelectTrigger>
          <SelectValue placeholder="Select theme" />
        </SelectTrigger>
        <SelectContent>
          {data.map((item) => (
            <SelectItem key={item.value} value={item.value}>
              {t(item.label)}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    )
  }
}

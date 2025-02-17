"use client"

import { Moon, Sun } from 'lucide-react';
import { useTheme } from 'next-themes';
import { useEffect } from 'react';

import { editTheme } from '@/actions/user.ations';
import { Button } from '@/components/ui/button';
import { useUser } from '@/hooks/use-user';

export const ToggleTheme = () => {
  const { theme, setTheme } = useTheme()
  const { user } = useUser()

  useEffect(() => {
    setTheme(user?.theme ?? "dark")
  }, [user])

  const toggleTheme = async () => {
    if (theme == "light") {
      setTheme("dark")
      await editTheme("dark")
    } else {
      setTheme("light")
      await editTheme("light")
    }
  }

  return (
    <Button onClick={toggleTheme} variant="ghost">
      {theme === "light" ? <Moon /> : <Sun />}
    </Button>
  )
}

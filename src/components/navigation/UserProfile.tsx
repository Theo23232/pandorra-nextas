"use client"

import { ChevronsUpDown } from "lucide-react"

import { Button } from "@/components/tremor/ui/button"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { useUser } from "@/hooks/use-user"
import { cx, focusRing } from "@/lib/utils"

import { DropdownUserProfile } from "./DropdownUserProfile"

export const UserProfileDesktop = () => {
  const { user, isError } = useUser()
  if (!isError && user) {
    return (
      <DropdownUserProfile>
        <Button
          aria-label="User settings"
          variant="ghost"
          id="tour3-step3"
          className={cx(
            focusRing,
            "group flex w-full items-center justify-between rounded-md p-2 text-sm font-medium text-gray-900 hover:bg-gray-100 data-[state=open]:bg-gray-100 data-[state=open]:bg-gray-400/10 hover:dark:bg-gray-400/10",
          )}
        >
          {" "}
          <Avatar className="mr-2 h-8 w-8 rounded-lg">
            <AvatarImage src={user.image!} alt={user.username} />
            <AvatarFallback className="rounded-lg">P</AvatarFallback>
          </Avatar>
          <div className="grid flex-1 text-left text-sm leading-tight">
            <span className="truncate font-semibold">{user.username}</span>
            <span className="truncate text-xs">{user.email}</span>
          </div>
          <ChevronsUpDown className="ml-auto size-4" />
        </Button>
      </DropdownUserProfile>
    )
  }
}

export const UserProfileMobile = () => {
  const { user, isLoading } = useUser()

  if (user) {
    return (
      <DropdownUserProfile align="end">
        <Button
          aria-label="User settings"
          variant="ghost"
          id="tour3-step3"
          className={cx(
            "group flex items-center rounded-md p-1 text-sm font-medium text-gray-900 hover:bg-gray-100 data-[state=open]:bg-gray-100 data-[state=open]:bg-gray-400/10 hover:dark:bg-gray-400/10",
          )}
        >
          <Avatar className="h-8 w-8 rounded-lg">
            <AvatarImage src={user.image!} alt={user.username} />
            <AvatarFallback className="rounded-lg">P</AvatarFallback>
          </Avatar>
        </Button>
      </DropdownUserProfile>
    )
  }
  return <></>
}

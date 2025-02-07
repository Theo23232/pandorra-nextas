"use client"
import { useEffect } from "react"

import { addReferreId } from "@/actions/user.ations"

export function RegisterAffiliate() {
  const linkReferreToUser = async (userId: string) => {
    await addReferreId(userId)
  }

  useEffect(() => {
    const referrerId = localStorage.getItem("referrerId") || ""

    if (referrerId !== undefined) {
      linkReferreToUser(referrerId)
    }
  })

  return <> </>
}

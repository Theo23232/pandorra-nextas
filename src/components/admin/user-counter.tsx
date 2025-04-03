"use client"

import { useEffect, useState } from "react"

import pusherClient from "@/lib/pusher"

export function AdminUserCounter() {
  const [connectedCount, setConnectedCount] = useState<number>(0)
  const [activeCount, setActiveCount] = useState<number>(0)

  useEffect(() => {
    // Fonction pour récupérer le nombre d'utilisateurs actifs
    const fetchActiveUserCount = async () => {
      try {
        const response = await fetch("/api/user-activity")
        const data = await response.json()
        setActiveCount(data.activeUserCount)
      } catch (error) {
        console.error("Error fetching active user count:", error)
      }
    }

    // S'abonner au canal de présence
    const channel = pusherClient.subscribe("presence-app")

    // Traiter les données initiales de connexion
    channel.bind("pusher:subscription_succeeded", (members) => {
      setConnectedCount(members.count)
      fetchActiveUserCount() // Récupérer le nombre d'utilisateurs actifs
    })

    // Mettre à jour le compteur quand un membre rejoint
    channel.bind("pusher:member_added", () => {
      setConnectedCount((prev) => prev + 1)
    })

    // Mettre à jour le compteur quand un membre part
    channel.bind("pusher:member_removed", () => {
      setConnectedCount((prev) => Math.max(0, prev - 1))
    })

    // Écouter les mises à jour d'activité
    channel.bind("user-activity-update", (data) => {
      setActiveCount(data.activeUserCount)
    })

    // Récupérer les données initiales
    fetchActiveUserCount()

    // Rafraîchir périodiquement les données
    const refreshInterval = setInterval(fetchActiveUserCount, 60000) // Toutes les minutes

    // Nettoyer lors du démontage du composant
    return () => {
      clearInterval(refreshInterval)
      channel.unbind_all()
      pusherClient.unsubscribe("presence-app")
    }
  }, [])

  return <h3 className="text-xl font-medium sm:text-2xl">{connectedCount}</h3>
}

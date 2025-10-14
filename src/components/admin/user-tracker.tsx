"use client"

import { useCallback, useEffect } from "react"

import pusherClient from "@/lib/pusher"

export default function UserTracker() {
  // Fonction pour signaler l'activité utilisateur
  const reportActivity = useCallback(async () => {
    try {
      await fetch("/api/user-activity", {
        method: "POST",
        headers: {
          "Content-Type": "services/json",
        },
      })
    } catch (error) {
      console.error("Error reporting activity:", error)
    }
  }, [])

  useEffect(() => {
    // Enregistrer événements d'activité utilisateur
    const handleUserActivity = () => {
      reportActivity()
    }

    // S'abonner au canal de présence
    const channel = pusherClient.subscribe("presence-app")

    // Signaler l'activité initiale à la connexion réussie
    channel.bind("pusher:subscription_succeeded", () => {
      reportActivity()
    })

    // Ajouter des écouteurs d'événements pour les interactions utilisateur
    window.addEventListener("click", handleUserActivity)
    window.addEventListener("keydown", handleUserActivity)

    // Signaler l'activité périodiquement (toutes les 5 minutes)
    const activityInterval = setInterval(handleUserActivity, 5 * 60 * 1000)

    // Signaler l'activité lorsque l'onglet devient visible
    document.addEventListener("visibilitychange", () => {
      if (document.visibilityState === "visible") {
        reportActivity()
      }
    })

    // Nettoyer lors du démontage du composant
    return () => {
      window.removeEventListener("click", handleUserActivity)
      window.removeEventListener("keydown", handleUserActivity)
      clearInterval(activityInterval)
      pusherClient.unsubscribe("presence-app")
    }
  }, [reportActivity])

  // Ce composant ne rend rien visuellement
  return null
}

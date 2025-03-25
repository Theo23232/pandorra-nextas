"use client"
import { useEffect, useState } from "react"

import { useToast } from "@/hooks/use-toast"
import { useUser } from "@/hooks/use-user"
import { pusherClient } from "@/lib/pusher"

export function usePusher() {
  const { user } = useUser()
  const { toast } = useToast()
  const [isConnected, setIsConnected] = useState(false)

  function subscribeToChannel() {
    if (!user) return

    const channelName = `private-user-${user.id}`

    // Vérifier si déjà abonné pour éviter la duplication
    if (pusherClient.channel(channelName)) {
      console.log(
        `Déjà abonné à ${channelName}, annulation de la souscription en double`,
      )
      return
    }

    console.log(`Abonnement au canal: ${channelName}`)
    const channel = pusherClient.subscribe(channelName)

    // Écouter l'événement de succès
    channel.bind("pusher:subscription_succeeded", () => {
      console.log(`Successfully subscribed to ${channelName}`)
      setIsConnected(true)
    })

    // Gérer les erreurs d'abonnement
    channel.bind("pusher:subscription_error", (error: any) => {
      console.error(`Subscription error for ${channelName}:`, error)
      // alert("Connection error")
    })

    // Écouter les nouveaux messages
    channel.bind("new-message", (data: any) => {
      console.log("Received new message:", data)
      toast({
        title: "Generation finished",
        description: data.message,
        variant: data.status as
          | "info"
          | "success"
          | "warning"
          | "error"
          | "loading",
        duration: 3000,
      })
    })

    return () => {
      channel.unbind_all()
      pusherClient.unsubscribe(channelName)
      setIsConnected(false)
      console.log(`Désabonnement du canal: ${channelName}`)
    }
  }

  useEffect(() => {
    if (!user) return

    if (pusherClient.connection.state !== "connected") {
      console.log("Pusher not connected yet, connecting...")

      const connectHandler = () => {
        console.log("Pusher connected, now subscribing...")
        subscribeToChannel()
      }

      pusherClient.connection.bind("connected", connectHandler)

      return () => {
        pusherClient.connection.unbind("connected", connectHandler)
      }
    } else {
      subscribeToChannel()
    }

    return () => {
      if (user) {
        const channelName = `private-user-${user.id}`
        pusherClient.unsubscribe(channelName)
        console.log(`Désabonnement du canal: ${channelName}`)
      }
      setIsConnected(false)
    }
  }, [user])

  return { isConnected }
}

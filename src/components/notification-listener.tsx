"use client"

import { usePusher } from '@/hooks/use-pusher';

export function NotificationListener() {
  // Appeler le hook pour s'abonner aux notifications Pusher
  const { isConnected } = usePusher()

  return (
    <div className="hidden">
      {/* Ce composant n'affiche rien, il sert uniquement à écouter les notifications */}
      {/* Vous pouvez éventuellement afficher un indicateur de connexion */}
      {isConnected ? <span>O</span> : <span>X</span>}
    </div>
  )
}

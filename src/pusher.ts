import Pusher from 'pusher';


const pusherClientSingleton = () => {
  return new Pusher({
    appId: process.env.PUSHER_APP_ID!,
    key: process.env.PUSHER_KEY!,
    secret: process.env.PUSHER_SECRET!,
    cluster: process.env.PUSHER_CLUSTER!,
    useTLS: true,
  })
}

declare global {
  var globalPusher: undefined | ReturnType<typeof pusherClientSingleton>
}

export const pusherServer = globalThis.globalPusher ?? pusherClientSingleton()

if (process.env.NODE_ENV !== "production")
  globalThis.globalPusher = pusherServer

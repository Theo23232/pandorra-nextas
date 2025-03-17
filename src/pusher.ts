import Pusher from 'pusher';

const pusherClientSingleton = () => {
  return new Pusher({
    appId: "hFU46XsprTQnP",
    key: "hFU46XsprTQnP",
    secret: "hFU46XsprTQnP",
    cluster: "",
    useTLS: true,
    host: "ws.teratany.org",
    port: "443",
  })
}

declare global {
  var globalPusher: undefined | ReturnType<typeof pusherClientSingleton>
}

export const pusherServer = globalThis.globalPusher ?? pusherClientSingleton()

if (process.env.NODE_ENV !== "production")
  globalThis.globalPusher = pusherServer

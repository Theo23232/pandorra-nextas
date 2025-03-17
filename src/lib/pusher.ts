import Pusher from 'pusher-js';

export const pusherClient = new Pusher("hFU46XsprTQnP", {
  cluster: "",
  wsHost: "ws.teratany.org",
  wsPort: 443,
  wssPort: 443,
  forceTLS: true,
  enabledTransports: ["ws", "wss"],
  authTransport: "ajax",
  authEndpoint: "/api/pusher/auth",
})

export default pusherClient

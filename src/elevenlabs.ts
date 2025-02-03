import { ElevenLabsClient } from "elevenlabs"

const elevenlabsClientSingleton = () => {
  return new ElevenLabsClient({ apiKey: process.env.XI_API_KEY })
}

declare global {
  // eslint-disable-next-line no-var
  var globalElevenlabs: undefined | ReturnType<typeof elevenlabsClientSingleton>
}

export const elevenlabs =
  globalThis.globalElevenlabs ?? elevenlabsClientSingleton()

if (process.env.NODE_ENV !== "production")
  globalThis.globalElevenlabs = elevenlabs

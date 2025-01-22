// lib/device.ts
import { UAParser } from 'ua-parser-js';

export async function getDeviceInfo(userAgent: string, ip: string) {
  const parser = new UAParser()
  parser.setUA(userAgent)

  const device = parser.getDevice()
  const os = parser.getOS()
  const browser = parser.getBrowser()

  // Rest of the code remains the same
  const geoResponse = await fetch(`https://ipapi.co/${ip}/json/`)
  const geoData = await geoResponse.json()

  let deviceModel = device.model || ""

  if (os.name === "iOS") {
    deviceModel = detectiOSModel(userAgent)
  }

  if (os.name === "Android") {
    deviceModel = detectAndroidModel(userAgent)
  }

  return {
    deviceType: device.type || "desktop",
    deviceOs: os.name || "Unknown",
    deviceModel,
    browser: browser.name || "Unknown",
    browserVersion: browser.version || "Unknown",
    ip,
    country: geoData.country_name || "Unknown",
  }
}

// Rest of the file remains unchanged

function detectiOSModel(userAgent: string): string {
  const models: { [key: string]: string } = {
    "iPhone14,2": "iPhone 13 Pro",
    "iPhone14,3": "iPhone 13 Pro Max",
    "iPhone14,4": "iPhone 13 mini",
    "iPhone14,5": "iPhone 13",
    // Ajouter d'autres modèles au besoin
  }

  const match = userAgent.match(/iPhone(\d+,\d+)/)
  return match ? models[match[0]] || match[0] : "iPhone"
}

function detectAndroidModel(userAgent: string): string {
  const match = userAgent.match(/\((.+?)\)/)
  if (!match) return "Android Device"

  const deviceInfo = match[1].split(";")
  return (
    deviceInfo
      .find(
        (info) =>
          info.includes("SM-") || // Samsung
          info.includes("Pixel") || // Google
          info.includes("OnePlus"), // OnePlus
      )
      ?.trim() || "Android Device"
  )
}

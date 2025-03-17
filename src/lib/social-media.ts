/**
 * Social media sharing and verification utilities
 */

type SocialMediaPlatform = "instagram" | "facebook"
type ShareStatus = {
  instagram: boolean
  facebook: boolean
}

/**
 * Share content on social media platforms
 * @param imageUrl URL of the image to share
 * @param caption Caption text for the image
 * @param platform Platform to share on (instagram or facebook)
 */
export async function shareOnSocialMedia(
  imageUrl: string,
  caption: string,
  platform: SocialMediaPlatform,
): Promise<boolean> {
  try {
    // In a real implementation, this would use the platform's API
    // For Instagram, this would typically use their Graph API
    // For Facebook, this would use the Facebook SDK or Graph API

    const response = await fetch("/api/social-media/share", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        imageUrl,
        caption,
        platform,
      }),
    })

    if (!response.ok) {
      throw new Error(`Failed to share on ${platform}`)
    }

    const data = await response.json()
    return data.success
  } catch (error) {
    console.error(`Error sharing to ${platform}:`, error)
    throw error
  }
}

/**
 * Check if a publication has been shared on social media platforms
 * @param publicationId ID of the publication to check
 * @returns Object with status for each platform
 */
export async function checkSocialMediaShare(
  publicationId: string,
): Promise<ShareStatus> {
  try {
    const response = await fetch(
      `/api/social-media/status?publicationId=${publicationId}`,
    )

    if (!response.ok) {
      throw new Error("Failed to check share status")
    }

    const data = await response.json()
    return data.status
  } catch (error) {
    console.error("Error checking share status:", error)
    throw error
  }
}

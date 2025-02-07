"use server"
import OpenAI from "openai"

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
  dangerouslyAllowBrowser: true, // Only for client-side, not recommended for production
})

export const enhanceImagePrompt = async (prompt: string): Promise<string> => {
  try {
    const response = await openai.chat.completions.create({
      model: "gpt-3.5-turbo",
      messages: [
        {
          role: "system",
          content:
            "You are a prompt enhancement assistant. Improve the given prompt for image generation by making it more specific, descriptive, and clear.",
        },
        {
          role: "user",
          content: `Enhance this prompt for image generation: ${prompt}`,
        },
      ],
    })

    const enhancedPrompt = response.choices[0].message.content
    if (enhancedPrompt) {
      return enhancedPrompt
    } else {
      throw new Error("Prompt enhancement failed")
    }
  } catch (error) {
    console.error("Prompt enhancement failed:", error)
    throw new Error("Prompt enhancement failed")
  }
}

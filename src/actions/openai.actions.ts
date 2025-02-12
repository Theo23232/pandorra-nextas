"use server"
import OpenAI from "openai"

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
})

export const enhanceImagePrompt = async (prompt: string): Promise<string> => {
  try {
    const response = await openai.chat.completions.create({
      model: "gpt-3.5-turbo",
      messages: [
        {
          role: "system",
          content:
            "You are a prompt enhancement assistant. If there is no prompt just generate a random one.",
        },
        {
          role: "system",
          content:
            "Improve the given prompt for image generation by making it more specific, descriptive, and clear.",
        },
        {
          role: "system",
          content:
            "Always choose a realistic style or leave the style unspecified if the prompt does not mention one.",
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

export const enhanceVideoPrompt = async (prompt: string): Promise<string> => {
  try {
    const response = await openai.chat.completions.create({
      model: "gpt-3.5-turbo",
      messages: [
        {
          role: "system",
          content:
            "You are a prompt enhancement assistant. Improve the given prompt for video generation by making it more specific, descriptive, and clear. Possibly the user added an image following his prompt.  Always choose a realistic style or leave the style unspecified if the prompt does not mention one. And do not choose 3D animation if  if the prompt does not mention one style",
        },
        {
          role: "user",
          content: `Enhance this prompt for video generation: ${prompt}`,
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

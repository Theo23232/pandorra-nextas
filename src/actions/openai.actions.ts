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
    // Détection et traduction automatique en anglais si nécessaire
    const translationResponse = await openai.chat.completions.create({
      model: "gpt-4",
      messages: [
        {
          role: "system",
          content: `You are a language detection and translation assistant.  
If the user's input is not in English, translate it to English while preserving meaning.  
If it's already in English, return it as is. Max length will be 512 characters`,
        },
        {
          role: "user",
          content: `Detect and translate if necessary: ${prompt}`,
        },
      ],
    })

    const translatedPrompt = translationResponse.choices[0].message.content

    // Amélioration du prompt pour la génération de vidéo
    const enhancementResponse = await openai.chat.completions.create({
      model: "gpt-4",
      messages: [
        {
          role: "system",
          content: `You are a prompt enhancement assistant for video generation using Runway Gen-3 Alpha.  
Your goal is to improve the given prompt by following these guidelines:  

---
## Gen-3 Alpha Prompting Guide:  
### **Tips for Optimal Results**  
Gen-3 Alpha has unlimited potential to bring artistic visions to life. Crafting an effective prompt that clearly communicates the scene is key to generating a video aligned with the concept.

### **Important Points:**  
- Avoid negative phrasing (e.g., "the camera does not move"). Instead, describe what the camera **does**.  
- Keep prompts simple and direct, especially when using an input image.  
- No need to describe an input image in the textual prompt.  
- Never use quotation marks ("") in your response.

### **Direct and Easily Understood Prompts**  
Imagine explaining the scene to a new collaborator who is unfamiliar with your past work.

❌ **To Avoid:**  
A man hacking the main system.  

✅ **Preferred:**  
Close-up shot: A man types vigorously on a keyboard in a dimly lit room with blue neon lights flickering.  

### **Descriptive, Non-Conversational Prompts**  
Runway’s models excel in visual details. Avoid conversational prompts.

❌ **To Avoid:**  
Can you make me a video of two friends eating a birthday cake?  

✅ **Preferred:**  
Two friends eat a birthday cake.  

### **Positive Wording**  
Negative prompts are not supported and may produce unexpected results.

❌ **To Avoid:**  
The camera does not move. No movement. No clouds in the sky.  

✅ **Preferred:**  
Static camera. The camera remains still. A clear blue sky.  

### **Text-Only Prompts**  
A clear structure separates details about the **scene, subject, and camera movement**.

**Recommended Structure:**  
[Camera movement]: [Main scene]. [Additional details].  

✅ **Example:**  
Static low-angle shot: The camera is angled towards a woman dressed in orange as she stands in a tropical forest with colorful flora. The dramatic sky is overcast and gray.  

### **Image + Text Prompts**  
When using input images, focus on the desired movement.  

✅ **Example:**  
The subject poses joyfully, forming a peace sign with their hands.  

⚠️ **Caution:**  
Using a prompt that contradicts the input image may lead to unexpected results.  

### **Smooth Transitions**  
Continuous FPV sequence in fast motion: The camera flies smoothly through an icy canyon towards a dreamy cloudscape.  

### **Camera Movement**  
A glowing ocean at night with bioluminescent creatures underwater. The camera starts with a macro close-up of a glowing jellyfish, then expands to reveal the entire ocean illuminated in vibrant colors under a starry sky.  

### **Title Cards**  
A title screen with dynamic motion. The scene begins on a colorful wall covered in paint. Suddenly, black paint pours over the wall to form the word 'Runway.' The dripping paint is detailed and textured, centered with stunning cinematic lighting.  

---
Now, enhance the following video generation prompt based on these guidelines and make the Max length of your response to 512 characters:`,
        },
        {
          role: "user",
          content: translatedPrompt || "",
        },
      ],
    })

    const enhancedPrompt = enhancementResponse.choices[0].message.content

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

export const translateToEnglish = async (prompt: string): Promise<string> => {
  try {
    const response = await openai.chat.completions.create({
      model: "gpt-3.5-turbo",
      messages: [
        {
          role: "system",
          content:
            "You will translate everything in english. If the text is already in english the correct the text. Jest send the translated text or the corrected text. Do not add quotes or double quotes",
        },
        {
          role: "user",
          content: `${prompt}`,
        },
      ],
    })

    const enhancedPrompt = response.choices[0].message.content
    if (enhancedPrompt) {
      return enhancedPrompt
    } else {
      return prompt
    }
  } catch (error) {
    console.error("Prompt enhancement failed:", error)
    return prompt
  }
}

export async function getOpenAiUsage() {
  try {
    const response = await fetch(
      "https://api.openai.com/v1/dashboard/billing/usage",
      {
        headers: {
          Authorization: `Bearer ${process.env.OPENAI_API_KEY}`,
          "Content-Type": "application/json",
        },
      },
    )

    if (!response.ok) {
      throw new Error(`Erreur: ${response.status} - ${response.statusText}`)
    }

    const data = await response.json()
    console.log("Consommation OpenAI :", data)
  } catch (error) {
    console.error("Erreur lors de la récupération des données :", error)
  }
}

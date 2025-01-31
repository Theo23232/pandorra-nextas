"use server"

import { SA } from '@/lib/safe-ation';
import { prisma } from '@/prisma';
import { Agent } from '@prisma/client';

interface AgentOption {
  language: string
  voiceId: string
}

export const createAgent = SA(
  async (user, option: AgentOption): Promise<Agent> => {
    // Create agent (POST /v1/convai/agents/create)
    let firstMessage = "Bonjour, comment puis-je vous aider?"
    let language = option.language
    console.log("option.voiceId ==> ", option.voiceId)
    console.log("language ==> ", language)
    switch (language) {
      case "en":
        firstMessage = "Hello, how can I help you?"
        break
      case "fr":
        firstMessage = "Bonjour, comment puis-je vous aider?"
        break
      case "ar":
        firstMessage = "مرحبًا، كيف يمكنني مساعدتك؟"
        break
      case "bg":
        firstMessage = "Здравейте, как мога да ви помогна?"
        break
      case "zh":
        firstMessage = "你好，我能帮你什么吗？"
        break
      case "hr":
        firstMessage = "Bok, kako vam mogu pomoći?"
        break
      case "da":
        firstMessage = "Hej, hvordan kan jeg hjælpe dig?"
        break
      case "de":
        firstMessage = "Hallo, wie kann ich Ihnen helfen?"
        break
      case "el":
        firstMessage = "Γεια σας, πώς μπορώ να σας βοηθήσω;"
        break
      case "hi":
        firstMessage = "नमस्ते, मैं आपकी कैसे मदद कर सकता हूँ?"
        break
      case "it":
        firstMessage = "Ciao, come posso aiutarti?"
        break
      case "ja":
        firstMessage = "こんにちは、どのようにお手伝いできますか？"
        break
      case "ko":
        firstMessage = "안녕하세요, 어떻게 도와드릴까요?"
        break
      case "pl":
        firstMessage = "Cześć, jak mogę ci pomóc?"
        break
      case "pt":
        firstMessage = "Olá, como posso ajudar?"
        break
      case "ms":
        firstMessage = "Hai, bagaimana saya boleh membantu anda?"
        break
      case "ro":
        firstMessage = "Bună, cum te pot ajuta?"
        break
      case "ru":
        firstMessage = "Здравствуйте, как я могу вам помочь?"
        break
      case "es":
        firstMessage = "Hola, ¿cómo puedo ayudarte?"
        break
      case "sk":
        firstMessage = "Ahoj, ako ti môžem pomôcť?"
        break
      case "sv":
        firstMessage = "Hej, hur kan jag hjälpa dig?"
        break
      case "tr":
        firstMessage = "Merhaba, size nasıl yardımcı olabilirim?"
        break
      case "uk":
        firstMessage = "Привіт, як я можу вам допомогти?"
        break
      default:
        firstMessage = "Hello, how can I help you?"
        language = "en"
    }

    const existingAgent = await prisma.agent.findFirst({
      where: {
        userId: user.id,
        language: option.language,
        voiceId: option.voiceId,
      },
    })

    console.log("existingAgent ==> ", existingAgent)

    if (existingAgent) {
      return existingAgent
    }

    const configBody: any = {
      conversation_config: {
        agent: {
          prompt: {
            prompt:
              "You are an AI assistant do whatever the human ask you to do, and answear on everything he say",
          },
          first_message: firstMessage,
          language: language,
        },
      },
    }

    if (language !== "en") {
      configBody.conversation_config.tts = {
        model_id: "eleven_turbo_v2_5",
        voice_id: option.voiceId,
      }
    } else {
      configBody.conversation_config.tts = {
        voice_id: option.voiceId,
      }
    }

    const response = await fetch(
      "https://api.elevenlabs.io/v1/convai/agents/create",
      {
        method: "POST",
        headers: {
          "xi-api-key": process.env.XI_API_KEY || "",
          "Content-Type": "application/json",
        },
        body: JSON.stringify(configBody),
      },
    )
    const body = await response.json()
    console.log("Error body:", body)
    const agentId = body.agent_id

    const agent = await prisma.agent.create({
      data: {
        language,
        voiceId: option.voiceId,
        userId: user.id,
        id: agentId,
      },
    })

    return agent
  },
)

export const saveConversation = SA(async (user, agentId) => {
  const response = await fetch(
    `https://api.elevenlabs.io/v1/convai/conversations?agent_id=${agentId}`,
    {
      method: "GET",
      headers: {
        "xi-api-key": process.env.XI_API_KEY || "",
      },
    },
  )

  const body = await response.json()

  const conversations = body.conversations
  if (conversations.length) {
    let conversation = conversations[0]

    const transcriptResponse = await fetch(
      `https://api.elevenlabs.io/v1/convai/conversations/${conversation.conversation_id}`,
      {
        method: "GET",
        headers: {
          "xi-api-key": process.env.XI_API_KEY || "",
        },
      },
    )
    const transcriptBody = await transcriptResponse.json()

    console.log("transcriptBody ==> ", transcriptBody)

    await prisma.$transaction(async (prisma) => {
      const conv = await prisma.conversation.create({
        data: {
          id: conversation.conversation_id,
          agentId: conversation.agent_id,
          agentName: conversation.agent_name,
          callDurationSecs: conversation.call_duration_secs,
          messageCount: conversation.message_count,
          status: conversation.status,
          call_successful: conversation.call_successful,
          userId: user.id,
          cost: transcriptBody.metadata.cost,
        },
      })

      // Use for...of to ensure sequential processing
      for (const transcript of transcriptBody.transcript) {
        await prisma.transcript.create({
          data: {
            conversationId: conversation.conversation_id,
            role: transcript.role,
            message: transcript.message,
            timeInCallSecs: transcript.time_in_call_secs,
            createdAt: new Date(), // Optional: add timestamp
          },
        })
      }

      return conversation
    })
  }
})

export const getConversationAudio = SA(async (user, convId: string) => {
  const response = await fetch(
    `https://api.elevenlabs.io/v1/convai/conversations/${convId}/audio`,
    {
      method: "GET",
      headers: {
        "xi-api-key": process.env.XI_API_KEY || "",
      },
    },
  )

  const blob = await response.blob()
  return blob
})

import OpenAI from 'openai'
import {ChatMessage} from "@/features/chat/types/chat.types";
import {ChatConfig} from "@/config/chat.config";

export class OpenAIService {
    private client: OpenAI

    constructor(apiKey: string, baseURL?: string) {
        this.client = new OpenAI({
            baseURL: baseURL || 'https://api.deepseek.com',
            apiKey,
        })
    }
    async generateTitle(prompt: string): Promise<string> {
        try {
            const titleGenerate = await this.client.chat.completions.create({
                model: ChatConfig.CHEAPER_MODEL,
                messages: [
                    {
                        role: "system",
                        content:
                            "Generate a conversation title based on this first prompt. Directly give the title without anything else. And don't add quotes or double quotes. Give a title that fits in max 20 chars. Use the prompt's language; if unknown, use English.",
                    },
                    { role: "user", content: prompt },
                ],
            })

            return (
                titleGenerate.choices[0].message.content?.trim() ||
                prompt.slice(0, 20)
            )
        } catch (err) {
            console.error("Title generation failed:", err)
            return prompt.slice(0, 20)
        }
    }

    async checkIfSearchNeeded(query: string): Promise<boolean> {
        const response = await this.client.chat.completions.create({
            model: ChatConfig.CHEAPER_MODEL,
            messages: [
                {
                    role: 'system',
                    content:
                        "You are an AI assistant that determines if a user query requires current information from the web. Respond with only 'YES' if the query likely needs current information or 'NO' if it can be answered with general knowledge.",
                },
                { role: 'user', content: query },
            ],
            max_completion_tokens: 5,
        })

        return response.choices[0]?.message?.content?.trim().toUpperCase() === 'YES'
    }

    async createChatStream(messages: ChatMessage[]) {
        return this.client.chat.completions.create({
            model: ChatConfig.MAIN_MODEL,
            messages,
            stream: true,
        })
    }
}

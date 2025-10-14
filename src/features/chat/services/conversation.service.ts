import {IConversationRepository} from "@/features/chat/repositories/conversation.repository";
import {openai} from "@/lib/openai";


export class ConversationService {
    constructor(private repo: IConversationRepository) {
    }

    async getUserConversations(userId: string) {
        return this.repo.getAllByUserId(userId)
    }

    async createConversationWithGeneratedTitle(userId: string , firstPrompt: string) {
        const title = await this.generateTitle(firstPrompt)
        return this.repo.create({title , userId})
    }
    async createConversation(userId: string , title: string) {
        return this.repo.create({title , userId})
    }
    private async generateTitle(prompt: string): Promise<string> {
        try {
            const titleGenerate = await openai.chat.completions.create({
                model: "deepseek-chat",
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
}

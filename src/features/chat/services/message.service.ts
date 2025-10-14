
import { openai } from "@/lib/openai"
import type {MessagePayload , SSEResponse} from "../types/messages"
import {IMessageRepository} from "@/features/chat/repositories/message.repository";

export class MessageService {
    constructor(private readonly messageRepository: IMessageRepository) {}

    async sendMessage(data: MessagePayload) {

        const userMsg = await this.messageRepository.create(data)

        const completion = await openai.chat.completions.create({
            model: "deepseek-chat",
            messages: [{ role: "user", content: data.content }],
            stream: false,
        })

        const assistantContent = completion.choices[0].message?.content ?? "..."
        const assistantMsg = await this.messageRepository.create({
            role: "assistant",
            content: assistantContent,
            conversationId: data.conversationId,
        })

        return { userMsg, assistantMsg }
    }

    async streamMessageToSSE(
        data: MessagePayload,
        res: SSEResponse
    ) {
        await this.messageRepository.create({...data, role: 'user'})

        const assistantMsg = await this.messageRepository.create({
            role: "assistant",
            content: "",
            conversationId: data.conversationId,
        })

        const stream = await openai.chat.completions.create({
            model: "deepseek-chat",
            stream: true,
            messages: [{ role: "user", content: data.content }],
        })

        let assistantContent = ""

        for await (const event of stream) {
            const delta = event.choices?.[0]?.delta?.content
            if (!delta) continue

            assistantContent += delta
            res.write(`data: ${delta.replace(/\n/g, "\\n")}\n\n`)
            await this.messageRepository.updateContent(assistantMsg.id, assistantContent)
        }

        res.write("event: done\ndata: done\n\n")
        res.end()

        return { ...assistantMsg, content: assistantContent }
    }


    async editMessage(messageId: string, newContent: string) {
        return this.messageRepository.updateContent(messageId, newContent)
    }

    async deleteConversationMessages(conversationId: string) {
        return this.messageRepository.deleteByConversation(conversationId)
    }

    async getConversationMessages(conversationId: string) {
        return this.messageRepository.findByConversation(conversationId)
    }
}

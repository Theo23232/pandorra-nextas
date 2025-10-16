import {ChatMessage , MessageType , SearchResult} from "@/features/chat/types/chat.types";
import {ChatConfig} from "@/config/chat.config";
import {MessageRepositoryPrisma} from "@/features/chat/repositories/message.repository.prisma";
import {OpenAIService} from "@/features/chat/services/openai.service";
import {WebSearchService} from "@/features/chat/services/web-search.search";
import {PrismaConversationRepository} from "@/features/chat/repositories/conversation.repository.prisma";

export class ChatService {
    constructor(
        private messageRepo: MessageRepositoryPrisma,
        private conversationRepo: PrismaConversationRepository,
        private openaiService: OpenAIService,
        private searchService: WebSearchService
    ) {}

    async getConversationContext(conversationId: string): Promise<ChatMessage[]> {
        const history = await this.messageRepo.getRecentMessages(
            conversationId,
            ChatConfig.MAX_HISTORY_LENGTH
        )

        return history.map((msg) => ({
            role: msg.role === 'user' ? 'user' : 'assistant',
            content: msg.content,
        }))
    }

    buildSystemMessage(): ChatMessage {
        return {
            role: 'system',
            content:
                'You are Pandorra, an AI assistant built by Pandorra.ai. Previous conversation context has been summarized. Respond to the user\'s current query based on the recent conversation history provided.',
        }
    }

    buildSearchSystemMessage(): ChatMessage {
        return {
            role: 'system',
            content:
                "You are Pandorra, an AI assistant built by Pandorra.ai. Help the user by analyzing web search results and providing a comprehensive answer. When citing sources, always use descriptive link text instead of URLs. Always cite your sources. And add a list the top the 3 web research at the end of message using the user's language",
        }
    }

    buildContextMessages(
        messages: ChatMessage[],
        currentQuery: string,
        includeSystem = true
    ): ChatMessage[] {
        const contextMessages: ChatMessage[] = []

        if (includeSystem) {
            contextMessages.push(this.buildSystemMessage())
        }

        contextMessages.push(...messages.slice(-ChatConfig.CONTEXT_MESSAGE_COUNT))
        contextMessages.push({ role: 'user', content: currentQuery })

        return contextMessages
    }

    buildSearchContextMessages(
        messages: ChatMessage[],
        query: string,
        searchResults: SearchResult[]
    ): ChatMessage[] {
        return [
            this.buildSearchSystemMessage(),
            ...messages.slice(-ChatConfig.SEARCH_CONTEXT_COUNT),
            {
                role: 'user',
                content: `My question is: ${query}\n\nHere are web search results:\n${JSON.stringify(searchResults)}\n\nPlease analyze these results and answer my question.`,
            },
        ]
    }

    async processWithWebSearch(
        conversationId: string,
        content: string,
        messages: ChatMessage[],
        controller: ReadableStreamDefaultController,
        encoder: TextEncoder
    ): Promise<string> {
        const needsSearch = await this.openaiService.checkIfSearchNeeded(content)

        if (!needsSearch) {
            return this.processRegularChat(content, messages, controller, encoder)
        }

        controller.enqueue(
            encoder.encode('🔍 Searching the web for information... Please wait.\n\n')
        )

        const searchResults = await this.searchService.search(content)

        if (typeof searchResults === 'string') {
            controller.enqueue(encoder.encode(`${searchResults}\n\n`))
            return `${searchResults}\n\n`
        }

        controller.enqueue(encoder.encode('Found information:\n\n'))

        const condensedResults = this.searchService.condenseResults(searchResults)
        const searchMessages = this.buildSearchContextMessages(
            messages,
            content,
            condensedResults
        )

        const stream = await this.openaiService.createChatStream(searchMessages)

        let assistantContent =
            'Based on the search results, here\'s what I found:\n\n'
        controller.enqueue(encoder.encode(assistantContent))

        for await (const chunk of stream) {
            const chunkContent = chunk.choices[0]?.delta?.content || ''
            assistantContent += chunkContent
            controller.enqueue(encoder.encode(chunkContent))
        }

        return assistantContent
    }

    async processRegularChat(
        content: string,
        messages: ChatMessage[],
        controller: ReadableStreamDefaultController,
        encoder: TextEncoder
    ): Promise<string> {
        const contextMessages = this.buildContextMessages(messages, content)
        const stream = await this.openaiService.createChatStream(contextMessages)

        let assistantContent = ''

        for await (const chunk of stream) {
            const chunkContent = chunk.choices[0]?.delta?.content || ''
            assistantContent += chunkContent
            controller.enqueue(encoder.encode(chunkContent))
        }

        return assistantContent
    }

    async saveConversation(
        conversationId: string,
        userContent: string,
        assistantContent: string
    ): Promise<void> {
        await this.messageRepo.saveMessagePair(
            conversationId,
            userContent,
            assistantContent
        )
        await this.conversationRepo.updateTimestamp({conversationId})
    }

    async getUserConversations(userId: string) {
        return this.conversationRepo.getAllByUserId(userId)
    }

    async createConversationWithGeneratedTitle(userId: string , firstPrompt: string) {
        const title = await this.openaiService.generateTitle(firstPrompt)
        return this.conversationRepo.create({title , userId})
    }

    async updateConversationTitle(conversationId: string, title: string) {
        return this.conversationRepo.update({conversationId, title})
    }
    async createConversation(userId: string , title: string) {
        return this.conversationRepo.create({title , userId})
    }

    async getConversationMessages(id: string): Promise<MessageType[]> {
        return this.messageRepo.getRecentMessages(id, 20 );
    }
}

import {PrismaClient} from "@prisma/client";
import {MessageRepositoryPrisma} from "@/features/chat/repositories/message.repository.prisma";
import {OpenAIService} from "@/features/chat/services/openai.service";
import {PrismaConversationRepository} from "@/features/chat/repositories/conversation.repository.prisma";
import {WebSearchService} from "@/features/chat/services/web-search.search";
import {ChatService} from "@/features/chat/services/chat.service";
import {prisma} from "@/prisma";


export const messageRepo = new MessageRepositoryPrisma(prisma)
export const openaiService = new OpenAIService(process.env.DEEPSEEK_API_KEY!)
export const conversationRepo = new PrismaConversationRepository(prisma);
export const searchService = new WebSearchService()
export const chatService = new ChatService(messageRepo,conversationRepo ,openaiService, searchService)

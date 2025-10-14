import {PrismaConversationRepository} from "@/features/chat/repositories/conversation.repository.prisma";
import {ConversationService} from "@/features/chat/services/conversation.service";
import {PrismaMessageRepository} from "@/features/chat/repositories/message.repository.prisma";
import {MessageService} from "@/features/chat/services/message.service";


const conversationRepo = new PrismaConversationRepository();
const messageRepo = new PrismaMessageRepository();
export const conversationService = new ConversationService(conversationRepo);
export const messageService = new MessageService(messageRepo);

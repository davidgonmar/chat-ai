import { db } from '@/lib/db';
import { Message, Role } from '@prisma/client';

export const getMessagesByChatId = async (
  chatId: string
): Promise<Message[]> => {
  if (!chatId) return [];
  const messages = await db.message.findMany({
    where: { chatId },
  });
  return messages;
};

export const createMessage = async (
  chatId: string,
  content: string,
  role: Role
): Promise<Message> => {
  const message = await db.message.create({
    data: { chatId, content, role, createdAt: new Date() },
  });
  return message;
};

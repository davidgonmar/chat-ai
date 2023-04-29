import { db } from '@/lib/db';
import { Chat } from '@prisma/client';

export const createChat = async (
  userId: string,
  name: string
): Promise<Chat> => {
  const chat = await db.chat.create({
    data: { userId, name },
  });
  return chat;
};

// sorted by most recent
export const getChatsByUserId = async (userId: string): Promise<Chat[]> => {
  const chats = await db.chat.findMany({
    where: { userId },
    orderBy: { createdAt: 'desc' },
  });
  return chats;
};

export const getChatById = async (chatId: string): Promise<Chat | null> => {
  const chat = await db.chat.findUnique({
    where: { id: chatId },
  });
  return chat;
};

export const deleteChat = async (chatId: string): Promise<Chat> => {
  const chat = await db.chat.delete({
    where: { id: chatId },
  });
  return chat;
};

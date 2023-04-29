import { Message } from '@prisma/client';
import { create } from 'zustand';

export interface MessageStore {
  messages: Message[];
  setMessages: (messages: Message[]) => void;
  error: string | null;
  setError: (error: string | null) => void;
  isSendingMessage: boolean;
  setIsSendingMessage: (isSendingMessage: boolean) => void;
}

export const useMessageStore = create<MessageStore>((set) => ({
  messages: [],
  setMessages: (messages) => set({ messages }),
  error: null,
  setError: (error) => set({ error }),
  isSendingMessage: false,
  setIsSendingMessage: (isSendingMessage) => set({ isSendingMessage }),
}));

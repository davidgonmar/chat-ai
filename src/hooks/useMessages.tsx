import { useMessageStore } from '@/store/store';
import { usePathname } from 'next/navigation';
import { useChats } from './useChats';
import { useSession } from 'next-auth/react';
import { Message } from '@prisma/client';
import { v4 as uuidv4 } from 'uuid';

export const useMessages = () => {
  let chatId = usePathname()?.split('/')[2];
  const {
    messages,
    setMessages,
    setError,
    error,
    isSendingMessage,
    setIsSendingMessage,
  } = useMessageStore();
  const { addChat } = useChats();
  const session = useSession();
  const sendMessage = async (newMessage: string) => {
    if (isSendingMessage) return;

    // We set the message as sending
    setIsSendingMessage(true);
    // Due to not being able to retrieve the message id from the server real-time, we generate it here.
    const userMessageId = uuidv4();
    const assistantMessageId = uuidv4();

    // If chat is not new OR user is not logged in
    // We can update state inmediately
    if (chatId || !session.data?.user) {
      setMessages([
        ...messages,
        {
          content: newMessage,
          role: 'user',
          createdAt: new Date(),
          id: userMessageId,
          chatId: chatId as string,
        },
      ]);
    }
    // If chat is new AND user is logged in
    // We await for the chat to be created
    if (!chatId && session.data?.user) {
      chatId = await addChat(newMessage);
    }

    const userMessage: Message = {
      content: newMessage,
      role: 'user',
      createdAt: new Date(),
      id: userMessageId,
      chatId: chatId as string,
    };

    try {
      const reader = await _postMessageStreamed(
        [...messages, userMessage],
        chatId as string
      );
      const read = () => {
        reader?.read().then(({ done, value }) => {
          if (done) {
            // Stream has been read
            setIsSendingMessage(false);
            return;
          }
          // Concatenate the chunk of data in `value` to `content`
          content += new TextDecoder('utf-8').decode(value);
          setMessages([
            ...messages,
            userMessage,
            {
              content,
              role: 'assistant',
              createdAt: new Date(),
              id: assistantMessageId,
              chatId: chatId as string,
            },
          ]);
          // Read the next chunk of data recursively
          read();
        });
      };

      // Update the content of the message as we receive it
      let content = '';
      setMessages([
        ...messages,
        userMessage,
        {
          content: '...',
          role: 'assistant',
          createdAt: new Date(),
          id: assistantMessageId,
          chatId: chatId as string,
        },
      ]);

      // Start reading the stream
      read();
    } catch (error) {
      setIsSendingMessage(false);
      setError('Error sending message');
    }
  };

  return {
    messages,
    isSendingMessage,
    sendMessage,
    error,
  };
};

const _postMessageStreamed = async (
  messageHistory: Message[],
  chatId: string
) => {
  const response = await fetch('/api/messages', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      chatId,
      messages: messageHistory,
    }),
  });

  if (response.status !== 200) {
    throw new Error('Error');
  }

  return response?.body?.getReader();
};

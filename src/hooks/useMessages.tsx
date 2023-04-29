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
  const sendMessage = async (message: string) => {
    // Dont allow to send message if already sending
    if (isSendingMessage) return;
    _postMessage({
      newMessage: message,
      chatId,
      session,
      messages,
      setMessages,
      setIsSendingMessage,
      addChat,
      setError,
    });
  };

  return {
    messages,
    isSendingMessage,
    sendMessage,
    error,
  };
};

const _postMessage = async ({
  newMessage,
  chatId,
  session,
  messages,
  setMessages,
  addChat,
  setError,
  setIsSendingMessage,
}: {
  newMessage: string;
  chatId: string | undefined;
  session: any;
  messages: Message[];
  setMessages: (messages: Message[]) => void;
  addChat: (message: string) => Promise<string>;
  setError: (error: string) => void;
  setIsSendingMessage: (isSendingMessage: boolean) => void;
}) => {
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

  // We create the message object
  const userMessage: Message = {
    content: newMessage,
    role: 'user',
    createdAt: new Date(),
    id: userMessageId,
    chatId: chatId as string,
  };

  try {
    // response is streamed
    const response = await fetch('/api/messages', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        chatId,
        messages: [...messages, userMessage],
      }),
    });

    if (response.status !== 200) {
      throw new Error('Error');
    }

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
    const reader = response.body?.getReader();
    let content = '';
    // Append user message to state
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
    // Update the content of the message as we receive it

    // Start reading the stream
    read();
  } catch (error) {
    setIsSendingMessage(false);
    setError('Error sending message');
  }
};

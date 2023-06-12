import { useSession } from 'next-auth/react';
import { useRouter, usePathname } from 'next/navigation';
import { useState } from 'react';
import { useMutation, useQuery } from '@tanstack/react-query';
import { Chat, Session } from '@prisma/client';
import { clientSideQueryClient as queryClient } from '@/components/util/Providers';

export const useChats = () => {
  const { data: session } = useSession();
  const router = useRouter();
  const pathname = usePathname();

  // Get all
  const { data: chats, isLoading: chatsLoading } = useQuery({
    queryKey: ['chats', session?.user.id],
    queryFn: () => _getChats(session as Session | null),
  });

  // Add
  // Use mutate async for it to be possible to await the mutation
  const { mutateAsync: addChat, isLoading: isAddingChat } = useMutation(
    (message: string) => _postChat(message),
    {
      onSuccess: (data) => {
        queryClient.invalidateQueries(['chats']);
        const chatId = data;
        router.push(`/chat/${chatId}`);
      },
    }
  );

  // Delete
  const [deleteChatCurrentId, setDeleteChatCurrentId] = useState<string | null>(
    null
  );
  const { mutateAsync: deleteChat } = useMutation(
    (chatId: string) => _deleteChat(chatId),
    {
      onMutate: (chatId) => {
        setDeleteChatCurrentId(chatId);
      },
      onSuccess: (_, variables) => {
        queryClient.invalidateQueries(['chats']);
        // if deleted chat was active, redirect to /chat
        if (pathname === `/chat/${variables}`) router.push(`/chat`);
      },
      onSettled: () => {
        setDeleteChatCurrentId(null);
      },
    }
  );

  return {
    chats: (chats || []) as Chat[],
    chatsLoading,
    addChat: (message: string) => addChat(message),
    isAddingChat,
    deleteChat: (chatId: string) => deleteChat(chatId),
    deleteChatCurrentId,
  };
};

/* ======================UTILS ====================== */

const CHATS_URL = `/api/chats`;

// Returns chats by userId
// They get automatically filtered by the server
export const _getChats = async (session: Session | null) => {
  try {
    // If no session, return empty array and don't try to fetch
    if (!session) return [];
    const response = await fetch(`${CHATS_URL}`);
    const data = await response.json();
    const chats: Chat[] = data.chats || [];
    return chats;
  } catch (error) {
    console.error(error);
    return [];
  }
};

export const _postChat = async (message: string) => {
  try {
    const response = await fetch(`${CHATS_URL}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ message }),
    });
    const data = await response.json();
    const chatId: string = data.chatId;
    return chatId;
  } catch (error) {
    console.error(error);
    return '';
  }
};

export const _deleteChat = async (chatId: string) => {
  try {
    const response = await fetch(`${CHATS_URL}/${chatId}`, {
      method: 'DELETE',
    });
    return true;
  } catch (error) {
    console.error(error);
    return false;
  }
};

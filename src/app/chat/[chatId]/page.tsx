import { getServerSession, Session } from 'next-auth';
import authOptions from '@/pages/api/auth/[...nextauth]';
import MainComponent from '../../../components/MainComponent/MainComponent';
import { getMessagesByChatId } from '../../../controller/MessageController';
import { getChatsByUserId } from '../../../controller/ChatController';
import { redirect } from 'next/navigation';
import { Message } from '@prisma/client';
import MessageInitializer from '@/store/MessageInitializer';
interface PageProps {
  params: {
    chatId: string;
  };
}

export default async function Page({ params }: PageProps) {
  const { chatId } = params;
  const session: Session | null = await getServerSession(authOptions);

  if (!session) {
    redirect('/chat');
  }
  const initialMessages = await getMessagesByChatId(chatId);

  const initialClientMessages: Message[] = initialMessages.map(
    (message: Message) => {
      return {
        content: message.content,
        createdAt: message.createdAt,
        role: message.role,
        id: message.id,
      } as Message;
    }
  );
  const serializedMessages = JSON.parse(JSON.stringify(initialClientMessages));

  return (
    <>
      <MessageInitializer
        initialMessageData={{
          messages: serializedMessages,
          error: null
        }}
      />
      <MainComponent />
    </>
  );
}

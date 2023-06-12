import Navbar from '@/components/Navbar/Navbar';

import { getServerSession } from 'next-auth';
import { getChatsByUserId } from '@/controller/ChatController';
import { authOptions } from '@/lib/auth';
import getQueryClient from './../../lib/getQueryClient';
import { dehydrate } from '@tanstack/query-core';
import Hydrate from '@/components/util/Hydrate';
export default async function ChatLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await getServerSession(authOptions);
  const queryClient = getQueryClient();
  if (session) {
    await queryClient.prefetchQuery(['chats', session?.user.id], async () => {
      // The chat object has a property of type Date, which is not serializable
      // RSC will warn us if we pass them to the client directly
      // We need to stringify and parse the object as a workaround
      return JSON.parse(
        JSON.stringify(await getChatsByUserId(session?.user.id))
      );
    });
  }

  const dehydratedState = dehydrate(queryClient);

  return (
    <div className='flex h-full w-full '>
      <Hydrate state={dehydratedState}>
        <Navbar />
      </Hydrate>
      {children}
    </div>
  );
}

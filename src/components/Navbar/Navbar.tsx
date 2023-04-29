'use client';

import { signIn, signOut, useSession } from 'next-auth/react';
import getFirstNames from '../../lib/names';
import { LogOut, Menu, Plus, Trash, X } from 'lucide-react';
import { Loader2, MessageSquare } from 'lucide-react';
import { useState } from 'react';
import { Chat } from '@prisma/client';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import clsx from 'clsx';
import { useChats } from '@/hooks/useChats';
import Image from 'next/image';
import IconButton from '../ui/IconButton';

export default function Navbar() {
  const { chats } = useChats();
  const [isOpen, setIsOpen] = useState(false);

  return (
    <>
      <IconButton
        variant='bordered'
        onClick={() => setIsOpen(!isOpen)}
        className='fixed top-8 left-8'
      >
        <Menu />
      </IconButton>

      <IconButton
        variant='bordered'
        className={clsx(
          'fixed left-[260px] top-8',
          isOpen ? 'block' : 'hidden'
        )}
        onClick={() => setIsOpen(!isOpen)}
      >
        <X />
      </IconButton>
      <div
        className={clsx(
          'flex flex-col items-center justify-start  w-[250px] shrink-0 bg-gray-800 px-2 pb-5 pt-0 md:px-3 transition-all duration-300 ease-in-out fixed md:block h-full md:trangray-x-0 md:static shadow-lg md:shadow-sm overflow-auto max-h-full',
          isOpen ? 'translate-x-0' : '-translate-x-[120%] md:translate-x-0'
        )}
      >
        <div className='flex flex-col gap-2 sticky top-0 bg-gray-800 z-10 pt-5 pb-3 w-full'>
          <AuthCard />
          <Link href='/chat' onClick={() => setIsOpen(false)}>
            <div
              className={clsx(
                'border-white/20 border rounded-md px-3 py-3 gap-2 self-stretch hover:shadow-lg hover:shadow-white/10 transition-all duration-75 flex'
              )}
            >
              <Plus className='w-6 h-6 text-gray-100' />
              <span>Create new chat</span>
            </div>
          </Link>
        </div>
        <div className='w-full mt-2'>
          <div className='flex flex-col gap-2 w-full'>
            {chats.map((chat) => (
              <ChatCard chat={chat} key={chat.id} />
            ))}
          </div>
        </div>
      </div>
    </>
  );
}

{
  status === 'unauthenticated' && (
    <button
      className='border-white/20 border font-bold flex gap-2 text-sm items-center p-2 rounded-md w-full hover:shadow-lg hover:shadow-white/10'
      onClick={() => {
        signIn('google');
      }}
    >
      <Image
        src='/google-icon.png'
        alt=''
        referrerPolicy='no-referrer'
        width={30}
        height={30}
      />
      Sign in with Google
    </button>
  );
}

const AuthCard = () => {
  const { data: session, status } = useSession();

  return status === 'authenticated' ? (
    <div className='flex p-2 items-center justify-start w-full border border-white/20 rounded-md shrink-0 gap-2'>
      <div className='flex items-center justify-center shrink-0 rounded-full'>
        <Image
          src={session?.user?.image || 'null'}
          alt=''
          referrerPolicy='no-referrer'
          width={30}
          height={30}
        />
      </div>
      <div>{getFirstNames(session?.user?.name || '', 1)}</div>
      <IconButton
        className='ml-auto'
        onClick={() => {
          signOut();
        }}
      >
        <LogOut />
      </IconButton>
    </div>
  ) : (
    <button
      className='border-white/20 border font-bold flex gap-2 text-sm items-center p-2 rounded-md w-full hover:shadow-lg hover:shadow-white/10'
      onClick={() => {
        signIn('google');
      }}
    >
      <Image
        src='/google-icon.png'
        alt=''
        referrerPolicy='no-referrer'
        width={30}
        height={30}
      />
      Sign in with Google
    </button>
  );
};
const ChatCard = ({ chat }: { chat: Chat }) => {
  const currentChatId = usePathname()?.split('/')[2];
  const { deleteChat, deleteChatCurrentId } = useChats();
  return (
    <Link href={`/chat/${chat.id}`} key={chat.id}>
      <div
        className={clsx(
          'flex items-center justify-start rounded-md px-3 py-2 gap-2 self-stretch  active:scale-[0.99] scaletransition-all duration-75 text-sm whitespace-nowrap overflow-hidden relative border-white/20 hover:border-white/70 border',
          currentChatId === chat.id && 'bg-gray-900'
        )}
      >
        <div
          className={clsx(
            'absolute -right-1 w-14 h-full bg-gradient-to-l  to-transparent',
            currentChatId === chat.id
              ? 'from-gray-900 via-gray-900'
              : 'from-gray-800 via-gray-800'
          )}
        ></div>
        <MessageSquare className='w-5 h-5 text-gray-100 flex-shrink-0' />
        <span>{chat.name}</span>

        {deleteChatCurrentId === chat.id ? (
          <Loader2 className='w-5 h-5 text-gray-100 flex-shrink-0 absolute right-2 animate-spin' />
        ) : (
          <Trash
            className='w-5 h-5 text-gray-100 flex-shrink-0 absolute right-2'
            onClick={(e) => {
              e.preventDefault();
              e.stopPropagation();
              deleteChat(chat.id);
            }}
          />
        )}
      </div>
    </Link>
  );
};

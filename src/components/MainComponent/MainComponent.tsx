'use client';

import ChatInput from '@/components/MainComponent/ChatInput';
import MessagesContainer from '@/components/MainComponent/MessagesContainer';
export default function MainComponent() {
  return (
    <div className='flex flex-col w-full md:w-[calc(100%-250px)]'>
      <MessagesContainer />
      <ChatInput />
    </div>
  );
}

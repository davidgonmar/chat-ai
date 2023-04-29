import React, { useEffect, useRef } from 'react';
import Message from '@/components/MainComponent/Message';
import ErrorContainer from './ErrorContainer';
import { useMessages } from '@/hooks/useMessages';

export default function MessagesContainer() {
  const { messages, error } = useMessages();
  const messagesContainerRef = useRef<HTMLDivElement>(null);
  // scroll to bottom on new message
  useEffect(() => {
    if (messagesContainerRef.current) {
      messagesContainerRef.current.scrollTop =
        messagesContainerRef.current.scrollHeight;
    }
  }, [messages, error]);
  return (
    <div
      className='flex flex-col overflow-y-auto h-full mb-auto flex-grow'
      ref={messagesContainerRef}
    >
      {messages.map((message, index) => (
        <Message key={index} {...message} />
      ))}
      {error && <ErrorContainer content={error} />}
    </div>
  );
}

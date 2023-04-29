'use client';

import { useEffect } from 'react';
import { useMessageStore } from './store';
import { MessageStore } from './store';

interface MessageInitializerProps {
  initialMessageData: Partial<MessageStore>;
}

// Component used to initialize the message store with data from the server
export default function MessageInitializer({
  initialMessageData,
}: MessageInitializerProps) {
  useEffect(() => {
    useMessageStore.setState(initialMessageData);
  }, [initialMessageData]);

  return null;
}

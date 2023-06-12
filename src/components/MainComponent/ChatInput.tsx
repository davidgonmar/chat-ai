'use client';

import { Send } from 'lucide-react';
import { useRef, useState } from 'react';
import IconButton from '../ui/IconButton';
import { useMessages } from '@/hooks/useMessages';

export default function ChatInput() {
  const [inputText, setInputText] = useState('');
  const { sendMessage, isSendingMessage } = useMessages();

  // Auto resize textarea
  const textAreaRef = useRef<HTMLTextAreaElement>(null);
  const handleTextAreaChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const textarea = document.querySelector('textarea');
    if (textarea) {
      textarea.style.height = 'auto';
      textarea.style.height = textarea.scrollHeight + 'px';
    }
    setInputText(e.target.value);
  };

  // New mesage submit
  const handleMessageSubmit = () => {
    if (inputText.trim() === '') return;
    sendMessage(inputText);
    setInputText('');
  };

  return (
    <div className='py-4 md:py-8 chat-container bg-transparent'>
      <div className='flex items-center bg-slate-800 rounded-md p-2 pl-4 shadow-lg gap-2'>
        <textarea
          ref={textAreaRef}
          value={inputText}
          onChange={handleTextAreaChange}
          className='w-full bg-transparent outline-none resize-none overflow-hidden'
          rows={1}
          onKeyDown={(e) => {
            if (e.key === 'Enter') {
              e.preventDefault();
              handleMessageSubmit();
            }
          }}
        />
        <IconButton
          onClick={handleMessageSubmit}
          disabled={inputText.trim() === '' || isSendingMessage}
        >
          <Send />
        </IconButton>
      </div>
    </div>
  );
}

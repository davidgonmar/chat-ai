import React from 'react';
import { Bot, User } from 'lucide-react';
import { ReactMarkdown } from 'react-markdown/lib/react-markdown';
import { code } from '../ui/CodeBox';
import { Message as IMessage } from '@prisma/client';

interface MessageProps extends IMessage {}

export default function Message({ content, role }: MessageProps) {
  return (
    <div
      className={`max-w-full ${
        role === 'assistant' ? 'bg-slate-900' : 'bg-slate-800'
      }`}
    >
      <div className='flex items-start gap-2 py-4 chat-container'>
        <div className='p-2 bg-slate-700 rounded-md'>
          {role === 'assistant' ? <Bot /> : <User />}
        </div>
        <div className='w-[calc(100%-50px)] flex'>
          <ReactMarkdown
            className='text-white w-full leading-relaxed font-normal break-words'
            components={{
              code: code,
            }}
          >
            {content}
          </ReactMarkdown>
        </div>
      </div>
    </div>
  );
}

import { NextRequest, NextResponse } from 'next/server';
import { OpenAIApi } from 'openai';
import { Configuration } from 'openai/dist/configuration';
import { Readable } from 'stream';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { createMessage } from '@/controller/MessageController';
import { getChatById } from '@/controller/ChatController';
import { Message } from '@prisma/client';

interface ExpectedBody {
  messages: Message[];
  chatId: string;
}

// trims messages to about 'maxTokens' words
function trimMessages(messages: Message[], maxTokens: number = 2000) {
  let tokenCount = 0;
  let index = messages.length - 1;

  while (index >= 0 && tokenCount < maxTokens) {
    const message = messages[index];
    const contentTokens = message.content.split(' ').length;
    tokenCount += contentTokens;
    index--;
  }

  // Return the sublist of messages that have been visited so far
  return messages.slice(index + 1);
}

export async function POST(req: NextRequest, res: Response) {
  try {
    let { messages, chatId } = (await req.json()) as ExpectedBody;
    const session = await getServerSession(authOptions);

    // Check that chat belongs to user. If no chatId it means user is not logged in, which is fine, but messages will not be saved
    if (chatId) {
      const chatUserId = (await getChatById(chatId))?.userId;
      if (!chatUserId || chatUserId !== session?.user.id) {
        return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
      }
    }

    // Initialize OpenAI
    const openai = new OpenAIApi(
      new Configuration({ apiKey: process.env.OPENAI_API_KEY })
    );

    // Trim messages to about 2000 words to be safe
    const messagesTrimmed = trimMessages(messages, 2000);
    // Create messages for send
    const messagesForSend = messagesTrimmed.map((message) => ({
      role: message.role,
      content: message.content,
    }));

    // Create chat completion
    const completion = await openai.createChatCompletion(
      {
        model: 'gpt-3.5-turbo',
        messages: [
          {
            role: 'system',
            content:
              'You are an AI assistant. This is the conversation. Always make sure to include the language after the ``` if you are providing code',
          },
          ...messagesForSend,
        ],
        stream: true,
      },
      {
        responseType: 'stream',
      }
    );

    // Stream data to client as it comes in
    const encoder = new TextEncoder();
    const completionData = completion.data as unknown as Readable;
    // Accum for total message
    let totalMessage = '';
    const stream = new ReadableStream({
      start(controller) {
        completionData.on('data', (chunk) => {
          const lines: string[] = chunk
            .toString('utf8')
            .split('\n')
            .filter((line: string) => line.trim().startsWith('data: '));
          for (const line of lines) {
            // Parse message. If message is [DONE], close stream
            const message = line.replace(/^data: /, '');
            if (message === '[DONE]') {
              return;
            }
            const json = JSON.parse(message);
            const content = json.choices[0].delta.content || '';
            if (content) {
              totalMessage += content;
              controller.enqueue(encoder.encode(content));
            }
          }
        });
        completionData.on('end', async () => {
          if (chatId) {
            //  create message from user
            await createMessage(
              chatId,
              messages[messages.length - 1].content,
              'user'
            );
            // // create message from assistant
            await createMessage(chatId, totalMessage, 'assistant');
          }
          // close stream
          controller.close();
        });
      },
    });

    return new Response(stream);
  } catch (e: any) {
    console.log(e);
    return NextResponse.json(
      { error: e.message || 'Something went wrong' },
      { status: 500 }
    );
  }
}

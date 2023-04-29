import { NextRequest, NextResponse } from 'next/server';
import { createChat, getChatsByUserId } from '@/controller/ChatController';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { Configuration, OpenAIApi } from 'openai';
import { z } from 'zod';

const PostSchema = z.object({
  message: z.string(),
});

export async function POST(req: NextRequest) {
  try {
    // Check auth
    const session = await getServerSession(authOptions);
    const userId = session?.user.id;
    if (!userId)
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

    const { message } = await req.json();

    // Validate request body against schema
    const { success } = PostSchema.safeParse({ message });
    if (!success)
      return NextResponse.json({ error: 'Bad request' }, { status: 400 });

    const openai = new OpenAIApi(
      new Configuration({ apiKey: process.env.OPENAI_API_KEY })
    );

    // Create title
    const completion = await openai.createChatCompletion({
      model: 'gpt-3.5-turbo',
      messages: [
        {
          role: 'user',
          content:
            'This is the first message of the conversation. You should come up with a title of the conversation. ONLY answer with the title, and if it is absolutely impossible to create one because the content is illegible, use "New chat". Message: ' +
            message,
        },
      ],
    });
    const title = completion?.data?.choices[0]?.message?.content;
    if (!title) throw new Error('Title could not be generated');

    // Create chat
    const chatId = (await createChat(userId, title)).id;
    if (!chatId) throw new Error('Chat could not be created');

    return NextResponse.json({ chatId });
  } catch (error: any) {
    console.log(error);
    return NextResponse.json(
      { error: error?.message || 'Something went wrong' },
      { status: 500 }
    );
  }
}

export async function GET(req: NextRequest) {
  try {
    // Check session
    const session = await getServerSession(authOptions);
    const userId = session?.user.id;
    if (!userId)
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

    const chats = await getChatsByUserId(userId);
    return NextResponse.json({ chats });
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { error: 'Something went wrong' },
      { status: 500 }
    );
  }
}

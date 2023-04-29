import { deleteChat, getChatById } from '@/controller/ChatController';
import { authOptions } from '@/lib/auth';
import { getServerSession } from 'next-auth';
import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';

const DeleteSchema = z.object({
  chatId: z.string(),
});
export async function DELETE(
  req: NextRequest,
  { params }: { params: { chatId: string } }
) {
  try {
    // Validate request body against schema
    const { success } = DeleteSchema.safeParse(params);
    if (!success)
      return NextResponse.json({ error: 'Bad request' }, { status: 400 });

    // Can only delete their own chats
    const session = await getServerSession(authOptions);
    const chatInfo = await getChatById(params.chatId);
    if (!session || !chatInfo || chatInfo.userId !== session.user.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }
    const deletedChat = await deleteChat(params.chatId);
    return NextResponse.json({ deletedChat });
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { error: 'Something went wrong' },
      { status: 500 }
    );
  }
}

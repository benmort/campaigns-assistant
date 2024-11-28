interface Message {
  role: string;
  content: string;
}

import { models } from '@/lib/ai/models';
import { createTextStream } from '@/lib/ai/stream-text'
import { auth } from '@/app/(auth)/auth';
import {
  deleteChatById,
  getChatById,
  saveChat,
  saveMessages,
} from '@/lib/db/queries';

import {
  generateUUID,
  getMostRecentUserMessage,
} from '@/lib/utils';

import { generateTitleFromUserMessage } from '../../actions';

export async function POST(request: Request) {
  const {
    id,
    messages,
    modelId,
    rag
  }: { id: string; messages: Message[]; modelId: string, rag: boolean } =
    await request.json();

  const session = await auth();

  if (!session || !session.user || !session.user.id) {
    return new Response('Unauthorized', { status: 401 });
  }

  const model = models.find((model) => model.id === modelId);

  if (!model) {
    return new Response('Model not found', { status: 404 });
  }

  const userMessage = getMostRecentUserMessage(messages as any);

  if (!userMessage) {
    return new Response('No user message found', { status: 400 });
  }

  const chat = await getChatById({ id });

  if (!chat) {
    const title = await generateTitleFromUserMessage({ message: userMessage });
    await saveChat({ id, userId: session.user.id, title });
  }

  await saveMessages({
    messages: [
      { ...userMessage, id: generateUUID(), createdAt: new Date(), chatId: id },
    ],
  });

  const result = await createTextStream(
    id,
    model,
    modelId,
    userMessage as any,
    messages,
    session as any,
    rag
  )

  /* >> to replace below if needed
  return result.toDataStreamResponse({
    data: streamingData,
  */

  return result.textStream.toDataStreamResponse({
    data: result.dataStream,
  });
}

export async function DELETE(request: Request) {
  const { searchParams } = new URL(request.url);
  const id = searchParams.get('id');

  if (!id) {
    return new Response('Not Found', { status: 404 });
  }

  const session = await auth();

  if (!session || !session.user) {
    return new Response('Unauthorized', { status: 401 });
  }

  try {
    const chat = await getChatById({ id });

    if (chat.userId !== session.user.id) {
      return new Response('Unauthorized', { status: 401 });
    }

    await deleteChatById({ id });

    return new Response('Chat deleted', { status: 200 });
  } catch (error) {
    return new Response('An error occurred while processing your request', {
      status: 500,
    });
  }
}

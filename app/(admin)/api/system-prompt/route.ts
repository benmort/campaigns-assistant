import { auth } from '@/app/(auth)/auth';
import { getSystemPrompt, updateSystemPrompt } from '@/lib/db/queries';

export async function GET(request: Request) {
  const session = await auth();

  if (!session || !session.user) {
    return new Response('Unauthorized', { status: 401 });
  }

  try {
    const systemPrompt = await getSystemPrompt();
    return Response.json(systemPrompt, { status: 200 });
  } catch (error) {
    console.error('Failed to retrieve SystemPrompt:', error);
    return new Response('Internal Server Error', { status: 500 });
  }
}

export async function PUT(request: Request) {
  const session = await auth();

  if (!session || !session.user) {
    return new Response('Unauthorized', { status: 401 });
  }

  try {
    const { content } = await request.json();

    if (!content) {
      return new Response('Content is required', { status: 400 });
    }

    const updatedPrompt = await updateSystemPrompt(content);
    return Response.json(updatedPrompt, { status: 200 });
  } catch (error) {
    console.error('Failed to update SystemPrompt:', error);
    return new Response('Internal Server Error', { status: 500 });
  }
}

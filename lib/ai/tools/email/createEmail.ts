import { streamText } from 'ai';
import { z } from 'zod';

import { customModel } from '@/lib/ai';
import { saveDocument } from '@/lib/db/queries';
import { generateUUID } from '@/lib/utils';

import type { Tool } from '../index'

const createDocument: Tool = {
  description: 'Create a document for a writing activity',
  parameters: z.object({
    title: z.string(),
  }),
  execute
}

export default createDocument;

import type { ExecutionContext } from '@/lib/ai/tools'

async function execute(parameters: Record<string, any>, options: Record<string, any>, executionContext: ExecutionContext) {
  const { title } = parameters
  const { streamingData, model, session, rag } = executionContext

  const id = generateUUID();

  let draftText = '';

  streamingData.append({
    type: 'id',
    content: id,
  });

  streamingData.append({
    type: 'title',
    content: title,
  });

  streamingData.append({
    type: 'clear',
    content: '',
  });

  const { fullStream } = await streamText({
    model: customModel(model.apiIdentifier),
    system:
      'Write about the given topic. Markdown is supported. Use headings wherever appropriate.',
    prompt: title,
  });

  for await (const delta of fullStream) {
    const { type } = delta;

    if (type === 'text-delta') {
      const { textDelta } = delta;

      draftText += textDelta;
      streamingData.append({
        type: 'text-delta',
        content: textDelta,
      });
    }
  }

  streamingData.append({ type: 'finish', content: '' });

  if (session.user?.id) {
    await saveDocument({
      id,
      title,
      content: draftText,
      userId: session.user.id,
    });
  }

  return {
    id,
    title,
    content: `A document was created and is now visible to the user.`,
  };
}
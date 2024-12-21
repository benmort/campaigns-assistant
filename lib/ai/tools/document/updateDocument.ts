import { streamText } from 'ai';
import { z } from 'zod';

import { customModel } from '@/lib/ai';
import { getDocumentById, saveDocument } from '@/lib/db/queries';

import type { Tool } from '../index'

const updateDocument: Tool = {
  description: 'Update a document with the given description',
  parameters: z.object({
    id: z.string().describe('The ID of the document to update'),
    description: z
      .string()
      .describe('The description of changes that need to be made'),
  }),
  execute
}

export default updateDocument;

import type { ExecutionContext } from '@/lib/ai/tools'

async function execute(parameters: Record<string, any>, options: Record<string, any>, executionContext: ExecutionContext) {
  const { id, description } = parameters
  const { streamingData, model, session, rag } = executionContext

  const document = await getDocumentById({ id });

  if (!document) {
    return {
      error: 'Document not found',
    };
  }

  const { content: currentContent } = document;
  let draftText = '';

  streamingData.append({
    type: 'clear',
    content: document.title,
  });

  const { fullStream } = await streamText({
    model: customModel(model.apiIdentifier),
    system:
      'You are a helpful writing assistant. Based on the description, please update the piece of writing.',
    experimental_providerMetadata: {
      openai: {
        prediction: {
          type: 'content',
          content: currentContent,
        },
      },
    },
    messages: [
      {
        role: 'user',
        content: description,
      },
      { role: 'user', content: currentContent },
    ],
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
      title: document.title,
      content: draftText,
      userId: session.user.id,
    });
  }

  return {
    id,
    title: document.title,
    content: 'The document has been updated successfully.',
  };
}

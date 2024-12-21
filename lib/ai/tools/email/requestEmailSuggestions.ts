import { streamObject } from 'ai';
import { z } from 'zod';

import { customModel } from '@/lib/ai';
import { getDocumentById, saveSuggestions } from '@/lib/db/queries';
import { generateUUID } from '@/lib/utils';

import {
  type Suggestion
} from '@/lib/db/schema';

import type { Tool } from '../index'

const requestSuggestions: Tool = {
  description: 'Request suggestions for a document',
  parameters: z.object({
    documentId: z
      .string()
      .describe('The ID of the document to request edits'),
  }),
  execute
}

export default requestSuggestions;

import type { ExecutionContext } from '@/lib/ai/tools'

async function execute(parameters: Record<string, any>, options: Record<string, any>, executionContext: ExecutionContext) {
  const { documentId } = parameters
  const { streamingData, model, session, rag } = executionContext

  const document = await getDocumentById({ id: documentId });

  if (!document || !document.content) {
    return {
      error: 'Document not found',
    };
  }

  const suggestions: Array<
    Omit<Suggestion, 'userId' | 'createdAt' | 'documentCreatedAt'>
  > = [];

  const { elementStream } = await streamObject({
    model: customModel(model.apiIdentifier),
    system:
      'You are a help writing assistant. Given a piece of writing, please offer suggestions to improve the piece of writing and describe the change. It is very important for the edits to contain full sentences instead of just words. Max 5 suggestions.',
    prompt: document.content,
    output: 'array',
    schema: z.object({
      originalSentence: z.string().describe('The original sentence'),
      suggestedSentence: z.string().describe('The suggested sentence'),
      description: z
        .string()
        .describe('The description of the suggestion'),
    }),
  });

  for await (const element of elementStream) {
    const suggestion = {
      originalText: element.originalSentence,
      suggestedText: element.suggestedSentence,
      description: element.description,
      id: generateUUID(),
      documentId: documentId,
      isResolved: false,
    };

    streamingData.append({
      type: 'suggestion',
      content: suggestion,
    });

    suggestions.push(suggestion);
  }

  if (session.user?.id) {
    const userId = session.user.id;

    await saveSuggestions({
      suggestions: suggestions.map((suggestion) => ({
        ...suggestion,
        userId,
        createdAt: new Date(),
        documentCreatedAt: document.createdAt,
      })),
    });
  }

  return {
    id: documentId,
    title: document.title,
    message: 'Suggestions have been added to the document',
  };
}

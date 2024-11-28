interface ExtendedSession extends Session {
  user: {
    id: string;
    name?: string;
    email?: string;
    image?: string;
  };
}

interface UserMessage {
  role: string;
  content: string;
}

interface Model {
  id: string;
  apiIdentifier: string;
}

import type { ExecutionContext } from '@/lib/ai/tools'

import {
  convertToCoreMessages,
  StreamData,
  streamText
} from 'ai';
import type { Session } from "next-auth";

import { customModel } from '@/lib/ai';
import { generateMessageEmbeddings } from "@/lib/ai/embeddings";
import { getQueryDocuments } from "@/lib/ai/pinecone";
import { createSystemPrompt, prependSystemPrompt } from '@/lib/ai/prompts';
import { summariseContext } from "@/lib/ai/summarisation";
import { allActiveTools, allTools } from '@/lib/ai/tools'

import {
  saveMessages,
} from '@/lib/db/queries';
import {
  generateUUID,
  sanitizeResponseMessages,
} from '@/lib/utils';

async function generateSummarisedContext(userMessage: UserMessage, messages: UserMessage[]) {
  // Generate embedding for the query
  const queryEmbedding = await generateMessageEmbeddings(userMessage, messages);
  // Retrieve relevant documents from Pinecone
  const queryDocuments = await getQueryDocuments(queryEmbedding)
  // Summarize or select key points
  const summarisedContext = await summariseContext(queryDocuments)
  return summarisedContext
}

export async function createTextStream(
  id: string,
  model: Model,
  modelId: string,
  userMessage: UserMessage,
  messages: UserMessage[],
  session: ExtendedSession,
  rag: boolean
){
  const streamingData = new StreamData();
  const maxSteps = 5;

  let summarisedContext = null;
  // If RAG is enabled, augment the prompt with retrieved context
  if (rag) {
    summarisedContext = await generateSummarisedContext(userMessage as any, messages as any);
  }

  const systemPrompt = createSystemPrompt(modelId, summarisedContext);
  messages = prependSystemPrompt(systemPrompt, messages)

  const coreMessages = convertToCoreMessages(messages as any);

  // Integrate executionContext with tools
  const toolsWithExecutionContext = Object.entries(allTools).map(([key, value]) => {
    return [
      key,
      {
        ...value,
        execute: async (...args: unknown[]) => {
          try {
            console.log(`Starting Tool > ${key}`);
            const executionContext = { streamingData, model, session, rag }
            const updatedArgs = [...args, executionContext] as [Record<string, any>, Record<string, any>, ExecutionContext]; // Append executionContext to args
            const result = await value.execute(...updatedArgs); // Call the original function
            console.log(`Complete Tool > ${key}`);
            return result
          } catch(error){
            console.error('Tool Execute Error:', error)
          }
        }
      }
    ];
  });

  const extendedAllTools = Object.fromEntries(toolsWithExecutionContext);

  const result = await streamText({
    model: customModel(model.apiIdentifier),
    messages: coreMessages,
    maxSteps,
    experimental_activeTools: allActiveTools,
    tools: extendedAllTools,
    onFinish: (result) => handleOnFinish(result, id, streamingData, session),
    experimental_telemetry: {
      isEnabled: true,
      functionId: 'stream-text',
    },
  });

  return {
    textStream: result,
    dataStream: streamingData
  }
}

async function handleOnFinish(
  result: any,
  id: string,
  streamingData: any,
  session: ExtendedSession
) {

  const { responseMessages } = result;
  if (session.user?.id) {
    try {
      const responseMessagesWithoutIncompleteToolCalls =
        sanitizeResponseMessages(responseMessages);
      await saveMessages({
        messages: responseMessagesWithoutIncompleteToolCalls.map(
          (message) => {
            const messageId = generateUUID();

            if (message.role === 'assistant') {
              streamingData.appendMessageAnnotation({
                messageIdFromServer: messageId,
              });
            }

            return {
              id: messageId,
              chatId: id,
              role: message.role,
              content: message.content,
              createdAt: new Date(),
            };
          }
        ),
      });
    } catch (error) {
      console.error('Failed to save chat:', error);
    }
  }

  streamingData.close();
}

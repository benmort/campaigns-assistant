import { documentPrompt } from './document'
import { weatherPrompt } from './weather'

export interface FewShot {
  question: string;
  answer: string;
}

interface Message {
  role: string;
  content: string;
}

const toolsPromptTemplate = `
  ### Tool Identification Block:
  You have access to 20+ specialized tools, each designed for specific tasks. 
  Based on the user's request, identify which tool is most suitable and explain why it fits the task.
  ### Switching Command Block:
  If the user's goal changes or a specific tool is not adequate, seamlessly switch to another tool. 
  Maintain continuity by preserving key details from the previous interaction.
  ### Task Execution Block:
  You are now using [Tool Name]. Perform the following task: [Detailed User Input].
  ### Error Handling Block:
  If the selected tool cannot complete the task, return to the Tool Identification Block and suggest alternatives.
`

// Create a structured prompt with optional examples
export function createSystemPrompt(modelId: string, summarisedContext: string) {
  const prompt = `
    ## Context
    ${summarisedContext}

    ## Context Instructions
    Use the context above to answer the following question concisely.

    ## Templated System Prompt Instructions
    ${toolsPromptTemplate}
    ${documentPrompt}
    ${weatherPrompt}
  `;

  return prompt;
}

export function prependSystemPrompt(systemPrompt: string, messages: Message[]) {
  const systemMessage = { role: "system", content: systemPrompt };
  return [systemMessage, ...messages]
}

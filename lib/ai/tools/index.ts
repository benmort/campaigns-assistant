import { documentTools } from './document'
import { weatherTools } from './weather'

export interface ExecutionContext {
  streamingData: any;
  model: any;
  session: any;
  rag: any;
}

export interface Tool {
  description: string;
  parameters: Record<string, any>;
  execute: (
    parameters: Record<string, any>, 
    options: Record<string, any>, 
    executionContext: ExecutionContext
  ) => Promise<any>;
}

type AllowedTools =
  | 'createDocument'
  | 'updateDocument'
  | 'requestSuggestions'
  | 'getWeather';

const allActiveTools: AllowedTools[] = [
  'createDocument',
  'updateDocument',
  'requestSuggestions',
  'getWeather'
];

const allTools = Object.assign(
  documentTools,
  weatherTools
)

export {
  allActiveTools,
  allTools
}

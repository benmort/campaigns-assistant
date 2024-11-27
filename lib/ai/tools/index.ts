import { documentTools } from './document'
import { weatherTools } from './weather'

export interface Tool {
  description: string;
  parameters: Record<string, any>;
  execute: (args: Record<string, any>) => Promise<any>;
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

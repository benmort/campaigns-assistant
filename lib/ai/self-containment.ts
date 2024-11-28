import localesCombined from '@/lib/i18n/locales-combined';
import { getLocalesArray } from '@/lib/utils';

interface UserMessage {
  role: string;
  content: string;
}

// Dynamically infer the Language type from getLocalesArray
const locales = getLocalesArray(); // Ensure this function returns a readonly array or a concrete list
type Language = (typeof locales)[number]; // Extract the type of elements in the array

interface LanguageConfig {
  dependentKeywords: string[];
  unresolvedReferences: string[];
  questionWords: string[];
  dependentPunctuation: string[];
  temporalKeywords: string[];
}

const languageConfigs: Record<Language, LanguageConfig> = Object.fromEntries(
  Object.entries(localesCombined).map(([key, value]) => [
    key,
    value.ai_context_indicators,
  ])
) as Record<Language, LanguageConfig>;

export async function isSelfContained(
  userMessage: UserMessage,
  messages: UserMessage[] = [],
  language: Language = "en",
  approach = "simplistic"
): Promise<boolean> {
  const message = userMessage.content;

  if (approach === "simplistic") {
    return message.endsWith("?") || message.length > 50;
  }

  const priorMessages = messages.map(msg => msg.content).join(" ");
  let score = 0;
  const threshold = 3;

  score += dependencyAnalysis(message, language);
  score += referenceResolution(message, language);
  score += logicalCompleteness(message, language);
  score += punctuationAndStructure(message, language);
  score += temporalDependency(message, language);
  /* Complex functions with external dependancies
    - update threshold value when these uncommented */
  //score += await semanticSimilarity(message, priorMessages);
  //score += dependencyParsing(message);
  //score += sentimentShift(message, priorMessages);
  //score += topicSimilarity(message, priorMessages);

  return score >= threshold; // Threshold for determining self-containment
}

function dependencyAnalysis(message: string, language: Language): number {
  const weight = 1;
  const config = languageConfigs[language];
  return !config.dependentKeywords.some(keyword => message.toLowerCase().includes(keyword)) ? weight : 0;
}

function referenceResolution(message: string, language: Language): number {
  const weight = 1;
  const config = languageConfigs[language];
  const words = message.toLowerCase().split(/\s+/);
  return !words.some(word => config.unresolvedReferences.includes(word)) ? weight : 0;
}

function logicalCompleteness(message: string, language: Language): number {
  const weight = 1;
  const config = languageConfigs[language];
  const hasQuestionWord = config.questionWords.some(word => message.toLowerCase().startsWith(word));
  const hasClearIntent = message.includes("?") || message.includes("please");
  return hasQuestionWord && hasClearIntent ? weight : 0;
}

function punctuationAndStructure(message: string, language: Language): number {
  const weight = 1;
  const config = languageConfigs[language];
  return !config.dependentPunctuation.some(punct => message.includes(punct)) ? weight : 0;
}

function temporalDependency(message: string, language: Language): number {
  const weight = 1;
  const config = languageConfigs[language];
  return !config.temporalKeywords.some(word => message.toLowerCase().includes(word)) ? weight : 0;
}

/*
async function semanticSimilarity(message: string, priorMessages: string, language: Language): Promise<number> {
  const weight = 1;
  const similarity = await calculateSemanticSimilarity(message, priorMessages, language); // Add language parameter
  return similarity < 0.5 ? weight : 0;
}

function dependencyParsing(message: string, language: Language): number {
  const weight = 1;
  return parseSentenceStructure(message, language) ? weight : 0;
}

function sentimentShift(message: string, priorMessages: string, language: Language): number {
  const weight = 1;
  const currentSentiment = analyzeSentiment(message, language);
  const previousSentiment = analyzeSentiment(priorMessages, language);
  const sentimentDifference = Math.abs(currentSentiment - previousSentiment);

  return sentimentDifference < 0.5 ? weight : 0;
}

function topicSimilarity(message: string, priorMessages: string, language: Language): number {
  const weight = 1;
  const currentTopic = extractTopic(message, language);
  const priorTopic = extractTopic(priorMessages, language);

  return currentTopic !== priorTopic ? weight : 0;
}
*/

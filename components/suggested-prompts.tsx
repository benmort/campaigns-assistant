import type { Message, CreateMessage, ChatRequestOptions } from "ai";
import { motion } from "framer-motion";
import { useTranslations } from 'next-intl';

import { Button } from './ui/button';

interface SuggestedPromptProps {
  chatId: string;
  index: number;
  suggestedPromptsKey: string;
  append: (
    message: Message | CreateMessage,
    chatRequestOptions?: ChatRequestOptions
  ) => Promise<string | null | undefined>;
}

const SuggestedPrompt = ({ chatId, suggestedPromptsKey, index, append }: SuggestedPromptProps) => {
  const suggested_prompts = useTranslations('suggested_prompts');
  const title = suggested_prompts(`${suggestedPromptsKey}.title`)
  const label = suggested_prompts(`${suggestedPromptsKey}.label`)
  const action = suggested_prompts(`${suggestedPromptsKey}.action`)

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: 20 }}
      transition={{ delay: 0.05 * index }}
      key={`suggested-action-${title}-${index}`}
      className={index > 1 ? "hidden sm:block" : "block"}
    >
      <Button
        variant="ghost"
        onClick={async () => {
          window.history.replaceState({}, '', `/chat/${chatId}`);

          append({
            role: 'user',
            content: action,
          });
        }}
        className="text-left border rounded-xl px-4 py-3.5 text-sm flex-1 gap-1 sm:flex-col w-full h-auto justify-start items-start"
      >
        <span className="font-medium text-wrap">
          { title }
        </span>
        <span className="text-muted-foreground text-wrap">
          { label }
        </span>
      </Button>
    </motion.div>
  );
};

interface SuggestedPromptsProps {
  chatId: string;
  append: (
    message: Message | CreateMessage,
    chatRequestOptions?: ChatRequestOptions
  ) => Promise<string | null | undefined>;
}

export const SuggestedPrompts = ({ chatId, append }: SuggestedPromptsProps) => {
  const suggestedPromptsKeys = [
    'strategic_campaign',
    'social_toolkit',
    'volunteer_mobilisation',
    'standard_campaign',
  ] as const;

  return (
    <div className="grid sm:grid-cols-2 gap-2 w-full text-wrap">
      {suggestedPromptsKeys.map((suggestedPromptsKey, index) => (
        <SuggestedPrompt
          chatId={chatId}
          index={index}
          suggestedPromptsKey={suggestedPromptsKey}
          append={append}
          key={index}
        />
      ))}
    </div>
  );
};

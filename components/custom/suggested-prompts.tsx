import { Message, CreateMessage, ChatRequestOptions } from "ai";
import { motion } from "framer-motion";
import { useTranslations } from 'next-intl';

import { Button } from '../ui/button';

interface SuggestedPromptProps {
  keyName: string;
  index: number;
  append: (
    message: Message | CreateMessage,
    chatRequestOptions?: ChatRequestOptions
  ) => Promise<string | null | undefined>;
}

const SuggestedPrompt = ({ keyName, index, append }: SuggestedPromptProps) => {
  const suggested_prompts = useTranslations('suggested_prompts');

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: 20 }}
      transition={{ delay: 0.05 * index }}
      key={index}
      className={index > 1 ? "hidden sm:block" : "block"}
    >
      <Button
        variant="ghost"
        onClick={() =>
          append({
            role: "user",
            content: suggested_prompts(`${keyName}.action`),
          })
        }
        className="text-left border rounded-xl px-4 py-3.5 text-sm flex-1 gap-1 sm:flex-col w-full h-auto justify-start items-start"
      >
        <span className="font-medium text-wrap">
          {suggested_prompts(`${keyName}.title`)}
        </span>
        <span className="text-muted-foreground text-wrap">
          {suggested_prompts(`${keyName}.label`)}
        </span>
      </Button>
    </motion.div>
  );
};

interface SuggestedPromptsProps {
  append: (
    message: Message | CreateMessage,
    chatRequestOptions?: ChatRequestOptions
  ) => Promise<string | null | undefined>;
}

export const SuggestedPrompts = ({ append }: SuggestedPromptsProps) => {
  const suggested_prompts_keys = [
    'strategic_campaign',
    'social_toolkit',
    'volunteer_mobilisation',
    'standard_campaign',
  ] as const;

  return (
    <div className="grid sm:grid-cols-2 gap-2 w-full">
      {suggested_prompts_keys.map((key, index) => (
        <SuggestedPrompt key={index} index={index} keyName={key} append={append} />
      ))}
    </div>
  );
};

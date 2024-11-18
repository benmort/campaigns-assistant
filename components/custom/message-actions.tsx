import { Message } from 'ai';
import { useTranslations } from 'next-intl';
import { toast } from 'sonner';
import { useSWRConfig } from 'swr';
import { useCopyToClipboard } from 'usehooks-ts';

import { Vote } from '@/db/schema';
import { getMessageIdFromAnnotations } from '@/lib/utils';

import { CopyIcon, ThumbDownIcon, ThumbUpIcon } from './icons';
import { Button } from '../ui/button';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '../ui/tooltip';

export function MessageActions({
  chatId,
  message,
  vote,
  isLoading,
}: {
  chatId: string;
  message: Message;
  vote: Vote | undefined;
  isLoading: boolean;
}) {
  const { mutate } = useSWRConfig();
  const [_, copyToClipboard] = useCopyToClipboard();
  const content = useTranslations('content')

  if (isLoading) return null;
  if (message.role === 'user') return null;
  if (message.toolInvocations && message.toolInvocations.length > 0)
    return null;

  return (
    <TooltipProvider delayDuration={0}>
      <div className="flex flex-row gap-2">
        <Tooltip>
          <TooltipTrigger asChild>
            <Button
              className="py-1 px-2 h-fit text-muted-foreground"
              variant="outline"
              onClick={async () => {
                await copyToClipboard(message.content as string);
                toast.success(content('copied_clipboard'));
              }}
            >
              <CopyIcon />
            </Button>
          </TooltipTrigger>
          <TooltipContent>{ content('copy') }</TooltipContent>
        </Tooltip>

        <Tooltip>
          <TooltipTrigger asChild>
            <Button
              className="py-1 px-2 h-fit text-muted-foreground !pointer-events-auto"
              disabled={vote && vote.isUpvoted}
              variant="outline"
              onClick={async () => {
                const messageId = getMessageIdFromAnnotations(message);

                const upvote = fetch('/api/vote', {
                  method: 'PATCH',
                  body: JSON.stringify({
                    chatId,
                    messageId,
                    type: 'up',
                  }),
                });

                toast.promise(upvote, {
                  loading: `${ content('upvoting_resp') }...`,
                  success: () => {
                    mutate<Array<Vote>>(
                      `/api/vote?chatId=${chatId}`,
                      (currentVotes) => {
                        if (!currentVotes) return [];

                        const votesWithoutCurrent = currentVotes.filter(
                          (vote) => vote.messageId !== message.id
                        );

                        return [
                          ...votesWithoutCurrent,
                          {
                            chatId,
                            messageId: message.id,
                            isUpvoted: true,
                          },
                        ];
                      },
                      { revalidate: false }
                    );

                    return `${ content('upvoted_resp') }!`;
                  },
                  error: `${ content('upvote_resp_failed') }.`,
                });
              }}
            >
              <ThumbUpIcon />
            </Button>
          </TooltipTrigger>
          <TooltipContent>{ content('upvote_resp') }</TooltipContent>
        </Tooltip>

        <Tooltip>
          <TooltipTrigger asChild>
            <Button
              className="py-1 px-2 h-fit text-muted-foreground !pointer-events-auto"
              variant="outline"
              disabled={vote && !vote.isUpvoted}
              onClick={async () => {
                const messageId = getMessageIdFromAnnotations(message);

                const downvote = fetch('/api/vote', {
                  method: 'PATCH',
                  body: JSON.stringify({
                    chatId,
                    messageId,
                    type: 'down',
                  }),
                });

                toast.promise(downvote, {
                  loading: `${ content('downvoting_resp') }...`,
                  success: () => {
                    mutate<Array<Vote>>(
                      `/api/vote?chatId=${chatId}`,
                      (currentVotes) => {
                        if (!currentVotes) return [];

                        const votesWithoutCurrent = currentVotes.filter(
                          (vote) => vote.messageId !== message.id
                        );

                        return [
                          ...votesWithoutCurrent,
                          {
                            chatId,
                            messageId: message.id,
                            isUpvoted: false,
                          },
                        ];
                      },
                      { revalidate: false }
                    );

                    return `${ content('downvoted_resp') }!`;
                  },
                  error: `${ content('downvote_resp_failed') }.`,
                });
              }}
            >
              <ThumbDownIcon />
            </Button>
          </TooltipTrigger>
          <TooltipContent>{ content('downvote_resp') }</TooltipContent>
        </Tooltip>
      </div>
    </TooltipProvider>
  );
}

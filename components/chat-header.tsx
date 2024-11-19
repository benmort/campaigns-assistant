'use client';

import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useTranslations } from 'next-intl';
import { useWindowSize } from 'usehooks-ts';

import { LocaleSelector } from '@/components/locale-selector';
import { ModelSelector } from '@/components/model-selector';
import { RagToggle } from '@/components/rag-toggle';
import { SidebarToggle } from '@/components/sidebar-toggle';
import { Button } from '@/components/ui/button';
import { BetterTooltip } from '@/components/ui/tooltip';
import { PlusIcon, VercelIcon } from './icons';
import { useSidebar } from './ui/sidebar';

export function ChatHeader({ selectedModelId }: { selectedModelId: string }) {
  const router = useRouter();
  const { open } = useSidebar();

  const { width: windowWidth } = useWindowSize();
  const content = useTranslations('content');

  return (
    <header className="flex sticky top-0 bg-background py-1.5 items-center px-2 md:px-2 gap-2">
      <SidebarToggle />
      {(!open || windowWidth < 768) && (
        <BetterTooltip content={ content('new_chat') }>
          <Button
            variant="outline"
            className="order-2 md:order-1 md:px-2 px-2 md:h-fit ml-auto md:ml-0"
            onClick={() => {
              router.push('/');
              router.refresh();
            }}
          >
            <PlusIcon />
            <span className="md:sr-only">{ content('new_chat') }</span>
          </Button>
        </BetterTooltip>
      )}
      <ModelSelector
        selectedModelId={selectedModelId}
        className="order-1 md:order-2"
      />
      <LocaleSelector />
      <RagToggle />
    </header>
  );
}

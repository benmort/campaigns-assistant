'use client';
import { ChevronUp } from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';
import { type User } from 'next-auth';
import { signOut } from 'next-auth/react';
import { useTranslations } from 'next-intl';
import { useTheme } from 'next-themes';

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import {
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from '@/components/ui/sidebar';

export function SidebarUserNav({ user }: { user: User }) {
  const { setTheme, theme } = useTheme();
  const content = useTranslations('content')

  return (
    <SidebarMenu>
      <SidebarMenuItem>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <SidebarMenuButton className="data-[state=open]:bg-sidebar-accent bg-background data-[state=open]:text-sidebar-accent-foreground h-10">
              <Image
                src={`https://avatar.vercel.sh/${user.email}`}
                alt={user.email ?? 'User Avatar'}
                width={24}
                height={24}
                className="rounded-full"
              />
              <span>{user?.email}</span>
              <ChevronUp className="ml-auto" />
            </SidebarMenuButton>
          </DropdownMenuTrigger>
          <DropdownMenuContent
            side="top"
            className="w-[--radix-popper-anchor-width]"
          >
            {/*
              <DropdownMenuItem
                className="cursor-pointer"
                onSelect={() => setTheme(theme === 'dark' ? content('light') : content('dark'))}
              >
                {`${content('toggle')} ${theme === 'light' ? content('dark') : content('light')} ${content('mode')}`}
              </DropdownMenuItem>
              
            */}
            <DropdownMenuItem asChild>
              <Link href="/admin">Admin</Link>
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem asChild>
              <button
                className="w-full cursor-pointer"
                onClick={() => {
                  signOut({
                    redirectTo: '/',
                  });
                }}
              >
                { content('log_out') }
              </button>
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </SidebarMenuItem>
    </SidebarMenu>
  );
}

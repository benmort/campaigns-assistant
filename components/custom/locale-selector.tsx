'use client';

import { Check, ChevronDown } from 'lucide-react';
import Link from "next/link";
import { useTranslations } from 'next-intl';

import { getLocalesArray } from '@/lib/utils'
import { setLocale, getLocale } from '@/lib/utils/cookies-client'

import { CheckCirclFillIcon } from './icons';
import { Button } from "../ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "../ui/dropdown-menu";

export const LocaleSelector = () => {
  const content = useTranslations('content');
  const locales = useTranslations('locales');
  const LOCALES = getLocalesArray()
  const currentLocale = getLocale() || 'en'

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          className="py-1.5 px-2 h-fit font-normal"
          variant="secondary"
        >
          { content('switch_language') }
          <ChevronDown className="text-muted-foreground" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="start" className="min-w-[100px]">
        {LOCALES.map((key, index) => (
          <DropdownMenuItem key={`${key}_${index}`} data-active={currentLocale === key} className="gap-4 group/item flex flex-row justify-between items-center">
            <div className="flex flex-col gap-1 items-start">
              <Link href="" onClick={(e) => {e.preventDefault();setLocale(key);location.reload()}} >{ locales(key) }</Link>
            </div>
            <div className="text-primary dark:text-primary-foreground opacity-0 group-data-[active=true]/item:opacity-100">
              <CheckCirclFillIcon />
            </div>
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

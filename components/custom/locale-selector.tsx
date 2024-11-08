import { Check, ChevronDown } from 'lucide-react';
import Link from "next/link";
import { useTranslations } from 'next-intl';

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
      <DropdownMenuContent align="end">
        <DropdownMenuItem>
          <Link locale="en" href="/en">{ locales('en') }</Link>
        </DropdownMenuItem>
        <DropdownMenuItem>
          <Link locale="es" href="/es">{ locales('es') }</Link>
        </DropdownMenuItem>
        <DropdownMenuItem>
          <Link locale="de" href="/de">{ locales('de') }</Link>
        </DropdownMenuItem>
        <DropdownMenuItem>
          <Link locale="fr" href="/fr">{ locales('fr') }</Link>
        </DropdownMenuItem>
        <DropdownMenuItem>
          <Link locale="pt" href="/pt">{ locales('pt') }</Link>
        </DropdownMenuItem>
        <DropdownMenuItem>
          <Link locale="hi" href="/hi">{ locales('hi') }</Link>
        </DropdownMenuItem>
        <DropdownMenuItem>
          <Link locale="it" href="/it">{ locales('it') }</Link>
        </DropdownMenuItem>
        <DropdownMenuItem>
          <Link locale="nl" href="/nl">{ locales('nl') }</Link>
        </DropdownMenuItem>
        <DropdownMenuItem>
          <Link locale="pl" href="/pl">{ locales('pl') }</Link>
        </DropdownMenuItem>
        <DropdownMenuItem>
          <Link locale="ga" href="/ga">{ locales('ga') }</Link>
        </DropdownMenuItem>
        <DropdownMenuItem>
          <Link locale="zu" href="/zu">{ locales('zu') }</Link>
        </DropdownMenuItem>
        <DropdownMenuItem>
          <Link locale="af" href="/af"></Link>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

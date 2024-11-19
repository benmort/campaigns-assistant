import { cookies } from 'next/headers'
import { getRequestConfig } from 'next-intl/server';

export default getRequestConfig(async () => {
  const cookieStore = await cookies();
  let locale = cookieStore.get('NEXT_LOCALE')?.value;

  // Ensure that a valid locale is used
  if (!locale) {
    locale = 'en'
  }

  return {
    locale,
    messages: (await import(`./locales/${locale}.json`)).default
  };
});

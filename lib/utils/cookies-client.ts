// cookies-client.ts

export function getCookies(): string | undefined {
  return typeof document !== 'undefined' ? document.cookie : undefined;
}

export function parseCookie(name: string): string | undefined {
  const cookies = getCookies();
  if (!cookies) return undefined;

  const cookie: Record<string, string> = {};
  cookies.split(';').forEach((el) => {
    const [key, ...value] = el.split('=');
    cookie[key.trim()] = value.join('=');
  });

  return cookie[name];
}

export function getCookieValue(name: string): string | undefined {
  return parseCookie(name);
}

export function getLocale(): string | undefined {
  return getCookieValue('NEXT_LOCALE');
}

export function getRagCookie(): boolean {
  const ragCookie = getCookieValue('RAG');
  return ragCookie === undefined ? true : ragCookie === 'true';
}

export function setCookie(name: string, value: string, options = {}): void {
  if (typeof document !== 'undefined') {
    const optionsString = Object.entries(options)
      .map(([key, val]) => `${key}=${val}`)
      .join('; ');
    document.cookie = `${name}=${value}; path=/; ${optionsString}`;
  }
}

export function setCookieValue(name: string, value: string, options = {}): void {
  setCookie(name, value, options);
}

export function setLocale(locale: string): void {
  setCookieValue('NEXT_LOCALE', locale, { path: '/' });
}

export function setRagCookie(value: boolean): void {
  setCookieValue('RAG', value.toString(), { path: '/' });
}
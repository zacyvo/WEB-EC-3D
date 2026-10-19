/**
 * "Return to where I was" after login. Only same-site relative paths are ever honoured
 * (no `//evil.com`, no `/\evil.com`, no absolute URLs), and never back into /auth/*.
 */

const OAUTH_REDIRECT_KEY = 'auth-redirect';

export function safeRedirect(raw: string | null | undefined, fallback = '/'): string {
  if (!raw || !raw.startsWith('/') || raw.startsWith('//') || raw.startsWith('/\\')) return fallback;
  if (raw === '/auth' || raw.startsWith('/auth/') || raw.startsWith('/auth?')) return fallback;
  return raw;
}

/** Current path + query (+ hash), e.g. "/products?category=den". Browser only. */
export function currentPath(): string {
  if (typeof window === 'undefined') return '/';
  const { pathname, search, hash } = window.location;
  return `${pathname}${search}${hash}`;
}

export function loginHref(returnTo?: string | null): string {
  const target = safeRedirect(returnTo, '');
  return target ? `/auth/login?redirect=${encodeURIComponent(target)}` : '/auth/login';
}

/** OAuth leaves the site, so the target survives the round trip in sessionStorage. */
export function rememberOAuthRedirect(target: string): void {
  try {
    sessionStorage.setItem(OAUTH_REDIRECT_KEY, safeRedirect(target));
  } catch {
    // storage unavailable — callback falls back to "/"
  }
}

export function consumeOAuthRedirect(): string {
  try {
    const target = sessionStorage.getItem(OAUTH_REDIRECT_KEY);
    sessionStorage.removeItem(OAUTH_REDIRECT_KEY);
    return safeRedirect(target);
  } catch {
    return '/';
  }
}

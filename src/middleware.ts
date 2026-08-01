import { NextRequest, NextResponse } from 'next/server';
import { MAINTENANCE_COOKIE_NAME, getMaintenanceBypassToken, isMaintenanceModeOn } from '@/lib/maintenance';

const ALLOWED_PREFIXES = ['/maintenance', '/api/maintenance', '/img', '/data', '/favicon.ico'];

export async function middleware(request: NextRequest) {
  if (!isMaintenanceModeOn()) {
    return NextResponse.next();
  }

  const { pathname } = request.nextUrl;
  if (ALLOWED_PREFIXES.some((prefix) => pathname.startsWith(prefix))) {
    return NextResponse.next();
  }

  const bypassToken = await getMaintenanceBypassToken();
  const cookieToken = request.cookies.get(MAINTENANCE_COOKIE_NAME)?.value;
  if (bypassToken && cookieToken === bypassToken) {
    return NextResponse.next();
  }

  const url = request.nextUrl.clone();
  url.pathname = '/maintenance';
  url.search = '';
  return NextResponse.rewrite(url);
}

export const config = {
  matcher: ['/((?!_next/static|_next/image).*)'],
};

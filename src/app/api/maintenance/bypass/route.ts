import { NextRequest, NextResponse } from 'next/server';
import {
  MAINTENANCE_COOKIE_MAX_AGE,
  MAINTENANCE_COOKIE_NAME,
  getMaintenanceBypassToken,
  verifyMaintenanceCredentials,
} from '@/lib/maintenance';

export async function POST(request: NextRequest) {
  const body = await request.json().catch(() => null);
  const id = typeof body?.id === 'string' ? body.id : '';
  const password = typeof body?.password === 'string' ? body.password : '';

  if (!id || !password || !(await verifyMaintenanceCredentials(id, password))) {
    return NextResponse.json({ success: false, message: 'ID hoặc mật khẩu không đúng.' }, { status: 401 });
  }

  const token = await getMaintenanceBypassToken();
  if (!token) {
    return NextResponse.json({ success: false, message: 'Chưa cấu hình bypass.' }, { status: 500 });
  }

  const response = NextResponse.json({ success: true });
  response.cookies.set(MAINTENANCE_COOKIE_NAME, token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    path: '/',
    maxAge: MAINTENANCE_COOKIE_MAX_AGE,
  });
  return response;
}

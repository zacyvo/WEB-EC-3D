'use client';

import { useEffect, Suspense } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import { useAuthStore } from '@/lib/store/auth.store';
import api from '@/lib/api';

function CallbackInner() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const { setAuth } = useAuthStore();

  useEffect(() => {
    const accessToken = searchParams.get('accessToken');
    const refreshToken = searchParams.get('refreshToken');

    if (!accessToken || !refreshToken) {
      router.replace('/auth/login?error=oauth_failed');
      return;
    }

    // Store tokens
    localStorage.setItem('accessToken', accessToken);
    localStorage.setItem('refreshToken', refreshToken);

    // Fetch user profile
    api
      .get('/auth/me', {
        headers: { Authorization: `Bearer ${accessToken}` },
      })
      .then((res) => {
        const profile = res.data.data;
        if (profile.isBlocked) {
          localStorage.removeItem('accessToken');
          localStorage.removeItem('refreshToken');
          router.replace('/auth/login?error=account_blocked');
          return;
        }
        setAuth(profile, { accessToken, refreshToken });
        router.replace('/');
      })
      .catch(() => {
        router.replace('/auth/login?error=fetch_profile_failed');
      });
  }, [searchParams, router, setAuth]);

  return (
    <div className="min-h-[60vh] flex items-center justify-center">
      <div className="text-center">
        <div className="w-10 h-10 border-2 border-apple-blue border-t-transparent rounded-full animate-spin mx-auto mb-4" />
        <p className="text-apple-gray-500">Đang xác thực...</p>
      </div>
    </div>
  );
}

export default function AuthCallbackPage() {
  return (
    <Suspense fallback={
      <div className="min-h-[60vh] flex items-center justify-center">
        <div className="w-10 h-10 border-2 border-apple-blue border-t-transparent rounded-full animate-spin" />
      </div>
    }>
      <CallbackInner />
    </Suspense>
  );
}

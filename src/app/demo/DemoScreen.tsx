'use client';

import { useEffect, useRef, useState } from 'react';
import Image from 'next/image';
import { Box, Container, Typography } from '@mui/material';
import { api } from '@/lib/api';

// Giá trị mặc định khớp với default của backend (Setting schema) — dùng khi
// chưa gọi API xong hoặc API lỗi, để trang vẫn hoạt động được.
const DEFAULT_REDIRECT_URL = 'https://luxe-glow.vn';
const DEFAULT_REDIRECT_SECONDS = 3;

type LogoPhase = 'enter' | 'visible' | 'exit';

interface SettingResponse {
  demoRedirectUrl: string;
  demoRedirectSeconds: number;
}

export function DemoScreen() {
  const [redirectUrl, setRedirectUrl] = useState(DEFAULT_REDIRECT_URL);
  const [secondsLeft, setSecondsLeft] = useState<number | null>(null);
  const [logoPhase, setLogoPhase] = useState<LogoPhase>('enter');

  const redirectTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  // "Coming up": logo trượt lên + mờ dần hiện ra ngay khi vào trang.
  useEffect(() => {
    const raf = requestAnimationFrame(() => setLogoPhase('visible'));
    return () => cancelAnimationFrame(raf);
  }, []);

  // Lấy URL + thời gian đếm ngược từ setting trong admin.
  useEffect(() => {
    let cancelled = false;

    api
      .get<{ data: SettingResponse }>('/settings')
      .then((res) => {
        if (cancelled) return;
        setRedirectUrl(res.data.data.demoRedirectUrl || DEFAULT_REDIRECT_URL);
        setSecondsLeft(res.data.data.demoRedirectSeconds ?? DEFAULT_REDIRECT_SECONDS);
      })
      .catch(() => {
        if (cancelled) return;
        setSecondsLeft(DEFAULT_REDIRECT_SECONDS);
      });

    return () => { cancelled = true; };
  }, []);

  // Đếm ngược mỗi giây, khi về 0 thì phát hiệu ứng "coming out" rồi chuyển trang.
  useEffect(() => {
    if (secondsLeft === null) return;

    if (secondsLeft <= 0) {
      setLogoPhase('exit');
      redirectTimeoutRef.current = setTimeout(() => {
        window.location.href = redirectUrl;
      }, 600);
      return;
    }

    const timer = setTimeout(() => setSecondsLeft((s) => (s ?? 1) - 1), 1000);
    return () => clearTimeout(timer);
  }, [secondsLeft, redirectUrl]);

  useEffect(() => () => {
    if (redirectTimeoutRef.current) clearTimeout(redirectTimeoutRef.current);
  }, []);

  const logoTransform =
    logoPhase === 'visible'
      ? 'translateY(0) scale(1)'
      : logoPhase === 'exit'
        ? 'translateY(-32px) scale(0.9)'
        : 'translateY(32px) scale(0.9)';

  return (
    <Box
      sx={{
        minHeight: '100vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        background: 'linear-gradient(135deg, #F5F5F7 0%, #E8E8ED 100%)',
        px: 2,
      }}
    >
      <Container maxWidth="sm">
        <Box sx={{ textAlign: 'center' }}>
          <Box
            sx={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: 1.5,
              opacity: logoPhase === 'visible' ? 1 : 0,
              transform: logoTransform,
              transition: 'opacity 0.6s cubic-bezier(0.16, 1, 0.3, 1), transform 0.6s cubic-bezier(0.16, 1, 0.3, 1)',
            }}
          >
            <Image src="/img/logo_blue_geometric.svg" alt="Luxe Glow" width={56} height={56} priority draggable={false} />
            <Typography
              variant="h4"
              sx={{
                fontWeight: 700,
                letterSpacing: '-0.02em',
                background: 'linear-gradient(135deg, #007AFF 0%, #8B5CF6 100%)',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
                userSelect: 'none',
              }}
            >
              Luxe Glow
            </Typography>
          </Box>

          <Typography
            variant="body1"
            sx={{
              color: 'text.secondary',
              mt: 4,
              opacity: logoPhase === 'exit' ? 0 : 1,
              transition: 'opacity 0.4s ease',
            }}
          >
            {secondsLeft === null
              ? 'Đang tải...'
              : `Chuyển sang trang trong ${secondsLeft} giây`}
          </Typography>

          <Typography
            component="a"
            href={redirectUrl}
            variant="body2"
            sx={{
              display: 'inline-block',
              mt: 2,
              color: 'primary.main',
              textDecoration: 'none',
              opacity: logoPhase === 'exit' ? 0 : 0.8,
              transition: 'opacity 0.4s ease',
              '&:hover': { textDecoration: 'underline' },
            }}
          >
            Chưa được chuyển? Bấm vào đây
          </Typography>
        </Box>
      </Container>
    </Box>
  );
}

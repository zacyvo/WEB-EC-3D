'use client';

import { useEffect, useMemo, useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { Box, Container } from '@mui/material';
import { api } from '@/lib/api';
import { isBannerLive, type HomeBanner } from '@/lib/banners';
import { BannerCarousel } from './BannerCarousel';
import { HeroSection } from './HeroSection';

/**
 * Banner trang chủ. `initial` lấy từ server (ISR 60s); null = server không gọi được backend → client gọi lại.
 * Đồng hồ client lọc lại khung giờ để banner vừa hết hạn biến mất kể cả khi trang còn trong cache.
 */
export function useHomeBanners(initial: HomeBanner[] | null) {
  const { data } = useQuery({
    queryKey: ['home-banners'],
    queryFn: async () => {
      const res = await api.get<{ data: HomeBanner[] }>('/banners');
      return res.data.data ?? [];
    },
    initialData: initial ?? undefined,
    staleTime: 60_000,
    retry: 1,
  });

  // Lọc theo giờ chỉ sau khi mount để HTML server và client khớp nhau (tránh lỗi hydration).
  const [now, setNow] = useState<number | null>(null);
  useEffect(() => {
    setNow(Date.now());
    const t = window.setInterval(() => setNow(Date.now()), 60_000);
    return () => window.clearInterval(t);
  }, []);

  return useMemo(() => {
    const list = data ?? [];
    return now === null ? list : list.filter((b) => isBannerLive(b, now));
  }, [data, now]);
}

/** Hero trên cùng: có banner HERO đang chạy → slider; không có → Hero mặc định. */
export function HomeHero({ banners }: { banners: HomeBanner[] }) {
  const hero = banners.filter((b) => b.placement === 'HERO');
  if (hero.length === 0) return <HeroSection />;
  return (
    <Box component="section" sx={{ bgcolor: '#F5F5F7' }}>
      <Box sx={{ maxWidth: 1920, mx: 'auto' }}>
        <BannerCarousel banners={hero} placement="HERO" interval={5000} ariaLabel="Chương trình nổi bật" />
      </Box>
    </Box>
  );
}

/** Dải banner khuyến mãi: không có banner PROMO đang chạy thì không hiển thị gì (như mặc định). */
export function HomePromoBanners({ banners }: { banners: HomeBanner[] }) {
  const promo = banners.filter((b) => b.placement === 'PROMO');
  if (promo.length === 0) return null;
  return (
    <Container component="section" maxWidth="lg" sx={{ pb: { xs: 6, md: 10 } }}>
      <BannerCarousel banners={promo} placement="PROMO" interval={6000} ariaLabel="Khuyến mãi" />
    </Container>
  );
}

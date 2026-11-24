import { HomePageClient } from './HomePageClient';
import { fetchHomeBanners } from '@/lib/banners';

/** Trang chủ: lấy banner đang chạy phía server (ISR 60s) để slider hiện ngay, không nháy Hero mặc định. */
export default async function HomePage() {
  const initialBanners = await fetchHomeBanners();
  return <HomePageClient initialBanners={initialBanners} />;
}

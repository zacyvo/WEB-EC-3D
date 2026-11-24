/**
 * Banner / Hero quảng cáo trang chủ (backend: src/banners, docs: backend/docs/HOME_BANNERS.md).
 * Kích thước chuẩn trùng với frontend-admin/src/lib/banner-specs.ts — sửa thì sửa cả hai nơi.
 */

export type BannerPlacement = 'HERO' | 'PROMO';

export interface HomeBanner {
  _id: string;
  placement: BannerPlacement;
  title: string;
  altText: string;
  imageDesktop: string;
  /** '' = không có ảnh mobile, mobile dùng ảnh desktop. */
  imageMobile: string;
  /** null = banner không bấm được. */
  href: string | null;
  isExternal: boolean;
  openInNewTab: boolean;
  startAt: string | null;
  endAt: string | null;
}

/** Tỉ lệ khung (rộng / cao) — ảnh đúng tỉ lệ thì hiển thị trọn vẹn, không bị cắt. */
export const BANNER_RATIO: Record<BannerPlacement, { desktop: number; mobile: number }> = {
  HERO: { desktop: 1920 / 720, mobile: 1080 / 1080 },
  PROMO: { desktop: 2400 / 600, mobile: 1080 / 540 },
};

/** Dưới mốc này (px) dùng ảnh mobile — khớp breakpoint `md` của MUI. */
export const BANNER_MOBILE_MAX_WIDTH = 899;

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001/api/v1';

/**
 * Banner đang chạy cho trang chủ, gọi phía server (ISR 60s).
 * null = không gọi được backend → client tự gọi lại; [] = không có banner → giao diện mặc định.
 */
export async function fetchHomeBanners(): Promise<HomeBanner[] | null> {
  try {
    const res = await fetch(`${API_URL}/banners`, {
      next: { revalidate: 60 },
      signal: AbortSignal.timeout(4000),
    });
    if (!res.ok) return null;
    const json = (await res.json()) as { data?: HomeBanner[] };
    return Array.isArray(json.data) ? json.data : null;
  } catch {
    return null;
  }
}

/** Bỏ banner đã hết hạn / chưa tới giờ theo đồng hồ hiện tại (trang có thể được cache tới 60s). */
export function isBannerLive(b: Pick<HomeBanner, 'startAt' | 'endAt'>, now = Date.now()): boolean {
  if (b.startAt && new Date(b.startAt).getTime() > now) return false;
  if (b.endAt && new Date(b.endAt).getTime() <= now) return false;
  return true;
}

/** Ghi nhận lượt bấm — fire-and-forget, không chặn điều hướng. */
export function trackBannerClick(id: string): void {
  try {
    void fetch(`${API_URL}/banners/${id}/click`, { method: 'POST', keepalive: true }).catch(() => undefined);
  } catch {
    /* ignore */
  }
}

/**
 * Ảnh Cloudinary: chèn transform để tải đúng bề rộng cần dùng (f_auto,q_auto chọn WebP/AVIF).
 * URL không phải Cloudinary giữ nguyên.
 */
export function bannerImageUrl(url: string, width: number): string {
  const marker = '/image/upload/';
  const i = url.indexOf(marker);
  if (i === -1 || !url.includes('res.cloudinary.com')) return url;
  const head = url.slice(0, i + marker.length);
  const tail = url.slice(i + marker.length);
  return `${head}f_auto,q_auto,c_limit,w_${width}/${tail}`;
}

export function bannerSrcSet(url: string, widths: number[]): string | undefined {
  if (!url.includes('res.cloudinary.com')) return undefined;
  return widths.map((w) => `${bannerImageUrl(url, w)} ${w}w`).join(', ');
}

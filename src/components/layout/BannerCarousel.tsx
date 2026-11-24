'use client';

import Link from 'next/link';
import { useCallback, useEffect, useMemo, useRef, useState, type ReactNode } from 'react';
import { Box, IconButton, alpha } from '@mui/material';
import ChevronLeftIcon from '@mui/icons-material/ChevronLeft';
import ChevronRightIcon from '@mui/icons-material/ChevronRight';
import {
  BANNER_MOBILE_MAX_WIDTH, BANNER_RATIO, bannerImageUrl, bannerSrcSet, trackBannerClick,
  type BannerPlacement, type HomeBanner,
} from '@/lib/banners';

interface BannerCarouselProps {
  banners: HomeBanner[];
  placement: BannerPlacement;
  /** Thời gian mỗi slide (ms). */
  interval?: number;
  ariaLabel: string;
}

const SWIPE_THRESHOLD_PX = 50;
const CLICK_SUPPRESS_PX = 8;

/**
 * Slider banner: tự chạy (dừng khi hover/focus, tab ẩn, hoặc người dùng bật "giảm chuyển động"),
 * vuốt trên mobile, mũi tên trên desktop, chấm điều hướng, phím ← →.
 * Ảnh desktop/mobile chọn bằng <picture> nên trình duyệt chỉ tải một ảnh.
 */
export function BannerCarousel({ banners, placement, interval = 5000, ariaLabel }: BannerCarouselProps) {
  const count = banners.length;
  const [index, setIndex] = useState(0);
  const [paused, setPaused] = useState(false);
  const [reduceMotion, setReduceMotion] = useState(false);
  const [dragX, setDragX] = useState(0);
  const [dragging, setDragging] = useState(false);
  const startX = useRef<number | null>(null);
  const startY = useRef(0);
  const moved = useRef(0);
  const trackRef = useRef<HTMLDivElement>(null);

  const ratio = BANNER_RATIO[placement];
  // Khung mobile theo tỉ lệ mobile nếu có ít nhất một banner có ảnh mobile; slide thiếu ảnh mobile
  // sẽ hiển thị trọn ảnh desktop trên nền mờ thay vì bị cắt.
  const hasMobileArt = useMemo(() => banners.some((b) => !!b.imageMobile), [banners]);
  const mobileRatio = hasMobileArt ? ratio.mobile : ratio.desktop;

  useEffect(() => {
    if (index >= count) setIndex(0);
  }, [count, index]);

  useEffect(() => {
    const mq = window.matchMedia('(prefers-reduced-motion: reduce)');
    const update = () => setReduceMotion(mq.matches);
    update();
    mq.addEventListener('change', update);
    return () => mq.removeEventListener('change', update);
  }, []);

  const go = useCallback((next: number) => setIndex(((next % count) + count) % count), [count]);

  // Autoplay
  useEffect(() => {
    if (count < 2 || paused || dragging || reduceMotion) return;
    const t = window.setTimeout(() => {
      if (document.visibilityState === 'visible') go(index + 1);
    }, interval);
    return () => window.clearTimeout(t);
  }, [count, paused, dragging, reduceMotion, index, interval, go]);

  // ── Vuốt / kéo ────────────────────────────────────────────────────────────
  const onPointerDown = (e: React.PointerEvent) => {
    if (count < 2 || (e.pointerType === 'mouse' && e.button !== 0)) return;
    startX.current = e.clientX;
    startY.current = e.clientY;
    moved.current = 0;
  };
  const onPointerMove = (e: React.PointerEvent) => {
    if (startX.current === null) return;
    const dx = e.clientX - startX.current;
    const dy = e.clientY - startY.current;
    // Cuộn dọc trang: bỏ qua, không biến thành vuốt ngang.
    if (!dragging && Math.abs(dy) > Math.abs(dx) && Math.abs(dy) > CLICK_SUPPRESS_PX) {
      startX.current = null;
      return;
    }
    moved.current = Math.max(moved.current, Math.abs(dx));
    if (Math.abs(dx) > CLICK_SUPPRESS_PX) {
      if (!dragging) {
        setDragging(true);
        try { (e.currentTarget as HTMLElement).setPointerCapture(e.pointerId); } catch { /* ignore */ }
      }
      setDragX(dx);
    }
  };
  const endDrag = () => {
    if (startX.current === null) return;
    startX.current = null;
    const width = trackRef.current?.offsetWidth ?? 1;
    if (dragging && Math.abs(dragX) > Math.min(SWIPE_THRESHOLD_PX, width * 0.15)) {
      go(dragX < 0 ? index + 1 : index - 1);
    }
    setDragging(false);
    setDragX(0);
  };
  // Vừa vuốt xong thì không mở liên kết.
  const onClickCapture = (e: React.MouseEvent) => {
    if (moved.current > CLICK_SUPPRESS_PX) {
      e.preventDefault();
      e.stopPropagation();
      moved.current = 0;
    }
  };

  const onKeyDown = (e: React.KeyboardEvent) => {
    if (count < 2) return;
    if (e.key === 'ArrowLeft') { e.preventDefault(); go(index - 1); }
    if (e.key === 'ArrowRight') { e.preventDefault(); go(index + 1); }
  };

  if (count === 0) return null;

  const isHero = placement === 'HERO';
  const desktopWidths = isHero ? [1280, 1920, 2560] : [1200, 1800, 2400];
  const mobileWidths = isHero ? [640, 828, 1080] : [640, 828, 1080];
  const sizes = isHero ? '(max-width: 1920px) 100vw, 1920px' : '(max-width: 1200px) 100vw, 1152px';

  return (
    <Box
      role="region"
      aria-roledescription="carousel"
      aria-label={ariaLabel}
      tabIndex={count > 1 ? 0 : undefined}
      onKeyDown={onKeyDown}
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
      onFocus={() => setPaused(true)}
      onBlur={(e) => { if (!e.currentTarget.contains(e.relatedTarget as Node)) setPaused(false); }}
      sx={{
        position: 'relative',
        overflow: 'hidden',
        width: '100%',
        aspectRatio: { xs: `${mobileRatio}`, md: `${ratio.desktop}` },
        bgcolor: '#F5F5F7',
        borderRadius: isHero ? 0 : { xs: 3, md: 4 },
        outline: 'none',
        '&:focus-visible': { boxShadow: (t) => `0 0 0 3px ${alpha(t.palette.primary.main, 0.5)}` },
        '&:hover .banner-arrow': { opacity: 1 },
      }}
    >
      <Box
        ref={trackRef}
        onPointerDown={onPointerDown}
        onPointerMove={onPointerMove}
        onPointerUp={endDrag}
        onPointerCancel={endDrag}
        onClickCapture={onClickCapture}
        sx={{
          display: 'flex',
          height: '100%',
          touchAction: 'pan-y',
          userSelect: 'none',
          transform: `translate3d(calc(${-index * 100}% + ${dragX}px), 0, 0)`,
          transition: dragging || reduceMotion ? 'none' : 'transform 550ms cubic-bezier(0.22, 0.61, 0.36, 1)',
          cursor: count > 1 ? (dragging ? 'grabbing' : 'grab') : 'default',
        }}
      >
        {banners.map((b, i) => {
          const current = i === index;
          const mobileSrc = b.imageMobile || '';
          const letterbox = hasMobileArt && !mobileSrc; // ảnh desktop đặt trong khung mobile
          const img = (
            <Box component="picture" sx={{ display: 'block', width: '100%', height: '100%', position: 'relative' }}>
              {mobileSrc && (
                <source
                  media={`(max-width: ${BANNER_MOBILE_MAX_WIDTH}px)`}
                  srcSet={bannerSrcSet(mobileSrc, mobileWidths) ?? mobileSrc}
                  sizes="100vw"
                />
              )}
              <Box
                component="img"
                src={bannerImageUrl(b.imageDesktop, desktopWidths[1])}
                srcSet={bannerSrcSet(b.imageDesktop, desktopWidths)}
                sizes={sizes}
                alt={b.altText || b.title}
                draggable={false}
                loading={i === 0 ? 'eager' : 'lazy'}
                fetchPriority={i === 0 && isHero ? 'high' : undefined}
                decoding="async"
                sx={{
                  display: 'block', width: '100%', height: '100%',
                  objectFit: { xs: letterbox ? 'contain' : 'cover', md: 'cover' },
                  position: 'relative', zIndex: 1,
                }}
              />
              {letterbox && (
                <Box
                  aria-hidden
                  sx={{
                    display: { xs: 'block', md: 'none' },
                    position: 'absolute', inset: -24, zIndex: 0,
                    backgroundImage: `url("${bannerImageUrl(b.imageDesktop, 400)}")`,
                    backgroundSize: 'cover', backgroundPosition: 'center',
                    filter: 'blur(24px) saturate(1.1)', opacity: 0.7,
                  }}
                />
              )}
            </Box>
          );

          return (
            <Box
              key={b._id}
              role="group"
              aria-roledescription="slide"
              aria-label={`${i + 1} / ${count}: ${b.title}`}
              aria-hidden={!current}
              sx={{ flex: '0 0 100%', width: '100%', height: '100%', overflow: 'hidden', position: 'relative' }}
            >
              <SlideLink banner={b} focusable={current}>{img}</SlideLink>
            </Box>
          );
        })}
      </Box>

      {count > 1 && (
        <>
          <ArrowButton side="left" onClick={() => go(index - 1)} />
          <ArrowButton side="right" onClick={() => go(index + 1)} />
          <Box
            sx={{
              position: 'absolute', left: '50%', transform: 'translateX(-50%)',
              bottom: { xs: 10, md: isHero ? 20 : 14 },
              display: 'flex', gap: 0.75, px: 1, py: 0.75, borderRadius: 980,
              bgcolor: alpha('#000', 0.25), backdropFilter: 'blur(6px)', zIndex: 2,
            }}
          >
            {banners.map((b, i) => (
              <Box
                key={b._id}
                component="button"
                type="button"
                aria-label={`Xem banner ${i + 1}`}
                aria-current={i === index ? 'true' : undefined}
                onClick={() => go(i)}
                sx={{
                  width: i === index ? 22 : 8, height: 8, p: 0, border: 0, borderRadius: 980, cursor: 'pointer',
                  bgcolor: i === index ? '#fff' : alpha('#fff', 0.55),
                  transition: 'width 300ms ease, background-color 300ms ease',
                }}
              />
            ))}
          </Box>
        </>
      )}
    </Box>
  );
}

function SlideLink({ banner, focusable, children }: { banner: HomeBanner; focusable: boolean; children: ReactNode }) {
  const tabIndex = focusable ? undefined : -1;
  const sx = { display: 'block', width: '100%', height: '100%', color: 'inherit' };
  if (!banner.href) return <Box sx={sx}>{children}</Box>;

  const onClick = () => trackBannerClick(banner._id);
  const label = banner.altText || banner.title;

  if (banner.isExternal || banner.openInNewTab) {
    return (
      <Box
        component="a"
        href={banner.href}
        target={banner.openInNewTab ? '_blank' : undefined}
        rel={banner.isExternal ? 'noopener noreferrer' : undefined}
        aria-label={label}
        tabIndex={tabIndex}
        onClick={onClick}
        draggable={false}
        sx={sx}
      >
        {children}
      </Box>
    );
  }
  return (
    <Box component={Link} href={banner.href} aria-label={label} tabIndex={tabIndex} onClick={onClick} draggable={false} sx={sx}>
      {children}
    </Box>
  );
}

function ArrowButton({ side, onClick }: { side: 'left' | 'right'; onClick: () => void }) {
  const Icon = side === 'left' ? ChevronLeftIcon : ChevronRightIcon;
  return (
    <IconButton
      className="banner-arrow"
      aria-label={side === 'left' ? 'Banner trước' : 'Banner tiếp theo'}
      onClick={onClick}
      sx={{
        display: { xs: 'none', md: 'inline-flex' },
        position: 'absolute', top: '50%', transform: 'translateY(-50%)',
        [side]: 16, zIndex: 2, width: 44, height: 44,
        bgcolor: alpha('#fff', 0.85), color: '#1C1C1E', backdropFilter: 'blur(8px)',
        boxShadow: '0 4px 16px rgba(0,0,0,0.12)', opacity: 0, transition: 'opacity 200ms ease',
        '&:hover': { bgcolor: '#fff' },
        '&:focus-visible': { opacity: 1 },
      }}
    >
      <Icon />
    </IconButton>
  );
}

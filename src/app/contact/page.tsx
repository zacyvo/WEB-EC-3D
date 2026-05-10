'use client';

import Link from 'next/link';
import {
  Box, Container, Typography, Grid, Paper, Stack,
  Button, Divider, alpha,
} from '@mui/material';
import type { Metadata } from 'next';
import PhoneOutlinedIcon from '@mui/icons-material/PhoneOutlined';
import EmailOutlinedIcon from '@mui/icons-material/EmailOutlined';
import LocationOnOutlinedIcon from '@mui/icons-material/LocationOnOutlined';
import AccessTimeOutlinedIcon from '@mui/icons-material/AccessTimeOutlined';
import ChatBubbleOutlineIcon from '@mui/icons-material/ChatBubbleOutlineOutlined';
import StorefrontOutlinedIcon from '@mui/icons-material/StorefrontOutlined';
import CameraAltOutlinedIcon from '@mui/icons-material/CameraAltOutlined';
import VideoLibraryOutlinedIcon from '@mui/icons-material/VideoLibraryOutlined';
import PeopleOutlineIcon from '@mui/icons-material/PeopleOutlined';
import { STORE } from '@/lib/store-config';

const CHANNELS = [
  {
    id: 'phone',
    label: 'Gọi điện',
    value: STORE.phone,
    desc: 'Hotline hỗ trợ 8:00 – 22:00',
    href: `tel:${STORE.phone}`,
    Icon: PhoneOutlinedIcon,
    color: '#34C759',
    bg: '#F0FBF2',
    cta: 'Gọi ngay',
  },
  {
    id: 'zalo',
    label: 'Zalo',
    value: 'Chat qua Zalo',
    desc: 'Phản hồi trong vòng 5 phút',
    href: STORE.zalo,
    Icon: ChatBubbleOutlineIcon,
    color: '#007AFF',
    bg: '#EAF3FF',
    cta: 'Nhắn Zalo',
  },
  {
    id: 'email',
    label: 'Email',
    value: STORE.email,
    desc: 'Phản hồi trong vòng 24 giờ',
    href: `mailto:${STORE.email}`,
    Icon: EmailOutlinedIcon,
    color: '#636366',
    bg: '#F5F5F7',
    cta: 'Gửi email',
  },
  {
    id: 'facebook',
    label: 'Facebook',
    value: 'Luxe Glow',
    desc: 'Theo dõi tin tức & khuyến mãi',
    href: STORE.facebook,
    Icon: PeopleOutlineIcon,
    color: '#1877F2',
    bg: '#EEF4FE',
    cta: 'Xem trang',
  },
  {
    id: 'instagram',
    label: 'Instagram',
    value: '@luxeglow.vn',
    desc: 'Ảnh sản phẩm & behind-the-scenes',
    href: STORE.instagram,
    Icon: CameraAltOutlinedIcon,
    color: '#C13584',
    bg: '#FBF0F7',
    cta: 'Xem profile',
  },
  {
    id: 'shopee',
    label: 'Shopee',
    value: 'shop.luxeglow',
    desc: 'Mua hàng & nhận nhiều ưu đãi',
    href: STORE.shopee,
    Icon: StorefrontOutlinedIcon,
    color: '#EE4D2D',
    bg: '#FFF2EF',
    cta: 'Vào shop',
  },
  {
    id: 'tiktok',
    label: 'TikTok Shop',
    value: '@luxeglow',
    desc: 'Video sản phẩm & livestream',
    href: STORE.tiktok,
    Icon: VideoLibraryOutlinedIcon,
    color: '#1C1C1E',
    bg: '#F5F5F7',
    cta: 'Xem TikTok',
  },
];

export default function ContactPage() {
  return (
    <>
      {/* ── Hero ── */}
      <Box
        sx={{
          background: 'linear-gradient(180deg, #F5F5F7 0%, #fff 100%)',
          pt: { xs: 7, md: 12 },
          pb: { xs: 6, md: 10 },
          textAlign: 'center',
          position: 'relative',
          overflow: 'hidden',
        }}
      >
        {/* Decorative blob */}
        <Box
          sx={{
            position: 'absolute', top: -100, left: '50%', transform: 'translateX(-50%)',
            width: 600, height: 600, borderRadius: '50%',
            background: alpha('#007AFF', 0.06), filter: 'blur(80px)',
            pointerEvents: 'none',
          }}
        />
        <Container maxWidth="md" sx={{ position: 'relative' }}>
          <Box
            sx={{
              display: 'inline-flex', alignItems: 'center', gap: 1,
              bgcolor: alpha('#007AFF', 0.08), color: 'primary.main',
              px: 2.5, py: 0.75, borderRadius: 980, mb: 3,
            }}
          >
            <ChatBubbleOutlineIcon sx={{ fontSize: 16 }} />
            <Typography variant="body2" sx={{ fontWeight: 600 }}>Chúng tôi luôn lắng nghe bạn</Typography>
          </Box>

          <Typography
            variant="h2"
            sx={{ fontWeight: 700, fontSize: { xs: 32, md: 52 }, letterSpacing: '-0.03em', mb: 2 }}
          >
            Liên hệ với{' '}
            <Box
              component="span"
              sx={{
                background: 'linear-gradient(135deg, #007AFF 0%, #8B5CF6 100%)',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
              }}
            >
              Luxe Glow
            </Box>
          </Typography>

          <Typography
            variant="body1"
            color="text.secondary"
            sx={{ fontSize: { xs: 16, md: 18 }, maxWidth: 520, mx: 'auto', lineHeight: 1.7 }}
          >
            Có thắc mắc về sản phẩm, đơn hàng hoặc muốn đặt thiết kế theo yêu cầu?
            Chọn kênh phù hợp để liên hệ ngay với chúng tôi.
          </Typography>
        </Container>
      </Box>

      <Container maxWidth="lg" sx={{ pb: { xs: 8, md: 14 } }} style={{marginTop: "20px"}}>

        {/* ── Channel cards ── */}
        <Grid container spacing={2.5} sx={{ mb: 8 }}>
          {CHANNELS.map(({ id, label, value, desc, href, Icon, color, bg, cta }) => (
            <Grid key={id} size={{ xs: 12, sm: 6, md: 4 }}>
              <Paper
                elevation={0}
                sx={{
                  p: 3, height: '100%',
                  border: '1px solid', borderColor: 'divider',
                  borderRadius: 4,
                  transition: 'box-shadow 0.2s, transform 0.2s',
                  '&:hover': { boxShadow: 4, transform: 'translateY(-2px)' },
                  display: 'flex', flexDirection: 'column', gap: 1.5,
                }}
              >
                <Box sx={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: 1.5 }}>
                  <Box
                    sx={{
                      width: 52, height: 52, borderRadius: 3, bgcolor: bg,
                      display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0,
                    }}
                  >
                    <Icon sx={{ color, fontSize: 26 }} />
                  </Box>
                  <Button
                    component={Link}
                    href={href}
                    target={id !== 'phone' && id !== 'email' ? '_blank' : undefined}
                    rel={id !== 'phone' && id !== 'email' ? 'noopener noreferrer' : undefined}
                    size="small"
                    variant="outlined"
                    sx={{
                      borderRadius: 980, borderColor: alpha(color, 0.4), color,
                      fontSize: 12, fontWeight: 600, px: 1.75, py: 0.5, flexShrink: 0,
                      '&:hover': { bgcolor: alpha(color, 0.06), borderColor: color },
                    }}
                  >
                    {cta}
                  </Button>
                </Box>

                <Box>
                  <Typography variant="body2" sx={{ fontWeight: 700, color: 'text.primary', mb: 0.25 }}>
                    {label}
                  </Typography>
                  <Typography variant="body2" sx={{ fontWeight: 500, color }}>
                    {value}
                  </Typography>
                  <Typography variant="caption" color="text.secondary" sx={{ display: 'block', mt: 0.5, lineHeight: 1.5 }}>
                    {desc}
                  </Typography>
                </Box>
              </Paper>
            </Grid>
          ))}
        </Grid>

        {/* ── Info row ── */}
        <Grid container spacing={3} sx={{ mb: 8 }}>
          {/* Address + Hours */}
          <Grid size={{ xs: 12, md: 4 }}>
            <Stack spacing={2}>
              {/* <Paper elevation={0} sx={{ p: 3, border: '1px solid', borderColor: 'divider', borderRadius: 4 }}>
                <Box sx={{ display: 'flex', gap: 1.5, mb: 1.5 }}>
                  <Box sx={{ width: 40, height: 40, borderRadius: 2.5, bgcolor: alpha('#FF3B30', 0.08), display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                    <LocationOnOutlinedIcon sx={{ color: '#FF3B30', fontSize: 20 }} />
                  </Box>
                  <Box>
                    <Typography variant="body2" sx={{ fontWeight: 700, mb: 0.25 }}>Địa chỉ cửa hàng</Typography>
                    <Typography variant="caption" color="text.secondary" sx={{ lineHeight: 1.6, display: 'block' }}>
                      {STORE.address}
                    </Typography>
                  </Box>
                </Box>
                <Button
                  component={Link}
                  href={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(STORE.address)}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  size="small"
                  variant="text"
                  sx={{ color: 'primary.main', fontSize: 12, fontWeight: 600, p: 0, '&:hover': { background: 'none', textDecoration: 'underline' } }}
                >
                  Xem trên bản đồ →
                </Button>
              </Paper> */}

              <Paper elevation={0} sx={{ p: 3, border: '1px solid', borderColor: 'divider', borderRadius: 4 }}>
                <Box sx={{ display: 'flex', gap: 1.5 }}>
                  <Box sx={{ width: 40, height: 40, borderRadius: 2.5, bgcolor: alpha('#FF9500', 0.08), display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                    <AccessTimeOutlinedIcon sx={{ color: '#FF9500', fontSize: 20 }} />
                  </Box>
                  <Box>
                    <Typography variant="body2" sx={{ fontWeight: 700, mb: 0.75 }}>Giờ làm việc</Typography>
                    <Stack spacing={0.5}>
                      {[
                        { day: 'Thứ 2 – Thứ 6', hours: '8:00 – 22:00' },
                        { day: 'Thứ 7 – Chủ nhật', hours: '9:00 – 21:00' },
                      ].map(({ day, hours }) => (
                        <Box key={day} sx={{ display: 'flex', justifyContent: 'space-between', gap: 2 }}>
                          <Typography variant="caption" color="text.secondary">{day}</Typography>
                          <Typography variant="caption" sx={{ fontWeight: 600, color: 'text.primary' }}>{hours}</Typography>
                        </Box>
                      ))}
                    </Stack>
                  </Box>
                </Box>
              </Paper>
            </Stack>
          </Grid>

          {/* Map placeholder */}
          {/* <Grid size={{ xs: 12, md: 8 }}>
            <Paper
              elevation={0}
              sx={{
                height: { xs: 220, md: '100%' }, minHeight: 220,
                border: '1px solid', borderColor: 'divider', borderRadius: 4,
                overflow: 'hidden', position: 'relative',
                bgcolor: '#F5F5F7',
              }}
            >

              <Box
                sx={{
                  position: 'absolute', inset: 0,
                  display: 'flex', flexDirection: 'column',
                  alignItems: 'center', justifyContent: 'center', gap: 2,
                }}
              >

                <Box sx={{ position: 'absolute', inset: 0, opacity: 0.07 }}>
                  {Array.from({ length: 8 }).map((_, i) => (
                    <Box key={`h${i}`} sx={{ position: 'absolute', left: 0, right: 0, height: '1px', bgcolor: '#1C1C1E', top: `${(i + 1) * 12.5}%` }} />
                  ))}
                  {Array.from({ length: 10 }).map((_, i) => (
                    <Box key={`v${i}`} sx={{ position: 'absolute', top: 0, bottom: 0, width: '1px', bgcolor: '#1C1C1E', left: `${(i + 1) * 10}%` }} />
                  ))}
                </Box>

                <Box sx={{ position: 'absolute', inset: 0, opacity: 0.12 }}>
                  <Box sx={{ position: 'absolute', top: '40%', left: 0, right: 0, height: 6, bgcolor: '#1C1C1E', borderRadius: 3 }} />
                  <Box sx={{ position: 'absolute', left: '30%', top: 0, bottom: 0, width: 4, bgcolor: '#1C1C1E', borderRadius: 3 }} />
                  <Box sx={{ position: 'absolute', left: '65%', top: 0, bottom: 0, width: 3, bgcolor: '#1C1C1E', borderRadius: 3 }} />
                </Box>

                <Box sx={{ position: 'relative', zIndex: 1, textAlign: 'center' }}>
                  <Box
                    sx={{
                      width: 48, height: 48, borderRadius: '50%',
                      bgcolor: '#FF3B30',
                      display: 'flex', alignItems: 'center', justifyContent: 'center',
                      mx: 'auto', mb: 1,
                      boxShadow: '0 0 0 8px rgba(255,59,48,0.15)',
                    }}
                  >
                    <LocationOnOutlinedIcon sx={{ color: '#fff', fontSize: 24 }} />
                  </Box>
                  <Typography variant="body2" sx={{ fontWeight: 700, color: 'text.primary' }}>Luxe Glow</Typography>
                  <Typography variant="caption" color="text.secondary">119 Bình Long, Bình Tân, TP. HCM</Typography>
                  <Box sx={{ mt: 1.5 }}>
                    <Button
                      component={Link}
                      href={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(STORE.address)}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      size="small"
                      variant="contained"
                      sx={{ borderRadius: 980, fontSize: 12 }}
                    >
                      Mở Google Maps
                    </Button>
                  </Box>
                </Box>
              </Box>
            </Paper>
          </Grid> */}
        </Grid>

        {/* ── Quick links ── */}
        <Box sx={{ textAlign: 'center' }}>
          <Divider sx={{ mb: 4 }} />
          <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
            Bạn cần thêm thông tin?
          </Typography>
          <Stack direction="row" spacing={1.5} sx={{ justifyContent: 'center', flexWrap: 'wrap' }}>
            {[
              { label: 'Câu hỏi thường gặp', href: '/faq' },
              { label: 'Hướng dẫn đặt hàng', href: '/order-guide' },
              { label: 'Sản phẩm', href: '/products' },
            ].map(({ label, href }) => (
              <Button
                key={href}
                component={Link}
                href={href}
                variant="outlined"
                size="small"
                sx={{ borderRadius: 980, fontSize: 13, fontWeight: 500 }}
              >
                {label}
              </Button>
            ))}
          </Stack>
        </Box>
      </Container>
    </>
  );
}

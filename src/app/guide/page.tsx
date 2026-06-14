'use client';

import Image from 'next/image';
import Link from 'next/link';
import {
  Box, Container, Typography, Stack, Paper, Chip, alpha, Button, Grid,
} from '@mui/material';
import LightbulbOutlinedIcon from '@mui/icons-material/LightbulbOutlined';
import AutoAwesomeOutlinedIcon from '@mui/icons-material/AutoAwesomeOutlined';
import TouchAppOutlinedIcon from '@mui/icons-material/TouchAppOutlined';
import SettingsRemoteOutlinedIcon from '@mui/icons-material/SettingsRemoteOutlined';
import ArrowForwardIcon from '@mui/icons-material/ArrowForward';
import ContactSupportOutlinedIcon from '@mui/icons-material/ContactSupportOutlined';

const GUIDES = [
  {
    href: '/guide/den-3-mau',
    accent: '#FF9500',
    gradientFrom: '#FF9500',
    gradientTo: '#FFD60A',
    bgLight: '#FFF9EC',
    Icon: LightbulbOutlinedIcon,
    badge: 'Không remote',
    title: 'Đèn 3 Màu',
    desc: 'Điều khiển bằng công tắc cảm ứng tích hợp trên dây nguồn. Chuyển màu Trắng / Vàng / Ấm và điều chỉnh độ sáng chỉ bằng thao tác chạm.',
    features: ['Chạm 1 lần: đổi màu / tắt', 'Chạm giữ: điều chỉnh độ sáng', 'Lưu độ sáng theo từng màu'],
    featureIcon: <TouchAppOutlinedIcon sx={{ fontSize: 14 }} />,
    featureColor: '#FF9500',
    statusImages: ['/img/guide/status_off.png', '/img/guide/status_on.png'],
  },
  {
    href: '/guide/den-nhieu-mau',
    accent: '#8B5CF6',
    gradientFrom: '#8B5CF6',
    gradientTo: '#007AFF',
    bgLight: '#F5F0FF',
    Icon: AutoAwesomeOutlinedIcon,
    badge: 'Có remote',
    title: 'Đèn Nhiều Màu',
    desc: 'Kết hợp công tắc cảm ứng và remote điều khiển từ xa — tùy chỉnh màu sắc RGB, độ sáng và hiệu ứng chuyển màu dễ dàng.',
    features: ['Remote: chọn màu, độ sáng, hiệu ứng', 'Bật/tắt từ xa qua remote', 'Tháo pin bảo vệ trước lần đầu dùng'],
    featureIcon: <SettingsRemoteOutlinedIcon sx={{ fontSize: 14 }} />,
    featureColor: '#8B5CF6',
    statusImages: ['/img/guide/status_off.png', '/img/guide/remote.png'],
  },
];

export default function GuidePage() {
  return (
    <>
      {/* ── Hero ── */}
      <Box
        sx={{
          background: 'linear-gradient(180deg, #F5F5F7 0%, #fff 100%)',
          pt: { xs: 7, md: 11 },
          pb: { xs: 5, md: 8 },
          textAlign: 'center',
          position: 'relative',
          overflow: 'hidden',
        }}
      >
        <Box sx={{ position: 'absolute', top: -60, left: '25%', width: 400, height: 400, borderRadius: '50%', background: alpha('#FF9500', 0.07), filter: 'blur(90px)', pointerEvents: 'none' }} />
        <Box sx={{ position: 'absolute', top: -40, right: '20%', width: 350, height: 350, borderRadius: '50%', background: alpha('#8B5CF6', 0.07), filter: 'blur(80px)', pointerEvents: 'none' }} />

        <Container maxWidth="md" sx={{ position: 'relative' }}>
          <Box
            sx={{
              display: 'inline-flex', alignItems: 'center', gap: 1,
              bgcolor: alpha('#007AFF', 0.08), color: '#007AFF',
              px: 2.5, py: 0.75, borderRadius: 980, mb: 3,
            }}
          >
            <LightbulbOutlinedIcon sx={{ fontSize: 16 }} />
            <Typography variant="body2" sx={{ fontWeight: 600 }}>Hướng dẫn sử dụng</Typography>
          </Box>

          <Typography
            variant="h2"
            sx={{ fontWeight: 700, fontSize: { xs: 28, md: 46 }, letterSpacing: '-0.03em', mb: 2, lineHeight: 1.15 }}
          >
            Chọn loại đèn{' '}
            <Box
              component="span"
              sx={{
                background: 'linear-gradient(135deg, #FF9500 0%, #8B5CF6 100%)',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
              }}
            >
              của bạn
            </Box>
          </Typography>

          <Typography
            variant="body1"
            color="text.secondary"
            sx={{ fontSize: { xs: 15, md: 17 }, maxWidth: 480, mx: 'auto', lineHeight: 1.7 }}
          >
            Chọn đúng loại đèn để xem hướng dẫn chi tiết cách sử dụng và các tính năng đặc trưng.
          </Typography>
        </Container>
      </Box>

      <Container maxWidth="lg" sx={{ pb: { xs: 10, md: 14 } }}>

        {/* ── Guide cards ── */}
        <Grid container spacing={{ xs: 2.5, md: 4 }} sx={{ mb: { xs: 6, md: 10 } }}>
          {GUIDES.map((g) => (
            <Grid key={g.href} size={{ xs: 12, md: 6 }}>
              <Paper
                elevation={0}
                component={Link}
                href={g.href}
                sx={{
                  display: 'block',
                  textDecoration: 'none',
                  borderRadius: 4,
                  border: '1.5px solid',
                  borderColor: alpha(g.accent, 0.2),
                  overflow: 'hidden',
                  transition: 'all 0.22s ease',
                  '&:hover': {
                    borderColor: alpha(g.accent, 0.5),
                    transform: 'translateY(-4px)',
                    boxShadow: `0 16px 48px ${alpha(g.accent, 0.15)}`,
                  },
                }}
              >
                {/* Image strip */}
                <Box
                  sx={{
                    display: 'flex',
                    bgcolor: g.bgLight,
                    borderBottom: `1px solid ${alpha(g.accent, 0.12)}`,
                    height: 180,
                    overflow: 'hidden',
                    position: 'relative',
                  }}
                >
                  {g.statusImages.map((src, i) => (
                    <Box
                      key={src}
                      sx={{
                        flex: 1,
                        position: 'relative',
                        borderRight: i < g.statusImages.length - 1 ? `1px solid ${alpha(g.accent, 0.12)}` : 'none',
                      }}
                    >
                      <Image src={src} alt="" fill style={{ objectFit: 'contain', padding: '20px' }} />
                    </Box>
                  ))}

                  {/* Gradient overlay top-right */}
                  <Box
                    sx={{
                      position: 'absolute', top: 12, right: 12,
                      width: 56, height: 56, borderRadius: 3,
                      background: `linear-gradient(135deg, ${g.gradientFrom} 0%, ${g.gradientTo} 100%)`,
                      display: 'flex', alignItems: 'center', justifyContent: 'center',
                      boxShadow: `0 4px 16px ${alpha(g.accent, 0.35)}`,
                    }}
                  >
                    <g.Icon sx={{ fontSize: 28, color: '#fff' }} />
                  </Box>
                </Box>

                {/* Content */}
                <Box sx={{ p: { xs: 2.5, md: 3 } }}>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1.5, flexWrap: 'wrap' }}>
                    <Typography variant="h6" sx={{ fontWeight: 700 }}>{g.title}</Typography>
                    <Chip
                      label={g.badge}
                      size="small"
                      sx={{ height: 20, fontSize: 11, bgcolor: alpha(g.accent, 0.1), color: g.accent, fontWeight: 600, border: `1px solid ${alpha(g.accent, 0.2)}` }}
                    />
                  </Box>

                  <Typography variant="body2" color="text.secondary" sx={{ lineHeight: 1.7, mb: 2.5 }}>
                    {g.desc}
                  </Typography>

                  <Stack spacing={1} sx={{ mb: 3 }}>
                    {g.features.map((f) => (
                      <Box key={f} sx={{ display: 'flex', gap: 1, alignItems: 'center' }}>
                        <Box sx={{ color: g.featureColor, display: 'flex', alignItems: 'center', flexShrink: 0 }}>
                          {g.featureIcon}
                        </Box>
                        <Typography variant="body2" color="text.secondary" sx={{ fontSize: 13 }}>{f}</Typography>
                      </Box>
                    ))}
                  </Stack>

                  <Box
                    sx={{
                      display: 'inline-flex', alignItems: 'center', gap: 0.75,
                      color: g.accent, fontWeight: 600, fontSize: 14,
                    }}
                  >
                    Xem hướng dẫn
                    <ArrowForwardIcon sx={{ fontSize: 16 }} />
                  </Box>
                </Box>
              </Paper>
            </Grid>
          ))}
        </Grid>

        {/* ── Help CTA ── */}
        <Paper
          elevation={0}
          sx={{
            p: { xs: 3, md: 4 },
            borderRadius: 4,
            background: 'linear-gradient(135deg, #F5F5F7 0%, #EAF3FF 100%)',
            border: `1px solid ${alpha('#007AFF', 0.15)}`,
            display: 'flex',
            gap: 2,
            alignItems: { sm: 'center' },
            flexDirection: { xs: 'column', sm: 'row' },
          }}
        >
          <Box
            sx={{
              width: 48, height: 48, borderRadius: 3, flexShrink: 0,
              bgcolor: alpha('#007AFF', 0.1),
              display: 'flex', alignItems: 'center', justifyContent: 'center',
            }}
          >
            <ContactSupportOutlinedIcon sx={{ color: 'primary.main', fontSize: 24 }} />
          </Box>
          <Box sx={{ flex: 1 }}>
            <Typography variant="body1" sx={{ fontWeight: 700, mb: 0.5 }}>Vẫn cần hỗ trợ thêm?</Typography>
            <Typography variant="body2" color="text.secondary" sx={{ lineHeight: 1.65 }}>
              Đội ngũ Luxe Glow sẵn sàng giải đáp mọi thắc mắc từ 8:00 – 22:00 mỗi ngày qua Zalo và điện thoại.
            </Typography>
          </Box>
          <Button
            component={Link}
            href="/contact"
            variant="contained"
            sx={{ borderRadius: 980, px: 3, fontWeight: 600, flexShrink: 0 }}
            endIcon={<ArrowForwardIcon />}
          >
            Liên hệ ngay
          </Button>
        </Paper>
      </Container>
    </>
  );
}

'use client';

import Link from 'next/link';
import {
  Box, Container, Typography, Stack, Paper, alpha, Button, Chip,
} from '@mui/material';
import LightbulbOutlinedIcon from '@mui/icons-material/LightbulbOutlined';
import AutoAwesomeOutlinedIcon from '@mui/icons-material/AutoAwesomeOutlined';
import ArrowForwardIcon from '@mui/icons-material/ArrowForward';
import MenuBookOutlinedIcon from '@mui/icons-material/MenuBookOutlined';
import TouchAppOutlinedIcon from '@mui/icons-material/TouchAppOutlined';
import SettingsRemoteOutlinedIcon from '@mui/icons-material/SettingsRemoteOutlined';

const GUIDE_ITEMS = [
  {
    href: '/guide/den-3-mau',
    accent: '#FF9500',
    bg: '#FFF9EC',
    Icon: LightbulbOutlinedIcon,
    FeatureIcon: TouchAppOutlinedIcon,
    title: 'Đèn 3 Màu',
    badge: 'Không remote',
    desc: 'Chuyển màu & điều chỉnh độ sáng qua công tắc cảm ứng trên dây nguồn.',
  },
  {
    href: '/guide/den-nhieu-mau',
    accent: '#8B5CF6',
    bg: '#F5F0FF',
    Icon: AutoAwesomeOutlinedIcon,
    FeatureIcon: SettingsRemoteOutlinedIcon,
    title: 'Đèn Nhiều Màu',
    badge: 'Có remote',
    desc: 'Điều chỉnh màu RGB, hiệu ứng và độ sáng bằng remote điều khiển từ xa.',
  },
];

export function GuideBanner() {
  return (
    <Box component="section" sx={{ bgcolor: '#F5F5F7', py: { xs: 6, md: 10 } }}>
      <Container maxWidth="lg">
        {/* Header */}
        <Box
          sx={{
            display: 'flex',
            alignItems: { xs: 'flex-start', sm: 'center' },
            justifyContent: 'space-between',
            flexDirection: { xs: 'column', sm: 'row' },
            gap: 2,
            mb: { xs: 3.5, md: 5 },
          }}
        >
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
            <Box
              sx={{
                width: 40, height: 40, borderRadius: 2.5, flexShrink: 0,
                background: 'linear-gradient(135deg, #FF9500 0%, #8B5CF6 100%)',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
              }}
            >
              <MenuBookOutlinedIcon sx={{ fontSize: 20, color: '#fff' }} />
            </Box>
            <Box>
              <Typography variant="h5" sx={{ fontWeight: 700, lineHeight: 1.2 }}>
                Hướng dẫn sử dụng đèn
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Chọn loại đèn để xem hướng dẫn chi tiết
              </Typography>
            </Box>
          </Box>

          <Button
            component={Link}
            href="/guide"
            variant="outlined"
            size="small"
            endIcon={<ArrowForwardIcon sx={{ fontSize: '14px !important' }} />}
            sx={{ borderRadius: 980, flexShrink: 0, display: { xs: 'none', sm: 'inline-flex' } }}
          >
            Xem tất cả
          </Button>
        </Box>

        {/* Guide cards */}
        <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2.5}>
          {GUIDE_ITEMS.map((g) => (
            <Paper
              key={g.href}
              elevation={0}
              component={Link}
              href={g.href}
              sx={{
                flex: 1,
                display: 'flex',
                gap: 2,
                alignItems: 'flex-start',
                p: { xs: 2.5, md: 3 },
                borderRadius: 4,
                textDecoration: 'none',
                border: '1.5px solid',
                borderColor: alpha(g.accent, 0.2),
                bgcolor: '#fff',
                transition: 'all 0.2s ease',
                '&:hover': {
                  borderColor: alpha(g.accent, 0.5),
                  bgcolor: g.bg,
                  transform: 'translateY(-2px)',
                  boxShadow: `0 8px 32px ${alpha(g.accent, 0.12)}`,
                },
              }}
            >
              {/* Icon */}
              <Box
                sx={{
                  width: 48, height: 48, borderRadius: 2.5, flexShrink: 0,
                  bgcolor: alpha(g.accent, 0.1),
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                }}
              >
                <g.Icon sx={{ fontSize: 24, color: g.accent }} />
              </Box>

              {/* Text */}
              <Box sx={{ flex: 1, minWidth: 0 }}>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 0.75, flexWrap: 'wrap' }}>
                  <Typography variant="body1" sx={{ fontWeight: 700 }}>{g.title}</Typography>
                  <Chip
                    label={g.badge}
                    size="small"
                    sx={{ height: 18, fontSize: 10, bgcolor: alpha(g.accent, 0.08), color: g.accent, fontWeight: 600 }}
                  />
                </Box>
                <Typography variant="body2" color="text.secondary" sx={{ lineHeight: 1.6, mb: 1.5 }}>
                  {g.desc}
                </Typography>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5, color: g.accent }}>
                  <g.FeatureIcon sx={{ fontSize: 14 }} />
                  <Typography variant="caption" sx={{ fontWeight: 600, color: 'inherit' }}>
                    Xem hướng dẫn
                  </Typography>
                  <ArrowForwardIcon sx={{ fontSize: 12 }} />
                </Box>
              </Box>
            </Paper>
          ))}
        </Stack>

        {/* Mobile "Xem tất cả" button */}
        <Box sx={{ mt: 2.5, display: { xs: 'flex', sm: 'none' }, justifyContent: 'center' }}>
          <Button
            component={Link}
            href="/guide"
            variant="outlined"
            size="small"
            endIcon={<ArrowForwardIcon sx={{ fontSize: '14px !important' }} />}
            sx={{ borderRadius: 980 }}
          >
            Xem tất cả hướng dẫn
          </Button>
        </Box>
      </Container>
    </Box>
  );
}

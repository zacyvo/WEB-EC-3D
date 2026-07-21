'use client';

import Link from 'next/link';
import { Box, Container, Typography, Stack, Button, alpha } from '@mui/material';
import HandshakeOutlinedIcon from '@mui/icons-material/HandshakeOutlined';
import ArrowForwardIcon from '@mui/icons-material/ArrowForward';
import WorkspacePremiumOutlinedIcon from '@mui/icons-material/WorkspacePremiumOutlined';

export function PartnershipBanner() {
  return (
    <Box component="section" sx={{ py: { xs: 7, md: 10 } }}>
      <Container maxWidth="lg">
        <Box
          sx={{
            position: 'relative',
            overflow: 'hidden',
            borderRadius: 5,
            px: { xs: 3, md: 7 },
            py: { xs: 5, md: 6.5 },
            background: 'linear-gradient(135deg, #007AFF 0%, #8B5CF6 100%)',
            display: 'flex',
            flexDirection: { xs: 'column', md: 'row' },
            alignItems: 'center',
            justifyContent: 'space-between',
            gap: { xs: 3.5, md: 4 },
          }}
        >
          <Box sx={{ position: 'absolute', inset: 0, pointerEvents: 'none' }}>
            <Box sx={{ position: 'absolute', top: -120, right: -80, width: 320, height: 320, borderRadius: '50%', bgcolor: alpha('#fff', 0.08) }} />
            <Box sx={{ position: 'absolute', bottom: -140, left: -60, width: 280, height: 280, borderRadius: '50%', bgcolor: alpha('#fff', 0.06) }} />
          </Box>

          <Box sx={{ position: 'relative', textAlign: { xs: 'center', md: 'left' } }}>
            <Box
              sx={{
                display: 'inline-flex', alignItems: 'center', gap: 1,
                bgcolor: alpha('#fff', 0.15), color: '#fff',
                px: 2, py: 0.6, borderRadius: 980, mb: 2,
              }}
            >
              <WorkspacePremiumOutlinedIcon sx={{ fontSize: 16 }} />
              <Typography variant="body2" sx={{ fontWeight: 600 }}>Dành cho đối tác kinh doanh</Typography>
            </Box>

            <Typography variant="h4" sx={{ color: '#fff', fontWeight: 700, mb: 1.25, fontSize: { xs: 22, md: 28 } }}>
              Trở thành đối tác sản xuất cùng Luxe Glow
            </Typography>
            <Typography sx={{ color: alpha('#fff', 0.85), maxWidth: 520, lineHeight: 1.7 }}>
              4 cấp độ hợp tác với giá cung cấp ưu đãi và mức độ ưu tiên sản xuất tăng dần theo sản lượng, doanh số hằng tháng.
            </Typography>
          </Box>

          <Button
            component={Link}
            href="/partnership"
            variant="contained"
            size="large"
            endIcon={<ArrowForwardIcon />}
            startIcon={<HandshakeOutlinedIcon />}
            sx={{
              position: 'relative', flexShrink: 0,
              bgcolor: '#fff', color: 'white', px: 3.5, py: 1.5,
              fontWeight: 600, borderRadius: 980,
              '&:hover': { bgcolor: alpha('#fff', 0.9) },
            }}
          >
            Xem chính sách hợp tác
          </Button>
        </Box>
      </Container>
    </Box>
  );
}

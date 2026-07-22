'use client';
import Link from 'next/link';
import { Box, Container, Typography, Button, alpha, Stack } from '@mui/material';
import AutoAwesomeIcon from '@mui/icons-material/AutoAwesome';
import ArrowForwardIcon from '@mui/icons-material/ArrowForward';

const STATS = [
  { value: '500+', label: 'Sản phẩm đã bán' },
  { value: '4.9★', label: 'Đánh giá khách hàng' },
  { value: '3-7', label: 'Ngày giao hàng' },
];

export function HeroSection() {
  return (
    <Box
      component="section"
      sx={{
        position: 'relative', overflow: 'hidden',
        background: 'linear-gradient(180deg, #F5F5F7 0%, #ffffff 100%)',
        pt: { xs: 8, md: 14 }, pb: { xs: 10, md: 18 },
      }}
    >
      {/* Decorative blobs */}
      <Box sx={{ position: 'absolute', inset: 0, pointerEvents: 'none', overflow: 'hidden' }}>
        <Box sx={{ position: 'absolute', top: -160, right: -160, width: 480, height: 480, borderRadius: '50%', background: alpha('#007AFF', 0.08), filter: 'blur(80px)' }} />
        <Box sx={{ position: 'absolute', bottom: -80, left: -80, width: 400, height: 400, borderRadius: '50%', background: alpha('#8B5CF6', 0.06), filter: 'blur(80px)' }} />
      </Box>

      <Container maxWidth="lg" sx={{ position: 'relative' }}>
        <Box sx={{ textAlign: 'center', maxWidth: 800, mx: 'auto' }}>
          {/* Badge */}
          <Box sx={{ display: 'inline-flex', alignItems: 'center', gap: 1, bgcolor: alpha('#007AFF', 0.08), color: 'primary.main', px: 2.5, py: 0.75, borderRadius: 980, mb: 4 }}>
            <AutoAwesomeIcon sx={{ fontSize: 16 }} />
            <Typography variant="body2" sx={{ fontWeight: 600 }}>Xưởng in 3D theo ý tưởng của bạn</Typography>
          </Box>

          <Typography variant="h1" sx={{ fontSize: { xs: 40, md: 68, lg: 80 }, fontWeight: 700, letterSpacing: '-0.04em', mb: 3, lineHeight: 1.05 }}>
            Mọi thứ quanh bạn,{' '}
            <Box component="span" sx={{ background: 'linear-gradient(135deg, #007AFF 0%, #8B5CF6 100%)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>
              đều có thể in 3D
            </Box>
          </Typography>

          <Typography variant="body1" color="text.secondary" sx={{ fontSize: { xs: 17, md: 20 }, mb: 5, maxWidth: 560, mx: 'auto', lineHeight: 1.65 }}>
            Bạn có ý tưởng, Luxe Glow thực hiện nó. Từ những chiếc đèn nghệ thuật làm nên tên tuổi
            chúng tôi, đến bất kỳ ý tưởng nào bạn mang tới — công nghệ in 3D FDM biến nó thành sản phẩm thật.
          </Typography>

          <Stack direction={{ xs: 'column', sm: 'row' }} spacing={1.5} sx={{ justifyContent: 'center' }}>
            <Button
              component={Link} href="/products"
              variant="contained" size="large"
              endIcon={<ArrowForwardIcon />}
              sx={{ px: 4, py: 1.75, fontSize: '1rem', fontWeight: 600 }}
            >
              Khám phá sản phẩm
            </Button>
            <Button component={Link} href="/custom-order" variant="outlined" size="large" sx={{ px: 4, py: 1.75, fontSize: '1rem' }}>
              Gửi ý tưởng của bạn
            </Button>
          </Stack>

          {/* Stats */}
          <Box sx={{ mt: 8, display: 'grid', gridTemplateColumns: 'repeat(3,1fr)', maxWidth: 400, mx: 'auto', gap: 2 }}>
            {STATS.map(({ value, label }) => (
              <Box key={label} sx={{ textAlign: 'center' }}>
                <Typography variant="h5" color="text.primary" sx={{ fontWeight: 700 }}>{value}</Typography>
                <Typography variant="caption" color="text.secondary">{label}</Typography>
              </Box>
            ))}
          </Box>
        </Box>
      </Container>
    </Box>
  );
}

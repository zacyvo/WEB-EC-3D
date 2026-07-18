'use client';
import Link from 'next/link';
import { Box, Container, Grid, Typography, Divider, Stack } from '@mui/material';

const PRODUCTS = ['Đèn Bàn', 'Đèn Trần', 'Đèn Tường', 'Đèn Ngủ', 'Đèn Trang Trí'];
const SUPPORT = [
  { label: 'Hướng dẫn sử dụng đèn', href: '/guide' },
  { label: 'Hướng dẫn đặt hàng', href: '/order-guide' },
  { label: 'Câu hỏi thường gặp', href: '/faq' },
  { label: 'Liên hệ', href: '/contact' },
];

export function Footer() {
  return (
    <Box component="footer" sx={{ display: { xs: 'none', md: 'block' }, bgcolor: 'grey.50', borderTop: '1px solid', borderColor: 'divider', mt: 10 }}>
      <Container maxWidth="lg" sx={{ py: 7 }}>
        <Grid container spacing={4}>
          <Grid size={{ xs: 12, md: 4 }}>
            <Link href="/" style={{ textDecoration: 'none' }}>
              <Typography variant="h6" color="text.primary" gutterBottom sx={{ fontWeight: 700 }}>Luxe Glow</Typography>
            </Link>
            <Typography variant="body2" color="text.secondary" sx={{ lineHeight: 1.7, maxWidth: 260 }}>
              Đèn in 3D handcraft độc đáo, thiết kế theo phong cách tối giản hiện đại.
            </Typography>
          </Grid>
          <Grid size={{ xs: 6, md: 3 }}>
            <Typography variant="body2" color="text.primary" gutterBottom sx={{ fontWeight: 600 }}>Sản phẩm</Typography>
            <Stack spacing={1}>
              {PRODUCTS.map((p) => (
                <Link key={p} href="/products" style={{ textDecoration: 'none' }}>
                  <Typography variant="body2" color="text.secondary" sx={{ '&:hover': { color: 'primary.main' }, transition: 'color 0.15s' }}>{p}</Typography>
                </Link>
              ))}
            </Stack>
          </Grid>
          <Grid size={{ xs: 6, md: 2 }}>
            <Typography variant="body2" color="text.primary" gutterBottom sx={{ fontWeight: 600 }}>Hỗ trợ</Typography>
            <Stack spacing={1}>
              {SUPPORT.map(({ label, href }) => (
                <Link key={label} href={href} style={{ textDecoration: 'none' }}>
                  <Typography variant="body2" color="text.secondary" sx={{ '&:hover': { color: 'primary.main' }, transition: 'color 0.15s' }}>{label}</Typography>
                </Link>
              ))}
            </Stack>
          </Grid>
          <Grid size={{ xs: 12, md: 3 }}>
            <Typography variant="body2" color="text.primary" gutterBottom sx={{ fontWeight: 600 }}>Liên hệ</Typography>
            <Stack spacing={1}>
              {['📞 0909064680', '✉️ [support@luxe-glow.vn](mailto:support@luxe-glow.vn)', '📍 Bình Tân, TP. HCM', '🏢 MST: 079197022908'].map((t) => (
                <Typography key={t} variant="body2" color="text.secondary">{t}</Typography>
              ))}
            </Stack>
          </Grid>
        </Grid>
        <Divider sx={{ my: 4 }} />
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: 1 }}>
          <Typography variant="caption" color="text.disabled">© {new Date().getFullYear()} Luxe Glow. All rights reserved.</Typography>
          <Box sx={{ display: 'flex', gap: 2, flexWrap: 'wrap' }}>
            <Link href="/privacy-policy" style={{ textDecoration: 'none' }}>
              <Typography variant="caption" color="text.disabled" sx={{ '&:hover': { color: 'text.secondary' }, transition: 'color 0.15s' }}>Chính sách bảo mật</Typography>
            </Link>
            <Link href="/terms-of-service" style={{ textDecoration: 'none' }}>
              <Typography variant="caption" color="text.disabled" sx={{ '&:hover': { color: 'text.secondary' }, transition: 'color 0.15s' }}>Điều khoản dịch vụ</Typography>
            </Link>
          </Box>
        </Box>
      </Container>
    </Box>
  );
}

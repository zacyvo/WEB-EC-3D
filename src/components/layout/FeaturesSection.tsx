'use client';
import { Box, Container, Grid, Typography, Paper, alpha } from '@mui/material';
import LocalShippingOutlinedIcon from '@mui/icons-material/LocalShippingOutlined';
import VerifiedOutlinedIcon from '@mui/icons-material/VerifiedOutlined';
import CachedOutlinedIcon from '@mui/icons-material/CachedOutlined';
import SupportAgentOutlinedIcon from '@mui/icons-material/SupportAgentOutlined';

const FEATURES = [
  { Icon: LocalShippingOutlinedIcon, title: 'Giao hàng nhanh', desc: 'Nhận hàng trong 3-7 ngày làm việc trên toàn quốc.' },
  { Icon: VerifiedOutlinedIcon, title: 'Bảo hành 12 tháng', desc: 'Cam kết đổi mới nếu sản phẩm có lỗi từ nhà sản xuất.' },
  { Icon: CachedOutlinedIcon, title: 'Đổi trả 30 ngày', desc: 'Không hài lòng? Đổi trả miễn phí trong vòng 30 ngày.' },
  { Icon: SupportAgentOutlinedIcon, title: 'Hỗ trợ 24/7', desc: 'Đội ngũ tư vấn luôn sẵn sàng hỗ trợ bạn mọi lúc.' },
];

export function FeaturesSection() {
  return (
    <Box id="features" component="section" sx={{ bgcolor: 'grey.50', py: { xs: 7, md: 12 } }}>
      <Container maxWidth="lg">
        <Box sx={{ textAlign: 'center', mb: 7 }}>
          <Typography variant="h3" sx={{ mb: 1.5, fontWeight: 700  }}>Tại sao chọn chúng tôi?</Typography>
          <Typography variant="body1" color="text.secondary" sx={{ fontSize: 17 }}>Chúng tôi cam kết mang đến trải nghiệm mua sắm tốt nhất</Typography>
        </Box>
        <Grid container spacing={3}>
          {FEATURES.map(({ Icon, title, desc }) => (
            <Grid key={title} size={{ xs: 12, sm: 6, lg: 3 }}>
              <Paper elevation={0} sx={{ p: 3.5, height: '100%', border: '1px solid', borderColor: 'divider', transition: 'box-shadow 0.2s', '&:hover': { boxShadow: 3 } }}>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5, mb: 1.5 }}>
                  <Box sx={{ width: 48, height: 48, flexShrink: 0, borderRadius: 3, bgcolor: alpha('#007AFF', 0.08), display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    <Icon sx={{ color: 'primary.main', fontSize: 24 }} />
                  </Box>
                  <Typography variant="h6" sx={{ fontWeight: 600 }}>{title}</Typography>
                </Box>
                <Typography variant="body2" color="text.secondary" sx={{ lineHeight: 1.65 }}>{desc}</Typography>
              </Paper>
            </Grid>
          ))}
        </Grid>
      </Container>
    </Box>
  );
}

'use client';
import Link from 'next/link';
import { Box, Container, Typography, Grid, Paper, Stack, Button, alpha } from '@mui/material';
import EmojiObjectsOutlinedIcon from '@mui/icons-material/EmojiObjectsOutlined';
import CardGiftcardOutlinedIcon from '@mui/icons-material/CardGiftcardOutlined';
import ViewInArOutlinedIcon from '@mui/icons-material/ViewInArOutlined';
import AutoAwesomeOutlinedIcon from '@mui/icons-material/AutoAwesomeOutlined';
import ChatBubbleOutlineOutlinedIcon from '@mui/icons-material/ChatBubbleOutlineOutlined';
import DesignServicesOutlinedIcon from '@mui/icons-material/DesignServicesOutlined';
import LocalShippingOutlinedIcon from '@mui/icons-material/LocalShippingOutlined';
import ArrowForwardIcon from '@mui/icons-material/ArrowForward';

const IDEAS = [
  {
    Icon: EmojiObjectsOutlinedIcon,
    accent: '#007AFF',
    title: 'Đèn trang trí',
    desc: 'Dòng sản phẩm chủ lực làm nên tên tuổi Luxe Glow, hàng trăm mẫu thiết kế độc quyền.',
  },
  {
    Icon: CardGiftcardOutlinedIcon,
    accent: '#8B5CF6',
    title: 'Quà tặng cá nhân hoá',
    desc: 'Khắc tên, hình ảnh, thông điệp riêng cho người bạn yêu thương.',
  },
  {
    Icon: ViewInArOutlinedIcon,
    accent: '#FF9500',
    title: 'Decor & mô hình',
    desc: 'Vật phẩm trang trí, mô hình thu nhỏ, chi tiết đúng như bạn hình dung.',
  },
  {
    Icon: AutoAwesomeOutlinedIcon,
    accent: '#34C759',
    title: 'Ý tưởng của riêng bạn',
    desc: 'Chưa từng thấy ở đâu? Gửi ý tưởng, chúng tôi hiện thực hoá nó.',
  },
];

const STEPS = [
  { Icon: ChatBubbleOutlineOutlinedIcon, title: 'Chia sẻ ý tưởng', desc: 'Mô tả sản phẩm bạn muốn, kèm ảnh tham khảo nếu có.' },
  { Icon: DesignServicesOutlinedIcon, title: 'Luxe Glow thiết kế & báo giá', desc: 'Đội ngũ tư vấn dựng mô hình 3D và báo giá minh bạch.' },
  { Icon: LocalShippingOutlinedIcon, title: 'In 3D & giao đến bạn', desc: 'Sản xuất bằng công nghệ FDM, kiểm tra kỹ trước khi giao.' },
];

export function IdeaToRealitySection() {
  return (
    <Box component="section" sx={{ py: { xs: 7, md: 11 } }}>
      <Container maxWidth="lg">
        <Box sx={{ textAlign: 'center', maxWidth: 640, mx: 'auto', mb: { xs: 5, md: 7 } }}>
          <Typography variant="overline" sx={{ color: 'primary.main', fontWeight: 700, letterSpacing: '0.08em' }}>
            In 3D theo ý tưởng của bạn
          </Typography>
          <Typography variant="h3" sx={{ fontWeight: 700, mt: 1, mb: 1.5, fontSize: { xs: 28, md: 36 } }}>
            Không chỉ là đèn — là mọi ý tưởng
          </Typography>
          <Typography variant="body1" color="text.secondary" sx={{ fontSize: 17, lineHeight: 1.65 }}>
            Đèn nghệ thuật là khởi đầu của chúng tôi. Nhưng công nghệ in 3D có thể làm được nhiều hơn thế —
            bạn có ý tưởng, Luxe Glow biến nó thành sản phẩm thật.
          </Typography>
        </Box>

        <Grid container spacing={2.5} sx={{ mb: { xs: 6, md: 8 } }}>
          {IDEAS.map(({ Icon, accent, title, desc }) => (
            <Grid key={title} size={{ xs: 12, sm: 6, lg: 3 }}>
              <Paper
                elevation={0}
                sx={{
                  p: 3, height: '100%', borderRadius: 4,
                  border: '1px solid', borderColor: 'divider',
                  transition: 'all 0.2s ease',
                  '&:hover': { borderColor: alpha(accent, 0.4), boxShadow: `0 8px 32px ${alpha(accent, 0.12)}` },
                }}
              >
                <Box sx={{ width: 48, height: 48, borderRadius: 2.5, bgcolor: alpha(accent, 0.1), display: 'flex', alignItems: 'center', justifyContent: 'center', mb: 2 }}>
                  <Icon sx={{ fontSize: 24, color: accent }} />
                </Box>
                <Typography variant="body1" sx={{ fontWeight: 700, mb: 0.75 }}>{title}</Typography>
                <Typography variant="body2" color="text.secondary" sx={{ lineHeight: 1.6 }}>{desc}</Typography>
              </Paper>
            </Grid>
          ))}
        </Grid>

        <Box sx={{ bgcolor: 'grey.50', borderRadius: 5, p: { xs: 3, md: 5 } }}>
          <Grid container spacing={{ xs: 3, md: 2 }} sx={{ alignItems: 'center' }}>
            {STEPS.map(({ Icon, title, desc }, i) => (
              <Grid key={title} size={{ xs: 12, md: 4 }}>
                <Stack direction="row" spacing={2} sx={{ alignItems: 'flex-start' }}>
                  <Box sx={{ width: 40, height: 40, flexShrink: 0, borderRadius: '50%', bgcolor: 'primary.main', color: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 700 }}>
                    {i + 1}
                  </Box>
                  <Box>
                    <Stack direction="row" spacing={1} sx={{ alignItems: 'center', mb: 0.5 }}>
                      <Icon sx={{ fontSize: 18, color: 'text.secondary' }} />
                      <Typography variant="body1" sx={{ fontWeight: 700 }}>{title}</Typography>
                    </Stack>
                    <Typography variant="body2" color="text.secondary" sx={{ lineHeight: 1.6 }}>{desc}</Typography>
                  </Box>
                </Stack>
              </Grid>
            ))}
          </Grid>

          <Box sx={{ textAlign: 'center', mt: { xs: 4, md: 5 } }}>
            <Button
              component={Link}
              href="/custom-order"
              variant="contained"
              size="large"
              endIcon={<ArrowForwardIcon />}
              sx={{ px: 4, py: 1.5, fontWeight: 600, borderRadius: 980 }}
            >
              Gửi ý tưởng của bạn
            </Button>
          </Box>
        </Box>
      </Container>
    </Box>
  );
}

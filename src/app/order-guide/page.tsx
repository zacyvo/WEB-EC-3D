'use client';

import Link from 'next/link';
import {
  Box, Container, Typography, Grid, Stack, Button, Paper,
  Chip, alpha, Divider,
} from '@mui/material';
import AccountCircleOutlinedIcon from '@mui/icons-material/AccountCircleOutlined';
import SearchOutlinedIcon from '@mui/icons-material/SearchOutlined';
import AddShoppingCartOutlinedIcon from '@mui/icons-material/AddShoppingCartOutlined';
import LocalShippingOutlinedIcon from '@mui/icons-material/LocalShippingOutlined';
import PaymentOutlinedIcon from '@mui/icons-material/PaymentOutlined';
import CheckCircleOutlineIcon from '@mui/icons-material/CheckCircleOutlined';
import TrackChangesOutlinedIcon from '@mui/icons-material/TrackChangesOutlined';
import HelpOutlineIcon from '@mui/icons-material/HelpOutlined';
import ArrowForwardIcon from '@mui/icons-material/ArrowForward';
import TipsAndUpdatesOutlinedIcon from '@mui/icons-material/TipsAndUpdatesOutlined';
import ContactSupportOutlinedIcon from '@mui/icons-material/ContactSupportOutlined';
import PhoneOutlinedIcon from '@mui/icons-material/PhoneOutlined';

// ── Step visual mockup ───────────────────────────────────────────────────────

function StepMock({ step }: { step: number }) {
  const mocks: Record<
    number,
    { bg: string; accent: string; icon: React.ReactNode; ui: React.ReactNode }
  > = {
    1: {
      bg: '#EAF3FF',
      accent: '#007AFF',
      icon: <AccountCircleOutlinedIcon sx={{ fontSize: 28, color: '#007AFF' }} />,
      ui: (
        <Box sx={{ width: '100%' }}>
          <Box sx={{ bgcolor: '#fff', borderRadius: 2, p: 2, mb: 1.5, border: '1px solid', borderColor: alpha('#007AFF', 0.15) }}>
            <Typography sx={{ fontSize: 10, color: '#636366', mb: 0.5 }}>Email / Số điện thoại</Typography>
            <Box sx={{ height: 10, bgcolor: alpha('#007AFF', 0.15), borderRadius: 1, width: '70%' }} />
          </Box>
          <Box sx={{ bgcolor: '#fff', borderRadius: 2, p: 2, mb: 1.5, border: '1px solid', borderColor: alpha('#007AFF', 0.15) }}>
            <Typography sx={{ fontSize: 10, color: '#636366', mb: 0.5 }}>Mật khẩu</Typography>
            <Box sx={{ height: 10, bgcolor: alpha('#007AFF', 0.08), borderRadius: 1, width: '50%' }} />
          </Box>
          <Box sx={{ bgcolor: '#007AFF', borderRadius: 2, p: 1.5, textAlign: 'center' }}>
            <Typography sx={{ fontSize: 11, fontWeight: 700, color: '#fff' }}>Đăng nhập</Typography>
          </Box>
        </Box>
      ),
    },
    2: {
      bg: '#F0FBF2',
      accent: '#34C759',
      icon: <SearchOutlinedIcon sx={{ fontSize: 28, color: '#34C759' }} />,
      ui: (
        <Box sx={{ width: '100%' }}>
          <Box sx={{ bgcolor: '#fff', borderRadius: 2, p: 1.5, mb: 1.5, display: 'flex', alignItems: 'center', gap: 1, border: '1px solid', borderColor: alpha('#34C759', 0.2) }}>
            <SearchOutlinedIcon sx={{ fontSize: 14, color: '#AEAEB2' }} />
            <Box sx={{ height: 8, bgcolor: '#F5F5F7', borderRadius: 1, flex: 1 }} />
          </Box>
          <Grid container spacing={1}>
            {[1, 2, 3, 4].map((i) => (
              <Grid key={i} size={6}>
                <Box sx={{ bgcolor: '#fff', borderRadius: 2, p: 1, border: '1px solid', borderColor: 'divider' }}>
                  <Box sx={{ height: 40, bgcolor: alpha('#34C759', 0.08), borderRadius: 1, mb: 1 }} />
                  <Box sx={{ height: 6, bgcolor: '#F5F5F7', borderRadius: 1, mb: 0.5, width: '80%' }} />
                  <Box sx={{ height: 6, bgcolor: '#F5F5F7', borderRadius: 1, width: '50%' }} />
                </Box>
              </Grid>
            ))}
          </Grid>
        </Box>
      ),
    },
    3: {
      bg: '#FFF5EA',
      accent: '#FF9500',
      icon: <AddShoppingCartOutlinedIcon sx={{ fontSize: 28, color: '#FF9500' }} />,
      ui: (
        <Box sx={{ width: '100%' }}>
          {/* Product line */}
          <Box sx={{ bgcolor: '#fff', borderRadius: 2, p: 1.5, mb: 1.5, display: 'flex', gap: 1.5, border: '1px solid', borderColor: alpha('#FF9500', 0.2) }}>
            <Box sx={{ width: 44, height: 44, bgcolor: alpha('#FF9500', 0.12), borderRadius: 1.5, flexShrink: 0 }} />
            <Box sx={{ flex: 1 }}>
              <Box sx={{ height: 7, bgcolor: '#E8E8ED', borderRadius: 1, mb: 0.75, width: '75%' }} />
              <Box sx={{ height: 7, bgcolor: '#E8E8ED', borderRadius: 1, width: '40%' }} />
            </Box>
          </Box>
          {/* Qty row */}
          <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 1.5 }}>
            <Typography sx={{ fontSize: 10, color: '#636366' }}>Số lượng</Typography>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
              <Box sx={{ width: 20, height: 20, borderRadius: 1, bgcolor: '#F5F5F7', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <Typography sx={{ fontSize: 12, fontWeight: 700 }}>−</Typography>
              </Box>
              <Typography sx={{ fontSize: 12, fontWeight: 700 }}>1</Typography>
              <Box sx={{ width: 20, height: 20, borderRadius: 1, bgcolor: alpha('#FF9500', 0.15), display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <Typography sx={{ fontSize: 12, fontWeight: 700, color: '#FF9500' }}>+</Typography>
              </Box>
            </Box>
          </Box>
          <Box sx={{ bgcolor: '#FF9500', borderRadius: 2, p: 1.5, textAlign: 'center' }}>
            <Typography sx={{ fontSize: 11, fontWeight: 700, color: '#fff' }}>Thêm vào giỏ hàng</Typography>
          </Box>
        </Box>
      ),
    },
    4: {
      bg: '#F5F5F7',
      accent: '#636366',
      icon: <LocalShippingOutlinedIcon sx={{ fontSize: 28, color: '#636366' }} />,
      ui: (
        <Box sx={{ width: '100%' }}>
          {[
            { label: 'Họ và tên', w: '60%' },
            { label: 'Số điện thoại', w: '50%' },
            { label: 'Địa chỉ', w: '85%' },
          ].map(({ label, w }) => (
            <Box key={label} sx={{ bgcolor: '#fff', borderRadius: 2, p: 2, mb: 1, border: '1px solid', borderColor: 'divider' }}>
              <Typography sx={{ fontSize: 9, color: '#AEAEB2', mb: 0.5 }}>{label}</Typography>
              <Box sx={{ height: 8, bgcolor: '#F5F5F7', borderRadius: 1, width: w }} />
            </Box>
          ))}
        </Box>
      ),
    },
    5: {
      bg: '#FBF0FF',
      accent: '#8B5CF6',
      icon: <PaymentOutlinedIcon sx={{ fontSize: 28, color: '#8B5CF6' }} />,
      ui: (
        <Box sx={{ width: '100%' }}>
          {[
            { label: 'Thanh toán khi nhận hàng (COD)', active: true },
            { label: 'Chuyển khoản ngân hàng', active: false },
            { label: 'Ví điện tử (Momo, ZaloPay…)', active: false },
          ].map(({ label, active }) => (
            <Box
              key={label}
              sx={{
                bgcolor: active ? alpha('#8B5CF6', 0.08) : '#fff',
                borderRadius: 2, p: 1.5, mb: 1,
                border: '1px solid',
                borderColor: active ? alpha('#8B5CF6', 0.4) : 'divider',
                display: 'flex', alignItems: 'center', gap: 1.5,
              }}
            >
              <Box
                sx={{
                  width: 14, height: 14, borderRadius: '50%', flexShrink: 0,
                  border: `2px solid ${active ? '#8B5CF6' : '#AEAEB2'}`,
                  bgcolor: active ? '#8B5CF6' : 'transparent',
                }}
              />
              <Typography sx={{ fontSize: 10, fontWeight: active ? 600 : 400, color: active ? '#8B5CF6' : 'text.secondary' }}>
                {label}
              </Typography>
            </Box>
          ))}
        </Box>
      ),
    },
    6: {
      bg: '#EAF3FF',
      accent: '#007AFF',
      icon: <CheckCircleOutlineIcon sx={{ fontSize: 28, color: '#007AFF' }} />,
      ui: (
        <Box sx={{ width: '100%', textAlign: 'center' }}>
          <Box
            sx={{
              width: 56, height: 56, borderRadius: '50%', bgcolor: alpha('#34C759', 0.12),
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              mx: 'auto', mb: 1.5,
            }}
          >
            <CheckCircleOutlineIcon sx={{ fontSize: 32, color: '#34C759' }} />
          </Box>
          <Typography sx={{ fontSize: 12, fontWeight: 700, mb: 0.5 }}>Đặt hàng thành công!</Typography>
          <Box sx={{ bgcolor: '#fff', borderRadius: 2, p: 1.5, border: '1px solid', borderColor: alpha('#007AFF', 0.2), mb: 1 }}>
            <Typography sx={{ fontSize: 10, color: '#636366' }}>Mã đơn hàng</Typography>
            <Typography sx={{ fontSize: 13, fontWeight: 800, fontFamily: 'monospace', color: '#007AFF' }}>#AB3F92C1</Typography>
          </Box>
          <Typography sx={{ fontSize: 10, color: '#636366', lineHeight: 1.5 }}>
            Email xác nhận đã gửi về hộp thư của bạn
          </Typography>
        </Box>
      ),
    },
    7: {
      bg: '#F0FBF2',
      accent: '#34C759',
      icon: <TrackChangesOutlinedIcon sx={{ fontSize: 28, color: '#34C759' }} />,
      ui: (
        <Box sx={{ width: '100%' }}>
          {[
            { label: 'Đặt hàng thành công', done: true },
            { label: 'Đang xử lý', done: true },
            { label: 'Đang giao hàng', done: false, active: true },
            { label: 'Đã nhận hàng', done: false },
          ].map(({ label, done, active }) => (
            <Box key={label} sx={{ display: 'flex', alignItems: 'center', gap: 1.5, mb: 1 }}>
              <Box
                sx={{
                  width: 20, height: 20, borderRadius: '50%', flexShrink: 0,
                  bgcolor: done ? '#34C759' : active ? alpha('#34C759', 0.2) : '#F5F5F7',
                  border: `2px solid ${done ? '#34C759' : active ? '#34C759' : '#E8E8ED'}`,
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                }}
              >
                {done && <CheckCircleOutlineIcon sx={{ fontSize: 12, color: '#fff' }} />}
              </Box>
              <Typography sx={{ fontSize: 11, fontWeight: done || active ? 600 : 400, color: done || active ? 'text.primary' : 'text.disabled' }}>
                {label}
              </Typography>
              {active && <Chip label="Đang xử lý" size="small" sx={{ height: 18, fontSize: 9, bgcolor: alpha('#34C759', 0.1), color: '#34C759', ml: 'auto' }} />}
            </Box>
          ))}
        </Box>
      ),
    },
  };

  const m = mocks[step];
  if (!m) return null;

  return (
    <Box
      sx={{
        borderRadius: 4,
        bgcolor: m.bg,
        border: `1.5px solid ${alpha(m.accent, 0.2)}`,
        p: 3,
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        gap: 2,
      }}
    >
      {m.ui}
    </Box>
  );
}

// ── Steps data ───────────────────────────────────────────────────────────────

const STEPS = [
  {
    n: 1,
    title: 'Tạo tài khoản & Đăng nhập',
    desc: 'Truy cập website Luxe Glow và tạo tài khoản miễn phí. Nếu đã có tài khoản, chỉ cần đăng nhập bằng email hoặc số điện thoại.',
    tips: ['Dùng email để dễ khôi phục mật khẩu', 'Có thể đặt hàng không cần tài khoản nếu muốn'],
    color: '#007AFF',
    Icon: AccountCircleOutlinedIcon,
  },
  {
    n: 2,
    title: 'Tìm kiếm & Chọn sản phẩm',
    desc: 'Duyệt sản phẩm theo danh mục hoặc dùng thanh tìm kiếm. Đọc mô tả, xem ảnh thực tế và kiểm tra thông số kỹ thuật trước khi chọn.',
    tips: ['Lọc theo danh mục để tìm nhanh hơn', 'Đọc kỹ mô tả về kích thước và vật liệu'],
    color: '#34C759',
    Icon: SearchOutlinedIcon,
  },
  {
    n: 3,
    title: 'Thêm vào giỏ hàng',
    desc: 'Chọn số lượng mong muốn và nhấn "Thêm vào giỏ hàng". Bạn có thể tiếp tục mua thêm sản phẩm khác hoặc tiến hành thanh toán ngay.',
    tips: ['Giỏ hàng được lưu tự động', 'Có thể thêm nhiều sản phẩm trong một đơn'],
    color: '#FF9500',
    Icon: AddShoppingCartOutlinedIcon,
  },
  {
    n: 4,
    title: 'Điền thông tin giao hàng',
    desc: 'Nhập đầy đủ họ tên, số điện thoại và địa chỉ nhận hàng chính xác. Lưu địa chỉ vào tài khoản để sử dụng lại lần sau.',
    tips: ['Kiểm tra kỹ số điện thoại và địa chỉ', 'Có thể thêm ghi chú đặc biệt cho đơn hàng'],
    color: '#636366',
    Icon: LocalShippingOutlinedIcon,
  },
  {
    n: 5,
    title: 'Chọn phương thức thanh toán',
    desc: 'Chọn hình thức thanh toán phù hợp: COD (tiền mặt khi nhận), chuyển khoản ngân hàng, hoặc ví điện tử (Momo, ZaloPay, VNPay).',
    tips: ['COD phù hợp khi muốn kiểm tra hàng trước', 'Chuyển khoản thường được xử lý nhanh hơn'],
    color: '#8B5CF6',
    Icon: PaymentOutlinedIcon,
  },
  {
    n: 6,
    title: 'Xác nhận & Đặt hàng',
    desc: 'Kiểm tra lại toàn bộ thông tin đơn hàng: sản phẩm, số lượng, địa chỉ giao hàng, phương thức thanh toán và tổng tiền. Sau đó nhấn "Đặt hàng".',
    tips: ['Bạn sẽ nhận email xác nhận ngay sau khi đặt', 'Lưu mã đơn hàng để tra cứu dễ dàng'],
    color: '#007AFF',
    Icon: CheckCircleOutlineIcon,
  },
  {
    n: 7,
    title: 'Theo dõi đơn hàng',
    desc: 'Vào mục "Đơn hàng" trong tài khoản để theo dõi trạng thái theo thời gian thực. Khi hàng được giao vận chuyển, bạn sẽ nhận mã vận đơn.',
    tips: ['Kiểm tra email để cập nhật trạng thái', 'Liên hệ hotline nếu hàng quá hạn giao'],
    color: '#34C759',
    Icon: TrackChangesOutlinedIcon,
  },
];

// ── Page ─────────────────────────────────────────────────────────────────────

export default function OrderGuidePage() {
  return (
    <>
      {/* ── Hero ── */}
      <Box
        sx={{
          background: 'linear-gradient(180deg, #F5F5F7 0%, #fff 100%)',
          pt: { xs: 7, md: 12 },
          pb: { xs: 5, md: 8 },
          textAlign: 'center',
          position: 'relative',
          overflow: 'hidden',
        }}
      >
        <Box
          sx={{
            position: 'absolute', top: -80, right: -100,
            width: 500, height: 500, borderRadius: '50%',
            background: alpha('#34C759', 0.06), filter: 'blur(80px)', pointerEvents: 'none',
          }}
        />
        <Box
          sx={{
            position: 'absolute', bottom: -80, left: -80,
            width: 400, height: 400, borderRadius: '50%',
            background: alpha('#007AFF', 0.05), filter: 'blur(80px)', pointerEvents: 'none',
          }}
        />
        <Container maxWidth="md" sx={{ position: 'relative' }}>
          <Box
            sx={{
              display: 'inline-flex', alignItems: 'center', gap: 1,
              bgcolor: alpha('#34C759', 0.08), color: '#34C759',
              px: 2.5, py: 0.75, borderRadius: 980, mb: 3,
            }}
          >
            <CheckCircleOutlineIcon sx={{ fontSize: 16 }} />
            <Typography variant="body2" sx={{ fontWeight: 600 }}>7 bước đơn giản</Typography>
          </Box>
          <Typography
            variant="h2"
            sx={{ fontWeight: 700, fontSize: { xs: 30, md: 48 }, letterSpacing: '-0.03em', mb: 2 }}
          >
            Hướng dẫn{' '}
            <Box
              component="span"
              sx={{
                background: 'linear-gradient(135deg, #34C759 0%, #007AFF 100%)',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
              }}
            >
              đặt hàng
            </Box>
          </Typography>
          <Typography variant="body1" color="text.secondary" sx={{ fontSize: { xs: 15, md: 17 }, maxWidth: 480, mx: 'auto', lineHeight: 1.7 }}>
            Chỉ cần 5 phút — từ chọn sản phẩm đến nhận hàng tận nhà.
            Làm theo từng bước dưới đây nhé!
          </Typography>

          {/* Quick stats */}
          <Stack style={{justifyContent: "center"}} direction="row" spacing={3} justifyContent="center" sx={{ mt: 5 }}>
            {[
              { v: '5 phút', l: 'Hoàn tất đặt hàng' },
              { v: '3-7 ngày', l: 'Nhận hàng' },
              { v: '24/7', l: 'Hỗ trợ' },
            ].map(({ v, l }) => (
              <Box key={l} sx={{ textAlign: 'center' }}>
                <Typography variant="h6" sx={{ fontWeight: 700, color: 'text.primary' }}>{v}</Typography>
                <Typography variant="caption" color="text.secondary">{l}</Typography>
              </Box>
            ))}
          </Stack>
        </Container>
      </Box>

      <Container maxWidth="lg" sx={{ pb: { xs: 8, md: 8 } }}>

        {/* ── Steps ── */}
        <Stack spacing={0}>
          {STEPS.map((step, idx) => {
            const isEven = idx % 2 === 0;
            return (
              <Box key={step.n}>
                <Grid
                  container
                  spacing={{ xs: 3, md: 6 }}
                  alignItems="center"
                  direction={{ xs: 'column', md: isEven ? 'row' : 'row-reverse' }}
                  sx={{ py: { xs: 4, md: 7 } }}
                >
                  {/* Text side */}
                  <Grid size={{ xs: 12, md: 6 }}>
                    <Box sx={{ maxWidth: { md: 440 }, mx: { md: isEven ? 'auto 0' : '0 auto' } }}>
                      {/* Step badge */}
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 2.5 }}>
                        <Box
                          sx={{
                            width: 48, height: 48, borderRadius: 3,
                            bgcolor: alpha(step.color, 0.1),
                            display: 'flex', alignItems: 'center', justifyContent: 'center',
                            flexShrink: 0,
                          }}
                        >
                          <step.Icon sx={{ color: step.color, fontSize: 24 }} />
                        </Box>
                        <Box
                          sx={{
                            px: 1.5, py: 0.4, borderRadius: 1.5,
                            bgcolor: alpha(step.color, 0.08), border: `1px solid ${alpha(step.color, 0.25)}`,
                          }}
                        >
                          <Typography sx={{ fontSize: 11, fontWeight: 700, color: step.color, letterSpacing: '0.05em' }}>
                            BƯỚC {step.n}/{STEPS.length}
                          </Typography>
                        </Box>
                      </Box>

                      <Typography variant="h5" sx={{ fontWeight: 700, mb: 1.5, lineHeight: 1.3 }}>
                        {step.title}
                      </Typography>
                      <Typography variant="body1" color="text.secondary" sx={{ lineHeight: 1.7, mb: 2.5 }}>
                        {step.desc}
                      </Typography>

                      {/* Tips */}
                      <Stack spacing={1}>
                        {step.tips.map((tip) => (
                          <Box key={tip} sx={{ display: 'flex', gap: 1, alignItems: 'flex-start' }}>
                            <TipsAndUpdatesOutlinedIcon sx={{ fontSize: 16, color: step.color, mt: 0.2, flexShrink: 0 }} />
                            <Typography variant="body2" color="text.secondary" sx={{ lineHeight: 1.5 }}>
                              {tip}
                            </Typography>
                          </Box>
                        ))}
                      </Stack>
                    </Box>
                  </Grid>

                  {/* Visual side */}
                  <Grid size={{ xs: 12, md: 6 }}>
                    <StepMock step={step.n} />
                  </Grid>
                </Grid>

                {/* Connector */}
                {idx < STEPS.length - 1 && (
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, px: { xs: 0, md: 4 } }}>
                    <Divider sx={{ flex: 1, borderStyle: 'dashed' }} />
                    <ArrowForwardIcon sx={{ fontSize: 18, color: 'text.disabled', transform: 'rotate(90deg)' }} />
                    <Divider sx={{ flex: 1, borderStyle: 'dashed' }} />
                  </Box>
                )}
              </Box>
            );
          })}
        </Stack>

        {/* ── Tips section ── */}
        <Box sx={{ mt: 8, mb: 8 }}>
          <Paper
            elevation={0}
            sx={{
              p: { xs: 3, md: 5 },
              borderRadius: 5,
              background: 'linear-gradient(135deg, #F5F5F7 0%, #EAF3FF 100%)',
              border: '1px solid',
              borderColor: alpha('#007AFF', 0.15),
            }}
          >
            <Box sx={{ display: 'flex', gap: 2, alignItems: 'flex-start', flexDirection: { xs: 'column', sm: 'row' } }}>
              <Box
                sx={{
                  width: 52, height: 52, borderRadius: 3,
                  bgcolor: alpha('#007AFF', 0.1),
                  display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0,
                }}
              >
                <TipsAndUpdatesOutlinedIcon sx={{ color: 'primary.main', fontSize: 26 }} />
              </Box>
              <Box sx={{ flex: 1 }}>
                <Typography variant="h6" sx={{ fontWeight: 700, mb: 1.5 }}>
                  Mẹo để đặt hàng thuận lợi nhất
                </Typography>
                <Grid container spacing={2}>
                  {[
                    { icon: '📸', text: 'Chụp ảnh tóm tắt đơn hàng trước khi xác nhận để lưu thông tin.' },
                    { icon: '📞', text: 'Đảm bảo số điện thoại nhận hàng luôn bật máy để shipper liên hệ.' },
                    { icon: '🏠', text: 'Điền địa chỉ đầy đủ, rõ ràng — số nhà, tên đường, phường/xã, quận/huyện, tỉnh/thành.' },
                    { icon: '💬', text: 'Dùng ô ghi chú để yêu cầu đặc biệt: đóng gói quà, thêm thiệp chúc mừng…' },
                    { icon: '🔔', text: 'Bật thông báo email để nhận cập nhật trạng thái đơn hàng kịp thời.' },
                    { icon: '🛡️', text: 'Kiểm tra hàng trước khi ký nhận với shipper — đặc biệt kiểm tra bề ngoài thùng carton.' },
                  ].map(({ icon, text }) => (
                    <Grid key={text} size={{ xs: 12, sm: 6 }}>
                      <Box sx={{ display: 'flex', gap: 1.5, alignItems: 'flex-start' }}>
                        <Typography sx={{ fontSize: 16, mt: 0.1, flexShrink: 0 }}>{icon}</Typography>
                        <Typography variant="body2" color="text.secondary" sx={{ lineHeight: 1.6 }}>
                          {text}
                        </Typography>
                      </Box>
                    </Grid>
                  ))}
                </Grid>
              </Box>
            </Box>
          </Paper>
        </Box>

        {/* ── Bottom CTA ── */}
        <Grid container spacing={3}>
          <Grid size={{ xs: 12, sm: 6 }}>
            <Paper
              elevation={0}
              sx={{
                p: 3.5, height: '100%', borderRadius: 4,
                border: '1px solid', borderColor: alpha('#007AFF', 0.2),
                bgcolor: alpha('#007AFF', 0.03),
                display: 'flex', flexDirection: 'column', gap: 1.5,
              }}
            >
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
                <HelpOutlineIcon sx={{ color: 'primary.main' }} />
                <Typography variant="body1" sx={{ fontWeight: 700 }}>Câu hỏi thường gặp</Typography>
              </Box>
              <Typography variant="body2" color="text.secondary" sx={{ lineHeight: 1.7, flex: 1 }}>
                Tìm ngay câu trả lời cho các thắc mắc về sản phẩm, thanh toán, giao hàng và đổi trả.
              </Typography>
              <Button
                component={Link}
                href="/faq"
                variant="outlined"
                size="small"
                sx={{ borderRadius: 980, alignSelf: 'flex-start' }}
                endIcon={<ArrowForwardIcon sx={{ fontSize: '14px !important' }} />}
              >
                Xem FAQ
              </Button>
            </Paper>
          </Grid>
          <Grid size={{ xs: 12, sm: 6 }}>
            <Paper
              elevation={0}
              sx={{
                p: 3.5, height: '100%', borderRadius: 4,
                border: '1px solid', borderColor: alpha('#34C759', 0.2),
                bgcolor: alpha('#34C759', 0.03),
                display: 'flex', flexDirection: 'column', gap: 1.5,
              }}
            >
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
                <ContactSupportOutlinedIcon sx={{ color: '#34C759' }} />
                <Typography variant="body1" sx={{ fontWeight: 700 }}>Cần hỗ trợ trực tiếp?</Typography>
              </Box>
              <Typography variant="body2" color="text.secondary" sx={{ lineHeight: 1.7, flex: 1 }}>
                Đội ngũ tư vấn sẵn sàng hỗ trợ bạn từ 8:00 – 22:00 mỗi ngày qua Zalo, điện thoại hoặc Facebook.
              </Typography>
              <Button
                component={Link}
                href="/contact"
                variant="outlined"
                size="small"
                sx={{ borderRadius: 980, alignSelf: 'flex-start', borderColor: '#34C759', color: '#34C759', '&:hover': { borderColor: '#2DB04E', bgcolor: alpha('#34C759', 0.04) } }}
                endIcon={<PhoneOutlinedIcon sx={{ fontSize: '14px !important' }} />}
              >
                Liên hệ ngay
              </Button>
            </Paper>
          </Grid>
        </Grid>

        {/* ── Start shopping ── */}
        <Box sx={{ mt: 8, textAlign: 'center' }}>
          <Typography variant="h5" sx={{ fontWeight: 700, mb: 1 }}>Bắt đầu mua sắm ngay!</Typography>
          <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
            Hơn 500 mẫu đèn in 3D handcraft đang chờ bạn khám phá.
          </Typography>
          <Button
            component={Link}
            href="/products"
            variant="contained"
            size="large"
            endIcon={<ArrowForwardIcon />}
            sx={{ borderRadius: 980, px: 4, fontWeight: 600 }}
          >
            Xem sản phẩm
          </Button>
        </Box>
      </Container>
    </>
  );
}

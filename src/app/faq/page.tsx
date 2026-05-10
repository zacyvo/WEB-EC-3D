'use client';

import { useState } from 'react';
import Link from 'next/link';
import {
  Box, Container, Typography, Stack, Button,
  Collapse, Paper, Chip, alpha,
} from '@mui/material';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import ExpandLessIcon from '@mui/icons-material/ExpandLess';
import HelpOutlineIcon from '@mui/icons-material/HelpOutlined';
import ShoppingBagOutlinedIcon from '@mui/icons-material/ShoppingBagOutlined';
import PaymentOutlinedIcon from '@mui/icons-material/PaymentOutlined';
import LocalShippingOutlinedIcon from '@mui/icons-material/LocalShippingOutlined';
import CachedOutlinedIcon from '@mui/icons-material/CachedOutlined';
import PrintOutlinedIcon from '@mui/icons-material/PrintOutlined';
import StarBorderIcon from '@mui/icons-material/StarBorder';
import CheckCircleOutlineIcon from '@mui/icons-material/CheckCircleOutlined';
import InventoryOutlinedIcon from '@mui/icons-material/InventoryOutlined';
import LocalOfferOutlinedIcon from '@mui/icons-material/LocalOfferOutlined';
import BuildOutlinedIcon from '@mui/icons-material/BuildOutlined';
import ChatBubbleOutlineIcon from '@mui/icons-material/ChatBubbleOutlineOutlined';

// ── Visual mockup component (replaces screenshots) ──────────────────────────

function VisualMock({
  type,
}: {
  type: 'product' | 'cart' | 'delivery' | 'return' | 'quality' | 'payment';
}) {
  const configs: Record<
    string,
    { bg: string; accent: string; icon: React.ReactNode; label: string; tags: string[] }
  > = {
    product: {
      bg: '#EAF3FF',
      accent: '#007AFF',
      icon: <PrintOutlinedIcon sx={{ fontSize: 40, color: '#007AFF' }} />,
      label: 'Đèn In 3D Handcraft',
      tags: ['Chất liệu PLA', 'Công nghệ FDM', 'Bảo hành 12T'],
    },
    cart: {
      bg: '#F0FBF2',
      accent: '#34C759',
      icon: <ShoppingBagOutlinedIcon sx={{ fontSize: 40, color: '#34C759' }} />,
      label: 'Giỏ hàng & Đặt hàng',
      tags: ['Chọn số lượng', 'Thêm vào giỏ', 'Xác nhận đơn'],
    },
    payment: {
      bg: '#FBF0FF',
      accent: '#8B5CF6',
      icon: <PaymentOutlinedIcon sx={{ fontSize: 40, color: '#8B5CF6' }} />,
      label: 'Thanh toán an toàn',
      tags: ['COD', 'Chuyển khoản', 'Ví điện tử'],
    },
    delivery: {
      bg: '#FFF5EA',
      accent: '#FF9500',
      icon: <LocalShippingOutlinedIcon sx={{ fontSize: 40, color: '#FF9500' }} />,
      label: 'Giao hàng toàn quốc',
      tags: ['3-7 ngày', 'Theo dõi đơn', 'GHTK / GHN'],
    },
    return: {
      bg: '#FFF0F0',
      accent: '#FF3B30',
      icon: <CachedOutlinedIcon sx={{ fontSize: 40, color: '#FF3B30' }} />,
      label: 'Đổi trả & Hoàn tiền',
      tags: ['30 ngày đổi trả', 'Hoàn 100%', 'Nhanh chóng'],
    },
    quality: {
      bg: '#F5F5F7',
      accent: '#1C1C1E',
      icon: <BuildOutlinedIcon sx={{ fontSize: 40, color: '#636366' }} />,
      label: 'Chất lượng sản phẩm',
      tags: ['In 3D FDM', 'Kiểm tra kỹ', 'Đóng gói cẩn thận'],
    },
  };

  const cfg = configs[type];
  return (
    <Box
      sx={{
        borderRadius: 4,
        bgcolor: cfg.bg,
        border: `1.5px solid ${alpha(cfg.accent, 0.2)}`,
        p: 4,
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        gap: 2,
        minHeight: 180,
      }}
    >
      <Box
        sx={{
          width: 72,
          height: 72,
          borderRadius: 4,
          bgcolor: '#fff',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          boxShadow: `0 4px 16px ${alpha(cfg.accent, 0.18)}`,
        }}
      >
        {cfg.icon}
      </Box>
      <Typography variant="body2" sx={{ fontWeight: 700, color: 'text.primary', textAlign: 'center' }}>
        {cfg.label}
      </Typography>
      <Stack direction="row" spacing={0.75} sx={{ flexWrap: 'wrap', justifyContent: 'center' }}>
        {cfg.tags.map((t) => (
          <Chip
            key={t}
            label={t}
            size="small"
            sx={{ bgcolor: '#fff', fontSize: 11, height: 22, border: `1px solid ${alpha(cfg.accent, 0.25)}` }}
          />
        ))}
      </Stack>
    </Box>
  );
}

// ── FAQ data ────────────────────────────────────────────────────────────────

type FaqItem = {
  q: string;
  a: React.ReactNode;
  visual?: React.ReactNode;
};

type Category = {
  id: string;
  label: string;
  Icon: React.ElementType;
  color: string;
  items: FaqItem[];
};

const CATEGORIES: Category[] = [
  {
    id: 'product',
    label: 'Sản phẩm',
    Icon: PrintOutlinedIcon,
    color: '#007AFF',
    items: [
      {
        q: 'Đèn in 3D được làm từ vật liệu gì?',
        a: 'Chúng tôi sử dụng nhựa PLA (Polylactic Acid) — vật liệu in 3D thân thiện môi trường, không độc hại, chịu nhiệt tốt ở điều kiện trong nhà. Sản phẩm được in bằng công nghệ FDM (Fused Deposition Modeling) với độ chính xác cao.',
        visual: <VisualMock type="product" />,
      },
      {
        q: 'Sản phẩm có thể tùy chỉnh theo yêu cầu không?',
        a: (
          <>
            Có! Chúng tôi nhận thiết kế theo yêu cầu gồm: tên, ngày kỷ niệm, hình ảnh, logo cá nhân…
            Thời gian thiết kế thêm khoảng <strong>2–3 ngày làm việc</strong>. Liên hệ Zalo hoặc inbox
            Facebook để được tư vấn cụ thể.
          </>
        ),
      },
      {
        q: 'Đèn có bao gồm bóng đèn và dây điện không?',
        a: 'Đa số sản phẩm được bán kèm bộ đế đèn LED (nguồn USB), dây nguồn và bóng đèn phù hợp. Một số mẫu trang trí thuần túy không có bóng. Vui lòng đọc kỹ mô tả sản phẩm trước khi đặt hàng.',
      },
      {
        q: 'Màu sắc thực tế có giống ảnh không?',
        a: 'Chúng tôi luôn cố gắng chụp ảnh trong điều kiện ánh sáng chuẩn. Do đặc tính vật liệu in 3D, màu sắc thực tế có thể chênh nhẹ 5–10% tùy màn hình. Nếu không hài lòng, bạn có thể đổi trả trong 30 ngày.',
      },
    ],
  },
  {
    id: 'order',
    label: 'Đặt hàng',
    Icon: ShoppingBagOutlinedIcon,
    color: '#34C759',
    items: [
      {
        q: 'Làm thế nào để đặt hàng?',
        a: (
          <>
            Bạn có thể đặt hàng trực tiếp trên website này. Xem hướng dẫn chi tiết tại trang{' '}
            <Link href="/order-guide" style={{ color: '#007AFF', fontWeight: 600 }}>
              Hướng dẫn đặt hàng
            </Link>
            .
          </>
        ),
        visual: <VisualMock type="cart" />,
      },
      {
        q: 'Tôi có thể thay đổi hoặc hủy đơn hàng sau khi đặt không?',
        a: 'Bạn có thể hủy đơn trong vòng 2 giờ sau khi đặt, trước khi đơn chuyển sang trạng thái "Đang xử lý". Sau đó vui lòng liên hệ hotline để được hỗ trợ trực tiếp.',
      },
      {
        q: 'Tôi quên mật khẩu, phải làm gì?',
        a: (
          <>
            Truy cập trang{' '}
            <Link href="/auth/login" style={{ color: '#007AFF', fontWeight: 600 }}>
              Đăng nhập
            </Link>{' '}
            và chọn <strong>"Quên mật khẩu"</strong>. Hệ thống sẽ gửi liên kết đặt lại mật khẩu về
            email của bạn trong vòng vài phút.
          </>
        ),
      },
      {
        q: 'Làm thế nào để theo dõi đơn hàng?',
        a: (
          <>
            Đăng nhập vào tài khoản, vào mục <strong>"Đơn hàng"</strong> để xem trạng thái. Khi hàng
            được giao vận chuyển, bạn sẽ nhận được mã vận đơn qua SMS hoặc trên trang đơn hàng.
          </>
        ),
      },
    ],
  },
  {
    id: 'payment',
    label: 'Thanh toán',
    Icon: PaymentOutlinedIcon,
    color: '#8B5CF6',
    items: [
      {
        q: 'Website hỗ trợ những hình thức thanh toán nào?',
        a: (
          <Stack spacing={1}>
            <Typography variant="body2">Chúng tôi hỗ trợ các hình thức sau:</Typography>
            {[
              '💵 COD (thanh toán khi nhận hàng)',
              '🏦 Chuyển khoản ngân hàng',
              '📱 Ví điện tử (Momo, ZaloPay, VNPay)',
            ].map((t) => (
              <Box key={t} sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                <CheckCircleOutlineIcon sx={{ fontSize: 16, color: '#34C759', flexShrink: 0 }} />
                <Typography variant="body2">{t.slice(2)}</Typography>
              </Box>
            ))}
          </Stack>
        ),
        visual: <VisualMock type="payment" />,
      },
      {
        q: 'Thanh toán chuyển khoản có an toàn không?',
        a: 'Chúng tôi sử dụng thông tin tài khoản chính thức và luôn xác nhận đơn hàng qua SMS/email sau khi nhận được thanh toán. Không bao giờ yêu cầu chuyển khoản qua kênh thứ ba.',
      },
      {
        q: 'Tôi có thể xin hóa đơn VAT không?',
        a: 'Hiện tại chúng tôi chưa hỗ trợ xuất hóa đơn VAT điện tử. Chúng tôi sẽ cập nhật tính năng này trong thời gian sớm nhất.',
      },
    ],
  },
  {
    id: 'delivery',
    label: 'Giao hàng',
    Icon: LocalShippingOutlinedIcon,
    color: '#FF9500',
    items: [
      {
        q: 'Thời gian giao hàng mất bao lâu?',
        a: (
          <Stack spacing={1}>
            {[
              { area: 'TP. HCM nội thành', time: '1–2 ngày làm việc' },
              { area: 'TP. HCM ngoại thành', time: '2–3 ngày làm việc' },
              { area: 'Các tỉnh thành khác', time: '3–7 ngày làm việc' },
            ].map(({ area, time }) => (
              <Box key={area} sx={{ display: 'flex', justifyContent: 'space-between', gap: 2 }}>
                <Typography variant="body2" color="text.secondary">{area}</Typography>
                <Typography variant="body2" sx={{ fontWeight: 600 }}>{time}</Typography>
              </Box>
            ))}
          </Stack>
        ),
        visual: <VisualMock type="delivery" />,
      },
      {
        q: 'Phí vận chuyển được tính như thế nào?',
        a: 'Phí vận chuyển được tính dựa theo địa chỉ nhận hàng và trọng lượng đơn. Hiển thị cụ thể tại bước xác nhận đơn hàng. Đơn hàng trên 500.000đ được miễn phí vận chuyển nội thành TP. HCM.',
      },
      {
        q: 'Đơn vị vận chuyển nào được sử dụng?',
        a: 'Chúng tôi hợp tác với GHTK, GHN và J&T Express — các đơn vị vận chuyển uy tín tại Việt Nam. Bạn sẽ nhận mã vận đơn để theo dõi qua app hoặc website của đơn vị tương ứng.',
      },
      {
        q: 'Hàng giao bị hỏng/vỡ trong khi vận chuyển thì sao?',
        a: 'Chúng tôi đóng gói sản phẩm rất kỹ lưỡng. Nếu sản phẩm bị hỏng do vận chuyển, vui lòng chụp ảnh gói hàng và sản phẩm ngay khi nhận và liên hệ chúng tôi trong vòng 24 giờ. Chúng tôi sẽ gửi lại sản phẩm miễn phí.',
      },
    ],
  },
  {
    id: 'return',
    label: 'Đổi trả',
    Icon: CachedOutlinedIcon,
    color: '#FF3B30',
    items: [
      {
        q: 'Chính sách đổi trả như thế nào?',
        a: (
          <>
            Chúng tôi nhận đổi trả trong vòng <strong>30 ngày</strong> kể từ ngày nhận hàng với điều kiện:{' '}
            sản phẩm chưa qua sử dụng, còn nguyên vẹn bao bì, kèm hóa đơn mua hàng.
          </>
        ),
        visual: <VisualMock type="return" />,
      },
      {
        q: 'Những trường hợp nào được đổi trả miễn phí?',
        a: (
          <Stack spacing={0.75}>
            {[
              'Sản phẩm bị lỗi kỹ thuật từ nhà sản xuất',
              'Giao sai sản phẩm so với đơn hàng',
              'Sản phẩm bị hư hỏng trong quá trình vận chuyển',
            ].map((t) => (
              <Box key={t} sx={{ display: 'flex', gap: 1 }}>
                <CheckCircleOutlineIcon sx={{ fontSize: 16, color: '#34C759', mt: 0.25, flexShrink: 0 }} />
                <Typography variant="body2">{t}</Typography>
              </Box>
            ))}
          </Stack>
        ),
      },
      {
        q: 'Quy trình hoàn tiền mất bao lâu?',
        a: 'Sau khi nhận được hàng đổi trả và kiểm tra, chúng tôi sẽ hoàn tiền trong vòng 3–5 ngày làm việc qua phương thức thanh toán ban đầu của bạn.',
      },
    ],
  },
];

// ── Accordion item ───────────────────────────────────────────────────────────

function FaqAccordion({ item, accent }: { item: FaqItem; accent: string }) {
  const [open, setOpen] = useState(false);
  return (
    <Paper
      elevation={0}
      sx={{
        border: '1px solid',
        borderColor: open ? alpha(accent, 0.35) : 'divider',
        borderRadius: 3,
        overflow: 'hidden',
        transition: 'border-color 0.2s',
      }}
    >
      <Box
        onClick={() => setOpen(!open)}
        sx={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          gap: 2,
          px: 2.5,
          py: 2,
          cursor: 'pointer',
          bgcolor: open ? alpha(accent, 0.04) : 'transparent',
          transition: 'background 0.2s',
          '&:hover': { bgcolor: alpha(accent, 0.04) },
        }}
      >
        <Typography variant="body2" sx={{ fontWeight: open ? 700 : 500, lineHeight: 1.5, flex: 1 }}>
          {item.q}
        </Typography>
        {open ? (
          <ExpandLessIcon sx={{ color: accent, flexShrink: 0 }} />
        ) : (
          <ExpandMoreIcon sx={{ color: 'text.disabled', flexShrink: 0 }} />
        )}
      </Box>
      <Collapse in={open}>
        <Box sx={{ px: 2.5, pb: 2.5, pt: 0.5 }}>
          {item.visual && (
            <Box sx={{ mb: 2.5 }}>
              {item.visual}
            </Box>
          )}
          {typeof item.a === 'string' ? (
            <Typography variant="body2" color="text.secondary" sx={{ lineHeight: 1.7 }}>
              {item.a}
            </Typography>
          ) : (
            <Box sx={{ color: 'text.secondary', '& .MuiTypography-root': { fontSize: 14 } }}>
              {item.a}
            </Box>
          )}
        </Box>
      </Collapse>
    </Paper>
  );
}

// ── Page ─────────────────────────────────────────────────────────────────────

export default function FaqPage() {
  const [activeCategory, setActiveCategory] = useState<string>('product');
  const cat = CATEGORIES.find((c) => c.id === activeCategory)!;

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
            position: 'absolute', top: -80, left: '50%', transform: 'translateX(-50%)',
            width: 500, height: 500, borderRadius: '50%',
            background: alpha('#8B5CF6', 0.06), filter: 'blur(80px)', pointerEvents: 'none',
          }}
        />
        <Container maxWidth="md" sx={{ position: 'relative' }}>
          <Box
            sx={{
              display: 'inline-flex', alignItems: 'center', gap: 1,
              bgcolor: alpha('#8B5CF6', 0.08), color: '#8B5CF6',
              px: 2.5, py: 0.75, borderRadius: 980, mb: 3,
            }}
          >
            <HelpOutlineIcon sx={{ fontSize: 16 }} />
            <Typography variant="body2" sx={{ fontWeight: 600 }}>Câu hỏi thường gặp</Typography>
          </Box>
          <Typography
            variant="h2"
            sx={{ fontWeight: 700, fontSize: { xs: 30, md: 48 }, letterSpacing: '-0.03em', mb: 2 }}
          >
            Chúng tôi giải đáp mọi{' '}
            <Box
              component="span"
              sx={{
                background: 'linear-gradient(135deg, #8B5CF6 0%, #007AFF 100%)',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
              }}
            >
              thắc mắc
            </Box>
          </Typography>
          <Typography variant="body1" color="text.secondary" sx={{ fontSize: { xs: 15, md: 17 }, maxWidth: 480, mx: 'auto', lineHeight: 1.7 }}>
            Tổng hợp những câu hỏi phổ biến nhất từ khách hàng. Không tìm được câu trả lời?{' '}
            <Link href="/contact" style={{ color: '#007AFF', fontWeight: 600 }}>Liên hệ ngay</Link>
          </Typography>
        </Container>
      </Box>

      <Container maxWidth="lg" sx={{ pb: { xs: 8, md: 14 } }}>
        <Box
          sx={{
            display: 'flex',
            gap: { xs: 0, md: 4 },
            flexDirection: { xs: 'column', md: 'row' },
            alignItems: { xs: 'stretch', md: 'flex-start' },
          }}
        >
          {/* ── Category sidebar ── */}
          <Box
            sx={{
              flexShrink: 0,
              width: { xs: '100%', md: 220 },
              mb: { xs: 3, md: 8 },
            }}
          >
            <Typography variant="caption" sx={{ fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.08em', color: 'text.disabled', pl: 1, my: 1, display: 'block' }}>
              Chủ đề
            </Typography>
            <Stack spacing={0.5}>
              {CATEGORIES.map(({ id, label, Icon, color }) => {
                const isActive = activeCategory === id;
                return (
                  <Box
                    key={id}
                    onClick={() => setActiveCategory(id)}
                    sx={{
                      display: 'flex', alignItems: 'center', gap: 1.5,
                      px: 1.5, py: 1.25, borderRadius: 2.5, cursor: 'pointer',
                      bgcolor: isActive ? alpha(color, 0.08) : 'transparent',
                      color: isActive ? color : 'text.secondary',
                      fontWeight: isActive ? 600 : 400,
                      transition: 'all 0.15s',
                      '&:hover': { bgcolor: isActive ? alpha(color, 0.1) : 'grey.50' },
                    }}
                  >
                    <Icon sx={{ fontSize: 20, color: isActive ? color : 'text.disabled' }} />
                    <Typography variant="body2" sx={{ fontWeight: 'inherit', color: 'inherit' }}>{label}</Typography>
                    {isActive && (
                      <Box sx={{ ml: 'auto', width: 6, height: 6, borderRadius: '50%', bgcolor: color }} />
                    )}
                  </Box>
                );
              })}
            </Stack>

            {/* Contact CTA */}
            <Box
              sx={{
                mt: 4, p: 2, borderRadius: 3,
                bgcolor: alpha('#007AFF', 0.06),
                border: `1px solid ${alpha('#007AFF', 0.15)}`,
              }}
            >
              <ChatBubbleOutlineIcon sx={{ fontSize: 20, color: 'primary.main', mb: 0.75 }} />
              <Typography variant="body2" sx={{ fontWeight: 600, mb: 0.5 }}>Vẫn còn thắc mắc?</Typography>
              <Typography variant="caption" color="text.secondary" sx={{ display: 'block', mb: 1.5, lineHeight: 1.5 }}>
                Đội ngũ hỗ trợ sẵn sàng giải đáp 8:00–22:00 mỗi ngày.
              </Typography>
              <Button
                component={Link}
                href="/contact"
                fullWidth
                size="small"
                variant="contained"
                sx={{ borderRadius: 980, fontSize: 12 }}
              >
                Liên hệ ngay
              </Button>
            </Box>
          </Box>

          {/* ── FAQ list ── */}
          <Box sx={{ flex: 1 }}>
            {/* Category header */}
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5, mb: 3 }}>
              <Box
                sx={{
                  width: 40, height: 40, borderRadius: 2.5,
                  bgcolor: alpha(cat.color, 0.1),
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                }}
              >
                <cat.Icon sx={{ color: cat.color, fontSize: 20 }} />
              </Box>
              <Box>
                <Typography variant="h6" sx={{ fontWeight: 700, lineHeight: 1.2 }}>{cat.label}</Typography>
                <Typography variant="caption" color="text.secondary">{cat.items.length} câu hỏi</Typography>
              </Box>
            </Box>

            <Stack spacing={1.5}>
              {cat.items.map((item, idx) => (
                <FaqAccordion key={idx} item={item} accent={cat.color} />
              ))}
            </Stack>
          </Box>
        </Box>

        {/* ── Bottom CTA ── */}
        <Box sx={{ mt: 10, textAlign: 'center' }}>
          <Box
            sx={{
              display: 'inline-flex', alignItems: 'center', gap: 1,
              bgcolor: alpha('#34C759', 0.08), color: '#34C759',
              px: 2.5, py: 0.75, borderRadius: 980, mb: 2,
            }}
          >
            <StarBorderIcon sx={{ fontSize: 16 }} />
            <Typography variant="body2" sx={{ fontWeight: 600 }}>Khách hàng hài lòng 4.9/5</Typography>
          </Box>
          <Typography variant="h5" sx={{ fontWeight: 700, mb: 1 }}>
            Sẵn sàng khám phá sản phẩm?
          </Typography>
          <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
            Hơn 500 mẫu đèn in 3D handcraft đang chờ bạn.
          </Typography>
          <Stack direction="row" spacing={1.5} sx={{ flexWrap: 'wrap', justifyContent: 'center' }}>
            <Button component={Link} href="/products" variant="contained" sx={{ borderRadius: 980, px: 3 }}>
              Xem sản phẩm
            </Button>
            <Button component={Link} href="/order-guide" variant="outlined" sx={{ borderRadius: 980, px: 3 }}>
              Hướng dẫn đặt hàng
            </Button>
          </Stack>
        </Box>
      </Container>
    </>
  );
}

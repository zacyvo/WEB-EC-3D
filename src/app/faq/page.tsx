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
import { formatCurrency } from '@/lib/utils';
import { SHIPPING_FEE_HCM, SHIPPING_FEE_OTHER } from '@/lib/shipping-fee';

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
      tags: ['COD', 'Chuyển khoản VietQR', 'Hoá đơn VAT'],
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
      tags: ['7 ngày trả hàng', 'Yêu cầu online', 'Hoàn tiền 3–5 ngày'],
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
        a: 'Chúng tôi luôn cố gắng chụp ảnh trong điều kiện ánh sáng chuẩn. Do đặc tính vật liệu in 3D, màu sắc thực tế có thể chênh nhẹ 5–10% tùy màn hình. Nếu không hài lòng, bạn có thể yêu cầu trả hàng trong 7 ngày kể từ khi nhận hàng.',
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
        a: 'Khi đơn còn ở trạng thái "Chờ xác nhận", bạn có thể tự hủy trong mục Đơn hàng của tôi. Khi đơn đang ở trạng thái "Đang chuẩn bị hàng", bạn có thể gửi yêu cầu hủy để shop xem xét và liên hệ lại. Đơn ở trạng thái "Đã xác nhận", đang giao hoặc đã giao không thể hủy trên website — vui lòng liên hệ shop để được hỗ trợ. Nếu đơn đã chuyển khoản bị hủy, shop sẽ hoàn tiền cho bạn.',
      },
      {
        q: 'Tôi quên mật khẩu, phải làm gì?',
        a: (
          <>
            Nếu bạn đăng ký bằng Google hoặc Facebook, hãy chọn <strong>"Tiếp tục với Google/Facebook"</strong>{' '}
            tại trang{' '}
            <Link href="/auth/login?redirect=/faq" style={{ color: '#007AFF', fontWeight: 600 }}>
              Đăng nhập
            </Link>
            . Nếu bạn đăng ký bằng email, vui lòng liên hệ shop qua{' '}
            <Link href="/contact" style={{ color: '#007AFF', fontWeight: 600 }}>
              trang Liên hệ
            </Link>{' '}
            (email hoặc Zalo) từ email/số điện thoại của tài khoản để được hỗ trợ đặt lại mật khẩu.
          </>
        ),
      },
      {
        q: 'Làm thế nào để theo dõi đơn hàng?',
        a: (
          <>
            Đăng nhập vào tài khoản, vào mục <strong>"Đơn hàng"</strong> để xem trạng thái đơn. Khi hàng
            được bàn giao vận chuyển, tên đơn vị vận chuyển, mã vận đơn và đường dẫn tra cứu được cập nhật
            ngay trên trang chi tiết đơn hàng.
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
              '🏦 Chuyển khoản ngân hàng (quét mã VietQR sau khi đặt hàng)',
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
        a: 'Bạn chuyển trực tiếp vào tài khoản ngân hàng của shop hiển thị trên website, bằng mã VietQR đã điền sẵn số tiền và nội dung chuyển khoản riêng của đơn. Shop kiểm tra tài khoản và xác nhận thanh toán; trạng thái "Đã thanh toán" được cập nhật trên trang đơn hàng. Shop không bao giờ yêu cầu chuyển vào tài khoản khác hay cung cấp mã OTP, mật khẩu ngân hàng.',
      },
      {
        q: 'Tôi có thể xin hóa đơn VAT không?',
        a: 'Có. Bạn chọn "Yêu cầu xuất hoá đơn điện tử" khi đặt hàng hoặc tại trang chi tiết đơn hàng. Shop sẽ xử lý yêu cầu và gửi hoá đơn tới email của bạn sau khi đơn được thanh toán.',
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
        a: `Phí vận chuyển đồng giá ${formatCurrency(SHIPPING_FEE_HCM)}/đơn trong TP. Hồ Chí Minh và ${formatCurrency(SHIPPING_FEE_OTHER)}/đơn cho các tỉnh, thành phố khác. Phí vận chuyển luôn được hiển thị tại trang Thanh toán trước khi bạn đặt hàng.`,
      },
      {
        q: 'Đơn vị vận chuyển nào được sử dụng?',
        a: 'Hiện shop gửi hàng chủ yếu qua SPX Express; tuỳ khu vực có thể sử dụng đơn vị vận chuyển khác. Mã vận đơn và đường dẫn tra cứu được cập nhật trên trang chi tiết đơn hàng.',
      },
      {
        q: 'Hàng giao bị hỏng/vỡ trong khi vận chuyển thì sao?',
        a: 'Chúng tôi đóng gói sản phẩm rất kỹ lưỡng. Nếu sản phẩm bị hỏng do vận chuyển, vui lòng chụp ảnh/quay video gói hàng và sản phẩm khi nhận, rồi gửi yêu cầu "Trả hàng/Hoàn tiền" tại trang chi tiết đơn hàng trong vòng 7 ngày (nên báo ngay trong 24 giờ đầu). Chúng tôi sẽ gửi lại sản phẩm mới hoặc hoàn tiền miễn phí.',
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
            Chúng tôi nhận trả hàng trong vòng <strong>7 ngày</strong> kể từ ngày nhận hàng với điều kiện:{' '}
            sản phẩm chưa qua sử dụng, còn nguyên vẹn bao bì. Bạn gửi yêu cầu ngay tại trang chi tiết đơn hàng
            (nút &quot;Yêu cầu trả hàng/hoàn tiền&quot;) và theo dõi tiến trình ở tab &quot;Trả hàng/Hoàn tiền&quot;.
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
        a: 'Sau khi nhận được hàng đổi trả và kiểm tra, chúng tôi sẽ hoàn tiền trong vòng 3–5 ngày làm việc bằng chuyển khoản vào tài khoản ngân hàng bạn cung cấp khi gửi yêu cầu.',
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
            Hơn 500 mẫu đèn in 3D handcraft đang chờ bạn — hoặc gửi ý tưởng riêng để chúng tôi in 3D theo yêu cầu.
          </Typography>
          <Stack direction="row" spacing={1.5} sx={{ flexWrap: 'wrap', justifyContent: 'center' }}>
            <Button component={Link} href="/products" variant="contained" sx={{ borderRadius: 980, px: 3 }}>
              Xem sản phẩm
            </Button>
            <Button component={Link} href="/custom-order" variant="outlined" sx={{ borderRadius: 980, px: 3 }}>
              Gửi ý tưởng của bạn
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

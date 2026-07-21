'use client';

import Link from 'next/link';
import {
  Box, Container, Typography, Grid, Paper, Stack, Button, Divider, Chip, alpha,
} from '@mui/material';
import HandshakeOutlinedIcon from '@mui/icons-material/HandshakeOutlined';
import ArrowForwardIcon from '@mui/icons-material/ArrowForward';
import StarRoundedIcon from '@mui/icons-material/StarRounded';
import StarOutlineRoundedIcon from '@mui/icons-material/StarOutlineRounded';
import CheckCircleOutlinedIcon from '@mui/icons-material/CheckCircleOutlined';
import Inventory2OutlinedIcon from '@mui/icons-material/Inventory2Outlined';
import TrendingUpOutlinedIcon from '@mui/icons-material/TrendingUpOutlined';
import WorkspacePremiumOutlinedIcon from '@mui/icons-material/WorkspacePremiumOutlined';
import EmojiEventsOutlinedIcon from '@mui/icons-material/EmojiEventsOutlined';
import RuleOutlinedIcon from '@mui/icons-material/RuleOutlined';
import UpdateOutlinedIcon from '@mui/icons-material/UpdateOutlined';
import PrecisionManufacturingOutlinedIcon from '@mui/icons-material/PrecisionManufacturingOutlined';
import GavelOutlinedIcon from '@mui/icons-material/GavelOutlined';
import CampaignOutlinedIcon from '@mui/icons-material/CampaignOutlined';
import PaymentsOutlinedIcon from '@mui/icons-material/PaymentsOutlined';
import ArticleOutlinedIcon from '@mui/icons-material/ArticleOutlined';
import WarningAmberOutlinedIcon from '@mui/icons-material/WarningAmberOutlined';
import PhoneOutlinedIcon from '@mui/icons-material/PhoneOutlined';
import EmailOutlinedIcon from '@mui/icons-material/EmailOutlined';
import LocationOnOutlinedIcon from '@mui/icons-material/LocationOnOutlined';
import LanguageOutlinedIcon from '@mui/icons-material/LanguageOutlined';
import BadgeOutlinedIcon from '@mui/icons-material/BadgeOutlined';
import type SvgIcon from '@mui/material/SvgIcon';
import { STORE } from '@/lib/store-config';

type SvgIconComponent = typeof SvgIcon;

const LAST_UPDATED = '22/07/2026';

// ── Data ──────────────────────────────────────────────────────

type Tier = {
  badge: string;
  name: string;
  color: string;
  bg: string;
  Icon: SvgIconComponent;
  criteria: string[];
  stars: number;
  price: string;
  benefits: string[];
  featured?: boolean;
};

const TIERS: Tier[] = [
  {
    badge: 'Option 1',
    name: 'Đối tác tiêu chuẩn',
    color: '#8E8E93',
    bg: '#F5F5F7',
    Icon: Inventory2OutlinedIcon,
    criteria: ['Sản lượng dưới 200 sản phẩm/tháng', 'hoặc doanh số dưới 10.000.000 VNĐ/tháng'],
    stars: 2,
    price: 'Giá bán sỉ + 40%',
    benefits: [
      'Tiếp nhận và xử lý đơn hàng theo lịch sản xuất tiêu chuẩn',
      'Hỗ trợ tư vấn sản phẩm, chất liệu, màu sắc và phương án sản xuất phù hợp',
      'Không áp dụng chính sách giữ trước công suất máy',
    ],
  },
  {
    badge: 'Option 2',
    name: 'Đối tác tiềm năng',
    color: '#34C759',
    bg: '#F0FBF2',
    Icon: TrendingUpOutlinedIcon,
    criteria: ['Sản lượng 200 – dưới 500 sản phẩm/tháng', 'hoặc doanh số 10 – dưới 50 triệu VNĐ/tháng'],
    stars: 3,
    price: 'Giá bán sỉ + 30%',
    benefits: [
      'Ưu tiên xếp lịch sản xuất hơn các đơn hàng lẻ',
      'Hỗ trợ dự kiến tiến độ sản xuất theo kế hoạch đặt hàng',
      'Có thể thỏa thuận chia đợt giao hàng theo sản lượng và năng lực sản xuất',
    ],
  },
  {
    badge: 'Option 3',
    name: 'Đối tác ưu tiên',
    color: '#8B5CF6',
    bg: '#F5F0FF',
    Icon: WorkspacePremiumOutlinedIcon,
    criteria: ['Sản lượng 500 – dưới 1.000 sản phẩm/tháng', 'hoặc doanh số 50 – dưới 100 triệu VNĐ/tháng'],
    stars: 4,
    price: 'Giá bán sỉ + 10%',
    benefits: [
      'Ưu tiên cao trong kế hoạch sản xuất',
      'Có thể được giữ trước một phần công suất máy khi có kế hoạch rõ ràng',
      'Hỗ trợ lên kế hoạch sản xuất, chia lô và thời gian giao hàng',
      'Ưu tiên xử lý các yêu cầu phát sinh trong phạm vi năng lực',
    ],
  },
  {
    badge: 'Option 4',
    name: 'Đối tác chiến lược',
    color: '#FF9500',
    bg: '#FFF9EC',
    Icon: EmojiEventsOutlinedIcon,
    criteria: ['Sản lượng từ 1.000 sản phẩm/tháng trở lên', 'hoặc doanh số từ 100 triệu VNĐ/tháng trở lên'],
    stars: 5,
    price: 'Giá bán sỉ + 1%',
    featured: true,
    benefits: [
      'Ưu tiên cao nhất trong kế hoạch sản xuất',
      'Có thể bố trí công suất sản xuất riêng theo thỏa thuận',
      'Hỗ trợ xây dựng kế hoạch sản xuất định kỳ theo tuần hoặc theo tháng',
      'Ưu tiên phối hợp đơn hàng lớn, theo chiến dịch hoặc chia nhiều đợt giao',
      'Có thể được chỉ định đầu mối phụ trách riêng',
      'Có thể thỏa thuận thêm quyền lợi đặc biệt trong hợp đồng hợp tác',
    ],
  },
];

const PRINCIPLES = [
  'Sản lượng và doanh số được tính theo tổng số đơn hàng đã được Luxe Glow xác nhận trong từng tháng.',
  'Nếu đối tác đạt cả tiêu chí sản lượng và doanh số, Luxe Glow có thể áp dụng cấp độ quyền lợi cao hơn sau khi xem xét năng lực sản xuất và điều kiện thực tế.',
  'Mức giá cung cấp được áp dụng theo từng sản phẩm, mẫu thiết kế, kích thước, chất liệu, màu sắc, yêu cầu hoàn thiện và số lượng đặt hàng.',
  'Giá bán sỉ được xác định theo bảng giá hiện hành của Luxe Glow tại từng thời điểm.',
  'Luxe Glow có quyền điều chỉnh đơn giá khi có biến động lớn về nguyên vật liệu, chi phí vận hành, yêu cầu sản xuất hoặc điều kiện thị trường.',
  'Báo giá cụ thể cho từng đơn hàng sẽ được xác nhận trước khi tiến hành sản xuất.',
];

const EXCLUDED_COSTS = [
  'Chi phí thiết kế mới hoặc chỉnh sửa thiết kế',
  'Chi phí làm mẫu hoặc prototype',
  'Chi phí đóng gói riêng, tem nhãn, phụ kiện hoặc bao bì theo yêu cầu',
  'Chi phí vận chuyển và giao hàng gấp',
  'Chi phí phát sinh do thay đổi yêu cầu sau khi đã xác nhận sản xuất',
];

const MAINTENANCE = [
  'Cấp độ hợp tác được xem xét theo sản lượng hoặc doanh số thực tế của từng tháng.',
  'Luxe Glow có thể đánh giá lại cấp độ hợp tác theo tháng hoặc theo chu kỳ ba tháng.',
  'Nếu không đạt mức sản lượng hoặc doanh số đã cam kết, cấp độ hợp tác có thể được điều chỉnh về mức phù hợp.',
  'Muốn áp dụng quyền lợi cấp độ cao ngay từ đầu, hai bên cần thống nhất bằng hợp đồng, đơn đặt hàng hoặc văn bản cam kết sản lượng.',
  'Luxe Glow có thể yêu cầu đặt cọc trước khi tiến hành sản xuất.',
  'Chính sách công nợ chỉ được áp dụng khi có thỏa thuận riêng bằng văn bản.',
];

const PRIORITY_FACTORS = [
  'Số lượng sản phẩm',
  'Mức độ phức tạp',
  'Thời gian chạy máy',
  'Yêu cầu hậu kỳ',
  'Tình trạng công suất máy',
  'Thời điểm xác nhận đơn hàng',
  'Tiến độ thanh toán hoặc đặt cọc',
];

const IP_POLICY = [
  'Đối tác có trách nhiệm bảo đảm hình ảnh, logo, nhân vật, mẫu thiết kế hoặc nội dung cung cấp cho Luxe Glow không vi phạm quyền sở hữu trí tuệ của bên thứ ba.',
  'Luxe Glow có quyền từ chối sản xuất các sản phẩm có dấu hiệu vi phạm bản quyền, nhãn hiệu, kiểu dáng công nghiệp hoặc các quyền sở hữu trí tuệ khác.',
  'Với mẫu thiết kế do Luxe Glow thực hiện, quyền sở hữu và quyền sử dụng sẽ được quy định riêng theo từng hợp đồng hoặc báo giá.',
  'Chi phí sản xuất không mặc nhiên bao gồm quyền sở hữu độc quyền đối với thiết kế.',
  'Trường hợp yêu cầu độc quyền sản phẩm hoặc thiết kế, hai bên cần thỏa thuận riêng về phạm vi, thời hạn, khu vực áp dụng và mức cam kết doanh số.',
];

const BRAND_PR_CONTENT = [
  'Đăng bài giới thiệu Luxe Glow trên các nền tảng của đối tác',
  'Gắn tên hoặc logo Luxe Glow trong nội dung truyền thông',
  'Đăng hình ảnh hoặc video sản phẩm do Luxe Glow sản xuất',
  'Cho phép Luxe Glow sử dụng lại hình ảnh, video hoặc nội dung hợp tác',
  'Gắn thẻ tài khoản hoặc đường dẫn của Luxe Glow',
  'Thực hiện nội dung đồng thương hiệu',
  'Tham gia chiến dịch quảng bá, sự kiện hoặc hoạt động ra mắt sản phẩm',
];

const BRAND_PR_CONDITIONS = [
  'Nền tảng truyền thông', 'Số lượng bài đăng', 'Hình thức nội dung', 'Thời gian đăng tải',
  'Thời gian duy trì nội dung', 'Quyền sử dụng lại hình ảnh', 'Giá trị truyền thông quy đổi', 'Mức giảm giá hoặc quyền lợi tương ứng',
];

const PAYMENT_POLICY = [
  'Tỷ lệ đặt cọc được xác định theo từng đơn hàng hoặc từng hợp đồng.',
  'Luxe Glow chỉ tiến hành sản xuất sau khi nhận đủ khoản đặt cọc theo thỏa thuận.',
  'Phần giá trị còn lại phải được thanh toán theo tiến độ đã xác nhận.',
  'Với đơn hàng có thiết kế riêng hoặc sản xuất theo yêu cầu, khoản đặt cọc có thể không được hoàn lại sau khi Luxe Glow đã bắt đầu thiết kế hoặc sản xuất.',
  'Sản phẩm chỉ được bàn giao khi đối tác hoàn tất nghĩa vụ thanh toán, trừ trường hợp có thỏa thuận công nợ riêng.',
];

const VALIDITY = [
  'Chính sách này có hiệu lực kể từ ngày được Luxe Glow ban hành.',
  'Luxe Glow có quyền cập nhật hoặc điều chỉnh chính sách để phù hợp với năng lực sản xuất và điều kiện kinh doanh.',
  'Các báo giá hoặc hợp đồng đã được xác nhận trước thời điểm điều chỉnh vẫn được thực hiện theo nội dung đã thỏa thuận.',
  'Nếu có khác biệt giữa chính sách này và hợp đồng ký kết giữa hai bên, nội dung trong hợp đồng sẽ được ưu tiên áp dụng.',
];

const CONTACT_CHANNELS = [
  { label: 'Website', value: STORE.website.replace(/^https?:\/\//, '').replace(/\/$/, ''), href: STORE.website, Icon: LanguageOutlinedIcon, color: '#007AFF', bg: '#EAF3FF', external: true },
  { label: 'Điện thoại', value: STORE.phone, href: `tel:${STORE.phone}`, Icon: PhoneOutlinedIcon, color: '#34C759', bg: '#F0FBF2', external: false },
  { label: 'Email', value: STORE.email, href: `mailto:${STORE.email}`, Icon: EmailOutlinedIcon, color: '#636366', bg: '#F5F5F7', external: false },
  { label: 'Địa chỉ', value: STORE.address, href: undefined, Icon: LocationOnOutlinedIcon, color: '#FF3B30', bg: '#FFF1F0', external: false },
  { label: 'Mã số thuế', value: STORE.taxId, href: undefined, Icon: BadgeOutlinedIcon, color: '#8B5CF6', bg: '#F5F0FF', external: false },
];

// ── Small building blocks ────────────────────────────────────

function SectionHeader({
  Icon, accent = '#007AFF', title, subtitle,
}: { Icon: SvgIconComponent; accent?: string; title: string; subtitle?: string }) {
  return (
    <Box sx={{ display: 'flex', alignItems: 'flex-start', gap: 1.75, mb: 3 }}>
      <Box
        sx={{
          width: 44, height: 44, borderRadius: 2.5, flexShrink: 0,
          bgcolor: alpha(accent, 0.1),
          display: 'flex', alignItems: 'center', justifyContent: 'center',
        }}
      >
        <Icon sx={{ color: accent, fontSize: 22 }} />
      </Box>
      <Box>
        <Typography variant="h5" sx={{ fontWeight: 700, lineHeight: 1.3 }}>{title}</Typography>
        {subtitle && (
          <Typography variant="body2" color="text.secondary" sx={{ mt: 0.25 }}>{subtitle}</Typography>
        )}
      </Box>
    </Box>
  );
}

function BulletList({ items, color = '#007AFF' }: { items: string[]; color?: string }) {
  return (
    <Stack spacing={1.25}>
      {items.map((item) => (
        <Box key={item} sx={{ display: 'flex', alignItems: 'flex-start', gap: 1.25 }}>
          <CheckCircleOutlinedIcon sx={{ color, fontSize: 19, mt: 0.15, flexShrink: 0 }} />
          <Typography variant="body1" color="text.secondary" sx={{ lineHeight: 1.75 }}>{item}</Typography>
        </Box>
      ))}
    </Stack>
  );
}

function NumberedList({ items, color = '#007AFF' }: { items: string[]; color?: string }) {
  return (
    <Grid container spacing={2}>
      {items.map((item, idx) => (
        <Grid key={item} size={{ xs: 12, md: 6 }}>
          <Box sx={{ display: 'flex', alignItems: 'flex-start', gap: 1.5, height: '100%' }}>
            <Box
              sx={{
                width: 26, height: 26, borderRadius: '50%', flexShrink: 0,
                bgcolor: alpha(color, 0.1), color,
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                fontSize: 12, fontWeight: 700, mt: 0.15,
              }}
            >
              {idx + 1}
            </Box>
            <Typography variant="body1" color="text.secondary" sx={{ lineHeight: 1.75 }}>{item}</Typography>
          </Box>
        </Grid>
      ))}
    </Grid>
  );
}

function StarRating({ count }: { count: number }) {
  return (
    <Box sx={{ display: 'flex', gap: 0.25 }}>
      {Array.from({ length: 5 }).map((_, i) => (
        i < count
          ? <StarRoundedIcon key={i} sx={{ fontSize: 18, color: '#FF9500' }} />
          : <StarOutlineRoundedIcon key={i} sx={{ fontSize: 18, color: '#D2D2D7' }} />
      ))}
    </Box>
  );
}

// ── Page ──────────────────────────────────────────────────────

export default function PartnershipContent() {
  return (
    <>
      {/* ── Hero ── */}
      <Box
        component="section"
        sx={{
          position: 'relative', overflow: 'hidden',
          background: 'linear-gradient(180deg, #F5F5F7 0%, #ffffff 100%)',
          pt: { xs: 7, md: 12 }, pb: { xs: 8, md: 12 },
        }}
      >
        <Box sx={{ position: 'absolute', inset: 0, pointerEvents: 'none', overflow: 'hidden' }}>
          <Box sx={{ position: 'absolute', top: -160, right: -160, width: 480, height: 480, borderRadius: '50%', background: alpha('#FF9500', 0.08), filter: 'blur(80px)' }} />
          <Box sx={{ position: 'absolute', bottom: -100, left: -100, width: 400, height: 400, borderRadius: '50%', background: alpha('#007AFF', 0.07), filter: 'blur(80px)' }} />
        </Box>

        <Container maxWidth="md" sx={{ position: 'relative', textAlign: 'center' }}>
          <Box sx={{ display: 'inline-flex', alignItems: 'center', gap: 1, bgcolor: alpha('#007AFF', 0.08), color: 'primary.main', px: 2.5, py: 0.75, borderRadius: 980, mb: 3 }}>
            <HandshakeOutlinedIcon sx={{ fontSize: 16 }} />
            <Typography variant="body2" sx={{ fontWeight: 600 }}>Chính sách hợp tác sản xuất</Typography>
          </Box>

          <Typography variant="h2" sx={{ fontWeight: 700, fontSize: { xs: 32, md: 52 }, letterSpacing: '-0.03em', mb: 2.5 }}>
            Hợp tác sản xuất cùng{' '}
            <Box component="span" sx={{ background: 'linear-gradient(135deg, #007AFF 0%, #8B5CF6 100%)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>
              Luxe Glow
            </Box>
          </Typography>

          <Typography variant="body1" color="text.secondary" sx={{ fontSize: { xs: 16, md: 18 }, maxWidth: 620, mx: 'auto', lineHeight: 1.75, mb: 4.5 }}>
            Luxe Glow là đơn vị trực tiếp thiết kế, sản xuất và cung cấp các sản phẩm in 3D theo yêu cầu cho đối tác.
            Chính sách hợp tác được xây dựng dựa trên sản lượng hoặc doanh số mua hàng cam kết hằng tháng — cấp độ
            càng cao, ưu đãi giá và mức độ ưu tiên sản xuất càng lớn.
          </Typography>

          <Stack direction={{ xs: 'column', sm: 'row' }} spacing={1.5} sx={{ justifyContent: 'center' }}>
            <Button href="#tiers" variant="contained" size="large" endIcon={<ArrowForwardIcon />} sx={{ px: 4, py: 1.75, fontWeight: 600 }}>
              Xem chính sách phân hạng
            </Button>
            <Button href="#contact" variant="outlined" size="large" sx={{ px: 4, py: 1.75 }}>
              Liên hệ hợp tác
            </Button>
          </Stack>
        </Container>
      </Box>

      {/* ── Tiers ── */}
      <Container maxWidth="lg" id="tiers" sx={{ py: { xs: 7, md: 10 }, scrollMarginTop: 88 }}>
        <Box sx={{ textAlign: 'center', maxWidth: 640, mx: 'auto', mb: 6 }}>
          <Typography variant="h3" sx={{ fontWeight: 700, fontSize: { xs: 26, md: 34 }, mb: 1.5 }}>
            Chính sách phân hạng đối tác
          </Typography>
          <Typography variant="body1" color="text.secondary" sx={{ fontSize: 16, lineHeight: 1.7 }}>
            4 cấp độ hợp tác với mức giá cung cấp và mức độ ưu tiên sản xuất tăng dần theo sản lượng hoặc doanh số
            mua hàng cam kết hằng tháng.
          </Typography>
        </Box>

        <Grid container spacing={2.5} sx={{ alignItems: 'stretch' }}>
          {TIERS.map((tier) => (
            <Grid key={tier.badge} size={{ xs: 12, sm: 6, lg: 3 }} sx={{ display: 'flex' }}>
              <Paper
                elevation={0}
                sx={{
                  position: 'relative',
                  p: 3, width: '100%',
                  display: 'flex', flexDirection: 'column', gap: 2,
                  borderRadius: 4,
                  border: '1.5px solid',
                  borderColor: tier.featured ? alpha(tier.color, 0.4) : 'divider',
                  boxShadow: tier.featured ? `0 12px 32px ${alpha(tier.color, 0.16)}` : 'none',
                  transition: 'all 0.2s ease',
                  '&:hover': { borderColor: alpha(tier.color, 0.5), transform: 'translateY(-3px)', boxShadow: `0 12px 32px ${alpha(tier.color, 0.14)}` },
                }}
              >
                {tier.featured && (
                  <Chip
                    label="Cao cấp nhất"
                    size="small"
                    sx={{ position: 'absolute', top: -13, left: '50%', transform: 'translateX(-50%)', bgcolor: tier.color, color: '#fff', fontWeight: 700, fontSize: 11, height: 24 }}
                  />
                )}

                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
                  <Box sx={{ width: 44, height: 44, borderRadius: 2.5, flexShrink: 0, bgcolor: alpha(tier.color, 0.1), display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    <tier.Icon sx={{ color: tier.color, fontSize: 22 }} />
                  </Box>
                  <Box>
                    <Typography variant="caption" sx={{ fontWeight: 700, color: tier.color, letterSpacing: 0.5 }}>{tier.badge}</Typography>
                    <Typography variant="body1" sx={{ fontWeight: 700, lineHeight: 1.25 }}>{tier.name}</Typography>
                  </Box>
                </Box>

                <Stack spacing={0.4}>
                  {tier.criteria.map((c) => (
                    <Typography key={c} variant="caption" color="text.secondary" sx={{ lineHeight: 1.5 }}>{c}</Typography>
                  ))}
                </Stack>

                <Divider />

                <Box>
                  <StarRating count={tier.stars} />
                  <Typography variant="h6" sx={{ fontWeight: 700, mt: 1, color: tier.color }}>{tier.price}</Typography>
                  <Typography variant="caption" color="text.secondary">Giá cung cấp</Typography>
                </Box>

                <Divider />

                <Stack spacing={1} sx={{ flex: 1 }}>
                  {tier.benefits.map((b) => (
                    <Box key={b} sx={{ display: 'flex', alignItems: 'flex-start', gap: 1 }}>
                      <CheckCircleOutlinedIcon sx={{ color: tier.color, fontSize: 16, mt: 0.3, flexShrink: 0 }} />
                      <Typography variant="caption" color="text.secondary" sx={{ lineHeight: 1.6 }}>{b}</Typography>
                    </Box>
                  ))}
                </Stack>
              </Paper>
            </Grid>
          ))}
        </Grid>
      </Container>

      {/* ── Content sections ── */}
      <Box sx={{ bgcolor: 'grey.50', py: { xs: 7, md: 10 } }}>
        <Container maxWidth="md">
          <Stack spacing={6}>

            {/* Nguyên tắc áp dụng */}
            <Paper elevation={0} sx={{ p: { xs: 3, md: 4.5 }, borderRadius: 4, border: '1px solid', borderColor: 'divider' }}>
              <SectionHeader Icon={RuleOutlinedIcon} title="Nguyên tắc áp dụng" subtitle="Cách tính sản lượng, doanh số và đơn giá cung cấp" />
              <NumberedList items={PRINCIPLES} />
              <Box sx={{ mt: 3, p: 2.5, bgcolor: alpha('#FF9500', 0.06), border: '1px solid', borderColor: alpha('#FF9500', 0.2), borderRadius: 3 }}>
                <Typography variant="body2" sx={{ fontWeight: 700, mb: 1 }}>
                  Chính sách giá không mặc nhiên bao gồm các chi phí sau, trừ khi có thỏa thuận khác:
                </Typography>
                <BulletList items={EXCLUDED_COSTS} color="#FF9500" />
              </Box>
            </Paper>

            {/* Điều kiện duy trì cấp độ */}
            <Paper elevation={0} sx={{ p: { xs: 3, md: 4.5 }, borderRadius: 4, border: '1px solid', borderColor: 'divider' }}>
              <SectionHeader Icon={UpdateOutlinedIcon} accent="#34C759" title="Điều kiện duy trì cấp độ hợp tác" />
              <BulletList items={MAINTENANCE} color="#34C759" />
            </Paper>

            {/* Mức độ ưu tiên sản xuất */}
            <Paper elevation={0} sx={{ p: { xs: 3, md: 4.5 }, borderRadius: 4, border: '1px solid', borderColor: 'divider' }}>
              <SectionHeader Icon={PrecisionManufacturingOutlinedIcon} accent="#8B5CF6" title="Quy định về mức độ ưu tiên sản xuất" subtitle="Thứ tự sắp xếp và bố trí công suất sản xuất của Luxe Glow" />

              <Box sx={{ display: 'flex', gap: 1.25, p: 2.25, mb: 3, bgcolor: alpha('#FF3B30', 0.05), border: '1px solid', borderColor: alpha('#FF3B30', 0.18), borderRadius: 3 }}>
                <WarningAmberOutlinedIcon sx={{ color: '#FF3B30', fontSize: 20, flexShrink: 0, mt: 0.1 }} />
                <Typography variant="body2" color="text.secondary" sx={{ lineHeight: 1.7 }}>
                  Mức ưu tiên không đồng nghĩa với việc đối tác được quyền thay đổi tiến độ, yêu cầu chen ngang đơn hàng
                  hoặc yêu cầu giao gấp mà không có xác nhận từ Luxe Glow.
                </Typography>
              </Box>

              <Typography variant="body2" sx={{ fontWeight: 600, mb: 1.5 }}>
                Mọi tiến độ sản xuất và thời gian giao hàng chỉ có hiệu lực sau khi được Luxe Glow xác nhận dựa trên:
              </Typography>
              <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
                {PRIORITY_FACTORS.map((f) => (
                  <Chip key={f} label={f} sx={{ bgcolor: alpha('#8B5CF6', 0.08), color: '#8B5CF6', fontWeight: 600, fontSize: 13 }} />
                ))}
              </Box>
            </Paper>

            {/* Thiết kế & SHTT */}
            <Paper elevation={0} sx={{ p: { xs: 3, md: 4.5 }, borderRadius: 4, border: '1px solid', borderColor: 'divider' }}>
              <SectionHeader Icon={GavelOutlinedIcon} accent="#007AFF" title="Chính sách thiết kế và sở hữu trí tuệ" />
              <NumberedList items={IP_POLICY} />
            </Paper>

            {/* Brand PR */}
            <Paper
              elevation={0}
              sx={{
                p: { xs: 3, md: 4.5 }, borderRadius: 4,
                border: '1.5px solid', borderColor: alpha('#FF9500', 0.25),
                background: `linear-gradient(160deg, ${alpha('#FF9500', 0.06)} 0%, ${alpha('#8B5CF6', 0.05)} 100%)`,
              }}
            >
              <SectionHeader Icon={CampaignOutlinedIcon} accent="#FF9500" title="Hình thức hợp tác kết hợp Brand PR" subtitle="Một hình thức hợp tác riêng, không mặc nhiên cộng vào quyền lợi các Option" />

              <Typography variant="body2" sx={{ fontWeight: 600, mb: 1.5 }}>Nội dung hợp tác có thể bao gồm:</Typography>
              <Box sx={{ mb: 3 }}>
                <BulletList items={BRAND_PR_CONTENT} color="#FF9500" />
              </Box>

              <Typography variant="body2" sx={{ fontWeight: 600, mb: 1.5 }}>
                Quyền lợi quy đổi từ Brand PR chỉ được áp dụng khi hai bên thống nhất rõ:
              </Typography>
              <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1, mb: 2.5 }}>
                {BRAND_PR_CONDITIONS.map((c) => (
                  <Chip key={c} label={c} size="small" sx={{ bgcolor: '#fff', border: '1px solid', borderColor: alpha('#FF9500', 0.3), color: 'text.primary', fontWeight: 500 }} />
                ))}
              </Box>

              <Typography variant="caption" color="text.secondary" sx={{ fontStyle: 'italic' }}>
                Mọi cam kết truyền thông cần được xác nhận bằng văn bản trước khi áp dụng vào đơn giá sản xuất.
              </Typography>
            </Paper>

            {/* Thanh toán & đặt cọc */}
            <Paper elevation={0} sx={{ p: { xs: 3, md: 4.5 }, borderRadius: 4, border: '1px solid', borderColor: 'divider' }}>
              <SectionHeader Icon={PaymentsOutlinedIcon} accent="#34C759" title="Thanh toán và đặt cọc" />
              <BulletList items={PAYMENT_POLICY} color="#34C759" />
            </Paper>

            {/* Hiệu lực chính sách */}
            <Paper elevation={0} sx={{ p: { xs: 3, md: 4.5 }, borderRadius: 4, border: '1px solid', borderColor: 'divider' }}>
              <SectionHeader Icon={ArticleOutlinedIcon} accent="#636366" title="Hiệu lực chính sách" />
              <BulletList items={VALIDITY} color="#636366" />
              <Typography variant="caption" color="text.secondary">
                Cập nhật lần cuối: {LAST_UPDATED}
              </Typography>
            </Paper>

          </Stack>
        </Container>
      </Box>

      {/* ── Contact / CTA ── */}
      <Container maxWidth="lg" id="contact" sx={{ py: { xs: 7, md: 11 }, scrollMarginTop: 88 }}>
        <Box sx={{ textAlign: 'center', maxWidth: 620, mx: 'auto', mb: 5 }}>
          <Typography variant="h3" sx={{ fontWeight: 700, fontSize: { xs: 26, md: 34 }, mb: 1.5 }}>
            Sẵn sàng hợp tác cùng Luxe Glow?
          </Typography>
          <Typography variant="body1" color="text.secondary" sx={{ fontSize: 16, lineHeight: 1.7 }}>
            Liên hệ để được tư vấn cấp độ hợp tác phù hợp, mức giá cung cấp và tiến độ sản xuất dự kiến cho đơn hàng của bạn.
          </Typography>
        </Box>

        <Grid container spacing={2.5} sx={{ mb: 5 }}>
          {CONTACT_CHANNELS.map(({ label, value, href, Icon, color, bg, external }) => {
            const content = (
              <Paper
                elevation={0}
                sx={{
                  p: 3, height: '100%', borderRadius: 4,
                  border: '1px solid', borderColor: 'divider',
                  display: 'flex', flexDirection: 'column', gap: 1.5,
                  transition: 'box-shadow 0.2s, transform 0.2s',
                  ...(href && { '&:hover': { boxShadow: 4, transform: 'translateY(-2px)' } }),
                }}
              >
                <Box sx={{ width: 48, height: 48, borderRadius: 3, bgcolor: bg, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  <Icon sx={{ color, fontSize: 24 }} />
                </Box>
                <Box>
                  <Typography variant="caption" color="text.secondary">{label}</Typography>
                  <Typography variant="body2" sx={{ fontWeight: 700, wordBreak: 'break-word' }}>{value}</Typography>
                </Box>
              </Paper>
            );
            return (
              <Grid key={label} size={{ xs: 12, sm: 6, md: 4 }}>
                {href ? (
                  <Link href={href} target={external ? '_blank' : undefined} rel={external ? 'noopener noreferrer' : undefined} style={{ textDecoration: 'none', display: 'block', height: '100%' }}>
                    {content}
                  </Link>
                ) : content}
              </Grid>
            );
          })}
        </Grid>

        <Box sx={{ textAlign: 'center' }}>
          <Stack direction={{ xs: 'column', sm: 'row' }} spacing={1.5} sx={{ justifyContent: 'center', mb: 4 }}>
            <Button component={Link} href={`tel:${STORE.phone}`} variant="contained" size="large" startIcon={<PhoneOutlinedIcon />} sx={{ px: 4, py: 1.75, fontWeight: 600 }}>
              Gọi hotline hợp tác
            </Button>
            <Button component={Link} href={`mailto:${STORE.email}`} variant="outlined" size="large" startIcon={<EmailOutlinedIcon />} sx={{ px: 4, py: 1.75 }}>
              Gửi email hợp tác
            </Button>
          </Stack>

          <Divider sx={{ mb: 3 }} />
          <Typography variant="caption" color="text.disabled" sx={{ display: 'block', mb: 3, fontStyle: 'italic', maxWidth: 640, mx: 'auto', lineHeight: 1.7 }}>
            Tài liệu này là chính sách hợp tác tham khảo. Các điều khoản cụ thể về sản phẩm, đơn giá, tiến độ, thanh toán,
            quyền sở hữu trí tuệ và trách nhiệm của hai bên sẽ được xác nhận trong báo giá, đơn đặt hàng hoặc hợp đồng riêng.
          </Typography>

          <Stack direction="row" spacing={1.5} sx={{ justifyContent: 'center', flexWrap: 'wrap' }}>
            {[
              { label: 'Thiết kế theo yêu cầu', href: '/custom-order' },
              { label: 'Sản phẩm', href: '/products' },
              { label: 'Liên hệ chung', href: '/contact' },
            ].map(({ label, href }) => (
              <Button key={href} component={Link} href={href} variant="text" size="small" sx={{ fontSize: 13, fontWeight: 500, color: 'text.secondary' }}>
                {label}
              </Button>
            ))}
          </Stack>
        </Box>
      </Container>
    </>
  );
}

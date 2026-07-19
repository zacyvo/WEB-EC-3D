'use client';

import Link from 'next/link';
import { Box, Container, Typography, Stack, Divider, alpha } from '@mui/material';
import { STORE } from '@/lib/store-config';

const LAST_UPDATED = '19/07/2026';

type ContentItem = { subtitle?: string; body: string };
type Section = {
  id: string;
  title: string;
  content: ContentItem[];
  list?: string[];
  afterList?: ContentItem[];
  contact?: boolean;
};

const SECTIONS: Section[] = [
  {
    id: '1',
    title: '1. Phạm vi giao hàng',
    content: [
      {
        body: `${STORE.name} giao hàng toàn quốc — từ nội thành TP. Hồ Chí Minh đến các tỉnh, thành khác trên cả nước, kể cả khu vực vùng sâu, vùng xa.`,
      },
    ],
  },
  {
    id: '2',
    title: '2. Đơn vị vận chuyển',
    content: [
      {
        body: 'Chúng tôi hợp tác với các đơn vị vận chuyển uy tín tại Việt Nam để đảm bảo hàng đến tay bạn nhanh chóng và an toàn:',
      },
    ],
    list: [
      'Giao Hàng Tiết Kiệm (GHTK)',
      'Giao Hàng Nhanh (GHN)',
      'J&T Express',
    ],
    afterList: [
      {
        body: 'Sau khi đơn hàng được bàn giao cho đơn vị vận chuyển, bạn sẽ nhận được mã vận đơn qua SMS hoặc trong mục "Đơn hàng" trên website để theo dõi hành trình đơn hàng.',
      },
    ],
  },
  {
    id: '3',
    title: '3. Thời gian giao hàng',
    content: [
      {
        body: 'Thời gian giao hàng dự kiến, tính từ lúc đơn hàng được xác nhận và đóng gói:',
      },
    ],
    list: [
      'TP. Hồ Chí Minh nội thành: 1–2 ngày làm việc',
      'TP. Hồ Chí Minh ngoại thành: 2–3 ngày làm việc',
      'Các tỉnh, thành khác: 3–7 ngày làm việc',
      'Vùng sâu, vùng xa: có thể lâu hơn tùy khu vực',
    ],
    afterList: [
      {
        body: 'Thời gian trên không bao gồm các đơn hàng thiết kế theo yêu cầu (custom order), vốn cần thêm 2–3 ngày làm việc để sản xuất trước khi bàn giao vận chuyển. Thời gian giao hàng cũng có thể kéo dài hơn trong các dịp lễ, Tết hoặc do điều kiện thời tiết bất khả kháng.',
      },
    ],
  },
  {
    id: '4',
    title: '4. Phí vận chuyển',
    content: [
      {
        body: 'Phí vận chuyển được tính tự động dựa trên địa chỉ nhận hàng và trọng lượng đơn hàng, hiển thị rõ ràng tại bước xác nhận đơn trước khi bạn đặt hàng — không phát sinh phí ẩn.',
      },
      {
        body: 'Đơn hàng từ 500.000đ trở lên được miễn phí vận chuyển khi giao trong nội thành TP. Hồ Chí Minh.',
      },
    ],
  },
  {
    id: '5',
    title: '5. Đóng gói sản phẩm',
    content: [
      {
        body: 'Vì đèn in 3D là sản phẩm thủ công dễ va đập, mỗi sản phẩm được kiểm tra kỹ và đóng gói cẩn thận bằng vật liệu chống sốc (mút xốp, giấy chèn) trước khi đưa vào thùng carton chắc chắn, đảm bảo an toàn trong suốt quá trình vận chuyển.',
      },
    ],
  },
  {
    id: '6',
    title: '6. Kiểm tra hàng khi nhận',
    content: [
      {
        body: 'Bạn nên kiểm tra tình trạng bên ngoài của kiện hàng trước khi ký nhận với nhân viên giao hàng. Nếu phát hiện thùng hàng móp méo, ướt hoặc có dấu hiệu bị mở, vui lòng quay video/chụp ảnh trước khi mở và có quyền từ chối nhận hàng.',
      },
      {
        body: 'Trường hợp sản phẩm bị hư hỏng do vận chuyển, vui lòng chụp ảnh gói hàng và sản phẩm ngay khi nhận, liên hệ chúng tôi trong vòng 24 giờ để được đổi mới miễn phí. Xem thêm tại trang Chính sách bảo hành đổi trả.',
      },
    ],
  },
  {
    id: '7',
    title: '7. Theo dõi đơn hàng',
    content: [
      {
        body: 'Đăng nhập tài khoản và vào mục "Đơn hàng" để xem trạng thái theo thời gian thực: đang xử lý, đang giao hàng, đã giao thành công. Bạn cũng sẽ nhận email/SMS cập nhật ở các mốc quan trọng.',
      },
    ],
  },
  {
    id: '8',
    title: '8. Liên hệ',
    content: [
      {
        body: 'Nếu bạn có thắc mắc về đơn hàng đang vận chuyển hoặc cần hỗ trợ, vui lòng liên hệ:',
      },
    ],
    contact: true,
  },
];

export default function ShippingPolicyContent() {
  return (
    <Box sx={{ py: { xs: 6, md: 10 } }}>
      <Container maxWidth="md">
        {/* Header */}
        <Box sx={{ mb: 6 }}>
          <Typography
            variant="overline"
            sx={{ color: 'primary.main', fontWeight: 600, letterSpacing: 2 }}
          >
            Pháp lý
          </Typography>
          <Typography variant="h3" sx={{ fontWeight: 700, mt: 1, mb: 2, fontSize: { xs: '1.8rem', md: '2.4rem' } }}>
            Chính sách vận chuyển
          </Typography>
          <Typography variant="body2" color="text.secondary">
            Cập nhật lần cuối: {LAST_UPDATED}
          </Typography>
          <Divider sx={{ mt: 3 }} />
        </Box>

        {/* Intro */}
        <Box
          sx={{
            bgcolor: (t) => alpha(t.palette.primary.main, 0.05),
            border: '1px solid',
            borderColor: (t) => alpha(t.palette.primary.main, 0.15),
            borderRadius: 3,
            p: 3,
            mb: 5,
          }}
        >
          <Typography variant="body1" sx={{ lineHeight: 1.8, color: 'text.secondary' }}>
            {STORE.name} cam kết giao hàng nhanh chóng, an toàn trên toàn quốc. Trang này giải thích
            chi tiết phạm vi, thời gian, phí vận chuyển và cách theo dõi đơn hàng của bạn.
          </Typography>
        </Box>

        {/* Sections */}
        <Stack spacing={5}>
          {SECTIONS.map((section) => (
            <Box key={section.id}>
              <Typography variant="h6" sx={{ fontWeight: 700, mb: 2 }}>
                {section.title}
              </Typography>
              <Stack spacing={1.5}>
                {section.content.map((item, idx) => (
                  <Box key={idx}>
                    {'subtitle' in item && item.subtitle && (
                      <Typography variant="body1" sx={{ fontWeight: 600, mb: 0.5 }}>
                        {item.subtitle}
                      </Typography>
                    )}
                    <Typography variant="body1" color="text.secondary" sx={{ lineHeight: 1.8 }}>
                      {item.body}
                    </Typography>
                  </Box>
                ))}
                {section.list && (
                  <Box component="ul" sx={{ m: 0, pl: 2.5 }}>
                    {section.list.map((item) => (
                      <Box component="li" key={item} sx={{ mb: 0.75 }}>
                        <Typography variant="body1" color="text.secondary" sx={{ lineHeight: 1.8 }}>
                          {item}
                        </Typography>
                      </Box>
                    ))}
                  </Box>
                )}
                {section.afterList?.map((item, idx) => (
                  <Box key={`after-${idx}`}>
                    {'subtitle' in item && item.subtitle && (
                      <Typography variant="body1" sx={{ fontWeight: 600, mb: 0.5 }}>
                        {item.subtitle}
                      </Typography>
                    )}
                    <Typography variant="body1" color="text.secondary" sx={{ lineHeight: 1.8 }}>
                      {item.body}
                    </Typography>
                  </Box>
                ))}
                {section.contact && (
                  <Box
                    sx={{
                      bgcolor: 'grey.50',
                      border: '1px solid',
                      borderColor: 'divider',
                      borderRadius: 2,
                      p: 2.5,
                      mt: 1,
                    }}
                  >
                    <Stack spacing={0.75}>
                      <Typography variant="body2" color="text.secondary">
                        📧 Email:{' '}
                        <Link href={`mailto:${STORE.email}`} style={{ color: 'inherit', fontWeight: 600 }}>
                          {STORE.email}
                        </Link>
                      </Typography>
                      <Typography variant="body2" color="text.secondary">
                        📞 Điện thoại:{' '}
                        <Link href={`tel:${STORE.phone}`} style={{ color: 'inherit', fontWeight: 600 }}>
                          {STORE.phone}
                        </Link>
                      </Typography>
                      <Typography variant="body2" color="text.secondary">
                        📍 Địa chỉ: {STORE.address}
                      </Typography>
                    </Stack>
                  </Box>
                )}
              </Stack>
            </Box>
          ))}
        </Stack>

        {/* Footer nav */}
        <Divider sx={{ my: 6 }} />
        <Box sx={{ display: 'flex', gap: 3, flexWrap: 'wrap' }}>
          <Link href="/return-policy" style={{ color: 'inherit' }}>
            <Typography variant="body2" color="primary" sx={{ fontWeight: 600 }}>
              Chính sách bảo hành đổi trả →
            </Typography>
          </Link>
          <Link href="/payment-methods" style={{ color: 'inherit' }}>
            <Typography variant="body2" color="text.secondary">
              Hình thức thanh toán
            </Typography>
          </Link>
          <Link href="/contact" style={{ color: 'inherit' }}>
            <Typography variant="body2" color="text.secondary">
              Liên hệ chúng tôi
            </Typography>
          </Link>
        </Box>
      </Container>
    </Box>
  );
}

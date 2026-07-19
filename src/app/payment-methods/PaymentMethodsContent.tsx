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
  contact?: boolean;
};

const SECTIONS: Section[] = [
  {
    id: '1',
    title: '1. Các hình thức thanh toán được hỗ trợ',
    content: [
      {
        body: `${STORE.name} hỗ trợ các hình thức thanh toán sau để bạn lựa chọn phù hợp nhất:`,
      },
    ],
    list: [
      'Thanh toán khi nhận hàng (COD) — áp dụng toàn quốc',
      'Chuyển khoản ngân hàng',
      'Ví điện tử (MoMo, ZaloPay, VNPay)',
    ],
  },
  {
    id: '2',
    title: '2. Thanh toán khi nhận hàng (COD)',
    content: [
      {
        body: 'Bạn thanh toán bằng tiền mặt trực tiếp cho nhân viên giao hàng khi nhận sản phẩm. Đây là hình thức phổ biến nhất, phù hợp khi bạn muốn kiểm tra hàng trước khi thanh toán. Vui lòng chuẩn bị đúng số tiền theo giá trị đơn hàng hiển thị trong email/SMS xác nhận.',
      },
    ],
  },
  {
    id: '3',
    title: '3. Chuyển khoản ngân hàng',
    content: [
      {
        body: 'Sau khi đặt hàng, thông tin tài khoản ngân hàng của chúng tôi sẽ được gửi trong email xác nhận đơn hàng. Vui lòng ghi rõ mã đơn hàng ở nội dung chuyển khoản để được đối soát nhanh chóng.',
      },
      {
        body: 'Đơn hàng sẽ được xử lý ngay sau khi chúng tôi xác nhận đã nhận được thanh toán, thường trong vòng vài giờ làm việc.',
      },
    ],
  },
  {
    id: '4',
    title: '4. Ví điện tử',
    content: [
      {
        body: 'Chúng tôi chấp nhận thanh toán qua các ví điện tử phổ biến: MoMo, ZaloPay và VNPay. Làm theo hướng dẫn hiển thị tại trang thanh toán hoặc trong email xác nhận đơn để hoàn tất giao dịch.',
      },
    ],
  },
  {
    id: '5',
    title: '5. Đặt cọc cho đơn thiết kế theo yêu cầu',
    content: [
      {
        body: 'Đối với sản phẩm thiết kế riêng theo yêu cầu (custom order), chúng tôi yêu cầu đặt cọc 50% giá trị đơn hàng trước khi bắt đầu sản xuất. Số tiền còn lại được thanh toán khi nhận hàng hoặc trước khi giao, tùy theo thỏa thuận.',
      },
    ],
  },
  {
    id: '6',
    title: '6. An toàn thanh toán',
    content: [
      {
        body: 'Mọi giao dịch chuyển khoản và ví điện tử đều được xác nhận qua email/SMS sau khi chúng tôi nhận được thanh toán. Chúng tôi không bao giờ yêu cầu bạn chuyển khoản qua kênh trung gian, số tài khoản cá nhân không rõ nguồn gốc hoặc cung cấp mã OTP/mật khẩu ngân hàng. Nếu nhận được yêu cầu bất thường mạo danh cửa hàng, vui lòng liên hệ ngay với chúng tôi để xác minh.',
      },
    ],
  },
  {
    id: '7',
    title: '7. Hóa đơn',
    content: [
      {
        body: 'Hiện tại chúng tôi chưa hỗ trợ xuất hóa đơn giá trị gia tăng (VAT) điện tử. Tính năng này sẽ được cập nhật trong thời gian sớm nhất — vui lòng liên hệ nếu doanh nghiệp của bạn cần chứng từ mua hàng.',
      },
    ],
  },
  {
    id: '8',
    title: '8. Liên hệ',
    content: [
      {
        body: 'Nếu bạn gặp vấn đề khi thanh toán hoặc cần hỗ trợ, vui lòng liên hệ:',
      },
    ],
    contact: true,
  },
];

export default function PaymentMethodsContent() {
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
            Hình thức thanh toán
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
            {STORE.name} mang đến nhiều lựa chọn thanh toán linh hoạt và an toàn để bạn mua sắm thuận
            tiện nhất. Trang này giải thích chi tiết từng hình thức thanh toán hiện có.
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
          <Link href="/shipping-policy" style={{ color: 'inherit' }}>
            <Typography variant="body2" color="primary" sx={{ fontWeight: 600 }}>
              Chính sách vận chuyển →
            </Typography>
          </Link>
          <Link href="/return-policy" style={{ color: 'inherit' }}>
            <Typography variant="body2" color="text.secondary">
              Chính sách bảo hành đổi trả
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

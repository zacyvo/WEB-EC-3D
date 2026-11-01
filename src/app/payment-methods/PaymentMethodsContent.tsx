'use client';

import Link from 'next/link';
import { Box, Container, Typography, Stack, Divider, alpha } from '@mui/material';
import { STORE } from '@/lib/store-config';

const LAST_UPDATED = '02/11/2026';

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
        body: `Khi đặt hàng trên website, bạn chọn một trong hai hình thức thanh toán sau. ${STORE.name} hiện không kết nối với cổng thanh toán, thẻ hay ví điện tử.`,
      },
    ],
    list: [
      'Thanh toán khi nhận hàng (COD) — áp dụng toàn quốc',
      'Chuyển khoản ngân hàng (VietQR)',
    ],
  },
  {
    id: '2',
    title: '2. Thanh toán khi nhận hàng (COD)',
    content: [
      {
        body: 'Bạn thanh toán bằng tiền mặt (hoặc theo hình thức đơn vị vận chuyển hỗ trợ) cho nhân viên giao hàng khi nhận sản phẩm. Số tiền cần trả là mục "Cần thanh toán" hiển thị trong trang chi tiết đơn hàng — vui lòng không trả thêm bất kỳ khoản nào khác.',
      },
    ],
  },
  {
    id: '3',
    title: '3. Chuyển khoản ngân hàng (VietQR)',
    content: [
      {
        body: 'Chọn "Chuyển khoản ngân hàng (VietQR)" và bấm "Đặt hàng & lấy mã QR". Trang thanh toán (và trang chi tiết đơn hàng) hiển thị mã VietQR cùng tên ngân hàng, chủ tài khoản, số tài khoản, số tiền và nội dung chuyển khoản riêng của đơn. Quét mã bằng ứng dụng ngân hàng là số tiền và nội dung đã được điền sẵn; nếu chuyển khoản thủ công, vui lòng nhập đúng số tiền và nội dung chuyển khoản.',
      },
      {
        body: 'Sau khi chuyển, bạn có thể bấm "Tôi đã chuyển khoản" để báo cho chúng tôi kiểm tra. Đơn được ghi nhận "Đã thanh toán" sau khi nhân viên xác nhận đã nhận đủ tiền trong tài khoản ngân hàng, và chuyển sang "Đang chuẩn bị hàng". Trạng thái thanh toán được cập nhật trên trang chi tiết đơn hàng.',
      },
      {
        body: 'Nếu đơn đã chuyển khoản bị hủy, chúng tôi hoàn tiền bằng chuyển khoản theo Điều khoản dịch vụ; trạng thái "Đã hoàn tiền" được cập nhật trên trang đơn hàng.',
      },
    ],
  },
  {
    id: '4',
    title: '4. Đơn thiết kế theo yêu cầu',
    content: [
      {
        body: 'Với sản phẩm thiết kế riêng (custom order), giá, tiến độ và điều kiện thanh toán — bao gồm khoản đặt cọc (thông thường 50% giá trị đơn hàng) trước khi sản xuất — được báo giá và thống nhất với bạn trước khi bắt đầu. Số tiền còn lại được thanh toán khi nhận hàng hoặc trước khi giao, tùy theo thỏa thuận.',
      },
    ],
  },
  {
    id: '5',
    title: '5. An toàn thanh toán',
    content: [
      {
        body: 'Chúng tôi chỉ nhận tiền vào tài khoản ngân hàng hiển thị trên website cho từng đơn hàng. Chúng tôi không bao giờ yêu cầu bạn chuyển khoản vào tài khoản khác, qua kênh trung gian, hay cung cấp số thẻ, mật khẩu, mã OTP ngân hàng. Nếu nhận được yêu cầu bất thường mạo danh cửa hàng, vui lòng liên hệ ngay với chúng tôi để xác minh.',
      },
    ],
  },
  {
    id: '6',
    title: '6. Hoá đơn điện tử',
    content: [
      {
        body: 'Bạn có thể yêu cầu xuất hoá đơn điện tử (cá nhân hoặc doanh nghiệp) khi đặt hàng hoặc tại trang chi tiết đơn hàng. Hoá đơn được gửi tới email của bạn sau khi đơn được thanh toán. Chi tiết tại Điều khoản dịch vụ.',
      },
    ],
  },
  {
    id: '7',
    title: '7. Liên hệ',
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
            Trang này mô tả các hình thức thanh toán {STORE.name} đang áp dụng khi bạn đặt hàng trên website,
            cách xác nhận thanh toán và hoàn tiền.
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

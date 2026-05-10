'use client';

import Link from 'next/link';
import { Box, Container, Typography, Stack, Divider, alpha } from '@mui/material';
import { STORE } from '@/lib/store-config';

const LAST_UPDATED = '06/05/2025';

const SECTIONS = [
  {
    id: '1',
    title: '1. Thu thập thông tin',
    content: [
      {
        subtitle: 'Thông tin bạn cung cấp trực tiếp',
        body: `Khi đăng ký tài khoản, đặt hàng hoặc liên hệ với chúng tôi, ${STORE.name} có thể thu thập: họ và tên, địa chỉ email, số điện thoại, địa chỉ giao hàng, thông tin thanh toán (không lưu số thẻ nguyên văn) và nội dung tin nhắn hỗ trợ.`,
      },
      {
        subtitle: 'Thông tin thu thập tự động',
        body: 'Chúng tôi thu thập các dữ liệu kỹ thuật như địa chỉ IP, loại trình duyệt, thiết bị, trang đã xem và thời gian truy cập thông qua cookie và công nghệ tương tự. Dữ liệu này được dùng để cải thiện trải nghiệm mua sắm và phân tích hiệu suất website.',
      },
      {
        subtitle: 'Đăng nhập qua mạng xã hội',
        body: 'Nếu bạn đăng nhập bằng Google hoặc Facebook, chúng tôi chỉ nhận các thông tin mà nền tảng đó cho phép chia sẻ (thường là tên, email và ảnh đại diện). Chúng tôi không truy cập mật khẩu tài khoản mạng xã hội của bạn.',
      },
    ],
  },
  {
    id: '2',
    title: '2. Mục đích sử dụng thông tin',
    content: [
      {
        subtitle: null,
        body: `${STORE.name} sử dụng thông tin của bạn để:`,
      },
    ],
    list: [
      'Xử lý và giao đơn hàng, thông báo trạng thái vận chuyển',
      'Hỗ trợ khách hàng và giải quyết khiếu nại',
      'Gửi xác nhận đơn hàng, hóa đơn điện tử',
      'Cải thiện sản phẩm, dịch vụ và trải nghiệm mua sắm',
      'Gửi thông tin khuyến mãi, sản phẩm mới (nếu bạn đã đồng ý nhận)',
      'Tuân thủ nghĩa vụ pháp lý theo quy định của pháp luật Việt Nam',
    ],
  },
  {
    id: '3',
    title: '3. Chia sẻ thông tin',
    content: [
      {
        subtitle: null,
        body: 'Chúng tôi không bán, cho thuê hoặc chia sẻ thông tin cá nhân của bạn với bên thứ ba vì mục đích thương mại. Thông tin chỉ được chia sẻ trong các trường hợp sau:',
      },
    ],
    list: [
      'Đối tác vận chuyển (GHN, GHTK,...) để thực hiện giao hàng',
      'Cổng thanh toán để xử lý giao dịch an toàn',
      'Cơ quan pháp luật khi có yêu cầu theo quy định',
      'Bên thứ ba được ủy quyền vận hành hạ tầng kỹ thuật (có cam kết bảo mật)',
    ],
  },
  {
    id: '4',
    title: '4. Bảo mật dữ liệu',
    content: [
      {
        subtitle: null,
        body: 'Chúng tôi áp dụng các biện pháp kỹ thuật và tổ chức phù hợp để bảo vệ thông tin của bạn khỏi truy cập trái phép, mất mát hoặc tiết lộ. Bao gồm: mã hóa SSL/TLS cho mọi kết nối, mã hóa mật khẩu bằng bcrypt, phân quyền truy cập nội bộ và giám sát hệ thống liên tục.',
      },
      {
        subtitle: null,
        body: 'Tuy nhiên, không có hệ thống nào hoàn toàn an toàn. Chúng tôi khuyến khích bạn sử dụng mật khẩu mạnh và không chia sẻ thông tin tài khoản với người khác.',
      },
    ],
  },
  {
    id: '5',
    title: '5. Cookie',
    content: [
      {
        subtitle: null,
        body: 'Website sử dụng cookie để duy trì phiên đăng nhập, ghi nhớ giỏ hàng và phân tích hành vi duyệt web (thông qua các công cụ như Google Analytics). Bạn có thể tắt cookie trong cài đặt trình duyệt, tuy nhiên một số tính năng có thể bị ảnh hưởng.',
      },
    ],
  },
  {
    id: '6',
    title: '6. Quyền của bạn',
    content: [
      {
        subtitle: null,
        body: 'Bạn có các quyền sau đối với dữ liệu cá nhân của mình:',
      },
    ],
    list: [
      'Truy cập và xem thông tin cá nhân đang được lưu trữ',
      'Yêu cầu chỉnh sửa thông tin không chính xác',
      'Yêu cầu xóa tài khoản và dữ liệu liên quan',
      'Hủy đăng ký nhận email tiếp thị bất cứ lúc nào',
      'Phản đối hoặc yêu cầu hạn chế xử lý dữ liệu của bạn',
    ],
  },
  {
    id: '7',
    title: '7. Thời gian lưu trữ',
    content: [
      {
        subtitle: null,
        body: 'Thông tin đơn hàng và giao dịch được lưu trữ trong tối thiểu 5 năm theo quy định kế toán. Thông tin tài khoản được giữ cho đến khi bạn yêu cầu xóa. Dữ liệu log kỹ thuật được lưu tối đa 90 ngày.',
      },
    ],
  },
  {
    id: '8',
    title: '8. Thay đổi chính sách',
    content: [
      {
        subtitle: null,
        body: 'Chúng tôi có thể cập nhật chính sách này theo thời gian. Mọi thay đổi đáng kể sẽ được thông báo qua email hoặc thông báo nổi bật trên website. Ngày cập nhật sẽ được ghi rõ ở đầu trang.',
      },
    ],
  },
  {
    id: '9',
    title: '9. Liên hệ',
    content: [
      {
        subtitle: null,
        body: `Nếu bạn có câu hỏi về chính sách bảo mật hoặc muốn thực hiện quyền của mình, hãy liên hệ:`,
      },
    ],
    contact: true,
  },
];

export default function PrivacyPolicyContent() {
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
            Chính sách bảo mật
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
            {STORE.name} cam kết bảo vệ quyền riêng tư và thông tin cá nhân của bạn. Chính sách này giải thích
            cách chúng tôi thu thập, sử dụng và bảo vệ dữ liệu khi bạn sử dụng website{' '}
            <strong>luxeglow.vn</strong> và các dịch vụ liên quan.
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
                    {item.subtitle && (
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
                      <Box
                        component="li"
                        key={item}
                        sx={{ mb: 0.75 }}
                      >
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
          <Link href="/terms-of-service" style={{ color: 'inherit' }}>
            <Typography variant="body2" color="primary" sx={{ fontWeight: 600 }}>
              Điều khoản dịch vụ →
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

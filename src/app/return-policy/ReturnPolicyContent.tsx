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
    title: '1. Thời hạn đổi trả',
    content: [
      {
        body: `${STORE.name} chấp nhận đổi trả trong vòng 30 ngày kể từ ngày bạn nhận được hàng.`,
      },
    ],
  },
  {
    id: '2',
    title: '2. Điều kiện đổi trả',
    content: [
      {
        body: 'Sản phẩm được chấp nhận đổi trả khi đáp ứng đủ các điều kiện sau:',
      },
    ],
    list: [
      'Sản phẩm chưa qua sử dụng, còn nguyên vẹn hiện trạng ban đầu',
      'Còn đầy đủ bao bì, phụ kiện đi kèm (đế đèn, dây nguồn, bóng đèn nếu có)',
      'Kèm hóa đơn hoặc thông tin đơn hàng để đối chiếu',
    ],
  },
  {
    id: '3',
    title: '3. Trường hợp được đổi trả miễn phí',
    content: [
      {
        body: 'Các trường hợp sau được đổi trả hoặc đổi mới hoàn toàn miễn phí, không giới hạn ở lý do đổi ý:',
      },
    ],
    list: [
      'Sản phẩm bị lỗi kỹ thuật từ nhà sản xuất',
      'Giao sai sản phẩm so với đơn hàng đã đặt',
      'Sản phẩm bị hư hỏng, vỡ trong quá trình vận chuyển',
    ],
  },
  {
    id: '4',
    title: '4. Trường hợp không áp dụng đổi trả',
    content: [
      {
        body: 'Sản phẩm thiết kế theo yêu cầu (custom order — khắc tên, hình ảnh, logo cá nhân) không được đổi trả vì lý do đổi ý, trừ khi có lỗi sản xuất. Sản phẩm đã qua sử dụng hoặc bị tác động vật lý (rơi vỡ, trầy xước do người dùng) sau khi nhận hàng cũng không được chấp nhận đổi trả.',
      },
    ],
  },
  {
    id: '5',
    title: '5. Quy trình đổi trả',
    content: [
      {
        body: 'Để yêu cầu đổi trả, vui lòng thực hiện theo các bước sau:',
      },
    ],
    list: [
      'Liên hệ hotline, email hoặc Zalo trong vòng 24 giờ kể từ khi nhận hàng (đối với hàng lỗi/hư hỏng do vận chuyển) kèm ảnh hoặc video sản phẩm',
      'Chúng tôi xác nhận yêu cầu và hướng dẫn gửi trả sản phẩm',
      'Sau khi nhận và kiểm tra hàng trả về, chúng tôi tiến hành đổi mới hoặc hoàn tiền',
    ],
    afterList: [
      {
        body: 'Chi phí vận chuyển gửi trả hàng do lỗi từ phía chúng tôi (sản xuất, giao sai, hư hỏng vận chuyển) sẽ được hoàn lại. Trường hợp đổi ý, khách hàng chịu chi phí vận chuyển hai chiều.',
      },
    ],
  },
  {
    id: '6',
    title: '6. Bảo hành sản phẩm',
    content: [
      {
        body: 'Bộ đế đèn LED và dây nguồn đi kèm được bảo hành 12 tháng đối với lỗi kỹ thuật từ nhà sản xuất (không sáng, chập chờn do linh kiện). Bảo hành không áp dụng cho hư hỏng do sử dụng sai điện áp, ngấm nước hoặc tác động vật lý từ người dùng.',
      },
    ],
  },
  {
    id: '7',
    title: '7. Hoàn tiền',
    content: [
      {
        body: 'Sau khi nhận và kiểm tra sản phẩm trả về đạt điều kiện, chúng tôi xử lý hoàn tiền trong vòng 3–5 ngày làm việc. Hoàn tiền được thực hiện theo đúng phương thức thanh toán ban đầu của đơn hàng (chuyển khoản, ví điện tử) hoặc bằng tiền mặt/chuyển khoản đối với đơn thanh toán COD.',
      },
    ],
  },
  {
    id: '8',
    title: '8. Liên hệ',
    content: [
      {
        body: 'Mọi thắc mắc về đổi trả, bảo hành, vui lòng liên hệ:',
      },
    ],
    contact: true,
  },
];

export default function ReturnPolicyContent() {
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
            Chính sách bảo hành đổi trả
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
            {STORE.name} mong muốn bạn hoàn toàn hài lòng với sản phẩm. Trang này giải thích chi tiết
            điều kiện, quy trình đổi trả và chính sách bảo hành cho các sản phẩm đèn in 3D handcraft.
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
          <Link href="/shipping-policy" style={{ color: 'inherit' }}>
            <Typography variant="body2" color="primary" sx={{ fontWeight: 600 }}>
              Chính sách vận chuyển →
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

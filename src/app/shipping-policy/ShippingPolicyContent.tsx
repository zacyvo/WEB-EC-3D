'use client';

import Link from 'next/link';
import { Box, Container, Typography, Stack, Divider, alpha } from '@mui/material';
import { STORE } from '@/lib/store-config';
import { formatCurrency } from '@/lib/utils';
import { SHIPPING_FEE_HCM, SHIPPING_FEE_OTHER } from '@/lib/shipping-fee';

const LAST_UPDATED = '02/11/2026';

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
        body: `${STORE.name} giao hàng trên toàn lãnh thổ Việt Nam, bao gồm nội thành, ngoại thành TP. Hồ Chí Minh, các tỉnh, thành khác và khu vực vùng sâu, vùng xa mà đơn vị vận chuyển có hỗ trợ. Hiện chúng tôi chưa giao hàng ra nước ngoài.`,
      },
    ],
  },
  {
    id: '2',
    title: '2. Đơn vị vận chuyển',
    content: [
      {
        body: 'Đơn hàng được giao qua đơn vị vận chuyển chuyên nghiệp — hiện chủ yếu là SPX Express. Tùy khu vực và kích thước kiện hàng, chúng tôi có thể sử dụng đơn vị vận chuyển khác.',
      },
      {
        body: 'Khi đơn hàng được bàn giao cho đơn vị vận chuyển, tên đơn vị vận chuyển, mã vận đơn, đường dẫn tra cứu và ngày giao dự kiến (nếu có) được cập nhật tại trang chi tiết đơn hàng trong mục "Đơn hàng của tôi".',
      },
    ],
  },
  {
    id: '3',
    title: '3. Thời gian xử lý và giao hàng',
    content: [
      {
        subtitle: 'Thời điểm bắt đầu xử lý',
        body: 'Đơn thanh toán khi nhận hàng (COD) được chuẩn bị sau khi chúng tôi xác nhận đơn. Đơn chuyển khoản ngân hàng được chuẩn bị sau khi chúng tôi xác nhận đã nhận đủ tiền — lúc đó đơn tự chuyển sang trạng thái "Đang chuẩn bị hàng".',
      },
      {
        subtitle: 'Thời gian giao hàng dự kiến',
        body: 'Tính từ khi đơn hàng được xác nhận và đóng gói:',
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
        body: 'Sản phẩm thiết kế theo yêu cầu (custom order) cần thêm thời gian sản xuất theo tiến độ đã thống nhất với bạn trước khi bàn giao vận chuyển. Thời gian giao có thể kéo dài trong dịp lễ, Tết, khi thời tiết xấu hoặc do sự kiện bất khả kháng.',
      },
    ],
  },
  {
    id: '4',
    title: '4. Phí vận chuyển',
    content: [
      {
        body: `Phí vận chuyển đồng giá theo địa chỉ nhận hàng: ${formatCurrency(SHIPPING_FEE_HCM)}/đơn trong TP. Hồ Chí Minh và ${formatCurrency(SHIPPING_FEE_OTHER)}/đơn cho các tỉnh, thành phố khác. Phí vận chuyển luôn được hiển thị tại trang Thanh toán và trong tổng tiền trước khi bạn bấm "Đặt hàng"; nếu chính sách phí thay đổi, mức phí mới cũng được hiển thị tại bước này — không phát sinh khoản thu nào khác khi giao hàng.`,
      },
      {
        body: 'Chi phí gửi trả hàng (nếu có) được áp dụng theo Chính sách bảo hành đổi trả.',
      },
    ],
  },
  {
    id: '5',
    title: '5. Thanh toán khi giao hàng',
    content: [
      {
        body: 'Với đơn thanh toán khi nhận hàng (COD), bạn thanh toán cho nhân viên giao hàng đúng số tiền "Cần thanh toán" hiển thị trong đơn hàng. Với đơn đã chuyển khoản và được xác nhận thanh toán đủ, nhân viên giao hàng không thu thêm tiền. Vui lòng không thanh toán thêm bất kỳ khoản nào ngoài số tiền trên và liên hệ chúng tôi nếu được yêu cầu thu thêm.',
      },
    ],
  },
  {
    id: '6',
    title: '6. Đóng gói sản phẩm',
    content: [
      {
        body: 'Đèn và sản phẩm in 3D dễ va đập, vì vậy mỗi sản phẩm được kiểm tra trước khi gửi và đóng gói bằng vật liệu chống sốc (mút xốp, giấy chèn) trong thùng carton chắc chắn.',
      },
    ],
  },
  {
    id: '7',
    title: '7. Kiểm tra hàng khi nhận',
    content: [
      {
        body: 'Vui lòng kiểm tra tình trạng bên ngoài kiện hàng trước khi nhận. Nếu kiện hàng móp méo, ướt hoặc có dấu hiệu đã bị mở, bạn nên chụp ảnh/quay video và có quyền từ chối nhận hàng.',
      },
      {
        body: 'Khi mở hộp, bạn nên quay video quá trình mở. Nếu sản phẩm bị hư hỏng, thiếu hoặc sai so với đơn hàng, hãy gửi yêu cầu "Trả hàng/Hoàn tiền" tại trang chi tiết đơn hàng trong vòng 7 ngày kể từ khi đơn ở trạng thái "Đã giao", kèm hình ảnh — chúng tôi khuyến khích báo ngay trong 24 giờ đầu để được xử lý nhanh nhất. Chi tiết tại Chính sách bảo hành đổi trả.',
      },
    ],
  },
  {
    id: '8',
    title: '8. Giao hàng không thành công',
    content: [
      {
        body: 'Nếu đơn vị vận chuyển không liên lạc được với người nhận, địa chỉ không chính xác hoặc người nhận từ chối nhận hàng, kiện hàng sẽ được hoàn về cho chúng tôi. Chúng tôi sẽ liên hệ với bạn để thống nhất giao lại hoặc hủy đơn. Đơn đã thanh toán bị hủy được hoàn tiền theo Điều khoản dịch vụ.',
      },
    ],
  },
  {
    id: '9',
    title: '9. Trách nhiệm đối với hàng hóa trong quá trình vận chuyển',
    content: [
      {
        body: `${STORE.name} chịu trách nhiệm đối với hàng hóa cho đến khi giao thành công cho người nhận. Trường hợp hàng bị thất lạc hoặc hư hỏng trong quá trình vận chuyển, chúng tôi sẽ gửi lại sản phẩm mới hoặc hoàn tiền cho bạn và tự làm việc với đơn vị vận chuyển, bạn không phải chịu thêm chi phí.`,
      },
    ],
  },
  {
    id: '10',
    title: '10. Theo dõi đơn hàng',
    content: [
      {
        body: 'Đăng nhập và vào mục "Đơn hàng của tôi" để xem trạng thái đơn hàng: Chờ xác nhận → Đã xác nhận → Đang chuẩn bị hàng → Đang giao → Đã giao (hoặc Đã hủy), cùng thông tin vận chuyển và tình trạng thanh toán. Bạn cũng có thể liên hệ chúng tôi qua điện thoại, Zalo hoặc email để được hỗ trợ.',
      },
    ],
  },
  {
    id: '11',
    title: '11. Liên hệ',
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
            {STORE.name} giao hàng trên toàn quốc. Trang này quy định phạm vi, đơn vị vận chuyển, thời gian,
            phí vận chuyển, cách kiểm tra hàng và trách nhiệm của chúng tôi khi hàng hư hỏng, thất lạc.
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

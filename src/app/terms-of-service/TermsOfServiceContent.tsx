'use client';

import Link from 'next/link';
import { Box, Container, Typography, Stack, Divider, alpha } from '@mui/material';
import { STORE } from '@/lib/store-config';

const LAST_UPDATED = '06/05/2025';

const SECTIONS = [
  {
    id: '1',
    title: '1. Chấp nhận điều khoản',
    content: [
      {
        body: `Khi truy cập, đăng ký tài khoản hoặc thực hiện giao dịch trên website ${STORE.name} (luxeglow.vn), bạn đồng ý bị ràng buộc bởi các điều khoản dịch vụ này. Nếu bạn không đồng ý với bất kỳ điều khoản nào, vui lòng không sử dụng dịch vụ.`,
      },
    ],
  },
  {
    id: '2',
    title: '2. Tài khoản người dùng',
    content: [
      {
        body: 'Bạn có trách nhiệm duy trì bảo mật tài khoản và mật khẩu. Mọi hoạt động xảy ra dưới tài khoản của bạn đều là trách nhiệm của bạn.',
      },
    ],
    list: [
      'Phải từ 18 tuổi trở lên hoặc được sự đồng ý của phụ huynh/người giám hộ',
      'Cung cấp thông tin chính xác, đầy đủ khi đăng ký',
      'Không sử dụng tài khoản người khác hoặc tạo nhiều tài khoản gian lận',
      'Thông báo ngay cho chúng tôi nếu phát hiện truy cập trái phép',
      `${STORE.name} có quyền đình chỉ hoặc xóa tài khoản vi phạm điều khoản`,
    ],
  },
  {
    id: '3',
    title: '3. Sản phẩm và đặt hàng',
    content: [
      {
        subtitle: 'Thông tin sản phẩm',
        body: 'Chúng tôi cố gắng hiển thị chính xác màu sắc, kích thước và mô tả sản phẩm. Tuy nhiên, màu sắc thực tế có thể khác nhau tùy thuộc vào màn hình thiết bị. Đèn in 3D là sản phẩm handcraft nên có thể có sự khác biệt nhỏ giữa các lô sản xuất — điều này là đặc trưng của sản phẩm thủ công, không phải lỗi.',
      },
      {
        subtitle: 'Xác nhận đơn hàng',
        body: 'Đơn hàng chỉ được xác nhận sau khi chúng tôi gửi email xác nhận. Chúng tôi có quyền từ chối hoặc hủy đơn hàng trong trường hợp sản phẩm hết hàng, thông tin thanh toán không hợp lệ hoặc phát hiện gian lận.',
      },
      {
        subtitle: 'Giá cả',
        body: 'Giá sản phẩm được niêm yết bằng VNĐ và đã bao gồm VAT (nếu áp dụng). Chúng tôi bảo lưu quyền thay đổi giá mà không cần báo trước, nhưng giá tại thời điểm đặt hàng sẽ được giữ nguyên cho đơn hàng đó.',
      },
    ],
  },
  {
    id: '4',
    title: '4. Thanh toán',
    content: [
      {
        body: 'Chúng tôi chấp nhận các hình thức thanh toán sau:',
      },
    ],
    list: [
      'Thanh toán khi nhận hàng (COD) — áp dụng toàn quốc',
      'Chuyển khoản ngân hàng — thông tin tài khoản trong email xác nhận đơn',
      'Ví điện tử (MoMo, ZaloPay,...) — theo hướng dẫn tại trang thanh toán',
    ],
    afterList: [
      {
        body: 'Đối với đơn thiết kế theo yêu cầu (custom order), chúng tôi yêu cầu đặt cọc 50% trước khi bắt đầu sản xuất. Số còn lại thanh toán khi nhận hàng hoặc trước khi giao.',
      },
    ],
  },
  {
    id: '5',
    title: '5. Vận chuyển và giao hàng',
    content: [
      {
        body: 'Chúng tôi giao hàng toàn quốc thông qua các đối tác vận chuyển uy tín (GHN, GHTK,...). Thời gian giao hàng dự kiến:',
      },
    ],
    list: [
      'TP. Hồ Chí Minh: 1–2 ngày làm việc',
      'Các tỉnh thành khác: 3–7 ngày làm việc',
      'Vùng sâu, vùng xa: có thể lâu hơn tùy khu vực',
    ],
    afterList: [
      {
        body: 'Thời gian giao hàng có thể thay đổi trong các dịp lễ Tết hoặc do điều kiện thời tiết. Chúng tôi không chịu trách nhiệm cho các chậm trễ ngoài tầm kiểm soát của đơn vị vận chuyển.',
      },
    ],
  },
  {
    id: '6',
    title: '6. Đổi trả và hoàn tiền',
    content: [
      {
        subtitle: 'Điều kiện đổi trả',
        body: 'Chúng tôi chấp nhận đổi/trả trong vòng 7 ngày kể từ ngày nhận hàng trong các trường hợp:',
      },
    ],
    list: [
      'Sản phẩm bị lỗi sản xuất, hỏng hóc do vận chuyển',
      'Sản phẩm không đúng với mô tả hoặc đơn hàng đã đặt',
      'Sản phẩm còn nguyên vẹn, chưa qua sử dụng (trường hợp đổi ý)',
    ],
    afterList: [
      {
        subtitle: 'Không áp dụng đổi trả',
        body: 'Sản phẩm đặt thiết kế riêng theo yêu cầu (custom order) không được đổi trả trừ khi có lỗi sản xuất. Sản phẩm đã qua sử dụng hoặc bị tác động vật lý từ phía khách hàng không được chấp nhận.',
      },
      {
        subtitle: 'Hoàn tiền',
        body: 'Hoàn tiền sẽ được xử lý trong vòng 3–5 ngày làm việc sau khi chúng tôi nhận và kiểm tra sản phẩm trả về. Phương thức hoàn tiền theo hình thức thanh toán ban đầu.',
      },
    ],
  },
  {
    id: '7',
    title: '7. Sở hữu trí tuệ',
    content: [
      {
        body: `Toàn bộ nội dung trên website bao gồm hình ảnh, mô tả sản phẩm, thiết kế, logo và bộ nhận diện thương hiệu ${STORE.name} đều thuộc quyền sở hữu của chúng tôi và được bảo vệ bởi luật sở hữu trí tuệ Việt Nam.`,
      },
      {
        body: 'Bạn không được sao chép, tái sản xuất, phân phối hoặc sử dụng bất kỳ nội dung nào vì mục đích thương mại mà không có sự cho phép bằng văn bản của chúng tôi.',
      },
    ],
  },
  {
    id: '8',
    title: '8. Hành vi bị cấm',
    content: [
      {
        body: 'Khi sử dụng website, bạn cam kết không thực hiện các hành vi sau:',
      },
    ],
    list: [
      'Đặt hàng giả mạo, gian lận hoặc với thông tin sai lệch',
      'Tấn công, làm gián đoạn hoặc gây hại cho hạ tầng kỹ thuật website',
      'Scraping, thu thập dữ liệu tự động mà không được phép',
      'Đăng nội dung phỉ báng, thù hận hoặc vi phạm pháp luật',
      'Sử dụng dịch vụ cho các mục đích bất hợp pháp',
    ],
  },
  {
    id: '9',
    title: '9. Giới hạn trách nhiệm',
    content: [
      {
        body: `${STORE.name} không chịu trách nhiệm cho các thiệt hại gián tiếp, ngẫu nhiên hoặc hậu quả phát sinh từ việc sử dụng hoặc không thể sử dụng dịch vụ của chúng tôi. Trách nhiệm tối đa của chúng tôi không vượt quá giá trị đơn hàng liên quan.`,
      },
    ],
  },
  {
    id: '10',
    title: '10. Luật áp dụng',
    content: [
      {
        body: 'Các điều khoản này được điều chỉnh và giải thích theo pháp luật Việt Nam. Mọi tranh chấp phát sinh sẽ được giải quyết tại Tòa án nhân dân có thẩm quyền tại TP. Hồ Chí Minh.',
      },
    ],
  },
  {
    id: '11',
    title: '11. Thay đổi điều khoản',
    content: [
      {
        body: `${STORE.name} có quyền sửa đổi các điều khoản này bất cứ lúc nào. Thay đổi có hiệu lực ngay khi được đăng tải trên website. Việc tiếp tục sử dụng dịch vụ sau khi thay đổi được coi là bạn đã chấp nhận điều khoản mới.`,
      },
    ],
  },
  {
    id: '12',
    title: '12. Liên hệ',
    content: [
      {
        body: 'Mọi thắc mắc về điều khoản dịch vụ, vui lòng liên hệ:',
      },
    ],
    contact: true,
  },
];

export default function TermsOfServiceContent() {
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
            Điều khoản dịch vụ
          </Typography>
          <Typography variant="body2" color="text.secondary">
            Cập nhật lần cuối: {LAST_UPDATED}
          </Typography>
          <Divider sx={{ mt: 3 }} />
        </Box>

        {/* Intro */}
        <Box
          sx={{
            bgcolor: (t) => alpha(t.palette.warning.main, 0.06),
            border: '1px solid',
            borderColor: (t) => alpha(t.palette.warning.main, 0.2),
            borderRadius: 3,
            p: 3,
            mb: 5,
          }}
        >
          <Typography variant="body1" sx={{ lineHeight: 1.8, color: 'text.secondary' }}>
            Vui lòng đọc kỹ các điều khoản dưới đây trước khi sử dụng dịch vụ của{' '}
            <strong>{STORE.name}</strong>. Các điều khoản này tạo thành thỏa thuận pháp lý giữa bạn
            và chúng tôi về việc sử dụng website <strong>luxeglow.vn</strong>.
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
          <Link href="/privacy-policy" style={{ color: 'inherit' }}>
            <Typography variant="body2" color="primary" sx={{ fontWeight: 600 }}>
              Chính sách bảo mật →
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

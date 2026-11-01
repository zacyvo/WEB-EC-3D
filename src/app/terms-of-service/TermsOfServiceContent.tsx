'use client';

import Link from 'next/link';
import { Box, Container, Typography, Stack, Divider, alpha } from '@mui/material';
import { STORE, STORE_OWNER_LINES } from '@/lib/store-config';

const LAST_UPDATED = '02/11/2026';
const SITE = STORE.website.replace(/^https?:\/\//, '').replace(/\/+$/, '');

type ContentItem = { subtitle?: string; body: string };
type Section = {
  id: string;
  title: string;
  content: ContentItem[];
  list?: string[];
  afterList?: ContentItem[];
  /** Renders the website owner's identification block. */
  owner?: boolean;
  contact?: boolean;
};

const SECTIONS: Section[] = [
  {
    id: '1',
    title: '1. Thông tin chủ sở hữu website',
    content: [
      {
        body: `Website ${SITE} (sau đây gọi là "Website") do ${STORE.legalName || STORE.name} (sau đây gọi là "${STORE.name}" hoặc "chúng tôi") sở hữu và trực tiếp bán hàng. Thông tin định danh:`,
      },
    ],
    owner: true,
  },
  {
    id: '2',
    title: '2. Phạm vi áp dụng và chấp nhận điều khoản',
    content: [
      {
        body: `Điều khoản này áp dụng cho việc truy cập Website, đăng ký tài khoản và mua hàng trực tiếp trên Website. Khi đăng ký tài khoản và khi đặt hàng, bạn đánh dấu ô đồng ý để xác nhận đã đọc, hiểu và đồng ý với Điều khoản dịch vụ, Chính sách bảo mật, cùng Chính sách vận chuyển, Hình thức thanh toán và Chính sách bảo hành đổi trả được công bố trên Website tại thời điểm đó.`,
      },
      {
        body: `Đơn hàng mua qua sàn thương mại điện tử (như Shopee) được điều chỉnh bởi chính sách của sàn đó; ${STORE.name} chỉ đồng bộ đơn về hệ thống để chuẩn bị và giao hàng.`,
      },
    ],
  },
  {
    id: '3',
    title: '3. Tài khoản người dùng',
    content: [
      {
        body: 'Bạn cần đăng nhập để đặt hàng. Bạn có thể đăng ký bằng email và mật khẩu (kèm số điện thoại nếu muốn), hoặc đăng nhập bằng tài khoản Google/Facebook. Khi sử dụng tài khoản, bạn cam kết:',
      },
    ],
    list: [
      'Từ đủ 18 tuổi; người chưa thành niên chỉ sử dụng khi có sự đồng ý và giám sát của cha, mẹ hoặc người giám hộ',
      'Cung cấp thông tin chính xác, đầy đủ và cập nhật khi thay đổi',
      'Tự bảo mật mật khẩu; chịu trách nhiệm về các giao dịch thực hiện bằng tài khoản của mình',
      'Không sử dụng tài khoản của người khác, không tạo nhiều tài khoản nhằm gian lận khuyến mãi',
      'Thông báo ngay cho chúng tôi khi phát hiện tài khoản bị truy cập trái phép',
    ],
    afterList: [
      {
        body: `Bạn có thể tự xóa tài khoản tại trang Hồ sơ (xác nhận bằng mã gửi qua email). ${STORE.name} có quyền tạm khóa tài khoản có dấu hiệu gian lận hoặc vi phạm Điều khoản này và sẽ thông báo lý do cho bạn.`,
      },
    ],
  },
  {
    id: '4',
    title: '4. Thông tin sản phẩm, giá và khuyến mãi',
    content: [
      {
        subtitle: 'Thông tin sản phẩm',
        body: 'Chúng tôi cố gắng mô tả chính xác chất liệu, kích thước, màu sắc của sản phẩm. Sản phẩm in 3D được hoàn thiện thủ công nên có thể có khác biệt nhỏ giữa các lần sản xuất; màu hiển thị cũng phụ thuộc màn hình thiết bị. Các khác biệt này không được xem là lỗi sản phẩm.',
      },
      {
        subtitle: 'Giá bán',
        body: 'Giá được niêm yết bằng Việt Nam đồng (VNĐ). Tổng số tiền phải thanh toán (gồm giảm giá, phí vận chuyển và thuế GTGT nếu có) được hiển thị đầy đủ ở bước thanh toán trước khi bạn bấm "Đặt hàng" và được giữ nguyên cho đơn hàng đó, kể cả khi giá niêm yết thay đổi sau đó.',
      },
      {
        subtitle: 'Thuế GTGT khi yêu cầu hóa đơn',
        body: 'Giá niêm yết là giá thanh toán khi không yêu cầu hóa đơn giá trị gia tăng. Nếu bạn yêu cầu xuất hóa đơn điện tử, thuế GTGT 10% được cộng vào tổng thanh toán và hiển thị trước khi đặt hàng (xem Mục 7).',
      },
      {
        subtitle: 'Mã giảm giá',
        body: 'Mã giảm giá áp dụng theo điều kiện ghi trên từng mã (giá trị đơn tối thiểu, mức giảm tối đa, thời hạn, số lần sử dụng). Hệ thống kiểm tra lại điều kiện khi đặt hàng; mã đã dùng cho một đơn hàng không được khôi phục khi đơn đó bị hủy.',
      },
    ],
  },
  {
    id: '5',
    title: '5. Quy trình đặt hàng và giao kết hợp đồng',
    content: [
      {
        body: 'Quy trình đặt hàng trên Website gồm các bước:',
      },
    ],
    list: [
      'Chọn sản phẩm (màu, kích thước nếu có) và thêm vào giỏ hàng',
      'Tại trang Thanh toán: nhập thông tin người nhận, địa chỉ giao hàng, chọn mã giảm giá, yêu cầu hóa đơn điện tử (nếu cần) và phương thức thanh toán',
      'Kiểm tra lại sản phẩm, số lượng và tổng tiền, sau đó bấm "Đặt hàng" — đơn hàng được tạo với trạng thái "Chờ xác nhận"',
      `${STORE.name} kiểm tra và xác nhận đơn hàng ("Đã xác nhận"); với đơn chuyển khoản, đơn chuyển sang "Đang chuẩn bị hàng" sau khi chúng tôi xác nhận đã nhận đủ tiền`,
      'Đơn hàng được đóng gói ("Đang chuẩn bị hàng"), bàn giao cho đơn vị vận chuyển ("Đang giao") và hoàn tất khi bạn nhận hàng ("Đã giao")',
    ],
    afterList: [
      {
        subtitle: 'Thời điểm giao kết hợp đồng',
        body: 'Việc bấm "Đặt hàng" là đề nghị mua hàng của bạn. Hợp đồng mua bán được giao kết khi đơn hàng chuyển sang trạng thái "Đã xác nhận" hoặc "Đang chuẩn bị hàng". Bạn theo dõi trạng thái đơn bất cứ lúc nào tại mục "Đơn hàng của tôi".',
      },
      {
        subtitle: 'Từ chối đơn hàng',
        body: `${STORE.name} có thể từ chối hoặc hủy đơn hàng khi sản phẩm hết hàng, thông tin người nhận không chính xác/không liên lạc được, hoặc có dấu hiệu gian lận. Khi đó chúng tôi sẽ thông báo cho bạn và hoàn lại toàn bộ số tiền đã thanh toán (nếu có).`,
      },
    ],
  },
  {
    id: '6',
    title: '6. Thanh toán',
    content: [
      {
        body: 'Website hiện hỗ trợ các phương thức thanh toán sau:',
      },
    ],
    list: [
      'Thanh toán khi nhận hàng (COD): bạn thanh toán cho nhân viên giao hàng số tiền "Cần thanh toán" của đơn hàng',
      'Chuyển khoản ngân hàng (VietQR): sau khi đặt hàng, Website hiển thị mã VietQR cùng số tài khoản, số tiền và nội dung chuyển khoản riêng của đơn; bạn quét mã bằng ứng dụng ngân hàng để chuyển trực tiếp vào tài khoản của chúng tôi',
    ],
    afterList: [
      {
        subtitle: 'Xác nhận chuyển khoản',
        body: `Đơn chuyển khoản được ghi nhận "Đã thanh toán" sau khi nhân viên của ${STORE.name} kiểm tra và xác nhận đã nhận đủ tiền trong tài khoản ngân hàng. Nút "Tôi đã chuyển khoản" chỉ để báo cho chúng tôi kiểm tra, không tự động xác nhận thanh toán. Vui lòng chuyển đúng số tiền và nội dung chuyển khoản hiển thị để đơn được đối soát nhanh.`,
      },
      {
        subtitle: 'An toàn thanh toán',
        body: `${STORE.name} không thu thập số thẻ, mật khẩu hay mã OTP ngân hàng của bạn và không bao giờ yêu cầu chuyển tiền vào tài khoản khác với tài khoản hiển thị trên Website. Website hiện không kết nối với cổng thanh toán hoặc ví điện tử.`,
      },
      {
        subtitle: 'Đơn thiết kế theo yêu cầu',
        body: 'Với sản phẩm thiết kế riêng (custom order), giá, tiến độ và điều kiện thanh toán (bao gồm đặt cọc, nếu có) được báo giá và thống nhất với bạn trước khi bắt đầu sản xuất.',
      },
    ],
  },
  {
    id: '7',
    title: '7. Hóa đơn điện tử',
    content: [
      {
        body: 'Bạn có thể yêu cầu xuất hóa đơn điện tử (cá nhân hoặc doanh nghiệp) ngay khi đặt hàng hoặc tại trang chi tiết đơn hàng, trước khi đơn được giao cho đơn vị vận chuyển. Mỗi đơn hàng được gửi một yêu cầu.',
      },
    ],
    list: [
      'Thuế GTGT 10% được cộng vào tổng thanh toán ngay khi gửi yêu cầu',
      `${STORE.name} xem xét và chấp nhận hoặc từ chối yêu cầu trước khi giao hàng; nếu từ chối, khoản thuế GTGT được trừ lại khỏi đơn và lý do được hiển thị cho bạn`,
      'Hóa đơn được phát hành sau khi đơn hàng được thanh toán và gửi tới email bạn đã cung cấp',
      'Đơn mua qua sàn thương mại điện tử vui lòng yêu cầu hóa đơn trên sàn',
    ],
  },
  {
    id: '8',
    title: '8. Hủy đơn hàng',
    content: [
      {
        body: 'Quyền hủy đơn của khách hàng phụ thuộc trạng thái đơn hàng:',
      },
    ],
    list: [
      '"Chờ xác nhận": bạn có thể tự hủy ngay trong mục "Đơn hàng của tôi"',
      `"Đang chuẩn bị hàng": bạn có thể gửi yêu cầu hủy kèm lý do; ${STORE.name} xem xét và liên hệ lại với bạn`,
      '"Đã xác nhận", "Đang giao", "Đã giao": không thể hủy trên Website — vui lòng liên hệ chúng tôi để được hỗ trợ; sau khi nhận hàng, áp dụng Chính sách bảo hành đổi trả',
    ],
    afterList: [
      {
        subtitle: 'Hoàn tiền khi hủy đơn đã thanh toán',
        body: `Nếu đơn hàng đã chuyển khoản bị hủy (bởi bạn hoặc bởi ${STORE.name}), chúng tôi hoàn lại số tiền đã nhận bằng chuyển khoản ngân hàng vào tài khoản bạn cung cấp, trong vòng 3–5 ngày làm việc kể từ khi đơn bị hủy và có đủ thông tin tài khoản nhận. Trạng thái hoàn tiền được cập nhật tại trang chi tiết đơn hàng.`,
      },
    ],
  },
  {
    id: '9',
    title: '9. Vận chuyển và giao nhận',
    content: [
      {
        body: `${STORE.name} giao hàng toàn quốc qua đơn vị vận chuyển. Phạm vi, thời gian, phí vận chuyển, cách kiểm tra hàng và trách nhiệm khi hàng hư hỏng, thất lạc được quy định tại Chính sách vận chuyển.`,
      },
    ],
  },
  {
    id: '10',
    title: '10. Đổi trả, bảo hành và hoàn tiền',
    content: [
      {
        body: 'Bạn có thể gửi yêu cầu trả hàng/hoàn tiền trực tuyến trong vòng 7 ngày kể từ khi đơn hàng ở trạng thái "Đã giao", kèm lý do và hình ảnh. Tiền hoàn được chuyển khoản trong vòng 3–5 ngày làm việc sau khi chúng tôi nhận và kiểm tra hàng trả về. Điều kiện chi tiết, các trường hợp không áp dụng và chế độ bảo hành được quy định tại Chính sách bảo hành đổi trả.',
      },
    ],
  },
  {
    id: '11',
    title: '11. Sở hữu trí tuệ',
    content: [
      {
        body: `Hình ảnh, mô tả sản phẩm, thiết kế, logo và nhận diện thương hiệu ${STORE.name} trên Website thuộc quyền sở hữu của chúng tôi hoặc được sử dụng hợp pháp. Bạn không được sao chép, phân phối hoặc sử dụng cho mục đích thương mại khi chưa có sự đồng ý bằng văn bản của chúng tôi.`,
      },
      {
        body: 'Với đơn thiết kế theo yêu cầu, bạn cam kết có quyền sử dụng hợp pháp đối với hình ảnh, logo, nội dung gửi cho chúng tôi và chịu trách nhiệm nếu nội dung đó xâm phạm quyền của bên thứ ba. Chúng tôi có quyền từ chối sản xuất nội dung vi phạm pháp luật hoặc thuần phong mỹ tục.',
      },
    ],
  },
  {
    id: '12',
    title: '12. Hành vi bị cấm',
    content: [
      {
        body: 'Khi sử dụng Website, bạn không được:',
      },
    ],
    list: [
      'Đặt hàng giả mạo, dùng thông tin của người khác hoặc thông tin sai lệch',
      'Lạm dụng mã giảm giá, chương trình khuyến mãi bằng nhiều tài khoản hoặc thủ đoạn gian lận',
      'Tấn công, dò quét, làm gián đoạn hoặc gây hại cho hệ thống của Website',
      'Thu thập dữ liệu tự động (scraping) khi chưa được phép',
      'Đăng tải nội dung vi phạm pháp luật, xúc phạm danh dự, nhân phẩm người khác',
    ],
  },
  {
    id: '13',
    title: '13. Giới hạn trách nhiệm',
    content: [
      {
        body: `${STORE.name} không chịu trách nhiệm đối với thiệt hại phát sinh do lỗi của khách hàng (cung cấp sai thông tin, để lộ mật khẩu, chuyển khoản sai tài khoản/nội dung không theo hướng dẫn) hoặc do sự kiện bất khả kháng. Điều khoản này không loại trừ hay hạn chế các quyền của người tiêu dùng theo Luật Bảo vệ quyền lợi người tiêu dùng và các quy định pháp luật có liên quan.`,
      },
    ],
  },
  {
    id: '14',
    title: '14. Tiếp nhận và giải quyết khiếu nại',
    content: [
      {
        body: 'Bạn có thể gửi phản ánh, khiếu nại qua email, điện thoại hoặc Zalo ghi tại Mục 17, kèm mã đơn hàng và hình ảnh (nếu có). Quy trình xử lý:',
      },
    ],
    list: [
      'Tiếp nhận và phản hồi xác nhận đã nhận khiếu nại trong vòng 24 giờ làm việc',
      'Kiểm tra thông tin, đề xuất phương án giải quyết trong vòng 3 ngày làm việc kể từ khi nhận đủ thông tin',
      'Trường hợp hai bên không thống nhất được, tranh chấp được giải quyết bằng thương lượng, hòa giải, hoặc yêu cầu cơ quan nhà nước có thẩm quyền, Tòa án giải quyết theo quy định của pháp luật',
    ],
  },
  {
    id: '15',
    title: '15. Luật áp dụng',
    content: [
      {
        body: 'Điều khoản này được điều chỉnh bởi pháp luật Việt Nam, bao gồm Luật Thương mại điện tử, Luật Bảo vệ quyền lợi người tiêu dùng, Luật Bảo vệ dữ liệu cá nhân và các văn bản hướng dẫn thi hành.',
      },
    ],
  },
  {
    id: '16',
    title: '16. Thay đổi điều khoản',
    content: [
      {
        body: `${STORE.name} có thể cập nhật Điều khoản này; ngày cập nhật được ghi ở đầu trang. Đơn hàng đã đặt trước thời điểm cập nhật tiếp tục áp dụng điều khoản tại thời điểm đặt hàng.`,
      },
    ],
  },
  {
    id: '17',
    title: '17. Liên hệ',
    content: [
      {
        body: 'Mọi thắc mắc về Điều khoản dịch vụ, vui lòng liên hệ:',
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
            Vui lòng đọc kỹ các điều khoản dưới đây trước khi mua hàng tại{' '}
            <strong>{STORE.name}</strong>. Các điều khoản này là điều kiện giao dịch chung giữa bạn
            và chúng tôi khi sử dụng website <strong>{SITE}</strong>.
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
                {section.owner && (
                  <Box sx={{ bgcolor: 'grey.50', border: '1px solid', borderColor: 'divider', borderRadius: 2, p: 2.5 }}>
                    <Stack spacing={0.75}>
                      {STORE_OWNER_LINES.map((line) => (
                        <Typography key={line.label} variant="body2" color="text.secondary">
                          {line.label}: <strong>{line.value}</strong>
                        </Typography>
                      ))}
                    </Stack>
                  </Box>
                )}
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
                        📞 Điện thoại / Zalo:{' '}
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
          <Link href="/shipping-policy" style={{ color: 'inherit' }}>
            <Typography variant="body2" color="text.secondary">
              Chính sách vận chuyển
            </Typography>
          </Link>
          <Link href="/payment-methods" style={{ color: 'inherit' }}>
            <Typography variant="body2" color="text.secondary">
              Hình thức thanh toán
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

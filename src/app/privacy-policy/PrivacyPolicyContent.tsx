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
    title: '1. Đơn vị xử lý dữ liệu và phạm vi áp dụng',
    content: [
      {
        body: `Chính sách này là thông báo về việc xử lý dữ liệu cá nhân của ${STORE.legalName || STORE.name} — bên kiểm soát và xử lý dữ liệu cá nhân của khách hàng, người dùng website ${SITE}, theo Luật Bảo vệ dữ liệu cá nhân và các văn bản hướng dẫn thi hành. Thông tin đơn vị:`,
      },
    ],
    owner: true,
    afterList: [
      {
        body: 'Chính sách áp dụng cho dữ liệu thu thập qua website, tài khoản khách hàng, đơn hàng (kể cả đơn mua qua sàn thương mại điện tử được đồng bộ về hệ thống của chúng tôi để giao hàng) và các kênh liên hệ chính thức của chúng tôi.',
      },
    ],
  },
  {
    id: '2',
    title: '2. Dữ liệu cá nhân chúng tôi thu thập',
    content: [
      {
        subtitle: 'Tài khoản',
        body: 'Họ tên, email, số điện thoại (nếu cung cấp), mật khẩu (chỉ lưu dạng mã hóa một chiều), ảnh đại diện, các địa chỉ giao hàng đã lưu. Nếu đăng nhập bằng Google hoặc Facebook: tên, email, ảnh đại diện và mã định danh tài khoản mà nền tảng đó chia sẻ — chúng tôi không nhận mật khẩu của các tài khoản này.',
      },
      {
        subtitle: 'Đặt hàng và giao hàng',
        body: 'Họ tên, số điện thoại và địa chỉ người nhận, sản phẩm, số lượng, giá trị đơn hàng, mã giảm giá đã dùng, ghi chú, lịch sử trạng thái đơn hàng, yêu cầu hủy đơn và lý do.',
      },
      {
        subtitle: 'Thanh toán',
        body: 'Phương thức thanh toán, số tiền, nội dung chuyển khoản, thời điểm bạn báo đã chuyển khoản và thời điểm chúng tôi xác nhận. Khi bạn chuyển khoản, sao kê ngân hàng của chúng tôi hiển thị tên và số tài khoản người chuyển. Chúng tôi không thu thập số thẻ, mật khẩu, mã OTP hay thông tin đăng nhập ngân hàng của bạn.',
      },
      {
        subtitle: 'Hóa đơn điện tử',
        body: 'Khi bạn yêu cầu hóa đơn: họ tên người mua, tên đơn vị, mã số thuế hoặc số định danh cá nhân (nếu cung cấp), địa chỉ, email và số điện thoại nhận hóa đơn.',
      },
      {
        subtitle: 'Trả hàng, hoàn tiền',
        body: 'Lý do, mô tả, hình ảnh sản phẩm bạn gửi, thông tin gửi trả hàng và tài khoản ngân hàng nhận hoàn tiền (tên ngân hàng, số tài khoản, chủ tài khoản). Thông tin tài khoản ngân hàng chỉ được dùng để hoàn tiền cho bạn.',
      },
      {
        subtitle: 'Thiết kế theo yêu cầu, hợp tác sản xuất',
        body: 'Nội dung, hình ảnh, logo bạn gửi để thiết kế sản phẩm. Với đối tác ký hợp đồng trực tuyến: tên tổ chức/cá nhân, mã số thuế hoặc số định danh, địa chỉ, người đại diện, số điện thoại, thời điểm và địa chỉ IP khi ký hợp đồng.',
      },
      {
        subtitle: 'Zalo',
        body: 'Số điện thoại trên đơn hàng (dùng để gửi tin nhắn xác nhận đơn qua Zalo, khi tính năng này được bật) và mã định danh Zalo nếu bạn liên kết tài khoản để nhận ưu đãi khi quan tâm Zalo Official Account của chúng tôi.',
      },
      {
        subtitle: 'Hồ sơ NFC',
        body: 'Nếu bạn kích hoạt sản phẩm có thẻ NFC, các thông tin và liên kết mạng xã hội bạn tự nhập vào hồ sơ sẽ được hiển thị công khai cho người quét thẻ. Bạn có thể sửa hoặc gỡ các thông tin này bất cứ lúc nào.',
      },
      {
        subtitle: 'Dữ liệu kỹ thuật',
        body: 'Nhật ký truy cập máy chủ (địa chỉ IP, thời gian, trình duyệt) phục vụ vận hành và bảo mật. Website lưu phiên đăng nhập và giỏ hàng trong bộ nhớ trình duyệt (localStorage) của bạn. Chúng tôi không sử dụng cookie quảng cáo hay công cụ theo dõi hành vi của bên thứ ba.',
      },
    ],
  },
  {
    id: '3',
    title: '3. Mục đích xử lý',
    content: [
      {
        body: `${STORE.name} chỉ xử lý dữ liệu cá nhân cho các mục đích sau:`,
      },
    ],
    list: [
      'Tạo và quản lý tài khoản, xác thực đăng nhập, xác nhận yêu cầu xóa tài khoản',
      'Tiếp nhận, xác nhận, chuẩn bị, giao đơn hàng và thu tiền khi giao (COD)',
      'Đối soát chuyển khoản, xác nhận thanh toán và hoàn tiền',
      'Lập, phát hành và gửi hóa đơn điện tử theo yêu cầu của bạn',
      'Xử lý yêu cầu hủy đơn, trả hàng, bảo hành, khiếu nại và hỗ trợ khách hàng',
      'Gửi thông báo liên quan đến đơn hàng (trên website, qua Zalo hoặc email)',
      'Gửi thông tin khuyến mãi — chỉ khi bạn đã đồng ý nhận (xem Mục 8)',
      'Phòng chống gian lận, bảo đảm an toàn hệ thống',
      'Thực hiện nghĩa vụ kế toán, thuế và các nghĩa vụ khác theo quy định của pháp luật',
    ],
  },
  {
    id: '4',
    title: '4. Cơ sở xử lý và sự đồng ý',
    content: [
      {
        body: 'Chúng tôi xử lý dữ liệu cá nhân trên cơ sở sự đồng ý của bạn — được thể hiện bằng việc đánh dấu ô "Tôi đồng ý với Điều khoản dịch vụ và Chính sách bảo mật" khi đăng ký tài khoản và khi đặt hàng (thời điểm đồng ý được hệ thống ghi nhận), hoặc khi bạn chọn đăng nhập bằng Google/Facebook sau khi được thông báo — hoặc trong các trường hợp pháp luật cho phép xử lý không cần sự đồng ý, như để thực hiện hợp đồng mua bán với bạn hoặc thực hiện nghĩa vụ theo quy định của pháp luật.',
      },
      {
        body: 'Bạn có thể rút lại sự đồng ý bất cứ lúc nào (xem Mục 10). Việc rút lại không ảnh hưởng đến tính hợp pháp của việc xử lý đã thực hiện trước đó; khi đó chúng tôi có thể không tiếp tục cung cấp được dịch vụ cần dữ liệu tương ứng (ví dụ: không thể giao hàng nếu không có địa chỉ nhận).',
      },
    ],
  },
  {
    id: '5',
    title: '5. Tổ chức, cá nhân được tiếp cận dữ liệu',
    content: [
      {
        body: 'Chúng tôi không bán hoặc cho thuê dữ liệu cá nhân của bạn. Dữ liệu chỉ được chia sẻ ở mức cần thiết cho mục đích tương ứng với:',
      },
    ],
    list: [
      'Nhân viên được phân quyền của chúng tôi (bán hàng, chăm sóc khách hàng, kế toán) — chỉ truy cập dữ liệu cần cho công việc',
      'Đơn vị vận chuyển (hiện chủ yếu là SPX Express): họ tên, số điện thoại, địa chỉ người nhận, số tiền thu hộ',
      'Zalo (Công ty Cổ phần VNG): số điện thoại để gửi tin nhắn xác nhận đơn hàng; mã định danh Zalo khi bạn liên kết tài khoản',
      'Đơn vị cung cấp dịch vụ hóa đơn điện tử (EasyInvoice) và cơ quan thuế: thông tin người mua trên hóa đơn',
      'Google và Facebook: khi bạn chọn đăng nhập bằng các nền tảng này; Google (Gmail) để gửi email xác nhận xóa tài khoản và email hóa đơn',
      'Nhà cung cấp hạ tầng công nghệ lưu trữ, vận hành hệ thống: Vercel (website), Render (máy chủ ứng dụng), MongoDB Atlas (cơ sở dữ liệu), Cloudinary (lưu trữ hình ảnh)',
      'Sàn thương mại điện tử (Shopee): đối với đơn mua trên sàn, chúng tôi nhận dữ liệu đơn hàng từ sàn để giao hàng',
      'Cơ quan nhà nước có thẩm quyền khi có yêu cầu theo quy định của pháp luật',
    ],
    afterList: [
      {
        body: 'Các nhà cung cấp dịch vụ chỉ được xử lý dữ liệu theo mục đích chúng tôi giao và phải bảo mật dữ liệu theo điều khoản dịch vụ, thỏa thuận xử lý dữ liệu của họ.',
      },
    ],
  },
  {
    id: '6',
    title: '6. Chuyển dữ liệu ra nước ngoài',
    content: [
      {
        body: 'Một số nhà cung cấp hạ tầng nêu tại Mục 5 (Vercel, Render, MongoDB Atlas, Cloudinary, Google) lưu trữ, xử lý dữ liệu trên máy chủ đặt ngoài lãnh thổ Việt Nam. Việc chuyển dữ liệu này chỉ nhằm vận hành website và dịch vụ cho bạn, được thực hiện qua kết nối mã hóa và tuân thủ các quy định của pháp luật Việt Nam về chuyển dữ liệu cá nhân ra nước ngoài.',
      },
    ],
  },
  {
    id: '7',
    title: '7. Cách thức xử lý và bảo mật dữ liệu',
    content: [
      {
        body: 'Dữ liệu được thu thập trực tiếp từ bạn (hoặc từ sàn thương mại điện tử đối với đơn mua trên sàn), lưu trữ và xử lý trên hệ thống của chúng tôi. Chúng tôi không sử dụng việc xử lý tự động để đưa ra quyết định có ảnh hưởng pháp lý đến bạn; việc xác nhận thanh toán, duyệt yêu cầu hóa đơn, hủy đơn, trả hàng đều do nhân viên thực hiện. Các biện pháp bảo vệ gồm:',
      },
    ],
    list: [
      'Mã hóa kết nối HTTPS (SSL/TLS) cho website và hệ thống',
      'Mật khẩu và mã xác nhận được lưu dạng băm một chiều (bcrypt), không ai có thể xem được',
      'Phân quyền truy cập theo vai trò cho nhân viên; ghi nhật ký các thao tác quan trọng (xác nhận thanh toán, hoàn tiền, thay đổi đơn hàng)',
      'Che bớt số điện thoại, email trong các thông báo nội bộ không cần thông tin đầy đủ',
      'Không lưu thông tin thẻ hoặc thông tin đăng nhập ngân hàng',
    ],
    afterList: [
      {
        subtitle: 'Rủi ro có thể xảy ra',
        body: 'Không có hệ thống nào an toàn tuyệt đối; dữ liệu có thể bị lộ do tấn công mạng, lỗi kỹ thuật, lỗi của bên cung cấp dịch vụ hoặc do người dùng để lộ mật khẩu. Khi phát hiện sự cố vi phạm dữ liệu cá nhân, chúng tôi sẽ khắc phục, thông báo cho cơ quan có thẩm quyền và người bị ảnh hưởng theo quy định của pháp luật. Bạn nên dùng mật khẩu mạnh và không chia sẻ tài khoản cho người khác.',
      },
    ],
  },
  {
    id: '8',
    title: '8. Tin nhắn chăm sóc khách hàng và quảng cáo',
    content: [
      {
        body: 'Tin nhắn liên quan trực tiếp đến đơn hàng của bạn (xác nhận đơn, thanh toán, giao hàng, hóa đơn) được gửi để thực hiện giao dịch. Tin nhắn, email giới thiệu sản phẩm hoặc khuyến mãi chỉ được gửi khi bạn đã chủ động đồng ý nhận — bằng ô lựa chọn (không bắt buộc) khi đăng ký hoặc công tắc "Thông tin khuyến mãi" tại trang Hồ sơ. Bạn có thể tắt công tắc này bất cứ lúc nào, hoặc liên hệ với chúng tôi qua các kênh tại Mục 13; hệ thống không gửi tin khuyến mãi cho tài khoản chưa đồng ý.',
      },
    ],
  },
  {
    id: '9',
    title: '9. Thời gian lưu trữ',
    content: [
      {
        body: 'Dữ liệu được xử lý từ khi chúng tôi thu thập cho đến khi hoàn thành mục đích xử lý hoặc khi bạn yêu cầu xóa, cụ thể:',
      },
    ],
    list: [
      'Dữ liệu tài khoản: trong thời gian tài khoản còn hoạt động',
      'Dữ liệu đơn hàng, thanh toán, hóa đơn: theo thời hạn lưu trữ chứng từ kế toán, hóa đơn mà pháp luật về kế toán, thuế yêu cầu (có thể đến 10 năm)',
      'Hình ảnh, thông tin trả hàng và tài khoản nhận hoàn tiền: lưu cùng hồ sơ đơn hàng để đối chiếu, giải quyết khiếu nại',
      'Nhật ký kỹ thuật và nhật ký thao tác: trong thời gian cần thiết cho vận hành, bảo mật và đối soát',
    ],
    afterList: [
      {
        subtitle: 'Khi bạn xóa tài khoản',
        body: 'Bạn có thể tự xóa tài khoản tại trang Hồ sơ (xác nhận bằng mã gửi qua email). Tài khoản bị vô hiệu hóa ngay và không thể đăng nhập lại. Nếu bạn muốn xóa hẳn dữ liệu hồ sơ (họ tên, email, số điện thoại, địa chỉ đã lưu), hãy gửi yêu cầu qua email tại Mục 13 — chúng tôi sẽ xóa hoặc ẩn danh hóa, trừ dữ liệu phải tiếp tục lưu giữ theo quy định của pháp luật (như chứng từ đơn hàng, hóa đơn).',
      },
    ],
  },
  {
    id: '10',
    title: '10. Quyền của bạn',
    content: [
      {
        body: 'Với tư cách chủ thể dữ liệu, bạn có quyền:',
      },
    ],
    list: [
      'Được biết về hoạt động xử lý dữ liệu cá nhân của mình',
      'Đồng ý hoặc không đồng ý, rút lại sự đồng ý cho việc xử lý dữ liệu (riêng tin khuyến mãi có thể tự bật/tắt tại trang Hồ sơ)',
      'Xem, chỉnh sửa hoặc yêu cầu chỉnh sửa dữ liệu (thông tin tài khoản, địa chỉ có thể tự sửa tại trang Hồ sơ)',
      'Yêu cầu cung cấp, xóa, hạn chế xử lý dữ liệu cá nhân; phản đối việc xử lý dữ liệu cho mục đích quảng cáo',
      'Khiếu nại, tố cáo, khởi kiện và yêu cầu bồi thường thiệt hại theo quy định của pháp luật',
    ],
    afterList: [
      {
        body: 'Để thực hiện các quyền trên, vui lòng gửi yêu cầu qua email hoặc điện thoại tại Mục 13. Chúng tôi có thể đề nghị bạn xác minh danh tính (ví dụ: gửi yêu cầu từ email của tài khoản) để bảo vệ dữ liệu của bạn, và sẽ phản hồi trong thời hạn theo quy định của pháp luật.',
      },
    ],
  },
  {
    id: '11',
    title: '11. Dữ liệu cá nhân của trẻ em',
    content: [
      {
        body: 'Website không hướng đến trẻ em. Việc xử lý dữ liệu cá nhân của trẻ em chỉ được thực hiện khi có sự đồng ý của cha, mẹ hoặc người giám hộ theo quy định của pháp luật. Nếu phát hiện dữ liệu của trẻ em được cung cấp mà không có sự đồng ý này, vui lòng liên hệ để chúng tôi xóa.',
      },
    ],
  },
  {
    id: '12',
    title: '12. Thay đổi chính sách',
    content: [
      {
        body: 'Chúng tôi có thể cập nhật Chính sách này khi thay đổi cách thức xử lý dữ liệu hoặc khi pháp luật thay đổi. Ngày cập nhật được ghi ở đầu trang; thay đổi quan trọng sẽ được thông báo nổi bật trên website.',
      },
    ],
  },
  {
    id: '13',
    title: '13. Liên hệ',
    content: [
      {
        body: 'Mọi câu hỏi, yêu cầu về dữ liệu cá nhân, vui lòng liên hệ bộ phận phụ trách bảo vệ dữ liệu của chúng tôi:',
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
            {STORE.name} tôn trọng và bảo vệ dữ liệu cá nhân của bạn. Chính sách này thông báo loại dữ liệu
            chúng tôi thu thập, mục đích, cách thức xử lý, các bên được tiếp cận, thời gian lưu trữ và quyền
            của bạn khi sử dụng website <strong>{SITE}</strong>.
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
          <Link href="/terms-of-service" style={{ color: 'inherit' }}>
            <Typography variant="body2" color="primary" sx={{ fontWeight: 600 }}>
              Điều khoản dịch vụ →
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

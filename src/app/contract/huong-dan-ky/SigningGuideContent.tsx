'use client';

import Link from 'next/link';
import { Box, Container, Typography, Stack, Divider, Alert, Paper, alpha } from '@mui/material';
import VerifiedUserOutlinedIcon from '@mui/icons-material/VerifiedUserOutlined';
import GestureOutlinedIcon from '@mui/icons-material/GestureOutlined';
import DownloadOutlinedIcon from '@mui/icons-material/DownloadOutlined';
import UploadFileOutlinedIcon from '@mui/icons-material/UploadFileOutlined';
import HelpOutlineIcon from '@mui/icons-material/HelpOutlined';
import { STORE } from '@/lib/store-config';

function StepRow({
  n, title, desc, color,
}: {
  n: number;
  title: string;
  desc: React.ReactNode;
  color: string;
}) {
  return (
    <Stack direction="row" spacing={2} sx={{ alignItems: 'flex-start' }}>
      <Box
        sx={{
          width: 32, height: 32, borderRadius: '50%', flexShrink: 0,
          bgcolor: alpha(color, 0.12), color,
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          fontWeight: 700, fontSize: 14,
        }}
      >
        {n}
      </Box>
      <Box sx={{ pt: 0.3 }}>
        <Typography variant="body1" sx={{ fontWeight: 600, mb: 0.5 }}>{title}</Typography>
        <Typography variant="body2" color="text.secondary" sx={{ lineHeight: 1.7 }}>{desc}</Typography>
      </Box>
    </Stack>
  );
}

const FAQ: { q: string; a: string }[] = [
  {
    q: 'Hệ thống báo "Chữ ký số trong file không hợp lệ" — vì sao?',
    a: 'Thường do file bị chỉnh sửa nội dung sau khi tải về (dù chỉ một chút), hoặc bạn ký nhầm vào một bản PDF khác. Hệ thống chỉ chấp nhận file được ký trực tiếp trên đúng bản gốc tải từ link hợp đồng — không mở bằng phần mềm khác để chỉnh sửa/lưu lại trước khi ký.',
  },
  {
    q: 'Tôi cần cài phần mềm gì để ký?',
    a: 'Bạn cần phần mềm ký số đi kèm với chữ ký số/USB token của mình (do nhà cung cấp chứng thư số như VNPT-CA, VGCA, Viettel-CA, FPT-CA... cấp kèm khi mua chữ ký số). Cắm USB token vào máy tính, mở phần mềm đó, chọn file PDF cần ký và ký như bình thường — không cần cài thêm gì từ phía Luxe Glow.',
  },
  {
    q: 'Ký điện tử đơn giản có giá trị pháp lý không?',
    a: 'Đây là hình thức xác nhận nội dung hợp đồng qua chữ ký tay + xác thực số điện thoại, phù hợp cho giao dịch dân sự thông thường, nhưng KHÔNG phải "chữ ký số" (chữ ký điện tử an toàn) theo Nghị định 130/2018. Nếu cần giá trị pháp lý cao nhất, vui lòng dùng chữ ký số thật nếu bạn có.',
  },
  {
    q: 'Làm sao biết hợp đồng đã được ký thành công?',
    a: 'Sau khi tải lên file đã ký, hệ thống xác thực ngay lập tức. Nếu hợp lệ, phần "Chữ ký của bạn (Bên A)" trên trang hợp đồng sẽ hiển thị trạng thái đã xác thực kèm thông tin chứng thư số (hoặc tên/thời điểm nếu ký đơn giản).',
  },
  {
    q: 'Tôi ký nhầm hoặc muốn ký lại thì làm sao?',
    a: 'Vui lòng liên hệ trực tiếp với Luxe Glow để được hỗ trợ — hệ thống không cho phép ghi đè chữ ký đã xác thực hợp lệ nhằm đảm bảo tính toàn vẹn của hợp đồng.',
  },
];

export default function SigningGuideContent() {
  return (
    <Box sx={{ py: { xs: 6, md: 10 } }}>
      <Container maxWidth="md">
        {/* Header */}
        <Box sx={{ mb: 5 }}>
          <Typography variant="overline" sx={{ color: 'primary.main', fontWeight: 600, letterSpacing: 2 }}>
            Hợp đồng điện tử
          </Typography>
          <Typography variant="h3" sx={{ fontWeight: 700, mt: 1, mb: 2, fontSize: { xs: '1.8rem', md: '2.4rem' } }}>
            Hướng dẫn ký hợp đồng
          </Typography>
          <Typography variant="body1" color="text.secondary" sx={{ lineHeight: 1.8 }}>
            {STORE.name} luôn ký hợp đồng bằng <b>chữ ký số</b> trước khi gửi cho bạn. Trang này
            hướng dẫn bạn cách ký xác nhận lại — bằng chữ ký số của riêng bạn (nếu có), hoặc bằng
            chữ ký điện tử đơn giản.
          </Typography>
          <Divider sx={{ mt: 3 }} />
        </Box>

        <Alert severity="info" sx={{ borderRadius: 3, mb: 5 }}>
          Mục &quot;Ký hợp đồng&quot; chỉ xuất hiện trên trang hợp đồng của bạn sau khi Luxe Glow
          đã ký số vào bản hợp đồng chính thức (trạng thái <b>Bản chính thức</b>). Nếu chưa thấy
          mục này, có thể hợp đồng đang chờ cửa hàng xử lý.
        </Alert>

        {/* Cách 1: Chữ ký số */}
        <Paper elevation={0} sx={{ p: { xs: 3, md: 4 }, borderRadius: 4, border: '1px solid', borderColor: 'divider', mb: 4 }}>
          <Stack direction="row" spacing={1.5} sx={{ alignItems: 'center', mb: 3 }}>
            <VerifiedUserOutlinedIcon sx={{ color: '#2563EB' }} />
            <Typography variant="h6" sx={{ fontWeight: 700 }}>
              Cách 1 — Ký bằng chữ ký số (USB token)
            </Typography>
          </Stack>
          <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
            Áp dụng nếu bạn có chữ ký số riêng (do VNPT-CA, VGCA, Viettel-CA, FPT-CA... cấp), thường
            đi kèm USB token và phần mềm ký số cài trên máy tính.
          </Typography>
          <Stack spacing={3}>
            <StepRow
              n={1}
              color="#2563EB"
              title="Cắm USB token vào máy tính"
              desc="Đảm bảo phần mềm ký số đi kèm token của bạn đã được cài đặt và nhận diện được token."
            />
            <StepRow
              n={2}
              color="#2563EB"
              title="Tải file PDF cần ký"
              desc={
                <>
                  Trên trang hợp đồng, chọn <b>&quot;Tôi có chữ ký số (USB token)&quot;</b> rồi bấm{' '}
                  <b>&quot;Tải file cần ký&quot;</b> — đây là bản PDF đã có sẵn chữ ký số của Luxe Glow.
                </>
              }
            />
            <StepRow
              n={3}
              color="#2563EB"
              title="Ký bằng phần mềm ký số của bạn"
              desc={
                <>
                  Mở phần mềm ký số, chọn đúng file vừa tải về và ký như bình thường (ký chồng thêm
                  lên chữ ký sẵn có, không xoá hay chỉnh sửa nội dung file).
                  <Box component="span" sx={{ display: 'block', mt: 0.5, fontStyle: 'italic' }}>
                    Lưu ý: không mở file bằng phần mềm khác để chỉnh sửa/lưu lại trước khi ký — hệ
                    thống sẽ từ chối nếu nội dung file bị thay đổi dù chỉ một chút.
                  </Box>
                </>
              }
            />
            <StepRow
              n={4}
              color="#2563EB"
              title="Tải file đã ký lên hệ thống"
              desc={
                <>
                  Quay lại trang hợp đồng, bấm <b>&quot;Tải lên file đã ký&quot;</b> và chọn file vừa
                  ký. Hệ thống sẽ tự động xác thực chữ ký của bạn trong vài giây.
                </>
              }
            />
          </Stack>
        </Paper>

        {/* Cách 2: Ký đơn giản */}
        <Paper elevation={0} sx={{ p: { xs: 3, md: 4 }, borderRadius: 4, border: '1px solid', borderColor: 'divider', mb: 4 }}>
          <Stack direction="row" spacing={1.5} sx={{ alignItems: 'center', mb: 3 }}>
            <GestureOutlinedIcon sx={{ color: '#F59E0B' }} />
            <Typography variant="h6" sx={{ fontWeight: 700 }}>
              Cách 2 — Ký điện tử đơn giản (không cần chữ ký số)
            </Typography>
          </Stack>
          <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
            Dành cho khách hàng không có chữ ký số. Bạn ký tay trực tiếp trên màn hình và xác nhận
            họ tên — nhanh chóng, không cần cài đặt gì thêm.
          </Typography>
          <Stack spacing={3}>
            <StepRow
              n={1}
              color="#F59E0B"
              title="Chọn “Tôi không có — ký đơn giản”"
              desc="Trên trang hợp đồng, trong mục Ký hợp đồng, chọn phương án này."
            />
            <StepRow
              n={2}
              color="#F59E0B"
              title="Ký tên vào khung ký"
              desc="Dùng ngón tay (điện thoại/máy tính bảng) hoặc chuột (máy tính) để ký trực tiếp vào khung. Bấm “Xoá chữ ký” nếu muốn ký lại."
            />
            <StepRow
              n={3}
              color="#F59E0B"
              title="Nhập họ tên xác nhận và xác nhận"
              desc="Điền đầy đủ họ tên rồi bấm “Xác nhận chữ ký”. Hệ thống ghi nhận ngay, kèm thời điểm ký để đối chiếu khi cần."
            />
          </Stack>
          <Alert severity="warning" sx={{ borderRadius: 3, mt: 3 }}>
            Đây là chữ ký điện tử đơn giản để xác nhận nội dung hợp đồng, <b>không phải chữ ký số</b>{' '}
            (chữ ký điện tử an toàn) theo Nghị định 130/2018.
          </Alert>
        </Paper>

        {/* Vì sao bị từ chối */}
        <Paper
          elevation={0}
          sx={{
            p: { xs: 3, md: 4 }, borderRadius: 4, mb: 4,
            bgcolor: alpha('#EF4444', 0.04), border: '1px solid', borderColor: alpha('#EF4444', 0.2),
          }}
        >
          <Stack direction="row" spacing={1.5} sx={{ alignItems: 'center', mb: 2 }}>
            <Box sx={{
              width: 40, height: 40, borderRadius: 2.5, bgcolor: alpha('#EF4444', 0.12),
              display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0,
            }}>
              <DownloadOutlinedIcon sx={{ color: '#EF4444', fontSize: 20 }} />
            </Box>
            <UploadFileOutlinedIcon sx={{ color: '#EF4444', fontSize: 20 }} />
            <Typography variant="h6" sx={{ fontWeight: 700 }}>
              Vì sao hệ thống có thể từ chối file đã ký?
            </Typography>
          </Stack>
          <Typography variant="body2" color="text.secondary" sx={{ lineHeight: 1.8 }}>
            Hệ thống kiểm tra rất chặt để đảm bảo bạn ký đúng nội dung hợp đồng, không phải bản đã
            bị chỉnh sửa. File tải lên phải là <b>đúng file gốc</b> tải về từ trang hợp đồng, chỉ
            thêm chữ ký số vào — không mở bằng trình chỉnh sửa PDF khác, không đổi tên rồi lưu lại
            qua ứng dụng khác, không nén/ghép file. Nếu gặp lỗi, hãy tải lại file gốc mới nhất và ký
            lại từ đầu.
          </Typography>
        </Paper>

        {/* FAQ */}
        <Box sx={{ mb: 5 }}>
          <Stack direction="row" spacing={1.5} sx={{ alignItems: 'center', mb: 3 }}>
            <HelpOutlineIcon color="primary" />
            <Typography variant="h6" sx={{ fontWeight: 700 }}>Câu hỏi thường gặp</Typography>
          </Stack>
          <Stack spacing={3}>
            {FAQ.map(({ q, a }) => (
              <Box key={q}>
                <Typography variant="body1" sx={{ fontWeight: 600, mb: 0.5 }}>{q}</Typography>
                <Typography variant="body2" color="text.secondary" sx={{ lineHeight: 1.8 }}>{a}</Typography>
              </Box>
            ))}
          </Stack>
        </Box>

        {/* Contact */}
        <Box
          sx={{
            bgcolor: 'grey.50', border: '1px solid', borderColor: 'divider',
            borderRadius: 3, p: 3,
          }}
        >
          <Typography variant="body1" sx={{ fontWeight: 700, mb: 1 }}>Cần hỗ trợ thêm?</Typography>
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
          </Stack>
        </Box>

        {/* Footer nav */}
        <Divider sx={{ my: 6 }} />
        <Box sx={{ display: 'flex', gap: 3, flexWrap: 'wrap' }}>
          <Link href="/faq" style={{ color: 'inherit' }}>
            <Typography variant="body2" color="text.secondary">
              Câu hỏi thường gặp
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

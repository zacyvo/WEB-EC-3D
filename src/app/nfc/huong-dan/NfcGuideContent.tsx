'use client';

import Image from 'next/image';
import Link from 'next/link';
import {
  Box, Container, Typography, Stack, Divider, Alert, Paper, alpha, Grid,
} from '@mui/material';
import NfcOutlinedIcon from '@mui/icons-material/NfcOutlined';
import LockOutlinedIcon from '@mui/icons-material/LockOutlined';
import LoginOutlinedIcon from '@mui/icons-material/LoginOutlined';
import ContactPageOutlinedIcon from '@mui/icons-material/ContactPageOutlined';
import ShareOutlinedIcon from '@mui/icons-material/ShareOutlined';
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

function PhoneShot({ src, alt }: { src: string; alt: string }) {
  return (
    <Box
      sx={{
        position: 'relative',
        width: '100%',
        maxWidth: 260,
        mx: 'auto',
        aspectRatio: '498 / 968',
      }}
    >
      <Image src={src} alt={alt} fill style={{ objectFit: 'contain' }} sizes="260px" />
    </Box>
  );
}

const FAQ: { q: string; a: string }[] = [
  {
    q: 'Tôi quên mật khẩu quản lý thẻ NFC thì làm sao?',
    a: `Vui lòng liên hệ ${STORE.name} kèm số điện thoại đã đăng ký — chúng tôi sẽ đặt lại thẻ về trạng thái chưa kích hoạt để bạn thiết lập số điện thoại và mật khẩu mới. Lưu ý: đặt lại sẽ xoá toàn bộ danh sách liên hệ đã lưu trước đó.`,
  },
  {
    q: 'Điện thoại không nhận thẻ khi chạm (NFC không phản hồi)?',
    a: 'Kiểm tra điện thoại đã bật NFC (Cài đặt → Kết nối/NFC) và chạm đúng vị trí ăng-ten NFC (thường ở mặt lưng, gần camera). Nếu vẫn không được, dùng link quản lý hoặc mã QR đi kèm thẻ để mở trực tiếp bằng trình duyệt.',
  },
  {
    q: 'Link quản lý và link danh thiếp công khai khác nhau thế nào?',
    a: 'Link quản lý (dạng /nfc/NFC-xxxxxx) chỉ dành cho bạn — dùng để đăng nhập, thêm/sửa/xoá thông tin liên hệ. Link công khai (dạng /nfc/xxxxxxxx) là link chia sẻ được — bất kỳ ai mở cũng chỉ xem được danh thiếp, không đăng nhập hay chỉnh sửa được.',
  },
  {
    q: 'Tôi có thể chỉnh sửa lại danh sách liên hệ sau khi đã lưu không?',
    a: 'Có. Mở lại link quản lý bất cứ lúc nào, đăng nhập bằng số điện thoại và mật khẩu đã tạo, sau đó thêm, sửa giá trị hoặc xoá từng liên hệ rồi bấm "Lưu thay đổi".',
  },
];

export default function NfcGuideContent() {
  return (
    <Box sx={{ py: { xs: 6, md: 10 } }}>
      <Container maxWidth="md">
        {/* Header */}
        <Box sx={{ mb: 5 }}>
          <Stack direction="row" spacing={1} sx={{ alignItems: 'center', mb: 1.5 }}>
            <NfcOutlinedIcon sx={{ color: 'primary.main' }} />
            <Typography variant="overline" sx={{ color: 'primary.main', fontWeight: 600, letterSpacing: 2 }}>
              Thẻ NFC
            </Typography>
          </Stack>
          <Typography variant="h3" sx={{ fontWeight: 700, mb: 2, fontSize: { xs: '1.8rem', md: '2.4rem' } }}>
            Hướng dẫn kích hoạt và sử dụng thẻ NFC
          </Typography>
          <Typography variant="body1" color="text.secondary" sx={{ lineHeight: 1.8 }}>
            Thẻ NFC {STORE.name} hoạt động như một danh thiếp điện tử — chạm thẻ vào điện thoại để
            chia sẻ số điện thoại, Zalo, Facebook và các mạng xã hội khác của bạn chỉ trong một
            chạm. Trang này hướng dẫn bạn kích hoạt thẻ lần đầu, thêm thông tin liên hệ và chia sẻ
            cho người khác.
          </Typography>
          <Divider sx={{ mt: 3 }} />
        </Box>

        <Alert severity="info" sx={{ borderRadius: 3, mb: 4 }}>
          Hầu hết điện thoại từ 2018 trở đi đều đọc được NFC. Chưa chắc máy của bạn có hỗ trợ?{' '}
          <Link href="/nfc/huong-dan/thiet-bi-ho-tro" style={{ fontWeight: 700 }}>
            Xem danh sách điện thoại hỗ trợ NFC →
          </Link>
        </Alert>

        {/* Bước 1: Kích hoạt */}
        <Paper elevation={0} sx={{ p: { xs: 3, md: 4 }, borderRadius: 4, border: '1px solid', borderColor: 'divider', mb: 4 }}>
          <Stack direction="row" spacing={1.5} sx={{ alignItems: 'center', mb: 3 }}>
            <LockOutlinedIcon sx={{ color: '#2563EB' }} />
            <Typography variant="h6" sx={{ fontWeight: 700 }}>
              Bước 1 — Kích hoạt thẻ (chạm lần đầu tiên)
            </Typography>
          </Stack>
          <Grid container spacing={4} sx={{ alignItems: 'center' }}>
            <Grid size={{ xs: 12, sm: 5 }}>
              <PhoneShot src="/img/guide/NFC/S_1B.png" alt="Màn hình kích hoạt thẻ NFC" />
            </Grid>
            <Grid size={{ xs: 12, sm: 7 }}>
              <Stack spacing={3}>
                <StepRow
                  n={1}
                  color="#2563EB"
                  title="Chạm điện thoại vào thẻ NFC"
                  desc="Đưa mặt sau điện thoại lại gần thẻ vài giây (hoặc quét mã QR / mở link đi kèm thẻ nếu điện thoại không hỗ trợ NFC). Trình duyệt sẽ tự mở trang kích hoạt."
                />
                <StepRow
                  n={2}
                  color="#2563EB"
                  title="Nhập số điện thoại"
                  desc="Đây sẽ là số dùng để đăng nhập quản lý thẻ ở những lần sau."
                />
                <StepRow
                  n={3}
                  color="#2563EB"
                  title="Đặt mật khẩu và nhập lại để xác nhận"
                  desc="Mật khẩu cần 8-32 ký tự, gồm chữ hoa, chữ thường và số."
                />
                <StepRow
                  n={4}
                  color="#2563EB"
                  title="Đồng ý điều khoản và bấm “Kích hoạt”"
                  desc="Chỉ cần thực hiện một lần duy nhất — thẻ sẽ ghi nhớ và không yêu cầu kích hoạt lại."
                />
              </Stack>
            </Grid>
          </Grid>
        </Paper>

        {/* Đăng nhập lần sau */}
        <Paper elevation={0} sx={{ p: { xs: 3, md: 4 }, borderRadius: 4, border: '1px solid', borderColor: 'divider', mb: 4 }}>
          <Stack direction="row" spacing={1.5} sx={{ alignItems: 'center', mb: 3 }}>
            <LoginOutlinedIcon sx={{ color: '#0EA5E9' }} />
            <Typography variant="h6" sx={{ fontWeight: 700 }}>
              Những lần sau — đăng nhập để chỉnh sửa
            </Typography>
          </Stack>
          <Grid container spacing={4} sx={{ alignItems: 'center' }}>
            <Grid size={{ xs: 12, sm: 5 }}>
              <PhoneShot src="/img/guide/NFC/S_1A.png" alt="Màn hình đăng nhập thẻ NFC" />
            </Grid>
            <Grid size={{ xs: 12, sm: 7 }}>
              <Typography variant="body2" color="text.secondary" sx={{ lineHeight: 1.8 }}>
                Sau khi đã kích hoạt, chạm lại thẻ (hoặc mở link quản lý) sẽ hiện màn hình{' '}
                <b>“Đăng nhập thẻ NFC”</b> thay vì kích hoạt. Nhập đúng số điện thoại và mật khẩu đã
                thiết lập ở Bước 1 để vào trang quản lý và chỉnh sửa thông tin liên hệ bất cứ lúc
                nào.
              </Typography>
            </Grid>
          </Grid>
        </Paper>

        {/* Bước 2: Thêm liên hệ */}
        <Paper elevation={0} sx={{ p: { xs: 3, md: 4 }, borderRadius: 4, border: '1px solid', borderColor: 'divider', mb: 4 }}>
          <Stack direction="row" spacing={1.5} sx={{ alignItems: 'center', mb: 3 }}>
            <ContactPageOutlinedIcon sx={{ color: '#F59E0B' }} />
            <Typography variant="h6" sx={{ fontWeight: 700 }}>
              Bước 2 — Thêm thông tin liên hệ / mạng xã hội
            </Typography>
          </Stack>
          <Grid container spacing={4} sx={{ alignItems: 'center', mb: 3 }}>
            <Grid size={{ xs: 12, sm: 5 }}>
              <PhoneShot src="/img/guide/NFC/S_3.png" alt="Chọn biểu tượng liên hệ" />
            </Grid>
            <Grid size={{ xs: 12, sm: 7 }}>
              <Stack spacing={3}>
                <StepRow
                  n={1}
                  color="#F59E0B"
                  title="Bấm “Thêm liên hệ”"
                  desc="Trong màn hình Quản lý thẻ NFC, bấm nút này để mở bảng chọn biểu tượng."
                />
                <StepRow
                  n={2}
                  color="#F59E0B"
                  title="Chọn biểu tượng phù hợp"
                  desc="Điện thoại, Email, Zalo, Facebook, Instagram, TikTok, Threads, WhatsApp... — chọn 1 biểu tượng cho mỗi liên hệ muốn thêm."
                />
              </Stack>
            </Grid>
          </Grid>
          <Grid container spacing={4} sx={{ alignItems: 'center' }}>
            <Grid size={{ xs: 12, sm: 5 }} sx={{ order: { xs: 1, sm: 2 } }}>
              <PhoneShot src="/img/guide/NFC/S_4.png" alt="Nhập giá trị liên hệ và lưu" />
            </Grid>
            <Grid size={{ xs: 12, sm: 7 }} sx={{ order: { xs: 2, sm: 1 } }}>
              <Stack spacing={3}>
                <StepRow
                  n={3}
                  color="#F59E0B"
                  title="Nhập giá trị tương ứng"
                  desc="Số điện thoại, email, hoặc đường link trang cá nhân — tuỳ theo biểu tượng đã chọn. Có thể thêm nhiều liên hệ cùng lúc, xoá bằng biểu tượng thùng rác nếu cần."
                />
                <StepRow
                  n={4}
                  color="#F59E0B"
                  title="Bấm “Lưu thay đổi”"
                  desc="Toàn bộ danh sách liên hệ sẽ được cập nhật ngay trên danh thiếp điện tử công khai."
                />
              </Stack>
            </Grid>
          </Grid>
        </Paper>

        {/* Bước 3: Chia sẻ */}
        <Paper elevation={0} sx={{ p: { xs: 3, md: 4 }, borderRadius: 4, border: '1px solid', borderColor: 'divider', mb: 4 }}>
          <Stack direction="row" spacing={1.5} sx={{ alignItems: 'center', mb: 3 }}>
            <ShareOutlinedIcon sx={{ color: '#22C55E' }} />
            <Typography variant="h6" sx={{ fontWeight: 700 }}>
              Bước 3 — Chia sẻ danh thiếp điện tử
            </Typography>
          </Stack>
          <Grid container spacing={4} sx={{ alignItems: 'center' }}>
            <Grid size={{ xs: 12, sm: 5 }}>
              <PhoneShot src="/img/guide/NFC/S_5.png" alt="Danh thiếp điện tử công khai" />
            </Grid>
            <Grid size={{ xs: 12, sm: 7 }}>
              <Typography variant="body2" color="text.secondary" sx={{ lineHeight: 1.8, mb: 2 }}>
                Khi người khác chạm thẻ NFC của bạn (hoặc mở link/mã QR công khai), họ sẽ thấy ngay
                <b> danh thiếp điện tử</b> với toàn bộ liên hệ bạn đã thêm — chạm vào một mục để gọi
                điện, nhắn tin hoặc mở trang mạng xã hội tương ứng. Không cần cài đặt ứng dụng gì
                thêm.
              </Typography>
              <Alert severity="info" sx={{ borderRadius: 3 }}>
                Link công khai này khác với link quản lý — xem thêm ở phần Câu hỏi thường gặp bên
                dưới.
              </Alert>
            </Grid>
          </Grid>
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

'use client';

import Link from 'next/link';
import toast from 'react-hot-toast';
import { Alert, Box, Button, Card, CardContent, Container, Divider, Stack, Typography } from '@mui/material';
import CheckCircleOutlinedIcon from '@mui/icons-material/CheckCircleOutlined';
import ContentCopyIcon from '@mui/icons-material/ContentCopy';
import KeyOutlinedIcon from '@mui/icons-material/KeyOutlined';
import BankTransferPayment from '@/components/bank-transfer/BankTransferPayment';
import { formatCurrency } from '@/lib/utils';
import { orderLinkPath, type GuestCheckoutResult } from '@/lib/order-public-api';

async function copyText(text: string): Promise<boolean> {
  try {
    await navigator.clipboard.writeText(text);
    return true;
  } catch {
    // Older in-app browsers (Zalo, Facebook) block the Clipboard API — fall back to a hidden textarea.
    try {
      const el = document.createElement('textarea');
      el.value = text;
      el.setAttribute('readonly', '');
      el.style.position = 'fixed';
      el.style.opacity = '0';
      document.body.appendChild(el);
      el.select();
      const ok = document.execCommand('copy');
      document.body.removeChild(el);
      return ok;
    } catch {
      return false;
    }
  }
}

function CredentialRow({ label, value, mono, onCopy }: { label: string; value: string; mono?: boolean; onCopy: () => void }) {
  return (
    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
      <Box sx={{ flex: 1, minWidth: 0 }}>
        <Typography variant="caption" color="text.secondary">{label}</Typography>
        <Typography
          variant="body2"
          sx={{
            fontWeight: 700, wordBreak: 'break-all',
            ...(mono ? { fontFamily: 'monospace', letterSpacing: 3, fontSize: '1.15rem' } : {}),
          }}
        >
          {value}
        </Typography>
      </Box>
      <Button size="small" variant="outlined" startIcon={<ContentCopyIcon fontSize="small" />} onClick={onCopy} sx={{ flexShrink: 0, borderRadius: 980 }}>
        Sao chép
      </Button>
    </Box>
  );
}

/**
 * Success screen of a checkout without login: the order is followed through its "Link xem đơn"
 * (+ phone + security code), shown here once. Bank transfer → the VietQR card through that link.
 */
export default function GuestOrderSuccess({ result }: { result: GuestCheckoutResult }) {
  const { order, publicAccess } = result;
  const isBankTransfer = order.paymentMethod === 'BANK_TRANSFER';

  const copy = async (text: string, what: string) => {
    if (await copyText(text)) toast.success(`Đã sao chép ${what}`);
    else toast.error(`Không sao chép được — vui lòng ghi lại ${what}`);
  };
  const allText =
    `Đơn hàng Luxe Glow #${order.orderCode}\n` +
    `Link xem đơn: ${publicAccess.publicUrl}\n` +
    `Số điện thoại: ${publicAccess.phone}\n` +
    `Mã bảo mật: ${publicAccess.securityCode}`;

  return (
    <Container maxWidth="sm" sx={{ py: { xs: 4, md: 7 } }}>
      <Box sx={{ textAlign: 'center', mb: 3 }}>
        <CheckCircleOutlinedIcon sx={{ fontSize: 56, color: 'success.main' }} />
        <Typography variant="h5" sx={{ fontWeight: 700, mt: 1 }}>Đặt hàng thành công!</Typography>
        <Typography color="text.secondary">
          Đơn #{order.orderCode} · {formatCurrency(order.total)}
          {isBankTransfer ? ' — vui lòng hoàn tất chuyển khoản để Luxe Glow xử lý đơn hàng.' : ' — đơn hàng đang chờ xác nhận.'}
        </Typography>
      </Box>

      <Card variant="outlined" sx={{ borderRadius: 3, mb: 2, borderColor: 'warning.light' }}>
        <CardContent sx={{ p: { xs: 2.5, sm: 3 } }}>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1 }}>
            <KeyOutlinedIcon sx={{ color: 'warning.main' }} />
            <Typography variant="h6" sx={{ fontWeight: 700 }}>Lưu lại để theo dõi đơn hàng</Typography>
          </Box>
          <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
            Bạn đặt hàng không cần đăng nhập — mở link bên dưới và nhập số điện thoại + mã bảo mật để xem đơn.
            Mã bảo mật chỉ hiển thị <b>một lần</b> tại đây, hãy chụp màn hình hoặc sao chép lại.
          </Typography>
          <Stack spacing={1.5}>
            <CredentialRow label="Link xem đơn" value={publicAccess.publicUrl} onCopy={() => copy(publicAccess.publicUrl, 'link')} />
            <Divider />
            <CredentialRow label="Số điện thoại" value={publicAccess.phone} onCopy={() => copy(publicAccess.phone, 'số điện thoại')} />
            <Divider />
            <CredentialRow label="Mã bảo mật" value={publicAccess.securityCode} mono onCopy={() => copy(publicAccess.securityCode, 'mã bảo mật')} />
          </Stack>
          <Button fullWidth variant="contained" startIcon={<ContentCopyIcon />} onClick={() => copy(allText, 'thông tin đơn hàng')} sx={{ mt: 2.5, borderRadius: 980, fontWeight: 600 }}>
            Sao chép tất cả
          </Button>
          <Alert severity="info" sx={{ mt: 2, borderRadius: 2 }}>
            Quên mã bảo mật? Bạn vẫn xem được đơn bằng <b>số điện thoại + địa chỉ nhận hàng</b>. Mất link? Vào{' '}
            <Link href="/order-lookup" style={{ color: 'inherit', fontWeight: 600 }}>Tra cứu đơn hàng</Link>.
          </Alert>
        </CardContent>
      </Card>

      {isBankTransfer && (
        <BankTransferPayment
          orderId={publicAccess.token}
          showOrderLink
          publicAccess={{ token: publicAccess.token, jwt: publicAccess.accessJwt }}
        />
      )}

      <Stack direction={{ xs: 'column', sm: 'row' }} spacing={1.5}>
        {!isBankTransfer && (
          <Button component={Link} href={orderLinkPath(publicAccess.token)} variant="contained" size="large" fullWidth sx={{ borderRadius: 980, fontWeight: 600 }}>
            Xem đơn hàng
          </Button>
        )}
        <Button component={Link} href="/products" variant="outlined" size="large" fullWidth sx={{ borderRadius: 980, fontWeight: 600 }}>
          Tiếp tục mua hàng
        </Button>
      </Stack>
    </Container>
  );
}

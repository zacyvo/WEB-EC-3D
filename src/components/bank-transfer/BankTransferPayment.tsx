'use client';

import { useEffect, useRef, useState } from 'react';
import Link from 'next/link';
import QRCode from 'qrcode';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import {
  Alert, Box, Button, Card, CardContent, Chip, CircularProgress, Divider, Skeleton, Stack, Typography,
} from '@mui/material';
import ContentCopyIcon from '@mui/icons-material/ContentCopy';
import DownloadIcon from '@mui/icons-material/Download';
import CheckCircleOutlinedIcon from '@mui/icons-material/CheckCircleOutlined';
import AccountBalanceOutlinedIcon from '@mui/icons-material/AccountBalanceOutlined';
import toast from 'react-hot-toast';
import api from '@/lib/api';
import { formatCurrency, formatDate } from '@/lib/utils';
import type { ApiResponse, PaymentInstructions } from '@/types';

const REPORTED_MESSAGE =
  'Luxe Glow đã nhận được yêu cầu xác nhận thanh toán. Chúng tôi sẽ kiểm tra và cập nhật trạng thái đơn hàng.';

function statusChip(p: PaymentInstructions): { label: string; sx: Record<string, string> } {
  if (p.paymentStatus === 'REFUNDED') return { label: 'Đã hoàn tiền', sx: { bgcolor: '#F3F4F6', color: '#374151', borderColor: '#E5E7EB' } };
  if (p.paymentStatus === 'PAID' && p.orderStatus === 'CANCELLED') {
    return { label: 'Chờ hoàn tiền', sx: { bgcolor: '#FEF3C7', color: '#92400E', borderColor: '#FDE68A' } };
  }
  if (p.paymentStatus === 'PAID') return { label: 'Đã thanh toán', sx: { bgcolor: '#D1FAE5', color: '#065F46', borderColor: '#A7F3D0' } };
  if (!p.payable) return { label: 'Không cần thanh toán', sx: { bgcolor: '#F3F4F6', color: '#4B5563', borderColor: '#E5E7EB' } };
  if (p.verificationStatus === 'AWAITING_CONFIRMATION') {
    return { label: 'Chờ Luxe Glow xác nhận', sx: { bgcolor: '#DBEAFE', color: '#1D4ED8', borderColor: '#BFDBFE' } };
  }
  return { label: 'Chờ thanh toán', sx: { bgcolor: '#FEF9C3', color: '#92400E', borderColor: '#FDE68A' } };
}

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

function Row({ label, value, strong, mono }: { label: string; value: string; strong?: boolean; mono?: boolean }) {
  return (
    <Box sx={{ display: 'flex', justifyContent: 'space-between', gap: 2, alignItems: 'baseline' }}>
      <Typography variant="body2" color="text.secondary">{label}</Typography>
      <Typography
        variant="body2"
        sx={{
          fontWeight: strong ? 700 : 600, textAlign: 'right',
          ...(mono
            ? { fontFamily: 'monospace', letterSpacing: 0.5, fontSize: '0.95rem', whiteSpace: 'nowrap', flexShrink: 0 }
            : { wordBreak: 'break-word' }),
          ...(strong ? { color: 'primary.main', fontSize: '1.05rem' } : {}),
        }}
      >
        {value}
      </Typography>
    </Box>
  );
}

/**
 * "Thanh toán đơn hàng" for a VietQR bank-transfer order: QR (amount + transfer description
 * pre-filled), bank details with copy buttons, QR download and the "Tôi đã chuyển khoản" claim.
 * Everything comes from GET /orders/:id/payment — the amount is never computed here.
 */
export default function BankTransferPayment({
  orderId, showOrderLink = false, refreshKey,
}: {
  orderId: string;
  showOrderLink?: boolean;
  /** Changes when the order changes elsewhere on the page (cancelled, e-invoice request rejected…) → reload. */
  refreshKey?: string;
}) {
  const queryClient = useQueryClient();
  const queryKey = ['order-payment', orderId];
  const [qrDataUrl, setQrDataUrl] = useState<string | null>(null);
  const [qrRenderFailed, setQrRenderFailed] = useState(false);

  const { data: payment, isLoading, isError, refetch, isFetching } = useQuery({
    queryKey,
    queryFn: async () => (await api.get<ApiResponse<PaymentInstructions>>(`/orders/${orderId}/payment`)).data.data,
    // While the shop is checking the transfer, pick up its confirmation without a reload.
    refetchInterval: (q) =>
      q.state.data?.payable && q.state.data.verificationStatus === 'AWAITING_CONFIRMATION' ? 30_000 : false,
  });

  useEffect(() => {
    setQrDataUrl(null);
    setQrRenderFailed(false);
    if (!payment?.qrPayload) return;
    let cancelled = false;
    QRCode.toDataURL(payment.qrPayload, { margin: 2, width: 720, errorCorrectionLevel: 'M' })
      .then((url) => { if (!cancelled) setQrDataUrl(url); })
      .catch(() => { if (!cancelled) setQrRenderFailed(true); });
    return () => { cancelled = true; };
  }, [payment?.qrPayload]);

  const seenRefreshKey = useRef(refreshKey);
  useEffect(() => {
    if (seenRefreshKey.current === refreshKey) return;
    seenRefreshKey.current = refreshKey;
    queryClient.invalidateQueries({ queryKey: ['order-payment', orderId] });
  }, [refreshKey, orderId, queryClient]);

  // Once the shop confirms, the order page (paid amount, status) must show it too.
  const lastStatus = useRef(payment?.paymentStatus);
  useEffect(() => {
    if (payment?.paymentStatus === 'PAID' && lastStatus.current && lastStatus.current !== 'PAID') {
      queryClient.invalidateQueries({ queryKey: ['order', orderId] });
      queryClient.invalidateQueries({ queryKey: ['orders'] });
    }
    lastStatus.current = payment?.paymentStatus;
  }, [payment?.paymentStatus, orderId, queryClient]);

  const report = useMutation({
    mutationFn: async () => (await api.post<ApiResponse<PaymentInstructions>>(`/orders/${orderId}/payment/report`, {})).data.data,
    onSuccess: (updated) => {
      queryClient.setQueryData(queryKey, updated);
      queryClient.invalidateQueries({ queryKey: ['order', orderId] });
      toast.success(REPORTED_MESSAGE, { duration: 6000 });
    },
    onError: (err: unknown) => {
      const message = (err as { response?: { data?: { message?: string | string[] } } })?.response?.data?.message;
      toast.error((Array.isArray(message) ? message[0] : message) || 'Không gửi được yêu cầu, vui lòng thử lại');
      queryClient.invalidateQueries({ queryKey });
    },
  });

  const copy = async (text: string, what: string) => {
    if (await copyText(text)) toast.success(`Đã sao chép ${what}`);
    else toast.error(`Không sao chép được — vui lòng ghi lại ${what}`);
  };

  const downloadQr = () => {
    if (!qrDataUrl || !payment) {
      toast.error('Không tải được mã QR');
      return;
    }
    try {
      const a = document.createElement('a');
      a.href = qrDataUrl;
      a.download = `luxe-glow-${payment.reference}.png`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
    } catch {
      toast.error('Không tải được mã QR — bạn có thể chụp màn hình mã QR');
    }
  };

  if (isLoading) {
    return <Skeleton variant="rounded" height={420} sx={{ borderRadius: 3, mb: 2 }} />;
  }

  if (isError || !payment) {
    return (
      <Alert
        severity="error"
        sx={{ mb: 2, borderRadius: 3 }}
        action={<Button color="inherit" size="small" onClick={() => refetch()} disabled={isFetching}>Thử lại</Button>}
      >
        Không tải được thông tin thanh toán. Vui lòng kiểm tra kết nối mạng và thử lại.
      </Alert>
    );
  }

  const chip = statusChip(payment);
  const awaiting = payment.verificationStatus === 'AWAITING_CONFIRMATION';
  const qrUnavailable = payment.payable && (!payment.qrPayload || qrRenderFailed);

  return (
    <Card variant="outlined" sx={{ borderRadius: 3, mb: 2, borderColor: payment.payable ? 'primary.light' : undefined }}>
      <CardContent sx={{ p: { xs: 2.5, sm: 3 } }}>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: 1, mb: 2, flexWrap: 'wrap' }}>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            <AccountBalanceOutlinedIcon sx={{ color: 'primary.main' }} />
            <Typography variant="h6" sx={{ fontWeight: 700 }}>Thanh toán đơn hàng</Typography>
          </Box>
          <Chip label={chip.label} variant="outlined" sx={{ ...chip.sx, fontWeight: 600 }} />
        </Box>

        {payment.paymentStatus === 'PAID' && payment.orderStatus === 'CANCELLED' && (
          <Alert severity="warning" sx={{ borderRadius: 2, mb: 2 }}>
            Đơn hàng đã hủy. Luxe Glow sẽ hoàn lại {formatCurrency(payment.amount)} cho bạn và cập nhật tại đây khi đã chuyển tiền.
          </Alert>
        )}
        {payment.paymentStatus === 'PAID' && payment.orderStatus !== 'CANCELLED' && (
          <Alert icon={<CheckCircleOutlinedIcon />} severity="success" sx={{ borderRadius: 2, mb: 2 }}>
            Luxe Glow đã xác nhận nhận được thanh toán {formatCurrency(payment.amount)}
            {payment.confirmedAt ? ` lúc ${formatDate(payment.confirmedAt)}` : ''}. Cảm ơn bạn!
          </Alert>
        )}
        {payment.paymentStatus === 'REFUNDED' && (
          <Alert severity="info" sx={{ borderRadius: 2, mb: 2 }}>
            Luxe Glow đã hoàn {formatCurrency(payment.refundAmount ?? 0)}
            {payment.refundedAt ? ` lúc ${formatDate(payment.refundedAt)}` : ''}. Vui lòng kiểm tra tài khoản ngân hàng của bạn.
          </Alert>
        )}
        {!payment.payable && payment.paymentStatus === 'PENDING_PAYMENT' && (
          <Alert severity="info" sx={{ borderRadius: 2, mb: 2 }}>
            Đơn hàng đã hủy — bạn không cần thanh toán. Nếu đã chuyển khoản, vui lòng liên hệ Luxe Glow để được hoàn tiền.
          </Alert>
        )}

        {payment.payable && (
          <>
            <Typography variant="body2" sx={{ mb: 2 }}>
              Vui lòng quét mã QR bằng ứng dụng ngân hàng để thanh toán. Số tiền và nội dung chuyển khoản đã được điền sẵn.
            </Typography>

            <Box sx={{ display: 'flex', flexDirection: { xs: 'column', sm: 'row' }, gap: 3, alignItems: { xs: 'stretch', sm: 'flex-start' } }}>
              <Box sx={{ flexShrink: 0, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 1 }}>
                {qrUnavailable ? (
                  <Alert severity="warning" sx={{ borderRadius: 2, width: { xs: '100%', sm: 240 } }}>
                    {payment.qrError || 'Không hiển thị được mã QR'} — vui lòng chuyển khoản thủ công theo thông tin bên cạnh, ghi đúng nội dung chuyển khoản.
                  </Alert>
                ) : qrDataUrl ? (
                  <Box
                    component="img"
                    src={qrDataUrl}
                    alt={`Mã VietQR thanh toán ${formatCurrency(payment.amount)} cho đơn ${payment.orderCode}`}
                    sx={{ width: { xs: '100%', sm: 240 }, maxWidth: 320, aspectRatio: '1 / 1', borderRadius: 2, border: '1px solid', borderColor: 'divider', bgcolor: '#fff' }}
                  />
                ) : (
                  <Box sx={{ width: 240, height: 240, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    <CircularProgress size={28} />
                  </Box>
                )}
                <Typography variant="caption" color="text.secondary">VietQR · NAPAS 247</Typography>
              </Box>

              <Stack spacing={1.25} sx={{ flex: 1, minWidth: 0 }}>
                <Row label="Mã đơn hàng" value={payment.orderCode} mono />
                <Row label="Số tiền" value={formatCurrency(payment.amount)} strong />
                <Divider />
                <Row label="Ngân hàng" value={payment.bank.bankName} />
                <Row label="Chủ tài khoản" value={payment.bank.accountName} />
                <Row label="Số tài khoản" value={payment.bank.accountNumber} mono />
                <Row label="Nội dung chuyển khoản" value={payment.reference} mono />
              </Stack>
            </Box>

            <Box sx={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 1, mt: 2.5, '& .MuiButton-root': { whiteSpace: 'nowrap', px: 1 } }}>
              <Button size="small" variant="outlined" startIcon={<ContentCopyIcon fontSize="small" />} onClick={() => copy(payment.bank.accountNumber, 'số tài khoản')}>
                Sao chép số tài khoản
              </Button>
              <Button size="small" variant="outlined" startIcon={<ContentCopyIcon fontSize="small" />} onClick={() => copy(String(payment.amount), 'số tiền')}>
                Sao chép số tiền
              </Button>
              <Button size="small" variant="outlined" startIcon={<ContentCopyIcon fontSize="small" />} onClick={() => copy(payment.reference, 'nội dung')}>
                Sao chép nội dung
              </Button>
              <Button size="small" variant="outlined" startIcon={<DownloadIcon fontSize="small" />} onClick={downloadQr} disabled={!qrDataUrl}>
                Tải mã QR
              </Button>
            </Box>

            <Alert severity={awaiting ? 'success' : 'info'} sx={{ borderRadius: 2, mt: 2.5 }}>
              {awaiting
                ? <>{REPORTED_MESSAGE}{payment.customerReportedAt ? ` (gửi lúc ${formatDate(payment.customerReportedAt)})` : ''}</>
                : 'Đơn hàng sẽ được xác nhận sau khi Luxe Glow kiểm tra và nhận được thanh toán.'}
            </Alert>

            <Stack direction={{ xs: 'column', sm: 'row' }} spacing={1.5} sx={{ mt: 2.5 }}>
              <Button
                variant="contained" size="large" fullWidth
                onClick={() => report.mutate()}
                disabled={awaiting || report.isPending}
                sx={{ borderRadius: 980, fontWeight: 600 }}
              >
                {report.isPending ? <CircularProgress size={22} color="inherit" /> : awaiting ? 'Đã gửi yêu cầu xác nhận' : 'Tôi đã chuyển khoản'}
              </Button>
              {showOrderLink && (
                <Button component={Link} href={`/orders/${orderId}`} variant="outlined" size="large" fullWidth sx={{ borderRadius: 980, fontWeight: 600 }}>
                  Xem đơn hàng
                </Button>
              )}
            </Stack>
          </>
        )}

        {!payment.payable && (
          <Stack spacing={1}>
            <Row label="Số tiền" value={formatCurrency(payment.amount)} />
            <Row label="Nội dung chuyển khoản" value={payment.reference} mono />
            {showOrderLink && (
              <Button component={Link} href={`/orders/${orderId}`} variant="outlined" sx={{ mt: 1, borderRadius: 980, fontWeight: 600 }}>
                Xem đơn hàng
              </Button>
            )}
          </Stack>
        )}
      </CardContent>
    </Card>
  );
}

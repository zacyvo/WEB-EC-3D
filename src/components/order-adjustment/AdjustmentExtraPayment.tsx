'use client';

import { useEffect, useState } from 'react';
import QRCode from 'qrcode';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { Alert, Box, Button, CircularProgress, Divider, Skeleton, Stack, Typography } from '@mui/material';
import ContentCopyIcon from '@mui/icons-material/ContentCopy';
import toast from 'react-hot-toast';
import api from '@/lib/api';
import { formatCurrency, formatDate } from '@/lib/utils';
import type { AdjustmentPaymentInstructions, ApiResponse } from '@/types';
import { PAYMENT_ACCOUNT_SHORT_LABEL } from '@/lib/bank-transfer';

async function copyText(text: string): Promise<boolean> {
  try {
    await navigator.clipboard.writeText(text);
    return true;
  } catch {
    return false;
  }
}

function Row({ label, value, mono, strong }: { label: string; value: string; mono?: boolean; strong?: boolean }) {
  return (
    <Box sx={{ display: 'flex', justifyContent: 'space-between', gap: 2 }}>
      <Typography variant="body2" color="text.secondary">{label}</Typography>
      <Typography
        variant="body2"
        sx={{ fontWeight: strong ? 700 : 600, textAlign: 'right', ...(mono ? { fontFamily: 'monospace' } : { wordBreak: 'break-word' }), ...(strong ? { color: 'primary.main' } : {}) }}
      >
        {value}
      </Typography>
    </Box>
  );
}

/** VietQR for the extra amount of an accepted order adjustment — its own transfer description
 * (LG…T<n>), so it can't be mistaken for the original payment. Data from GET /orders/:id/adjustment/payment. */
export default function AdjustmentExtraPayment({ orderId, refreshKey }: { orderId: string; refreshKey: string }) {
  const queryClient = useQueryClient();
  const queryKey = ['order-adjustment-payment', orderId, refreshKey];
  const [qr, setQr] = useState<string | null>(null);

  const { data: p, isLoading, isError, refetch } = useQuery({
    queryKey,
    queryFn: async () => (await api.get<ApiResponse<AdjustmentPaymentInstructions>>(`/orders/${orderId}/adjustment/payment`)).data.data,
    refetchInterval: (q) => (q.state.data?.status === 'AWAITING_CONFIRMATION' ? 30_000 : false),
  });

  useEffect(() => {
    setQr(null);
    if (!p?.qrPayload) return;
    let cancelled = false;
    QRCode.toDataURL(p.qrPayload, { margin: 2, width: 600, errorCorrectionLevel: 'M' })
      .then((url) => { if (!cancelled) setQr(url); })
      .catch(() => undefined);
    return () => { cancelled = true; };
  }, [p?.qrPayload]);

  // Confirmed by the shop → the order page (paid amount) must show it too.
  useEffect(() => {
    if (p?.status === 'COMPLETED') queryClient.invalidateQueries({ queryKey: ['order', orderId] });
  }, [p?.status, orderId, queryClient]);

  const report = useMutation({
    mutationFn: async () => (await api.post<ApiResponse<AdjustmentPaymentInstructions>>(`/orders/${orderId}/adjustment/payment/report`, {})).data.data,
    onSuccess: (updated) => {
      queryClient.setQueryData(queryKey, updated);
      toast.success('Luxe Glow đã nhận được thông báo. Chúng tôi sẽ kiểm tra và xác nhận sớm.', { duration: 6000 });
    },
    onError: (err: unknown) => {
      const message = (err as { response?: { data?: { message?: string | string[] } } })?.response?.data?.message;
      toast.error((Array.isArray(message) ? message[0] : message) || 'Không gửi được, vui lòng thử lại');
      refetch();
    },
  });

  const copy = async (text: string, what: string) => {
    if (await copyText(text)) toast.success(`Đã sao chép ${what}`);
    else toast.error(`Không sao chép được — vui lòng ghi lại ${what}`);
  };

  if (isLoading) return <Skeleton variant="rounded" height={260} sx={{ borderRadius: 2 }} />;
  if (isError || !p) {
    return (
      <Alert severity="error" sx={{ borderRadius: 2 }} action={<Button color="inherit" size="small" onClick={() => refetch()}>Thử lại</Button>}>
        Không tải được thông tin chuyển khoản.
      </Alert>
    );
  }
  if (p.status === 'COMPLETED') {
    return (
      <Alert severity="success" sx={{ borderRadius: 2 }}>
        Luxe Glow đã nhận được {formatCurrency(p.amount)} thanh toán thêm{p.completedAt ? ` lúc ${formatDate(p.completedAt)}` : ''}. Cảm ơn bạn!
      </Alert>
    );
  }
  if (!p.payable) return null;
  const awaiting = p.status === 'AWAITING_CONFIRMATION';

  return (
    <Box>
      <Typography variant="body2" sx={{ mb: 2 }}>
        Quét mã QR bằng ứng dụng ngân hàng để thanh toán phần còn lại. Số tiền và nội dung chuyển khoản đã được điền sẵn.
      </Typography>
      <Box sx={{ display: 'flex', flexDirection: { xs: 'column', sm: 'row' }, gap: 3, alignItems: { xs: 'stretch', sm: 'flex-start' } }}>
        <Box sx={{ display: 'flex', justifyContent: 'center', flexShrink: 0 }}>
          {p.qrPayload ? (
            qr ? (
              <Box component="img" src={qr} alt={`Mã VietQR ${formatCurrency(p.amount)}`} sx={{ width: { xs: '100%', sm: 200 }, maxWidth: 280, aspectRatio: '1 / 1', borderRadius: 2, border: '1px solid', borderColor: 'divider', bgcolor: '#fff' }} />
            ) : (
              <Box sx={{ width: 200, height: 200, display: 'flex', alignItems: 'center', justifyContent: 'center' }}><CircularProgress size={26} /></Box>
            )
          ) : (
            <Alert severity="warning" sx={{ borderRadius: 2 }}>{p.qrError || 'Không hiển thị được mã QR'} — vui lòng chuyển khoản thủ công, ghi đúng nội dung.</Alert>
          )}
        </Box>
        <Stack spacing={1.25} sx={{ flex: 1, minWidth: 0 }}>
          <Row label="Số tiền" value={formatCurrency(p.amount)} strong />
          <Divider />
          {p.bank.accountType && <Row label="Loại tài khoản" value={PAYMENT_ACCOUNT_SHORT_LABEL[p.bank.accountType]} />}
          <Row label="Ngân hàng" value={p.bank.bankName} />
          <Row label="Chủ tài khoản" value={p.bank.accountName} />
          <Row label="Số tài khoản" value={p.bank.accountNumber} mono />
          <Row label="Nội dung chuyển khoản" value={p.reference} mono />
        </Stack>
      </Box>
      <Box sx={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 1, mt: 2, '& .MuiButton-root': { whiteSpace: 'nowrap', px: 1 } }}>
        <Button size="small" variant="outlined" startIcon={<ContentCopyIcon fontSize="small" />} onClick={() => copy(p.bank.accountNumber, 'số tài khoản')}>Sao chép STK</Button>
        <Button size="small" variant="outlined" startIcon={<ContentCopyIcon fontSize="small" />} onClick={() => copy(p.reference, 'nội dung')}>Sao chép nội dung</Button>
      </Box>
      <Button
        variant="contained" size="large" fullWidth
        onClick={() => report.mutate()}
        disabled={awaiting || report.isPending}
        sx={{ borderRadius: 980, fontWeight: 600, mt: 2 }}
      >
        {report.isPending ? <CircularProgress size={22} color="inherit" /> : awaiting ? 'Đã báo chuyển khoản — chờ xác nhận' : 'Tôi đã chuyển khoản'}
      </Button>
      {awaiting && p.customerReportedAt && (
        <Typography variant="caption" color="text.secondary" sx={{ display: 'block', textAlign: 'center', mt: 1 }}>
          Đã gửi lúc {formatDate(p.customerReportedAt)} — Luxe Glow sẽ kiểm tra tài khoản và xác nhận.
        </Typography>
      )}
    </Box>
  );
}

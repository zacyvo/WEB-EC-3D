'use client';

import { useState } from 'react';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import {
  Box, Card, CardContent, Chip, Typography, Stack, Button, TextField, Alert, Divider,
  Dialog, DialogTitle, DialogContent, DialogContentText, DialogActions, alpha,
} from '@mui/material';
import toast from 'react-hot-toast';
import api from '@/lib/api';
import { STORE } from '@/lib/store-config';
import { formatCurrency, formatDate, RETURN_REASON_LABELS, RETURN_STATUS_MAP } from '@/lib/utils';
import type { ApiResponse, Order, OrderReturnRequest, ReturnStatus } from '@/types';

/** The happy path, in order — drives the step indicator. */
const STEPS: { status: ReturnStatus; label: string }[] = [
  { status: 'REQUESTED', label: 'Gửi yêu cầu' },
  { status: 'APPROVED', label: 'Shop duyệt' },
  { status: 'SHIPPING_BACK', label: 'Gửi trả hàng' },
  { status: 'RECEIVED', label: 'Shop kiểm hàng' },
  { status: 'COMPLETED', label: 'Hoàn tất' },
];
const STEP_INDEX: Record<ReturnStatus, number> = {
  REQUESTED: 0, APPROVED: 1, SHIPPING_BACK: 2, RECEIVED: 3, REFUNDING: 3, COMPLETED: 4, REJECTED: -1, CANCELLED: -1,
};

/** What the customer should know / do now. */
function nextStepText(r: OrderReturnRequest): string {
  switch (r.status) {
    case 'REQUESTED': return 'Shop sẽ xem xét yêu cầu và phản hồi trong 1–2 ngày làm việc.';
    case 'APPROVED': return 'Vui lòng đóng gói sản phẩm (kèm đầy đủ phụ kiện, bao bì) và gửi về địa chỉ bên dưới, sau đó nhập mã vận đơn.';
    case 'SHIPPING_BACK': return 'Shop sẽ xác nhận khi nhận được hàng.';
    case 'RECEIVED': return 'Shop đã nhận hàng và đang kiểm tra tình trạng sản phẩm.';
    case 'REFUNDING': return 'Hàng trả đạt yêu cầu. Shop đang chuyển khoản hoàn tiền (3–5 ngày làm việc).';
    case 'COMPLETED': return (r.refundAmount ?? 0) + (r.returnShippingRefund ?? 0) > 0 ? 'Shop đã hoàn tiền cho bạn.' : 'Yêu cầu trả hàng đã hoàn tất.';
    case 'REJECTED': return r.rejectedAt === 'INSPECTION'
      ? 'Hàng trả không đạt điều kiện sau khi kiểm tra. Shop sẽ liên hệ để gửi lại sản phẩm cho bạn.'
      : 'Shop đã từ chối yêu cầu trả hàng.';
    case 'CANCELLED': return 'Bạn đã hủy yêu cầu trả hàng.';
  }
}

export default function ReturnRequestCard({ order }: { order: Order }) {
  const r = order.returnRequest!;
  const queryClient = useQueryClient();
  const [carrierName, setCarrierName] = useState(r.shipment?.carrierName ?? '');
  const [trackingCode, setTrackingCode] = useState(r.shipment?.trackingCode ?? '');
  const [editingShipment, setEditingShipment] = useState(false);
  const [confirmCancel, setConfirmCancel] = useState(false);

  const onError = (err: unknown) => {
    const message = (err as { response?: { data?: { message?: string | string[] } } })?.response?.data?.message;
    toast.error((Array.isArray(message) ? message[0] : message) || 'Không thể thực hiện, vui lòng thử lại');
    queryClient.invalidateQueries({ queryKey: ['order', order._id] });
  };
  const onUpdated = (updated: Order) => {
    queryClient.setQueryData(['order', order._id], updated);
    queryClient.invalidateQueries({ queryKey: ['orders'] });
  };

  const shipMutation = useMutation({
    mutationFn: async () => (await api.post<ApiResponse<Order>>(`/orders/${order._id}/return/shipment`, {
      trackingCode: trackingCode.trim(),
      ...(carrierName.trim() ? { carrierName: carrierName.trim() } : {}),
    })).data.data,
    onSuccess: (updated) => { onUpdated(updated); setEditingShipment(false); toast.success('Đã lưu mã vận đơn'); },
    onError,
  });
  const cancelMutation = useMutation({
    mutationFn: async () => (await api.post<ApiResponse<Order>>(`/orders/${order._id}/return/cancel`)).data.data,
    onSuccess: (updated) => { onUpdated(updated); setConfirmCancel(false); toast.success('Đã hủy yêu cầu trả hàng'); },
    onError,
  });

  const statusInfo = RETURN_STATUS_MAP[r.status];
  const stepIndex = STEP_INDEX[r.status];
  const canShip = r.status === 'APPROVED' || (r.status === 'SHIPPING_BACK' && editingShipment);
  const canCancel = r.status === 'REQUESTED' || r.status === 'APPROVED';
  const totalRefund = (r.refundAmount ?? 0) + (r.returnShippingRefund ?? 0);

  return (
    <Card variant="outlined" sx={{ borderRadius: 3, mb: 2, borderColor: 'primary.light' }}>
      <CardContent sx={{ p: 3 }}>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2, gap: 1 }}>
          <Typography variant="h6" sx={{ fontWeight: 700 }}>Trả hàng/Hoàn tiền</Typography>
          <Chip label={statusInfo?.label ?? r.status} size="small" variant="outlined" sx={statusInfo?.chipSx} />
        </Box>

        {stepIndex >= 0 && (
          <Box sx={{ display: 'flex', mb: 2.5 }}>
            {STEPS.map((s, i) => (
              <Box key={s.status} sx={{ flex: 1, textAlign: 'center' }}>
                <Box sx={{ height: 4, borderRadius: 2, mx: 0.25, bgcolor: i <= stepIndex ? 'primary.main' : 'grey.200' }} />
                <Typography variant="caption" sx={{ display: 'block', mt: 0.5, lineHeight: 1.2, color: i <= stepIndex ? 'text.primary' : 'text.disabled', fontWeight: i === stepIndex ? 700 : 400 }}>
                  {s.label}
                </Typography>
              </Box>
            ))}
          </Box>
        )}

        <Alert severity={r.status === 'REJECTED' ? 'error' : r.status === 'COMPLETED' ? 'success' : 'info'} sx={{ mb: 2, borderRadius: 2 }}>
          {nextStepText(r)}
          {r.rejectReason && <><br />Lý do: {r.rejectReason}</>}
        </Alert>

        {r.shopNote && (
          <Box sx={{ p: 2, mb: 2, bgcolor: (t) => alpha(t.palette.info.main, 0.06), borderRadius: 2, border: '1px solid', borderColor: 'info.light' }}>
            <Typography variant="caption" color="info.main" sx={{ fontWeight: 600 }}>Lời nhắn từ shop</Typography>
            <Typography variant="body2" sx={{ mt: 0.5, whiteSpace: 'pre-wrap' }}>{r.shopNote}</Typography>
          </Box>
        )}

        {(r.status === 'APPROVED' || r.status === 'SHIPPING_BACK') && (
          <Box sx={{ p: 2, mb: 2, bgcolor: 'grey.50', borderRadius: 2, border: '1px solid', borderColor: 'divider' }}>
            <Typography variant="caption" color="text.secondary" sx={{ fontWeight: 600 }}>Địa chỉ nhận hàng trả</Typography>
            <Typography variant="body2" sx={{ mt: 0.5 }}>{STORE.name} — {STORE.phone}</Typography>
            <Typography variant="body2" color="text.secondary">{STORE.address}</Typography>
            <Typography variant="caption" color="text.secondary" sx={{ display: 'block', mt: 0.5 }}>Ghi mã đơn #{order._id.slice(-8).toUpperCase()} trên kiện hàng.</Typography>
          </Box>
        )}

        {r.shipment && !canShip && (
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
            <Typography variant="body2" color="text.secondary">Mã vận đơn gửi trả</Typography>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
              <Typography variant="body2" sx={{ fontWeight: 700, fontFamily: 'monospace' }}>
                {r.shipment.trackingCode}{r.shipment.carrierName ? ` (${r.shipment.carrierName})` : ''}
              </Typography>
              {r.status === 'SHIPPING_BACK' && <Button size="small" onClick={() => setEditingShipment(true)}>Sửa</Button>}
            </Box>
          </Box>
        )}

        {canShip && (
          <Stack spacing={1.5} sx={{ mb: 2 }}>
            <Stack direction={{ xs: 'column', sm: 'row' }} spacing={1.5}>
              <TextField size="small" label="Đơn vị vận chuyển" placeholder="VD: GHN, GHTK, SPX" value={carrierName} onChange={(e) => setCarrierName(e.target.value)} sx={{ flex: 1 }} />
              <TextField size="small" label="Mã vận đơn" value={trackingCode} onChange={(e) => setTrackingCode(e.target.value)} required sx={{ flex: 1 }} />
            </Stack>
            <Button variant="contained" onClick={() => shipMutation.mutate()} disabled={trackingCode.trim().length < 4 || shipMutation.isPending} sx={{ borderRadius: 980, fontWeight: 600 }}>
              {shipMutation.isPending ? 'Đang lưu...' : 'Tôi đã gửi hàng'}
            </Button>
          </Stack>
        )}

        <Divider sx={{ my: 2 }} />

        <Stack spacing={1}>
          {r.items.map((i) => (
            <Box key={i.itemIndex} sx={{ display: 'flex', justifyContent: 'space-between', gap: 2 }}>
              <Typography variant="body2" sx={{ flex: 1 }}>
                {i.productName}{(i.color || i.size) ? ` (${[i.color, i.size].filter(Boolean).join(', ')})` : ''}
              </Typography>
              <Typography variant="body2" color="text.secondary">x{i.quantity}</Typography>
            </Box>
          ))}
          <Typography variant="body2" color="text.secondary">Lý do: {RETURN_REASON_LABELS[r.reason] ?? r.reason}</Typography>
          <Typography variant="body2" color="text.secondary" sx={{ whiteSpace: 'pre-wrap' }}>{r.description}</Typography>
          {r.images.length > 0 && (
            <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap' }}>
              {r.images.map((url) => (
                <Box key={url} component="a" href={url} target="_blank" rel="noopener noreferrer" sx={{ width: 56, height: 56, borderRadius: 1.5, overflow: 'hidden', border: '1px solid', borderColor: 'divider' }}>
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img src={url} alt="" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                </Box>
              ))}
            </Box>
          )}
        </Stack>

        <Divider sx={{ my: 2 }} />

        <Stack spacing={0.75}>
          {r.status === 'REFUNDING' || r.status === 'COMPLETED' ? (
            <>
              <Row label="Hoàn tiền hàng" value={formatCurrency(r.refundAmount ?? 0)} />
              {(r.returnShippingRefund ?? 0) > 0 && <Row label="Hoàn phí gửi trả" value={formatCurrency(r.returnShippingRefund!)} />}
              <Row label="Tổng hoàn" value={formatCurrency(totalRefund)} strong />
              {r.refundAccount && totalRefund > 0 && <Row label="Chuyển về" value={`${r.refundAccount.bankName} · ${r.refundAccount.accountNumber}`} />}
              {r.refundedAt && <Row label="Đã hoàn lúc" value={formatDate(r.refundedAt)} />}
            </>
          ) : r.status !== 'REJECTED' && r.status !== 'CANCELLED' ? (
            <>
              <Row label="Hoàn tiền dự kiến" value={formatCurrency(r.estimatedRefund)} strong />
              {r.refundAccount && <Row label="Tài khoản nhận" value={`${r.refundAccount.bankName} · ${r.refundAccount.accountNumber}`} />}
            </>
          ) : null}
          <Row label="Gửi yêu cầu lúc" value={formatDate(r.requestedAt)} />
        </Stack>

        {canCancel && (
          <Button fullWidth variant="text" color="error" onClick={() => setConfirmCancel(true)} sx={{ mt: 2 }}>
            Hủy yêu cầu trả hàng
          </Button>
        )}
      </CardContent>

      <Dialog open={confirmCancel} onClose={() => !cancelMutation.isPending && setConfirmCancel(false)} fullWidth maxWidth="xs" slotProps={{ paper: { sx: { borderRadius: 3 } } }}>
        <DialogTitle sx={{ fontWeight: 700 }}>Hủy yêu cầu trả hàng?</DialogTitle>
        <DialogContent>
          <DialogContentText>Sau khi hủy, bạn sẽ không thể gửi lại yêu cầu trả hàng cho đơn này.</DialogContentText>
        </DialogContent>
        <DialogActions sx={{ px: 3, pb: 2.5 }}>
          <Button onClick={() => setConfirmCancel(false)} disabled={cancelMutation.isPending}>Quay lại</Button>
          <Button variant="contained" color="error" onClick={() => cancelMutation.mutate()} disabled={cancelMutation.isPending}>
            {cancelMutation.isPending ? 'Đang hủy...' : 'Hủy yêu cầu'}
          </Button>
        </DialogActions>
      </Dialog>
    </Card>
  );
}

function Row({ label, value, strong }: { label: string; value: string; strong?: boolean }) {
  return (
    <Box sx={{ display: 'flex', justifyContent: 'space-between', gap: 2 }}>
      <Typography variant="body2" color="text.secondary">{label}</Typography>
      <Typography variant="body2" sx={{ fontWeight: strong ? 700 : 500, textAlign: 'right', color: strong ? 'primary.main' : undefined }}>{value}</Typography>
    </Box>
  );
}

'use client';

import { useState } from 'react';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import {
  Alert, Box, Button, Card, CardContent, Chip, Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle,
  Divider, FormControlLabel, Radio, RadioGroup, Stack, TextField, Typography,
} from '@mui/material';
import EditNoteOutlinedIcon from '@mui/icons-material/EditNoteOutlined';
import ArrowForwardIcon from '@mui/icons-material/ArrowForward';
import toast from 'react-hot-toast';
import api from '@/lib/api';
import { formatCurrency, formatDate } from '@/lib/utils';
import type { ApiResponse, Order, OrderAdjustment, OrderAdjustmentSnapshot } from '@/types';
import { useBankTransferAvailability } from '@/lib/bank-transfer';
import AdjustmentExtraPayment from './AdjustmentExtraPayment';

function errMsg(err: unknown, fallback: string): string {
  const message = (err as { response?: { data?: { message?: string | string[] } } })?.response?.data?.message;
  return (Array.isArray(message) ? message[0] : message) || fallback;
}

const shippingLine = (s: OrderAdjustmentSnapshot) =>
  [s.shippingInfo.recipientName, s.shippingInfo.phone, [s.shippingInfo.street, s.shippingInfo.ward, s.shippingInfo.city].filter(Boolean).join(', ')].join(' · ');

function Snapshot({ title, s, highlight }: { title: string; s: OrderAdjustmentSnapshot; highlight?: boolean }) {
  return (
    <Box sx={{ flex: 1, minWidth: 0, p: 1.5, borderRadius: 2, border: '1px solid', borderColor: highlight ? 'warning.light' : 'divider', bgcolor: highlight ? 'background.paper' : 'action.hover', opacity: highlight ? 1 : 0.8 }}>
      <Typography variant="caption" sx={{ fontWeight: 700, textTransform: 'uppercase', letterSpacing: 0.5 }}>{title}</Typography>
      <Stack spacing={0.5} sx={{ mt: 0.5 }}>
        {s.items.map((i, k) => (
          <Box key={k} sx={{ display: 'flex', justifyContent: 'space-between', gap: 1 }}>
            <Typography variant="body2" sx={{ minWidth: 0, overflow: 'hidden', textOverflow: 'ellipsis' }}>
              {i.productName}{i.color || i.size ? ` (${[i.color, i.size].filter(Boolean).join(' · ')})` : ''} × {i.quantity}
            </Typography>
            <Typography variant="body2" sx={{ flexShrink: 0 }}>{formatCurrency(i.subtotal)}</Typography>
          </Box>
        ))}
        {s.discountAmount > 0 && (
          <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
            <Typography variant="body2" color="text.secondary">Giảm giá</Typography>
            <Typography variant="body2" color="success.main">-{formatCurrency(s.discountAmount)}</Typography>
          </Box>
        )}
        <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
          <Typography variant="body2" color="text.secondary">Phí vận chuyển</Typography>
          <Typography variant="body2">{formatCurrency(s.shippingFee)}</Typography>
        </Box>
        <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
          <Typography variant="body2" sx={{ fontWeight: 700 }}>Tổng tiền</Typography>
          <Typography variant="body2" sx={{ fontWeight: 700 }}>{formatCurrency(s.total)}</Typography>
        </Box>
        <Typography variant="caption" color="text.secondary">{shippingLine(s)}</Typography>
      </Stack>
    </Box>
  );
}

function balanceText(a: OrderAdjustment): string | null {
  if (a.paidAmountAtProposal <= 0) return null;
  if (a.balance < 0) return `Bạn đã thanh toán ${formatCurrency(a.paidAmountAtProposal)} — Luxe Glow sẽ hoàn lại ${formatCurrency(-a.balance)} cho bạn.`;
  if (a.balance > 0) return `Bạn đã thanh toán ${formatCurrency(a.paidAmountAtProposal)} — bạn cần thanh toán thêm ${formatCurrency(a.balance)} (COD hoặc chuyển khoản).`;
  return `Bạn đã thanh toán ${formatCurrency(a.paidAmountAtProposal)} — không phát sinh chênh lệch.`;
}

const EMPTY_ACCOUNT = { bankName: '', accountNumber: '', accountHolder: '' };

/** Order page: the shop's proposed change of the order — the customer agrees (giving a refund
 * account, or choosing how to pay the rest) or declines; afterwards, how the difference is settled. */
export default function OrderAdjustmentCard({ order }: { order: Order }) {
  const queryClient = useQueryClient();
  const a = order.adjustment;
  const [accepting, setAccepting] = useState(false);
  const [rejecting, setRejecting] = useState(false);
  const [account, setAccount] = useState(EMPTY_ACCOUNT);
  const [method, setMethod] = useState<'COD' | 'BANK_TRANSFER' | ''>('');
  const [rejectReason, setRejectReason] = useState('');

  const isOpen = a?.status === 'PROPOSED' && order.status !== 'CANCELLED';
  const { data: bankAvailability } = useBankTransferAvailability(isOpen && (a?.balance ?? 0) > 0);
  const bankAvailable = bankAvailability?.enabled;

  const onDone = (updated: Order, message: string) => {
    queryClient.setQueryData(['order', order._id], updated);
    queryClient.invalidateQueries({ queryKey: ['orders'] });
    queryClient.invalidateQueries({ queryKey: ['order-payment', order._id] });
    toast.success(message, { duration: 5000 });
  };
  const onFail = (err: unknown, fallback: string) => {
    toast.error(errMsg(err, fallback));
    queryClient.invalidateQueries({ queryKey: ['order', order._id] });
  };

  const accept = useMutation({
    mutationFn: async () =>
      (await api.post<ApiResponse<Order>>(`/orders/${order._id}/adjustment/accept`, {
        number: a!.number,
        ...(a!.balance < 0 ? { refundAccount: { bankName: account.bankName.trim(), accountNumber: account.accountNumber.trim(), accountHolder: account.accountHolder.trim() } } : {}),
        ...(a!.balance > 0 ? { extraPaymentMethod: method } : {}),
      })).data.data,
    onSuccess: (u) => { onDone(u, 'Đã đồng ý điều chỉnh — đơn hàng đã được cập nhật'); setAccepting(false); },
    onError: (err) => onFail(err, 'Không thể xác nhận, vui lòng thử lại'),
  });

  const reject = useMutation({
    mutationFn: async () =>
      (await api.post<ApiResponse<Order>>(`/orders/${order._id}/adjustment/reject`, {
        number: a!.number,
        ...(rejectReason.trim() ? { reason: rejectReason.trim() } : {}),
      })).data.data,
    onSuccess: (u) => { onDone(u, 'Đã từ chối điều chỉnh — Luxe Glow sẽ liên hệ với bạn'); setRejecting(false); },
    onError: (err) => onFail(err, 'Không thể gửi, vui lòng thử lại'),
  });

  if (!a || a.status === 'WITHDRAWN' || (a.status === 'PROPOSED' && order.status === 'CANCELLED')) return null;

  const accountValid = !!(account.bankName.trim() && /^[0-9A-Za-z]{4,19}$/.test(account.accountNumber.trim()) && account.accountHolder.trim());
  const acceptValid = a.balance < 0 ? accountValid : a.balance > 0 ? !!method : true;
  const st = a.settlement;

  return (
    <Card variant="outlined" sx={{ borderRadius: 3, mb: 2, borderColor: isOpen ? 'warning.main' : undefined }}>
      <CardContent sx={{ p: { xs: 2.5, sm: 3 } }}>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: 1, mb: 1.5, flexWrap: 'wrap' }}>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            <EditNoteOutlinedIcon sx={{ color: 'warning.main' }} />
            <Typography variant="h6" sx={{ fontWeight: 700 }}>Điều chỉnh đơn hàng</Typography>
          </Box>
          <Chip
            size="small"
            variant="outlined"
            label={a.status === 'PROPOSED' ? 'Chờ bạn xác nhận' : a.status === 'ACCEPTED' ? 'Bạn đã đồng ý' : 'Bạn đã từ chối'}
            color={a.status === 'PROPOSED' ? 'warning' : a.status === 'ACCEPTED' ? 'success' : 'default'}
            sx={{ fontWeight: 600 }}
          />
        </Box>

        {a.status === 'PROPOSED' && (
          <>
            <Typography variant="body2" sx={{ mb: 1 }}>Luxe Glow đề xuất điều chỉnh đơn hàng của bạn ({formatDate(a.proposedAt)}):</Typography>
            <Alert severity="info" icon={false} sx={{ borderRadius: 2, mb: 2, whiteSpace: 'pre-wrap' }}>{a.reason}</Alert>
            <Box sx={{ display: 'flex', flexDirection: { xs: 'column', sm: 'row' }, gap: 1.5, alignItems: 'center', mb: 2 }}>
              <Snapshot title="Hiện tại" s={a.before} />
              <ArrowForwardIcon sx={{ color: 'text.disabled', transform: { xs: 'rotate(90deg)', sm: 'none' } }} />
              <Snapshot title="Sau điều chỉnh" s={a.after} highlight />
            </Box>
            {balanceText(a) && <Alert severity={a.balance < 0 ? 'success' : a.balance > 0 ? 'warning' : 'info'} sx={{ borderRadius: 2, mb: 2 }}>{balanceText(a)}</Alert>}
            <Typography variant="caption" color="text.secondary" sx={{ display: 'block', mb: 2 }}>
              Đơn hàng chỉ thay đổi khi bạn đồng ý. Nếu từ chối, đơn giữ nguyên và Luxe Glow sẽ liên hệ với bạn.
            </Typography>
            <Stack direction={{ xs: 'column', sm: 'row' }} spacing={1.5}>
              <Button variant="contained" size="large" fullWidth onClick={() => { setAccount(EMPTY_ACCOUNT); setMethod(''); setAccepting(true); }} sx={{ borderRadius: 980, fontWeight: 600 }}>
                Đồng ý điều chỉnh
              </Button>
              <Button variant="outlined" color="inherit" size="large" fullWidth onClick={() => { setRejectReason(''); setRejecting(true); }} sx={{ borderRadius: 980, fontWeight: 600 }}>
                Từ chối
              </Button>
            </Stack>
          </>
        )}

        {a.status === 'REJECTED' && (
          <Typography variant="body2" color="text.secondary">
            Bạn đã từ chối đề xuất điều chỉnh lúc {a.respondedAt ? formatDate(a.respondedAt) : ''}. Đơn hàng giữ nguyên — Luxe Glow sẽ liên hệ với bạn.
          </Typography>
        )}

        {a.status === 'ACCEPTED' && (
          <Stack spacing={1.5}>
            <Typography variant="body2" color="text.secondary">
              Bạn đã đồng ý điều chỉnh lúc {a.respondedAt ? formatDate(a.respondedAt) : ''}: tổng tiền {formatCurrency(a.before.total)} → <b>{formatCurrency(a.after.total)}</b>.
            </Typography>
            {st?.type === 'REFUND' && (
              <Alert severity={st.status === 'COMPLETED' ? 'success' : 'info'} sx={{ borderRadius: 2 }}>
                {st.status === 'COMPLETED'
                  ? `Luxe Glow đã hoàn ${formatCurrency(st.amount)}${st.completedAt ? ` lúc ${formatDate(st.completedAt)}` : ''}. Vui lòng kiểm tra tài khoản ngân hàng của bạn.`
                  : `Luxe Glow sẽ hoàn ${formatCurrency(st.amount)} về tài khoản ${st.refundAccount?.bankName ?? ''} ${st.refundAccount?.accountNumber ?? ''} (${st.refundAccount?.accountHolder ?? ''}) và cập nhật tại đây khi đã chuyển.`}
              </Alert>
            )}
            {st?.type === 'EXTRA_PAYMENT' && st.method === 'COD' && (
              <Alert severity={st.status === 'COMPLETED' ? 'success' : 'warning'} sx={{ borderRadius: 2 }}>
                {st.status === 'COMPLETED'
                  ? `Đã thanh toán thêm ${formatCurrency(st.amount)} khi nhận hàng.`
                  : `Bạn thanh toán thêm ${formatCurrency(st.amount)} cho shipper khi nhận hàng (COD).`}
              </Alert>
            )}
            {st?.type === 'EXTRA_PAYMENT' && st.method === 'BANK_TRANSFER' && (
              <>
                <Divider />
                <Typography variant="subtitle2" sx={{ fontWeight: 700 }}>Thanh toán thêm {formatCurrency(st.amount)} bằng chuyển khoản</Typography>
                <AdjustmentExtraPayment orderId={order._id} refreshKey={`${a.number}:${st.status}`} />
              </>
            )}
          </Stack>
        )}
      </CardContent>

      <Dialog open={accepting} onClose={() => { if (!accept.isPending) setAccepting(false); }} fullWidth maxWidth="xs" slotProps={{ paper: { sx: { borderRadius: 3 } } }}>
        <DialogTitle sx={{ fontWeight: 700 }}>Đồng ý điều chỉnh đơn hàng?</DialogTitle>
        <DialogContent>
          <DialogContentText sx={{ mb: 2 }}>
            Đơn hàng sẽ được cập nhật theo đề xuất, tổng tiền mới là <b>{formatCurrency(a.after.total)}</b>.
          </DialogContentText>
          {a.balance < 0 && (
            <Stack spacing={1.5}>
              <Typography variant="body2" sx={{ fontWeight: 600 }}>Tài khoản nhận lại {formatCurrency(-a.balance)}</Typography>
              <TextField label="Ngân hàng" value={account.bankName} onChange={(e) => setAccount({ ...account, bankName: e.target.value.slice(0, 100) })} size="small" fullWidth placeholder="VD: Vietcombank" />
              <TextField
                label="Số tài khoản" value={account.accountNumber} size="small" fullWidth
                onChange={(e) => setAccount({ ...account, accountNumber: e.target.value.replace(/\s/g, '').slice(0, 19) })}
                error={!!account.accountNumber && !/^[0-9A-Za-z]{4,19}$/.test(account.accountNumber)}
              />
              <TextField label="Chủ tài khoản" value={account.accountHolder} onChange={(e) => setAccount({ ...account, accountHolder: e.target.value.toUpperCase().slice(0, 100) })} size="small" fullWidth />
            </Stack>
          )}
          {a.balance > 0 && (
            <>
              <Typography variant="body2" sx={{ fontWeight: 600 }}>Thanh toán phần còn lại {formatCurrency(a.balance)}</Typography>
              <RadioGroup value={method} onChange={(e) => setMethod(e.target.value as 'COD' | 'BANK_TRANSFER')}>
                <FormControlLabel value="COD" control={<Radio size="small" />} label="Thanh toán khi nhận hàng (COD)" />
                <FormControlLabel
                  value="BANK_TRANSFER"
                  control={<Radio size="small" />}
                  disabled={bankAvailable === false}
                  label={bankAvailable === false ? 'Chuyển khoản (tạm thời không khả dụng)' : 'Chuyển khoản ngân hàng (VietQR)'}
                />
              </RadioGroup>
            </>
          )}
        </DialogContent>
        <DialogActions sx={{ px: 3, pb: 2.5 }}>
          <Button onClick={() => setAccepting(false)} disabled={accept.isPending}>Quay lại</Button>
          <Button variant="contained" onClick={() => accept.mutate()} disabled={!acceptValid || accept.isPending}>
            {accept.isPending ? 'Đang gửi...' : 'Xác nhận đồng ý'}
          </Button>
        </DialogActions>
      </Dialog>

      <Dialog open={rejecting} onClose={() => { if (!reject.isPending) setRejecting(false); }} fullWidth maxWidth="xs" slotProps={{ paper: { sx: { borderRadius: 3 } } }}>
        <DialogTitle sx={{ fontWeight: 700 }}>Từ chối điều chỉnh?</DialogTitle>
        <DialogContent>
          <DialogContentText sx={{ mb: 2 }}>Đơn hàng sẽ giữ nguyên như hiện tại. Luxe Glow sẽ liên hệ với bạn để thống nhất.</DialogContentText>
          <TextField
            label="Lý do (không bắt buộc)" value={rejectReason} onChange={(e) => setRejectReason(e.target.value.slice(0, 500))}
            multiline minRows={2} fullWidth helperText={`${rejectReason.length}/500`}
          />
        </DialogContent>
        <DialogActions sx={{ px: 3, pb: 2.5 }}>
          <Button onClick={() => setRejecting(false)} disabled={reject.isPending}>Quay lại</Button>
          <Button variant="contained" color="error" onClick={() => reject.mutate()} disabled={reject.isPending}>
            {reject.isPending ? 'Đang gửi...' : 'Từ chối'}
          </Button>
        </DialogActions>
      </Dialog>
    </Card>
  );
}

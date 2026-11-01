'use client';

import { useState } from 'react';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import {
  Box, Button, Card, CardContent, Chip, Dialog, DialogActions, DialogContent, DialogTitle, Stack, Typography,
} from '@mui/material';
import ReceiptLongOutlinedIcon from '@mui/icons-material/ReceiptLongOutlined';
import toast from 'react-hot-toast';
import api from '@/lib/api';
import { formatCurrency, formatDate } from '@/lib/utils';
import {
  EINVOICE_REQUESTABLE_STATUSES, EINVOICE_STATUS_MAP, EMPTY_EINVOICE_REQUEST,
  toEInvoiceRequestPayload, validateEInvoiceRequest, type EInvoiceRequestErrors,
} from '@/lib/einvoice-request';
import type { ApiResponse, EInvoiceRequestInput, Order } from '@/types';
import EInvoiceRequestFields from './EInvoiceRequestFields';

/** What the customer should know about their request now. */
function statusText(order: Order): string {
  const r = order.einvoiceRequest!;
  switch (r.status) {
    case 'PENDING': return 'Shop đã nhận yêu cầu và sẽ liên hệ nếu cần bổ sung thông tin.';
    case 'APPROVED': return `Sau khi thanh toán, hoá đơn điện tử sẽ được gửi tới email ${r.email}.`;
    case 'REJECTED': return (order.vatAmount ?? 0) > 0
      ? 'Shop đã từ chối yêu cầu — khoản VAT đã được trừ khỏi đơn hàng.'
      : 'Shop đã từ chối yêu cầu xuất hoá đơn.';
    case 'ISSUED': return r.emailSentAt
      ? `Hoá đơn đã được gửi tới email ${r.email} (kèm khoá mở hoá đơn).`
      : `Hoá đơn đã được phát hành. Shop sẽ gửi hoá đơn và khoá mở hoá đơn tới email ${r.email}.`;
  }
}

/** Order page: shows the e-invoice request, or lets the customer send one (any order that isn't cancelled). */
export default function EInvoiceRequestCard({ order }: { order: Order }) {
  const queryClient = useQueryClient();
  const [open, setOpen] = useState(false);
  const [form, setForm] = useState<EInvoiceRequestInput>({ ...EMPTY_EINVOICE_REQUEST, buyerName: order.shippingInfo.recipientName });
  const [errors, setErrors] = useState<EInvoiceRequestErrors>({});
  const [submitted, setSubmitted] = useState(false);

  const mutation = useMutation({
    mutationFn: async () =>
      (await api.post<ApiResponse<Order>>(`/orders/${order._id}/einvoice-request`, toEInvoiceRequestPayload(form))).data.data,
    onSuccess: (updated) => {
      queryClient.setQueryData(['order', order._id], updated);
      queryClient.invalidateQueries({ queryKey: ['orders'] });
      toast.success('Đã gửi yêu cầu xuất hoá đơn. Shop sẽ xác nhận sớm.');
      setOpen(false);
    },
    onError: (err: unknown) => {
      const message = (err as { response?: { data?: { message?: string | string[] } } })?.response?.data?.message;
      toast.error((Array.isArray(message) ? message[0] : message) || 'Không thể gửi yêu cầu, vui lòng thử lại');
      queryClient.invalidateQueries({ queryKey: ['order', order._id] });
    },
  });

  const r = order.einvoiceRequest;
  const canRequest = !r && !order.externalRef && EINVOICE_REQUESTABLE_STATUSES.includes(order.status);
  if (!r && !canRequest) return null;

  const onFormChange = (v: EInvoiceRequestInput) => {
    setForm(v);
    if (submitted) setErrors(validateEInvoiceRequest(v));
  };
  const submit = () => {
    setSubmitted(true);
    const found = validateEInvoiceRequest(form);
    setErrors(found);
    if (Object.keys(found).length === 0) mutation.mutate();
  };
  const close = () => { if (!mutation.isPending) setOpen(false); };

  if (!r) {
    return (
      <>
        <Box sx={{ mb: 2 }}>
          <Button
            fullWidth variant="outlined" size="large" startIcon={<ReceiptLongOutlinedIcon />}
            onClick={() => setOpen(true)} sx={{ borderRadius: 980, fontWeight: 600 }}
          >
            Yêu cầu xuất hoá đơn điện tử (VAT)
          </Button>
          <Typography variant="caption" color="text.secondary" sx={{ display: 'block', textAlign: 'center', mt: 1 }}>
            Hoá đơn được gửi tới email sau khi đơn hàng được thanh toán
          </Typography>
        </Box>

        <Dialog open={open} onClose={close} fullWidth maxWidth="sm" slotProps={{ paper: { sx: { borderRadius: 3 } } }}>
          <DialogTitle sx={{ fontWeight: 700 }}>Yêu cầu xuất hoá đơn điện tử</DialogTitle>
          <DialogContent>
            <Box sx={{ pt: 1 }}>
              <EInvoiceRequestFields value={form} onChange={onFormChange} errors={errors} />
            </Box>
            <Stack spacing={0.75} sx={{ mt: 2.5, p: 2, bgcolor: 'grey.50', borderRadius: 2 }}>
              <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                <Typography variant="body2" sx={{ fontWeight: 700 }}>Tổng thanh toán</Typography>
                <Typography variant="body2" color="primary.main" sx={{ fontWeight: 700 }}>{formatCurrency(order.total)}</Typography>
              </Box>
            </Stack>
          </DialogContent>
          <DialogActions sx={{ px: 3, pb: 2.5 }}>
            <Button onClick={close} disabled={mutation.isPending}>Quay lại</Button>
            <Button variant="contained" onClick={submit} disabled={mutation.isPending}>
              {mutation.isPending ? 'Đang gửi...' : 'Gửi yêu cầu'}
            </Button>
          </DialogActions>
        </Dialog>
      </>
    );
  }

  const status = EINVOICE_STATUS_MAP[r.status];
  return (
    <Card variant="outlined" sx={{ borderRadius: 3, mb: 2 }}>
      <CardContent sx={{ p: 3 }}>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 1.5, gap: 1 }}>
          <Typography variant="h6" sx={{ fontWeight: 700 }}>Hoá đơn điện tử (VAT)</Typography>
          <Chip label={status.label} color={status.color} size="small" variant="outlined" />
        </Box>
        <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>{statusText(order)}</Typography>
        {r.status === 'REJECTED' && r.rejectReason && (
          <Typography variant="body2" color="error.main" sx={{ mb: 2 }}>Lý do: {r.rejectReason}</Typography>
        )}
        <Stack spacing={0.5}>
          <Typography variant="body2" sx={{ fontWeight: 600 }}>
            {r.buyerType === 'COMPANY' ? r.companyName : r.buyerName}
          </Typography>
          {r.taxCode && <Typography variant="body2" color="text.secondary">MST: {r.taxCode}</Typography>}
          {r.buyerType === 'COMPANY' && <Typography variant="body2" color="text.secondary">Người mua: {r.buyerName}</Typography>}
          <Typography variant="body2" color="text.secondary">{r.address}</Typography>
          <Typography variant="body2" color="text.secondary">Email: {r.email}</Typography>
          <Typography variant="caption" color="text.disabled">Yêu cầu lúc {formatDate(r.requestedAt)}</Typography>
        </Stack>
        {r.status === 'ISSUED' && r.invoiceUrl && (
          <Button
            component="a" href={r.invoiceUrl} target="_blank" rel="noopener noreferrer"
            variant="contained" fullWidth sx={{ mt: 2, borderRadius: 980, fontWeight: 600 }}
          >
            Xem hoá đơn
          </Button>
        )}
      </CardContent>
    </Card>
  );
}

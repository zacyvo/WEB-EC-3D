'use client';

import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { useAuthStore } from '@/lib/store/auth.store';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import {
  Box, Container, Typography, Card, CardContent, Chip, Skeleton,
  Divider, Stack, Button, Alert, Dialog, DialogTitle, DialogContent,
  DialogContentText, DialogActions, TextField,
} from '@mui/material';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import toast from 'react-hot-toast';
import api from '@/lib/api';
import { formatCurrency, formatDate, ORDER_STATUS_MAP } from '@/lib/utils';
import { loginHref } from '@/lib/auth-redirect';
import type { ApiResponse, Order, OrderStatus } from '@/types';

/** Customer may cancel by themselves only while the order awaits confirmation. */
const SELF_CANCEL_STATUSES: OrderStatus[] = ['PENDING'];
/** While the order is being processed the customer can only ask the shop to cancel (owner is
 * notified). Any other status can't be cancelled from the storefront. */
const REQUEST_CANCEL_STATUSES: OrderStatus[] = ['PROCESSING'];
/** Statuses in which an already-sent request is still open (older requests were allowed on CONFIRMED). */
const OPEN_REQUEST_STATUSES: OrderStatus[] = ['CONFIRMED', 'PROCESSING'];
const REASON_MAX_LENGTH = 500;

type CancelMode = 'cancel' | 'request';

const CANCEL_COPY: Record<CancelMode, { title: string; description: string; confirm: string; success: string }> = {
  cancel: {
    title: 'Hủy đơn hàng?',
    description: 'Đơn hàng đang chờ xác nhận nên sẽ được hủy ngay và không thể khôi phục.',
    confirm: 'Hủy đơn hàng',
    success: 'Đã hủy đơn hàng',
  },
  request: {
    title: 'Gửi yêu cầu hủy đơn?',
    description: 'Đơn hàng đang được xử lý nên không thể hủy trực tiếp. Yêu cầu của bạn sẽ được gửi tới shop để xem xét và liên hệ lại.',
    confirm: 'Gửi yêu cầu',
    success: 'Đã gửi yêu cầu hủy đơn. Shop sẽ liên hệ với bạn sớm.',
  },
};

export default function OrderDetailPage({ params }: { params: { id: string } }) {
  const { isAuthenticated } = useAuthStore();
  const router = useRouter();
  const [mounted, setMounted] = useState(false);

  useEffect(() => { setMounted(true); }, []);

  useEffect(() => {
    if (!mounted) return;
    if (!isAuthenticated) router.replace(loginHref(`/orders/${params.id}`));
  }, [mounted, isAuthenticated, router, params.id]);

  const { data: order, isLoading } = useQuery({
    queryKey: ['order', params.id],
    queryFn: async () => {
      const res = await api.get<ApiResponse<Order>>(`/orders/${params.id}`);
      return res.data.data;
    },
    enabled: isAuthenticated,
  });

  const queryClient = useQueryClient();
  const [cancelMode, setCancelMode] = useState<CancelMode | null>(null);
  const [reason, setReason] = useState('');

  const cancelMutation = useMutation({
    mutationFn: async (mode: CancelMode) => {
      const path = mode === 'cancel' ? 'cancel' : 'cancel-request';
      const res = await api.post<ApiResponse<Order>>(`/orders/${params.id}/${path}`, reason.trim() ? { reason: reason.trim() } : {});
      return res.data.data;
    },
    onSuccess: (updated, mode) => {
      queryClient.setQueryData(['order', params.id], updated);
      queryClient.invalidateQueries({ queryKey: ['orders'] });
      toast.success(CANCEL_COPY[mode].success);
      setCancelMode(null);
      setReason('');
    },
    onError: (err: unknown) => {
      const message = (err as { response?: { data?: { message?: string } } })?.response?.data?.message;
      toast.error(message || 'Không thể thực hiện, vui lòng thử lại');
      // The order may have moved on (e.g. the shop just confirmed it) — show its real state.
      queryClient.invalidateQueries({ queryKey: ['order', params.id] });
    },
  });

  if (!mounted) return null;
  if (!isAuthenticated) return (
    <Container maxWidth="sm" sx={{ py: 7 }}>
      <Skeleton variant="text" width={200} sx={{ mb: 2 }} />
      <Skeleton variant="rounded" height={160} sx={{ mb: 2, borderRadius: 3 }} />
      <Skeleton variant="rounded" height={120} sx={{ borderRadius: 3 }} />
    </Container>
  );

  if (isLoading) {
    return (
      <Container maxWidth="sm" sx={{ py: 7 }}>
        <Skeleton variant="text" width={200} sx={{ mb: 2 }} />
        <Skeleton variant="rounded" height={160} sx={{ mb: 2, borderRadius: 3 }} />
        <Skeleton variant="rounded" height={120} sx={{ borderRadius: 3 }} />
      </Container>
    );
  }

  if (!order) return null;

  const statusInfo = ORDER_STATUS_MAP[order.status] || { label: order.status, chipColor: 'default' };
  const canSelfCancel = SELF_CANCEL_STATUSES.includes(order.status);
  const canRequestCancel = REQUEST_CANCEL_STATUSES.includes(order.status) && !order.cancelRequest;
  const cancelRequestPending = OPEN_REQUEST_STATUSES.includes(order.status) && !!order.cancelRequest;
  const closeDialog = () => { if (!cancelMutation.isPending) setCancelMode(null); };

  return (
    <Container maxWidth="sm" sx={{ py: { xs: 4, md: 7 } }}>
      <Box component={Link} href="/orders" sx={{ display: 'inline-flex', alignItems: 'center', gap: 1, color: 'text.secondary', textDecoration: 'none', mb: 4, '&:hover': { color: 'text.primary' } }}>
        <ArrowBackIcon fontSize="small" />
        <Typography variant="body2">Đơn hàng của tôi</Typography>
      </Box>

      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
        <Typography variant="h5" sx={{ fontWeight: 700 }}>Đơn #{order._id.slice(-8).toUpperCase()}</Typography>
        <Chip
          label={statusInfo.label}
          variant="outlined"
          sx={statusInfo.chipSx}
        />
      </Box>

      {cancelRequestPending && (
        <Alert severity="warning" sx={{ mb: 2, borderRadius: 3 }}>
          Bạn đã gửi yêu cầu hủy đơn lúc {formatDate(order.cancelRequest!.requestedAt)}. Shop sẽ xem xét và liên hệ với bạn.
          {order.cancelRequest!.reason && <><br />Lý do: {order.cancelRequest!.reason}</>}
        </Alert>
      )}

      {/* Items */}
      <Card variant="outlined" sx={{ borderRadius: 3, mb: 2 }}>
        <CardContent sx={{ p: 3 }}>
          <Typography variant="h6" gutterBottom sx={{ fontWeight: 700 }}>Sản phẩm đặt mua</Typography>
          <Stack spacing={2} sx={{ mb: 2 }}>
            {order.items.map((item, i) => (
              <Box key={i} sx={{ display: 'flex', gap: 2 }}>
                <Box sx={{ position: 'relative', width: 56, height: 56, borderRadius: 2, overflow: 'hidden', bgcolor: 'grey.50', flexShrink: 0 }}>
                  {item.productImage && <Image src={item.productImage} alt={item.productName} fill sizes="56px" style={{ objectFit: 'cover' }} />}
                </Box>
                <Box sx={{ flex: 1 }}>
                  <Typography component={Link} href={`/products/${item.productSlug}`} variant="body2" sx={{ textDecoration: 'none', color: 'text.primary', display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical', overflow: 'hidden', '&:hover': { color: 'primary.main' }, fontWeight: 500  }}>
                    {item.productName}
                  </Typography>
                  {(item.color || item.size) && (
                    <Typography variant="caption" color="text.secondary" sx={{ display: 'block', mt: 0.25 }}>
                      {[item.color, item.size].filter(Boolean).join(' · ')}
                    </Typography>
                  )}
                  <Box sx={{ display: 'flex', justifyContent: 'space-between', mt: 0.5 }}>
                    <Typography variant="caption" color="text.disabled">x{item.quantity}</Typography>
                    <Typography variant="body2" color="primary.main" sx={{ fontWeight: 700 }}>{formatCurrency(item.subtotal)}</Typography>
                  </Box>
                </Box>
              </Box>
            ))}
          </Stack>
          <Divider sx={{ mb: 2 }} />
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
            <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
              <Typography variant="body2" color="text.secondary">Giá trị đơn hàng</Typography>
              <Typography variant="body2" sx={{ fontWeight: 600 }}>{formatCurrency(order.total)}</Typography>
            </Box>
            <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
              <Typography variant="body2" color="text.secondary">Đã thanh toán</Typography>
              <Typography variant="body2" sx={{ fontWeight: 600, color: 'success.main' }}>{formatCurrency(order.paidAmount ?? 0)}</Typography>
            </Box>
            <Divider sx={{ my: 0.5 }} />
            <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
              <Typography sx={{ fontWeight: 700 }}>Cần thanh toán</Typography>
              <Typography color="primary.main" variant="h6" sx={{ fontWeight: 700 }}>{formatCurrency(Math.max(0, order.total - (order.paidAmount ?? 0)))}</Typography>
            </Box>
          </Box>
        </CardContent>
      </Card>

      {/* Shipping */}
      <Card variant="outlined" sx={{ borderRadius: 3, mb: 2 }}>
        <CardContent sx={{ p: 3 }}>
          <Typography variant="h6" gutterBottom sx={{ fontWeight: 700 }}>Thông tin giao hàng</Typography>
          <Stack spacing={0.5}>
            <Typography variant="body2" sx={{ fontWeight: 600 }}>{order.shippingInfo.recipientName}</Typography>
            <Typography variant="body2" color="text.secondary">{order.shippingInfo.phone}</Typography>
            <Typography variant="body2" color="text.secondary">{order.shippingInfo.street}, {order.shippingInfo.ward}, {order.shippingInfo.district}, {order.shippingInfo.city}</Typography>
            {order.shippingInfo.note && <Typography variant="body2" color="text.disabled">Ghi chú: {order.shippingInfo.note}</Typography>}
          </Stack>
        </CardContent>
      </Card>

      {/* Customer note */}
      {order.customerNote && (
        <Card variant="outlined" sx={{ borderRadius: 3, mb: 2, borderColor: 'warning.light', bgcolor: (theme) => theme.palette.mode === 'light' ? '#FFFBF0' : undefined }}>
          <CardContent sx={{ p: 3 }}>
            <Typography variant="h6" gutterBottom sx={{ fontWeight: 700 }}>Ghi chú đơn hàng</Typography>
            <Typography variant="body2" sx={{ color: 'text.secondary', whiteSpace: 'pre-wrap' }}>{order.customerNote}</Typography>
          </CardContent>
        </Card>
      )}

      {/* Carrier */}
      {(order.delivery?.carrierName || order.delivery?.trackingCode || order.delivery?.trackingUrl || order.delivery?.estimatedDeliveryDate) && (
        <Card variant="outlined" sx={{ borderRadius: 3, mb: 2 }}>
          <CardContent sx={{ p: 3 }}>
            <Typography variant="h6" gutterBottom sx={{ fontWeight: 700 }}>Đơn vị vận chuyển</Typography>
            <Stack spacing={1}>
              {order.delivery?.carrierName && (
                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <Typography variant="body2" color="text.secondary">Đơn vị</Typography>
                  <Typography variant="body2" sx={{ fontWeight: 600 }}>{order.delivery.carrierName}</Typography>
                </Box>
              )}
              {order.delivery?.trackingCode && (
                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <Typography variant="body2" color="text.secondary">Mã vận chuyển</Typography>
                  <Typography variant="body2" sx={{ fontWeight: 700, fontFamily: 'monospace', letterSpacing: 0.5 }}>{order.delivery.trackingCode}</Typography>
                </Box>
              )}
              {order.delivery?.estimatedDeliveryDate && (
                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <Typography variant="body2" color="text.secondary">Ngày giao dự kiến</Typography>
                  <Typography variant="body2" sx={{ fontWeight: 700, color: 'success.dark' }}>{new Date(order.delivery.estimatedDeliveryDate).toLocaleDateString('vi-VN', { weekday: 'short', day: '2-digit', month: '2-digit', year: 'numeric' })}</Typography>
                </Box>
              )}
              {order.delivery?.trackingUrl && (
                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <Typography variant="body2" color="text.secondary">Theo dõi đơn</Typography>
                  <Typography
                    component="a"
                    href={order.delivery.trackingUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    variant="body2"
                    sx={{ fontWeight: 600, color: 'primary.main', textDecoration: 'underline' }}
                  >
                    Xem tại đây
                  </Typography>
                </Box>
              )}
            </Stack>
          </CardContent>
        </Card>
      )}

      {/* Timestamps */}
      <Card variant="outlined" sx={{ borderRadius: 3 }}>
        <CardContent sx={{ p: 3 }}>
          <Stack spacing={1.5}>
            <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
              <Typography variant="body2" color="text.secondary">Đặt hàng lúc</Typography>
              <Typography variant="body2">{formatDate(order.createdAt)}</Typography>
            </Box>
            <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
              <Typography variant="body2" color="text.secondary">Cập nhật lần cuối</Typography>
              <Typography variant="body2">{formatDate(order.updatedAt)}</Typography>
            </Box>
            {order.csNote && (
              <Box sx={{ p: 2, bgcolor: 'info.50', borderRadius: 2, border: '1px solid', borderColor: 'info.200' }}>
                <Typography variant="caption" color="info.main" sx={{ fontWeight: 600 }}>Ghi chú từ hỗ trợ</Typography>
                <Typography variant="body2" color="info.dark" sx={{ mt: 0.5 }}>{order.csNote}</Typography>
              </Box>
            )}
            {order.cancelReason && (
              <Box sx={{ p: 2, bgcolor: 'error.50', borderRadius: 2, border: '1px solid', borderColor: 'error.200' }}>
                <Typography variant="caption" color="error.main" sx={{ fontWeight: 600 }}>Lý do hủy</Typography>
                <Typography variant="body2" color="error.dark" sx={{ mt: 0.5 }}>{order.cancelReason}</Typography>
              </Box>
            )}
          </Stack>
        </CardContent>
      </Card>

      {(canSelfCancel || canRequestCancel) && (
        <Box sx={{ mt: 3 }}>
          <Button
            fullWidth
            variant="outlined"
            color="error"
            size="large"
            onClick={() => setCancelMode(canSelfCancel ? 'cancel' : 'request')}
            sx={{ borderRadius: 980, fontWeight: 600 }}
          >
            {canSelfCancel ? 'Hủy đơn hàng' : 'Yêu cầu hủy đơn'}
          </Button>
          {canRequestCancel && (
            <Typography variant="caption" color="text.secondary" sx={{ display: 'block', textAlign: 'center', mt: 1 }}>
              Đơn đang được xử lý — shop sẽ xem xét yêu cầu hủy của bạn
            </Typography>
          )}
        </Box>
      )}

      <Dialog open={!!cancelMode} onClose={closeDialog} fullWidth maxWidth="xs" slotProps={{ paper: { sx: { borderRadius: 3 } } }}>
        {cancelMode && (
          <>
            <DialogTitle sx={{ fontWeight: 700 }}>{CANCEL_COPY[cancelMode].title}</DialogTitle>
            <DialogContent>
              <DialogContentText sx={{ mb: 2 }}>{CANCEL_COPY[cancelMode].description}</DialogContentText>
              <TextField
                label="Lý do (không bắt buộc)"
                value={reason}
                onChange={(e) => setReason(e.target.value.slice(0, REASON_MAX_LENGTH))}
                multiline
                minRows={2}
                fullWidth
                helperText={`${reason.length}/${REASON_MAX_LENGTH}`}
              />
            </DialogContent>
            <DialogActions sx={{ px: 3, pb: 2.5 }}>
              <Button onClick={closeDialog} disabled={cancelMutation.isPending}>Quay lại</Button>
              <Button
                variant="contained"
                color="error"
                onClick={() => cancelMutation.mutate(cancelMode)}
                disabled={cancelMutation.isPending}
              >
                {cancelMutation.isPending ? 'Đang gửi...' : CANCEL_COPY[cancelMode].confirm}
              </Button>
            </DialogActions>
          </>
        )}
      </Dialog>
    </Container>
  );
}

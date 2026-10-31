'use client';

import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { useAuthStore } from '@/lib/store/auth.store';
import { useRouter } from 'next/navigation';
import { useEffect, useMemo, useRef, useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import {
  Box, Container, Typography, Card, CardContent, Skeleton, Stack, Button, Alert,
  Checkbox, TextField, MenuItem, Radio, RadioGroup, FormControlLabel, IconButton, CircularProgress, Divider,
} from '@mui/material';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import AddPhotoAlternateOutlinedIcon from '@mui/icons-material/AddPhotoAlternateOutlined';
import CloseIcon from '@mui/icons-material/Close';
import toast from 'react-hot-toast';
import api from '@/lib/api';
import { formatCurrency, formatDate, RETURN_REASON_OPTIONS, RETURN_WINDOW_DAYS } from '@/lib/utils';
import { loginHref } from '@/lib/auth-redirect';
import type { ApiResponse, Order, ReturnEligibility, ReturnReason } from '@/types';

const MAX_IMAGES = 5;
const MAX_FILE_SIZE_MB = 25;
const DESCRIPTION_MIN = 10;
const DESCRIPTION_MAX = 1000;

type PreviewImage = { previewUrl: string; uploading: boolean; uploadedUrl?: string; error?: string };

/** Same estimate as the backend (estimateReturnRefund): goods price minus their share of the
 * order discount, capped by what was paid. The shop confirms the final amount after inspection. */
function estimateRefund(order: Order, selected: Record<number, number>): number {
  const goods = Object.entries(selected).reduce((sum, [idx, qty]) => sum + (order.items[Number(idx)]?.unitPrice ?? 0) * qty, 0);
  const subtotal = order.subtotal ?? order.items.reduce((s, i) => s + i.subtotal, 0);
  const discount = subtotal > 0 ? Math.round(((order.discountAmount ?? 0) * goods) / subtotal) : 0;
  return Math.max(0, Math.min(goods - discount, order.paidAmount ?? 0));
}

export default function ReturnRequestPage({ params }: { params: { id: string } }) {
  const { isAuthenticated } = useAuthStore();
  const router = useRouter();
  const queryClient = useQueryClient();
  const [mounted, setMounted] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => { setMounted(true); }, []);
  useEffect(() => {
    if (!mounted) return;
    if (!isAuthenticated) router.replace(loginHref(`/orders/${params.id}/return`));
  }, [mounted, isAuthenticated, router, params.id]);

  const { data: order, isLoading: orderLoading } = useQuery({
    queryKey: ['order', params.id],
    queryFn: async () => (await api.get<ApiResponse<Order>>(`/orders/${params.id}`)).data.data,
    enabled: isAuthenticated,
  });
  const { data: eligibility, isLoading: eligibilityLoading } = useQuery({
    queryKey: ['order-return-eligibility', params.id],
    queryFn: async () => (await api.get<ApiResponse<ReturnEligibility>>(`/orders/${params.id}/return-eligibility`)).data.data,
    enabled: isAuthenticated,
  });

  /** itemIndex → quantity to return */
  const [selected, setSelected] = useState<Record<number, number>>({});
  const [reason, setReason] = useState<ReturnReason | ''>('');
  const [description, setDescription] = useState('');
  const [images, setImages] = useState<PreviewImage[]>([]);
  const [account, setAccount] = useState({ bankName: '', accountNumber: '', accountHolder: '' });

  // A single-line order: pre-select it.
  useEffect(() => {
    if (order?.items.length === 1) setSelected({ 0: order.items[0].quantity });
  }, [order]);

  const estimate = useMemo(() => (order ? estimateRefund(order, selected) : 0), [order, selected]);

  const submitMutation = useMutation({
    mutationFn: async () => {
      const accountFilled = account.bankName.trim() || account.accountNumber.trim() || account.accountHolder.trim();
      const res = await api.post<ApiResponse<Order>>(`/orders/${params.id}/return`, {
        items: Object.entries(selected).map(([itemIndex, quantity]) => ({ itemIndex: Number(itemIndex), quantity })),
        reason,
        description: description.trim(),
        images: images.map((i) => i.uploadedUrl).filter(Boolean),
        ...(accountFilled ? { refundAccount: { ...account, accountNumber: account.accountNumber.replace(/\s/g, '') } } : {}),
      });
      return res.data.data;
    },
    onSuccess: (updated) => {
      queryClient.setQueryData(['order', params.id], updated);
      queryClient.invalidateQueries({ queryKey: ['orders'] });
      queryClient.invalidateQueries({ queryKey: ['order-return-eligibility', params.id] });
      toast.success('Đã gửi yêu cầu trả hàng. Shop sẽ phản hồi sớm.');
      router.push(`/orders/${params.id}`);
    },
    onError: (err: unknown) => {
      const message = (err as { response?: { data?: { message?: string | string[] } } })?.response?.data?.message;
      toast.error((Array.isArray(message) ? message[0] : message) || 'Gửi yêu cầu thất bại, vui lòng thử lại');
    },
  });

  const handleFiles = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []).slice(0, MAX_IMAGES - images.length);
    if (fileInputRef.current) fileInputRef.current.value = '';
    for (const file of files) {
      if (file.size > MAX_FILE_SIZE_MB * 1024 * 1024) {
        toast.error(`${file.name} vượt quá ${MAX_FILE_SIZE_MB}MB`);
        continue;
      }
      const previewUrl = URL.createObjectURL(file);
      setImages((prev) => [...prev, { previewUrl, uploading: true }]);
      const formData = new FormData();
      formData.append('files', file);
      let uploadedUrl: string | undefined;
      try {
        uploadedUrl = (await api.post<{ data: { urls: string[] } }>('/upload/return-images', formData)).data.data.urls[0];
      } catch {
        uploadedUrl = undefined;
      }
      setImages((prev) => prev.map((img) => (img.previewUrl === previewUrl
        ? { ...img, uploading: false, uploadedUrl, error: uploadedUrl ? undefined : 'Tải ảnh thất bại' }
        : img)));
    }
  };

  const removeImage = (previewUrl: string) => {
    URL.revokeObjectURL(previewUrl);
    setImages((prev) => prev.filter((i) => i.previewUrl !== previewUrl));
  };

  if (!mounted) return null;
  if (!isAuthenticated || orderLoading || eligibilityLoading) {
    return (
      <Container maxWidth="sm" sx={{ py: 7 }}>
        <Skeleton variant="text" width={200} sx={{ mb: 2 }} />
        <Skeleton variant="rounded" height={200} sx={{ mb: 2, borderRadius: 3 }} />
        <Skeleton variant="rounded" height={160} sx={{ borderRadius: 3 }} />
      </Container>
    );
  }
  if (!order || !eligibility) return null;

  const backLink = (
    <Box component={Link} href={`/orders/${params.id}`} sx={{ display: 'inline-flex', alignItems: 'center', gap: 1, color: 'text.secondary', textDecoration: 'none', mb: 3, '&:hover': { color: 'text.primary' } }}>
      <ArrowBackIcon fontSize="small" />
      <Typography variant="body2">Đơn #{order._id.slice(-8).toUpperCase()}</Typography>
    </Box>
  );

  if (!eligibility.eligible) {
    return (
      <Container maxWidth="sm" sx={{ py: { xs: 4, md: 7 } }}>
        {backLink}
        <Alert severity="info" sx={{ borderRadius: 3 }}>{eligibility.reason}</Alert>
      </Container>
    );
  }

  const selectedCount = Object.keys(selected).length;
  const uploading = images.some((i) => i.uploading);
  const uploadedCount = images.filter((i) => i.uploadedUrl).length;
  const accountComplete = !!(account.bankName.trim() && account.accountNumber.trim() && account.accountHolder.trim());
  const missing: string[] = [];
  if (!selectedCount) missing.push('chọn sản phẩm');
  if (!reason) missing.push('chọn lý do');
  if (description.trim().length < DESCRIPTION_MIN) missing.push(`mô tả (≥ ${DESCRIPTION_MIN} ký tự)`);
  if (!uploadedCount) missing.push('ít nhất 1 ảnh');
  if (eligibility.requiresRefundAccount && !accountComplete) missing.push('tài khoản nhận tiền hoàn');
  const reasonHint = RETURN_REASON_OPTIONS.find((o) => o.value === reason)?.hint;

  return (
    <Container maxWidth="sm" sx={{ py: { xs: 4, md: 7 } }}>
      {backLink}
      <Typography variant="h5" sx={{ fontWeight: 700, mb: 1 }}>Yêu cầu trả hàng/hoàn tiền</Typography>
      <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
        Hạn gửi yêu cầu: <b>{formatDate(eligibility.deadline!)}</b> ({RETURN_WINDOW_DAYS} ngày kể từ khi nhận hàng).{' '}
        <Link href="/return-policy" style={{ color: 'inherit' }}>Xem chính sách</Link>
      </Typography>

      {/* 1. Items */}
      <Card variant="outlined" sx={{ borderRadius: 3, mb: 2 }}>
        <CardContent sx={{ p: 3 }}>
          <Typography variant="h6" gutterBottom sx={{ fontWeight: 700 }}>1. Sản phẩm muốn trả</Typography>
          <Stack spacing={1.5}>
            {order.items.map((item, idx) => {
              const checked = selected[idx] !== undefined;
              return (
                <Box key={idx} sx={{ display: 'flex', gap: 1.5, alignItems: 'center' }}>
                  <Checkbox
                    checked={checked}
                    onChange={(e) => setSelected((prev) => {
                      const next = { ...prev };
                      if (e.target.checked) next[idx] = item.quantity; else delete next[idx];
                      return next;
                    })}
                    sx={{ p: 0.5 }}
                  />
                  <Box sx={{ position: 'relative', width: 48, height: 48, borderRadius: 2, overflow: 'hidden', bgcolor: 'grey.50', flexShrink: 0 }}>
                    {item.productImage && <Image src={item.productImage} alt={item.productName} fill sizes="48px" style={{ objectFit: 'cover' }} />}
                  </Box>
                  <Box sx={{ flex: 1, minWidth: 0 }}>
                    <Typography variant="body2" sx={{ fontWeight: 500 }} noWrap>{item.productName}</Typography>
                    <Typography variant="caption" color="text.secondary">
                      {[item.color, item.size].filter(Boolean).join(' · ')}{(item.color || item.size) ? ' — ' : ''}{formatCurrency(item.unitPrice)} × {item.quantity}
                    </Typography>
                  </Box>
                  {checked && item.quantity > 1 && (
                    <TextField
                      select
                      size="small"
                      label="SL trả"
                      value={selected[idx]}
                      onChange={(e) => setSelected((prev) => ({ ...prev, [idx]: Number(e.target.value) }))}
                      sx={{ width: 84 }}
                    >
                      {Array.from({ length: item.quantity }, (_, i) => i + 1).map((q) => <MenuItem key={q} value={q}>{q}</MenuItem>)}
                    </TextField>
                  )}
                </Box>
              );
            })}
          </Stack>
        </CardContent>
      </Card>

      {/* 2. Reason */}
      <Card variant="outlined" sx={{ borderRadius: 3, mb: 2 }}>
        <CardContent sx={{ p: 3 }}>
          <Typography variant="h6" gutterBottom sx={{ fontWeight: 700 }}>2. Lý do trả hàng</Typography>
          <RadioGroup value={reason} onChange={(e) => setReason(e.target.value as ReturnReason)}>
            {RETURN_REASON_OPTIONS.map((o) => (
              <FormControlLabel key={o.value} value={o.value} control={<Radio size="small" />} label={<Typography variant="body2">{o.label}</Typography>} />
            ))}
          </RadioGroup>
          {reasonHint && <Alert severity="warning" sx={{ mt: 1, borderRadius: 2 }}>{reasonHint}</Alert>}
          <TextField
            label="Mô tả tình trạng sản phẩm"
            placeholder="VD: Chụp đèn bị nứt một đường ở cạnh, phát hiện khi mở hộp"
            value={description}
            onChange={(e) => setDescription(e.target.value.slice(0, DESCRIPTION_MAX))}
            multiline
            minRows={3}
            fullWidth
            helperText={`${description.length}/${DESCRIPTION_MAX}`}
            sx={{ mt: 2 }}
          />
        </CardContent>
      </Card>

      {/* 3. Evidence */}
      <Card variant="outlined" sx={{ borderRadius: 3, mb: 2 }}>
        <CardContent sx={{ p: 3 }}>
          <Typography variant="h6" sx={{ fontWeight: 700 }}>3. Hình ảnh sản phẩm</Typography>
          <Typography variant="caption" color="text.secondary" sx={{ display: 'block', mb: 1.5 }}>
            Tối thiểu 1, tối đa {MAX_IMAGES} ảnh — chụp rõ phần lỗi/hư hỏng, tem nhãn và bao bì.
          </Typography>
          <Box sx={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(84px, 1fr))', gap: 1 }}>
            {images.map((img) => (
              <Box key={img.previewUrl} sx={{ position: 'relative', aspectRatio: '1', borderRadius: 2, overflow: 'hidden', border: '1px solid', borderColor: img.error ? 'error.main' : 'divider' }}>
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={img.previewUrl} alt="" style={{ width: '100%', height: '100%', objectFit: 'cover', opacity: img.uploading ? 0.5 : 1 }} />
                {img.uploading && <CircularProgress size={20} sx={{ position: 'absolute', top: 'calc(50% - 10px)', left: 'calc(50% - 10px)' }} />}
                {img.error && <Typography variant="caption" color="error" sx={{ position: 'absolute', bottom: 0, left: 0, right: 0, bgcolor: 'rgba(255,255,255,0.9)', textAlign: 'center' }}>{img.error}</Typography>}
                <IconButton size="small" onClick={() => removeImage(img.previewUrl)} sx={{ position: 'absolute', top: 2, right: 2, bgcolor: 'rgba(0,0,0,0.5)', color: '#fff', p: 0.25, '&:hover': { bgcolor: 'rgba(0,0,0,0.7)' } }}>
                  <CloseIcon sx={{ fontSize: 14 }} />
                </IconButton>
              </Box>
            ))}
            {images.length < MAX_IMAGES && (
              <Box
                component="button"
                type="button"
                onClick={() => fileInputRef.current?.click()}
                sx={{ aspectRatio: '1', borderRadius: 2, border: '1px dashed', borderColor: 'divider', bgcolor: 'grey.50', cursor: 'pointer', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', color: 'text.secondary', '&:hover': { borderColor: 'primary.main', color: 'primary.main' } }}
              >
                <AddPhotoAlternateOutlinedIcon />
                <Typography variant="caption">Thêm ảnh</Typography>
              </Box>
            )}
          </Box>
          <input ref={fileInputRef} type="file" accept="image/*" multiple hidden onChange={handleFiles} />
        </CardContent>
      </Card>

      {/* 4. Refund account */}
      <Card variant="outlined" sx={{ borderRadius: 3, mb: 2 }}>
        <CardContent sx={{ p: 3 }}>
          <Typography variant="h6" sx={{ fontWeight: 700 }}>4. Tài khoản nhận tiền hoàn</Typography>
          <Typography variant="caption" color="text.secondary" sx={{ display: 'block', mb: 2 }}>
            {eligibility.requiresRefundAccount
              ? 'Đơn thanh toán khi nhận hàng (COD) được hoàn qua chuyển khoản ngân hàng.'
              : 'Đơn chưa ghi nhận thanh toán — có thể bỏ trống, shop sẽ liên hệ nếu cần hoàn tiền.'}
          </Typography>
          <Stack spacing={2}>
            <TextField size="small" label="Ngân hàng" placeholder="VD: Vietcombank" value={account.bankName} onChange={(e) => setAccount({ ...account, bankName: e.target.value })} required={eligibility.requiresRefundAccount} fullWidth />
            <TextField size="small" label="Số tài khoản" value={account.accountNumber} onChange={(e) => setAccount({ ...account, accountNumber: e.target.value })} required={eligibility.requiresRefundAccount} fullWidth slotProps={{ htmlInput: { inputMode: 'numeric' } }} />
            <TextField size="small" label="Tên chủ tài khoản" placeholder="VIẾT HOA KHÔNG DẤU" value={account.accountHolder} onChange={(e) => setAccount({ ...account, accountHolder: e.target.value })} required={eligibility.requiresRefundAccount} fullWidth />
          </Stack>
        </CardContent>
      </Card>

      {/* Summary */}
      <Card variant="outlined" sx={{ borderRadius: 3, mb: 3 }}>
        <CardContent sx={{ p: 3 }}>
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <Typography sx={{ fontWeight: 600 }}>Số tiền hoàn dự kiến</Typography>
            <Typography variant="h6" color="primary.main" sx={{ fontWeight: 700 }}>{formatCurrency(estimate)}</Typography>
          </Box>
          <Divider sx={{ my: 1.5 }} />
          <Typography variant="caption" color="text.secondary">
            Số tiền cuối cùng được shop xác nhận sau khi nhận và kiểm tra hàng trả về. Với lỗi từ phía shop, phí gửi trả sẽ được hoàn thêm.
          </Typography>
        </CardContent>
      </Card>

      <Button
        fullWidth
        size="large"
        variant="contained"
        disabled={missing.length > 0 || uploading || submitMutation.isPending}
        onClick={() => submitMutation.mutate()}
        sx={{ borderRadius: 980, fontWeight: 600 }}
      >
        {submitMutation.isPending ? 'Đang gửi...' : uploading ? 'Đang tải ảnh...' : 'Gửi yêu cầu'}
      </Button>
      {missing.length > 0 && (
        <Typography variant="caption" color="text.secondary" sx={{ display: 'block', textAlign: 'center', mt: 1 }}>
          Còn thiếu: {missing.join(', ')}
        </Typography>
      )}
    </Container>
  );
}

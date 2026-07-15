'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import Link from 'next/link';
import {
  Box, Container, Typography, Grid, Card, CardContent,
  TextField, Button, Divider, Stack, Alert, CircularProgress,
  Chip,
} from '@mui/material';
import ShoppingBagOutlinedIcon from '@mui/icons-material/ShoppingBagOutlined';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import CheckCircleOutlinedIcon from '@mui/icons-material/CheckCircleOutlined';
import LocalOfferOutlinedIcon from '@mui/icons-material/LocalOfferOutlined';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { useQuery } from '@tanstack/react-query';
import { useCartStore } from '@/lib/store/cart.store';
import { useAuthStore } from '@/lib/store/auth.store';
import { formatCurrency } from '@/lib/utils';
import api from '@/lib/api';
import toast from 'react-hot-toast';
import type { ApiResponse, Order, User, Coupon, ValidateCouponsResponse } from '@/types';
import AddressPicker, { type OldAddressSelection } from '@/components/AddressPicker';

// ─── Local administrative data (public/data/vn-locations.json) ───────────────
interface Ward { id: string; name: string; }
interface Province { id: string; name: string; wards: Ward[]; }
interface LocationData { provinces: Province[]; }

// ─── Form schema ──────────────────────────────────────────────────────────────
const shippingSchema = z.object({
  recipientName: z.string().min(2, 'Vui lòng nhập họ tên'),
  phone: z.string().regex(
    /^(0|\+84)(3[2-9]|5[25689]|7[06-9]|8[0-9]|9[0-9])\d{7}$/,
    'Số điện thoại không hợp lệ (VD: 0912345678)',
  ),
  city: z.string().min(1, 'Chọn tỉnh/thành phố'),
  ward: z.string().min(1, 'Chọn phường/xã'),
  street: z.string().min(3, 'Vui lòng nhập địa chỉ chi tiết'),
  note: z.string().optional(),
  customerNote: z.string().max(500, 'Ghi chú tối đa 500 ký tự').optional(),
});
type ShippingForm = z.infer<typeof shippingSchema>;

// ─── CheckoutPage ─────────────────────────────────────────────────────────────
export default function CheckoutPage() {
  const router = useRouter();
  const { items, total, clearCart } = useCartStore();
  const { isAuthenticated, user, updateUser } = useAuthStore();
  const [mounted, setMounted] = useState(false);
  const [success, setSuccess] = useState(false);
  const [orderId, setOrderId] = useState<string | null>(null);
  const [oldAddress, setOldAddress] = useState<OldAddressSelection | undefined>(undefined);

  // ── Coupon state ──────────────────────────────────────────────────────────
  const [selectedCodes, setSelectedCodes] = useState<string[]>([]);
  const [validateResult, setValidateResult] = useState<ValidateCouponsResponse | null>(null);
  const [isValidating, setIsValidating] = useState(false);

  useEffect(() => { setMounted(true); }, []);

  useEffect(() => {
    if (!mounted) return;
    if (!isAuthenticated) router.replace('/auth/login?redirect=/checkout');
  }, [mounted, isAuthenticated, router]);

  useEffect(() => {
    if (mounted && isAuthenticated && items.length === 0 && !success) router.replace('/cart');
  }, [mounted, isAuthenticated, items.length, success, router]);

  // Load all location data from local static file (cached after first load)
  const { data: locationData } = useQuery<LocationData>({
    queryKey: ['vn-locations'],
    queryFn: async () => {
      const res = await fetch('/data/vn-locations.json');
      if (!res.ok) throw new Error('Cannot load location data');
      return res.json();
    },
    staleTime: Infinity,
  });

  const provinces: Province[] = locationData?.provinces ?? [];

  // Load available coupons for this user
  const { data: coupons = [] } = useQuery<Coupon[]>({
    queryKey: ['my-coupons'],
    queryFn: async () => {
      const res = await api.get<ApiResponse<Coupon[]>>('/promotions/my-coupons');
      return res.data.data;
    },
    enabled: isAuthenticated,
    staleTime: 60_000,
  });

  const defaultAddress = user?.addresses?.find((a) => a.isDefault) ?? user?.addresses?.[0];

  const { register, handleSubmit, setValue, watch, formState: { errors, isSubmitting } } =
    useForm<ShippingForm>({
      resolver: zodResolver(shippingSchema),
      defaultValues: {
        recipientName: user?.name ?? '',
        phone: user?.phone ?? '',
        city: defaultAddress?.city ?? '',
        ward: defaultAddress?.ward ?? '',
        street: defaultAddress?.street ?? '',
      },
    });

  // Toggle coupon selection; reset validate result when selection changes
  function toggleCoupon(code: string) {
    setValidateResult(null);
    setSelectedCodes((prev) =>
      prev.includes(code) ? prev.filter((c) => c !== code) : [...prev, code],
    );
  }

  async function handleApplyCoupons() {
    if (!selectedCodes.length) return;
    setIsValidating(true);
    try {
      const res = await api.post<ApiResponse<ValidateCouponsResponse>>('/promotions/validate', {
        couponCodes: selectedCodes,
        orderTotal: total(),
      });
      setValidateResult(res.data.data);
    } catch {
      toast.error('Không thể kiểm tra mã giảm giá');
    } finally {
      setIsValidating(false);
    }
  }

  const onSubmit = async (data: ShippingForm) => {    try {
      const payload = {
        items: items.map((i) => ({ productId: i.productId, quantity: i.quantity })),
        shippingInfo: {
          recipientName: data.recipientName,
          phone: data.phone,
          city: data.city,
          ward: data.ward,
          street: data.street,
          note: data.note,
          ...(oldAddress ? { oldAddress } : {}),
        },
        ...(data.customerNote?.trim() ? { customerNote: data.customerNote.trim() } : {}),
        // Pass the validated applied coupon codes so backend can re-verify + track usage
        ...(validateResult?.appliedCoupons.length
          ? { couponCodes: validateResult.appliedCoupons.map((c) => c.code) }
          : {}),
      };
      const res = await api.post<ApiResponse<Order>>('/orders', payload);
      const newOrder = res.data.data;

      // Auto-save address if user has none
      if (!user?.addresses?.length) {
        try {
          const addrRes = await api.post<ApiResponse<User>>('/users/me/addresses', {
            street: data.street,
            ward: data.ward,
            district: '',
            city: data.city,
            isDefault: true,
            ...(oldAddress ? { oldAddress } : {}),
          });
          if (addrRes.data.data?.addresses) {
            updateUser({ addresses: addrRes.data.data.addresses });
          }
        } catch {
          // Non-critical
        }
      }

      clearCart();
      setOrderId(newOrder._id);
      setSuccess(true);
    } catch (err: unknown) {
      const msg = (err as { response?: { data?: { message?: string } } })?.response?.data?.message;
      toast.error(msg || 'Đặt hàng thất bại, vui lòng thử lại');
    }
  };

  if (!mounted) return null;
  if (!isAuthenticated) return (
    <Box sx={{ minHeight: '60vh', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
      <CircularProgress />
    </Box>
  );

  // ── Success screen ────────────────────────────────────────────────────────
  if (success) {
    return (
      <Box sx={{ minHeight: '70vh', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: 3, px: 2 }}>
        <CheckCircleOutlinedIcon sx={{ fontSize: 72, color: 'success.main' }} />
        <Box sx={{ textAlign: 'center' }}>
          <Typography variant="h5" gutterBottom sx={{ fontWeight: 700 }}>Đặt hàng thành công!</Typography>
          <Typography color="text.secondary">Cảm ơn bạn đã mua hàng. Đơn hàng đang được xử lý.</Typography>
        </Box>
        <Stack direction="row" spacing={2}>
          <Button component={Link} href={`/orders/${orderId}`} variant="contained" size="large">Xem đơn hàng</Button>
          <Button component={Link} href="/products" variant="outlined" size="large">Tiếp tục mua hàng</Button>
        </Stack>
      </Box>
    );
  }

  return (
    <Container maxWidth="md" sx={{ py: { xs: 4, md: 7 } }}>
      <Button component={Link} href="/cart" startIcon={<ArrowBackIcon />} sx={{ mb: 3, color: 'text.secondary' }}>
        Quay lại giỏ hàng
      </Button>

      <Typography variant="h4" sx={{ mb: 4, fontWeight: 700 }}>Thanh toán</Typography>

      <form onSubmit={handleSubmit(onSubmit)}>
        <Grid container spacing={4}>

          {/* ── Left: shipping form ── */}
          <Grid size={{ xs: 12, md: 7 }}>

            {/* Section 1 — Thông tin người nhận */}
            <Card variant="outlined" sx={{ borderRadius: 3, mb: 3 }}>
              <CardContent sx={{ p: 3 }}>
                <Typography variant="h6" sx={{ fontWeight: 700, mb: 2.5 }}>Thông tin người nhận</Typography>
                <Stack spacing={2.5}>
                  <TextField
                    label="Họ và tên *" fullWidth size="small"
                    {...register('recipientName')}
                    error={!!errors.recipientName} helperText={errors.recipientName?.message}
                  />
                  <TextField
                    label="Số điện thoại *" fullWidth size="small"
                    {...register('phone')}
                    error={!!errors.phone} helperText={errors.phone?.message}
                  />
                </Stack>
              </CardContent>
            </Card>

            {/* Section 2 — Địa chỉ giao hàng */}
            <Card variant="outlined" sx={{ borderRadius: 3 }}>
              <CardContent sx={{ p: 3 }}>
                <Typography variant="h6" sx={{ fontWeight: 700, mb: 2.5 }}>Địa chỉ giao hàng</Typography>
                <Stack spacing={2.5}>

                  {/* Tỉnh/Thành phố + Phường/Xã — hỗ trợ nhập địa chỉ mới hoặc cũ */}
                  <AddressPicker
                    newProvinces={provinces}
                    value={{ city: watch('city'), ward: watch('ward'), oldAddress }}
                    onChange={(v) => {
                      setValue('city', v.city, { shouldValidate: true });
                      setValue('ward', v.ward, { shouldValidate: true });
                      setOldAddress(v.oldAddress);
                    }}
                    cityError={errors.city?.message}
                    wardError={errors.ward?.message}
                  />

                  {/* Số nhà, tên đường */}
                  <TextField
                    label="Số nhà, tên đường *" fullWidth size="small"
                    {...register('street')} placeholder="VD: 123 Nguyễn Huệ"
                    error={!!errors.street} helperText={errors.street?.message}
                  />

                  {/* Ghi chú giao hàng */}
                  <TextField
                    label="Ghi chú cho tài xế (tùy chọn)" fullWidth size="small" multiline rows={2}
                    {...register('note')} placeholder="VD: Gọi trước khi giao, giao giờ hành chính..."
                  />
                </Stack>

                <Alert severity="info" sx={{ mt: 3, borderRadius: 2 }}>
                  Phương thức thanh toán: <strong>Thanh toán khi nhận hàng (COD)</strong>
                </Alert>
              </CardContent>
            </Card>

            {/* Section 3 — Mã giảm giá */}
            {coupons.length > 0 && (
              <Card variant="outlined" sx={{ borderRadius: 3, mt: 3 }}>
                <CardContent sx={{ p: 3 }}>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 0.5 }}>
                    <LocalOfferOutlinedIcon sx={{ fontSize: 20, color: 'primary.main' }} />
                    <Typography variant="h6" sx={{ fontWeight: 700 }}>Mã giảm giá</Typography>
                  </Box>
                  <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                    Chọn mã bạn muốn áp dụng, sau đó nhấn <strong>Áp dụng</strong> để kiểm tra
                  </Typography>

                  <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1, mb: 2 }}>
                    {coupons.map((c) => {
                      const selected = selectedCodes.includes(c.code);
                      const wasApplied = validateResult?.appliedCoupons.some((a) => a.code === c.code);
                      return (
                        <Chip
                          key={c.code}
                          label={
                            <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-start', py: 0.5 }}>
                              <Typography variant="caption" sx={{ fontWeight: 700, fontFamily: 'monospace', lineHeight: 1.3, fontSize: '0.8rem' }}>
                                {c.code}
                              </Typography>
                              <Typography variant="caption" sx={{ fontSize: '0.7rem', color: selected ? 'inherit' : 'text.secondary', lineHeight: 1.4 }}>
                                {c.type === 'percentage' ? `-${c.value}%` : `-${c.value.toLocaleString('vi-VN')}₫`}
                                {c.maxDiscountAmount > 0 && ` · Giảm tối đa ${(c.maxDiscountAmount / 1000).toFixed(0)}k`}
                              </Typography>
                              {c.minOrderValue > 0 && (
                                <Typography variant="caption" sx={{ fontSize: '0.65rem', color: selected ? 'inherit' : 'text.disabled', lineHeight: 1.3 }}>
                                  Đơn tối thiểu {c.minOrderValue.toLocaleString('vi-VN')}₫
                                </Typography>
                              )}
                            </Box>
                          }
                          onClick={() => toggleCoupon(c.code)}
                          color={wasApplied ? 'success' : selected ? 'primary' : 'default'}
                          variant={selected ? 'filled' : 'outlined'}
                          sx={{ height: 'auto', py: 0.75, cursor: 'pointer', borderRadius: '20px !important' }}
                        />
                      );
                    })}
                  </Box>

                  {selectedCodes.length > 0 && (
                    <Button
                      variant="contained"
                      size="small"
                      onClick={handleApplyCoupons}
                      disabled={isValidating}
                      sx={{ borderRadius: 2, textTransform: 'none', fontWeight: 600, px: 3 }}
                    >
                      {isValidating
                        ? <><CircularProgress size={14} sx={{ mr: 1 }} />Đang kiểm tra...</>
                        : 'Áp dụng mã giảm giá'}
                    </Button>
                  )}

                  {validateResult && (
                    <Box sx={{ mt: 2, p: 2, bgcolor: validateResult.appliedCoupons.length > 0 ? 'success.50' : 'grey.50', borderRadius: 2, border: '1px solid', borderColor: validateResult.appliedCoupons.length > 0 ? 'success.200' : 'grey.200' }}>
                      {validateResult.appliedCoupons.length > 0 ? (
                        <Stack spacing={0.5}>
                          {validateResult.appliedCoupons.map((a) => (
                            <Box key={a.code} sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                              <Typography variant="body2" color="success.main" sx={{ fontWeight: 600 }}>
                                🎉 {a.name}
                              </Typography>
                              <Typography variant="body2" color="success.main" sx={{ fontWeight: 700 }}>
                                -{a.discountAmount.toLocaleString('vi-VN')}₫
                              </Typography>
                            </Box>
                          ))}
                          <Typography variant="caption" color="success.dark" sx={{ pt: 0.5, borderTop: '1px dashed', borderColor: 'success.200' }}>
                            Tổng tiết kiệm: <strong>-{validateResult.totalDiscount.toLocaleString('vi-VN')}₫</strong>
                          </Typography>
                        </Stack>
                      ) : (
                        <Typography variant="body2" color="text.secondary">
                          Không có mã nào áp dụng được cho đơn hàng này
                        </Typography>
                      )}
                    </Box>
                  )}
                </CardContent>
              </Card>
            )}

            {/* Section 4 — Ghi chú đơn hàng */}
            <Card variant="outlined" sx={{ borderRadius: 3, mt: 3 }}>
              <CardContent sx={{ p: 3 }}>
                <Typography variant="h6" sx={{ fontWeight: 700, mb: 0.5 }}>Ghi chú đơn hàng</Typography>
                <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                  Yêu cầu đặc biệt, thiết kế tùy chỉnh, hoặc thông tin bổ sung cho đơn hàng
                </Typography>
                <TextField
                  label="Ghi chú đơn hàng (tùy chọn)" fullWidth multiline rows={3}
                  {...register('customerNote')}
                  error={!!errors.customerNote} helperText={errors.customerNote?.message}
                  placeholder="VD: Đèn màu xanh, tên nhân vật là Minh, quà tặng sinh nhật — gói đẹp..."
                />
              </CardContent>
            </Card>
          </Grid>

          {/* ── Right: order summary ── */}
          <Grid size={{ xs: 12, md: 5 }}>
            <Card variant="outlined" sx={{ borderRadius: 3, position: 'sticky', top: 88 }}>
              <CardContent sx={{ p: 3 }}>
                <Typography variant="h6" sx={{ fontWeight: 700, mb: 2 }}>
                  Đơn hàng ({items.length} sản phẩm)
                </Typography>

                <Stack spacing={1.5} sx={{ mb: 2 }}>
                  {items.map((item) => (
                    <Box key={item.productId} sx={{ display: 'flex', gap: 1.5, alignItems: 'center' }}>
                      <Box sx={{ position: 'relative', width: 48, height: 48, borderRadius: 1.5, overflow: 'hidden', bgcolor: 'grey.50', flexShrink: 0 }}>
                        {item.productImage ? (
                          <Image src={item.productImage} alt={item.productName} fill sizes="48px" style={{ objectFit: 'cover' }} />
                        ) : (
                          <Box sx={{ width: '100%', height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'grey.300' }}>
                            <ShoppingBagOutlinedIcon fontSize="small" />
                          </Box>
                        )}
                      </Box>
                      <Box sx={{ flex: 1, minWidth: 0 }}>
                        <Typography variant="body2" sx={{ fontWeight: 500, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                          {item.productName}
                        </Typography>
                        <Typography variant="caption" color="text.secondary">
                          x{item.quantity} · {formatCurrency(item.price)}
                        </Typography>
                      </Box>
                      <Typography variant="body2" sx={{ fontWeight: 600, flexShrink: 0 }}>
                        {formatCurrency(item.price * item.quantity)}
                      </Typography>
                    </Box>
                  ))}
                </Stack>

                <Divider sx={{ my: 2 }} />

                <Stack spacing={1} sx={{ mb: 2.5 }}>
                  <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                    <Typography variant="body2" color="text.secondary">Tạm tính</Typography>
                    <Typography variant="body2" sx={{ fontWeight: 500 }}>{formatCurrency(total())}</Typography>
                  </Box>
                  {validateResult && validateResult.totalDiscount > 0 && (
                    <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                      <Typography variant="body2" color="success.main">Giảm giá</Typography>
                      <Typography variant="body2" color="success.main" sx={{ fontWeight: 600 }}>
                        -{formatCurrency(validateResult.totalDiscount)}
                      </Typography>
                    </Box>
                  )}
                  <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                    <Typography variant="body2" color="text.secondary">Phí vận chuyển</Typography>
                    <Typography variant="body2" color="success.main" sx={{ fontWeight: 600 }}>Miễn phí</Typography>
                  </Box>
                </Stack>

                <Divider sx={{ mb: 2 }} />

                <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 3 }}>
                  <Typography sx={{ fontWeight: 700 }}>Tổng cộng</Typography>
                  <Typography color="primary.main" variant="h6" sx={{ fontWeight: 700 }}>
                    {formatCurrency(validateResult ? validateResult.finalTotal : total())}
                  </Typography>
                </Box>

                <Button
                  type="submit" fullWidth variant="contained" size="large"
                  disabled={isSubmitting} sx={{ py: 1.5, fontWeight: 600 }}
                >
                  {isSubmitting ? <CircularProgress size={22} color="inherit" /> : 'Đặt hàng'}
                </Button>
              </CardContent>
            </Card>
          </Grid>

        </Grid>
      </form>
    </Container>
  );
}

'use client';

import { useEffect, useRef, useState } from 'react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import Link from 'next/link';
import dynamic from 'next/dynamic';
import {
  Box, Container, Typography, Grid, Card, CardContent,
  TextField, Button, Divider, Stack, Alert, CircularProgress,
  Checkbox, FormControlLabel, Radio, RadioGroup,
} from '@mui/material';
import ShoppingBagOutlinedIcon from '@mui/icons-material/ShoppingBagOutlined';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import CheckCircleOutlinedIcon from '@mui/icons-material/CheckCircleOutlined';
import ReceiptLongOutlinedIcon from '@mui/icons-material/ReceiptLongOutlined';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { useQuery } from '@tanstack/react-query';
import { useCartStore } from '@/lib/store/cart.store';
import { useAuthStore } from '@/lib/store/auth.store';
import { formatCurrency } from '@/lib/utils';
import { computeShippingFee } from '@/lib/shipping-fee';
import { PAYMENT_ACCOUNT_LABEL, useBankTransferAvailability } from '@/lib/bank-transfer';
import api from '@/lib/api';
import toast from 'react-hot-toast';
import type {
  ApiResponse, Order, User, Coupon, ValidateCouponsResponse, EInvoiceRequestInput, PaymentMethod, PaymentAccountType,
} from '@/types';
import AddressPicker, { type OldAddressSelection } from '@/components/AddressPicker';
import EInvoiceRequestFields from '@/components/einvoice-request/EInvoiceRequestFields';
import BankTransferPayment from '@/components/bank-transfer/BankTransferPayment';
import CouponSection from '@/components/checkout/CouponSection';
import GuestOrderSuccess from '@/components/checkout/GuestOrderSuccess';
import { loginHref } from '@/lib/auth-redirect';
import {
  orderApi, rememberDeviceOrder, saveOrderSession, type GuestCheckoutResult,
} from '@/lib/order-public-api';
import {
  EMPTY_EINVOICE_REQUEST, toEInvoiceRequestPayload, validateEInvoiceRequest,
  type EInvoiceRequestErrors,
} from '@/lib/einvoice-request';
// Loaded only after a successful order — keeps the QR/animation code out of the checkout bundle.
const ZaloOaRewardModal = dynamic(() => import('@/components/zalo-oa-reward/ZaloOaRewardModal'), { ssr: false });

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
  const [paymentMethod, setPaymentMethod] = useState<PaymentMethod>('COD');
  const [placedPaymentMethod, setPlacedPaymentMethod] = useState<PaymentMethod>('COD');
  // Receiving account for bank transfer — personal by default, Hộ kinh doanh on request.
  const [paymentAccountType, setPaymentAccountType] = useState<PaymentAccountType>('PERSONAL');
  // "Mua không cần đăng nhập": the placed order's link + security code, shown once.
  const [guestResult, setGuestResult] = useState<GuestCheckoutResult | null>(null);

  // ── Coupon state ──────────────────────────────────────────────────────────
  // Codes the customer picked/typed; re-validated whenever they, the address or the cart change.
  const [selectedCodes, setSelectedCodes] = useState<string[]>([]);
  const [validateResult, setValidateResult] = useState<ValidateCouponsResponse | null>(null);
  const [isValidating, setIsValidating] = useState(false);
  const validateSeq = useRef(0);

  // ── VAT e-invoice request ─────────────────────────────────────────────────
  const [wantsEInvoice, setWantsEInvoice] = useState(false);
  // "Tôi đồng ý với Điều khoản dịch vụ và Chính sách bảo mật" — required to place the order.
  const [acceptTerms, setAcceptTerms] = useState(false);
  const [termsError, setTermsError] = useState(false);
  const [einvoice, setEInvoice] = useState<EInvoiceRequestInput>({
    ...EMPTY_EINVOICE_REQUEST, buyerName: user?.name ?? '', email: user?.email ?? '',
  });
  const [einvoiceErrors, setEInvoiceErrors] = useState<EInvoiceRequestErrors>({});
  const [einvoiceSubmitted, setEInvoiceSubmitted] = useState(false);

  useEffect(() => { setMounted(true); }, []);

  // Not logged in → checkout as a guest ("user tạm" by recipient phone, followed via the order link).
  useEffect(() => {
    if (mounted && items.length === 0 && !success) router.replace('/cart');
  }, [mounted, items.length, success, router]);

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

  // Bank transfer is offered only while the shop's receiving account is configured.
  const { data: bankAvailability } = useBankTransferAvailability();
  const bankTransferAvailable = !!bankAvailability?.enabled;
  const effectivePaymentMethod: PaymentMethod = bankTransferAvailable ? paymentMethod : 'COD';
  const accountTypes = bankAvailability?.accountTypes ?? [];
  // An e-invoice is issued by the Hộ kinh doanh, so such an order is paid into that account
  // (the server enforces the same rule).
  const einvoiceForcesBusiness = wantsEInvoice && accountTypes.includes('BUSINESS');
  // The chosen account if the shop currently offers it, else the shop's default (none = server decides).
  const effectiveAccountType: PaymentAccountType | undefined = einvoiceForcesBusiness
    ? 'BUSINESS'
    : accountTypes.includes(paymentAccountType)
      ? paymentAccountType
      : bankAvailability?.defaultAccountType ?? undefined;

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

  function addCoupon(code: string) {
    if (selectedCodes.includes(code)) {
      toast('Mã này đã được thêm');
      return;
    }
    setSelectedCodes((prev) => [...prev, code]);
  }

  function removeCoupon(code: string) {
    setSelectedCodes((prev) => prev.filter((c) => c !== code));
  }

  const onSubmit = async (data: ShippingForm) => {
    if (isValidating) {
      toast('Đang kiểm tra mã giảm giá, vui lòng đợi giây lát');
      return;
    }
    if (!acceptTerms) {
      setTermsError(true);
      toast.error('Vui lòng đồng ý với Điều khoản dịch vụ và Chính sách bảo mật');
      return;
    }
    if (wantsEInvoice) {
      setEInvoiceSubmitted(true);
      const found = validateEInvoiceRequest(einvoice);
      setEInvoiceErrors(found);
      if (Object.keys(found).length) {
        toast.error('Vui lòng kiểm tra thông tin xuất hoá đơn điện tử');
        return;
      }
    }
    try {
      const payload = {
        items: items.map((i) => ({
          productId: i.productId,
          quantity: i.quantity,
          ...(i.color ? { color: i.color } : {}),
          ...(i.size ? { size: i.size } : {}),
        })),
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
        ...(wantsEInvoice ? { einvoiceRequest: toEInvoiceRequestPayload(einvoice) } : {}),
        paymentMethod: effectivePaymentMethod,
        ...(effectivePaymentMethod === 'BANK_TRANSFER' && effectiveAccountType
          ? { paymentAccountType: effectiveAccountType }
          : {}),
        acceptTerms: true,
      };
      if (!isAuthenticated) {
        const { couponCodes: _ignored, ...guestPayload } = payload as typeof payload & { couponCodes?: string[] };
        const gRes = await orderApi.post<ApiResponse<GuestCheckoutResult>>('/orders/guest-checkout', guestPayload);
        const result = gRes.data.data;
        saveOrderSession(result.publicAccess.token, result.publicAccess.accessJwt);
        rememberDeviceOrder({
          token: result.publicAccess.token,
          orderCode: result.order.orderCode,
          total: result.order.total,
          createdAt: result.order.createdAt,
        });
        clearCart();
        setGuestResult(result);
        setSuccess(true);
        window.scrollTo({ top: 0 });
        return;
      }

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
      setPlacedPaymentMethod(newOrder.paymentMethod ?? 'COD');
      setSuccess(true);
    } catch (err: unknown) {
      const msg = (err as { response?: { data?: { message?: string } } })?.response?.data?.message;
      toast.error(msg || 'Đặt hàng thất bại, vui lòng thử lại');
    }
  };

  // Same fee rule as the backend, so the total shown is the total charged (prices include VAT).
  const selectedCity = watch('city');
  const shippingFee = selectedCity ? computeShippingFee(selectedCity) : 0;
  const cartTotal = total();

  // Server-side check of the selected codes. The city matters for free-shipping codes (the server
  // prices them against its own fee for that province); stale responses are dropped.
  useEffect(() => {
    const seq = ++validateSeq.current;
    if (!selectedCodes.length || !isAuthenticated) {
      setValidateResult(null);
      setIsValidating(false);
      return;
    }
    setIsValidating(true);
    const timer = setTimeout(async () => {
      try {
        const res = await api.post<ApiResponse<ValidateCouponsResponse>>('/promotions/validate', {
          couponCodes: selectedCodes,
          orderTotal: cartTotal,
          ...(selectedCity ? { city: selectedCity } : {}),
        });
        if (seq === validateSeq.current) setValidateResult(res.data.data);
      } catch {
        if (seq !== validateSeq.current) return;
        setValidateResult({
          appliedCoupons: [],
          rejectedCoupons: selectedCodes.map((code) => ({ code, reason: 'Không thể kiểm tra mã, vui lòng thử lại' })),
          totalDiscount: 0,
          finalTotal: cartTotal,
          shippingDiscount: 0,
          shippingFee: null,
        });
      } finally {
        if (seq === validateSeq.current) setIsValidating(false);
      }
    }, 250);
    return () => clearTimeout(timer);
  }, [selectedCodes, selectedCity, cartTotal, isAuthenticated]);

  const goodsDiscount = validateResult?.totalDiscount ?? 0;
  const shippingDiscount = selectedCity ? Math.min(validateResult?.shippingDiscount ?? 0, shippingFee) : 0;
  const grandTotal = (validateResult ? validateResult.finalTotal : cartTotal) + shippingFee - shippingDiscount;

  if (!mounted) return null;

  if (success && guestResult) return <GuestOrderSuccess result={guestResult} />;

  // ── Success screen ────────────────────────────────────────────────────────
  if (success && orderId && placedPaymentMethod === 'BANK_TRANSFER') {
    return (
      <Container maxWidth="sm" sx={{ py: { xs: 4, md: 7 } }}>
        <Box sx={{ textAlign: 'center', mb: 3 }}>
          <CheckCircleOutlinedIcon sx={{ fontSize: 56, color: 'success.main' }} />
          <Typography variant="h5" sx={{ fontWeight: 700, mt: 1 }}>Đặt hàng thành công!</Typography>
          <Typography color="text.secondary">Vui lòng hoàn tất chuyển khoản để Luxe Glow xử lý đơn hàng.</Typography>
        </Box>
        <BankTransferPayment orderId={orderId} showOrderLink />
        <Button component={Link} href="/products" fullWidth sx={{ mt: 1, color: 'text.secondary' }}>Tiếp tục mua hàng</Button>
        <ZaloOaRewardModal orderId={orderId} />
      </Container>
    );
  }

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
        {/* Zalo OA welcome reward — renders nothing unless the backend says this order is eligible. */}
        {orderId && <ZaloOaRewardModal orderId={orderId} />}
      </Box>
    );
  }

  return (
    <Container maxWidth="md" sx={{ py: { xs: 4, md: 7 } }}>
      <Button component={Link} href="/cart" startIcon={<ArrowBackIcon />} sx={{ mb: 3, color: 'text.secondary' }}>
        Quay lại giỏ hàng
      </Button>

      <Typography variant="h4" sx={{ mb: isAuthenticated ? 4 : 2, fontWeight: 700 }}>Thanh toán</Typography>

      {!isAuthenticated && (
        <Alert
          severity="info"
          sx={{ mb: 3, borderRadius: 3 }}
          action={
            <Button component={Link} href={loginHref('/checkout')} color="inherit" size="small" sx={{ fontWeight: 600, whiteSpace: 'nowrap' }}>
              Đăng nhập
            </Button>
          }
        >
          Bạn có thể đặt hàng <b>không cần đăng nhập</b>. Sau khi đặt, bạn nhận link xem đơn + mã bảo mật để theo dõi
          đơn bằng số điện thoại nhận hàng. Đăng nhập để dùng mã giảm giá và lưu lịch sử đơn hàng.
        </Alert>
      )}

      <form onSubmit={handleSubmit(onSubmit)}>
        <Grid container spacing={4}>

          {/* ── Left: shipping form ── */}
          <Grid size={{ xs: 12, md: 7 }}>

            {/* Section 1 — Thông tin người nhận */}
            <Card variant="outlined" sx={{ borderRadius: 3, mb: 3 }}>
              <CardContent sx={{ p: 3 }}>
                <Typography variant="h6" sx={{ fontWeight: 700, mb: 2.5 }}>Thông tin người nhận</Typography>
                {!isAuthenticated && (
                  <Typography variant="body2" color="text.secondary" sx={{ mt: -1.5, mb: 2 }}>
                    Số điện thoại này dùng để xem đơn hàng sau khi đặt.
                  </Typography>
                )}
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

                {!bankTransferAvailable && (
                  <Alert severity="info" sx={{ mt: 3, borderRadius: 2 }}>
                    Phương thức thanh toán: <strong>Thanh toán khi nhận hàng (COD)</strong>
                  </Alert>
                )}
              </CardContent>
            </Card>

            {/* Phương thức thanh toán — only shown when bank transfer is available */}
            {bankTransferAvailable && (
              <Card variant="outlined" sx={{ borderRadius: 3, mt: 3 }}>
                <CardContent sx={{ p: 3 }}>
                  <Typography variant="h6" sx={{ fontWeight: 700, mb: 1.5 }}>Phương thức thanh toán</Typography>
                  <RadioGroup value={paymentMethod} onChange={(e) => setPaymentMethod(e.target.value as PaymentMethod)}>
                    <FormControlLabel value="COD" control={<Radio />} label="Thanh toán khi nhận hàng (COD)" />
                    <FormControlLabel
                      value="BANK_TRANSFER"
                      control={<Radio />}
                      label={
                        <Box>
                          <Typography variant="body1">Chuyển khoản ngân hàng (VietQR)</Typography>
                          <Typography variant="caption" color="text.secondary">
                            Quét mã QR bằng ứng dụng ngân hàng sau khi đặt hàng — số tiền và nội dung đã điền sẵn
                          </Typography>
                        </Box>
                      }
                      sx={{ alignItems: 'flex-start', mt: 0.5, '& .MuiRadio-root': { pt: 0.5 } }}
                    />
                  </RadioGroup>
                  {paymentMethod === 'BANK_TRANSFER' && accountTypes.length > 1 && (
                    <Box sx={{ mt: 2, ml: { xs: 0, sm: 4 }, p: 2, borderRadius: 2, bgcolor: 'grey.50', border: '1px solid', borderColor: 'divider' }}>
                      <Typography variant="body2" sx={{ fontWeight: 600, mb: 0.5 }}>Tài khoản nhận tiền</Typography>
                      <RadioGroup
                        value={effectiveAccountType ?? ''}
                        onChange={(e) => setPaymentAccountType(e.target.value as PaymentAccountType)}
                      >
                        {accountTypes.map((t) => (
                          <FormControlLabel
                            key={t}
                            value={t}
                            disabled={einvoiceForcesBusiness && t !== 'BUSINESS'}
                            control={<Radio size="small" />}
                            label={
                              <Typography variant="body2">
                                {PAYMENT_ACCOUNT_LABEL[t]}
                                {t === bankAvailability?.defaultAccountType && (
                                  <Typography component="span" variant="caption" color="text.secondary"> (mặc định)</Typography>
                                )}
                              </Typography>
                            }
                          />
                        ))}
                      </RadioGroup>
                      {einvoiceForcesBusiness && (
                        <Typography variant="caption" color="text.secondary" sx={{ display: 'block', mt: 0.5 }}>
                          Đơn có yêu cầu xuất hoá đơn điện tử sẽ chuyển khoản vào tài khoản Hộ kinh doanh Luxe Glow
                          (đơn vị xuất hoá đơn).
                        </Typography>
                      )}
                    </Box>
                  )}
                  {paymentMethod === 'BANK_TRANSFER' && (
                    <Alert severity="info" sx={{ mt: 2, borderRadius: 2 }}>
                      Mã QR thanh toán sẽ hiển thị ngay sau khi bạn bấm <strong>Đặt hàng &amp; lấy mã QR</strong> — số tiền
                      và nội dung chuyển khoản được tạo riêng cho đơn hàng của bạn.
                    </Alert>
                  )}
                </CardContent>
              </Card>
            )}

            {/* Section 3 — Mã giảm giá (cần tài khoản: giới hạn lượt dùng tính theo khách) */}
            {isAuthenticated ? (
              <CouponSection
                coupons={coupons}
                selectedCodes={selectedCodes}
                validateResult={validateResult}
                isValidating={isValidating}
                onAdd={addCoupon}
                onRemove={removeCoupon}
              />
            ) : (
              <Card variant="outlined" sx={{ borderRadius: 3, mt: 3 }}>
                <CardContent sx={{ p: 3, display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 2, flexWrap: 'wrap' }}>
                  <Box>
                    <Typography variant="h6" sx={{ fontWeight: 700 }}>Mã giảm giá</Typography>
                    <Typography variant="body2" color="text.secondary">Đăng nhập để sử dụng mã giảm giá / miễn phí vận chuyển.</Typography>
                  </Box>
                  <Button component={Link} href={loginHref('/checkout')} variant="outlined" sx={{ borderRadius: 980 }}>Đăng nhập</Button>
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

            {/* Section 5 — Hoá đơn điện tử (VAT) */}
            <Card variant="outlined" sx={{ borderRadius: 3, mt: 3 }}>
              <CardContent sx={{ p: 3 }}>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 0.5 }}>
                  <ReceiptLongOutlinedIcon sx={{ fontSize: 20, color: 'primary.main' }} />
                  <Typography variant="h6" sx={{ fontWeight: 700 }}>Hoá đơn điện tử</Typography>
                </Box>
                <FormControlLabel
                  control={<Checkbox checked={wantsEInvoice} onChange={(e) => setWantsEInvoice(e.target.checked)} />}
                  label="Yêu cầu xuất hoá đơn điện tử (VAT)"
                />
                {wantsEInvoice && (
                  <Box sx={{ mt: 1.5 }}>
                    <EInvoiceRequestFields
                      value={einvoice}
                      onChange={(v) => {
                        setEInvoice(v);
                        if (einvoiceSubmitted) setEInvoiceErrors(validateEInvoiceRequest(v));
                      }}
                      errors={einvoiceErrors}
                    />
                    {effectivePaymentMethod === 'BANK_TRANSFER' && einvoiceForcesBusiness && (
                      <Alert severity="info" sx={{ mt: 1.5, borderRadius: 2 }}>
                        Khi yêu cầu hoá đơn, bạn chuyển khoản vào <strong>tài khoản Hộ kinh doanh Luxe Glow</strong> — mã QR
                        sau khi đặt hàng sẽ dùng tài khoản này.
                      </Alert>
                    )}
                  </Box>
                )}
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
                    <Box key={`${item.productId}-${item.color ?? ''}-${item.size ?? ''}`} sx={{ display: 'flex', gap: 1.5, alignItems: 'center' }}>
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
                        {(item.color || item.size) && (
                          <Typography variant="caption" color="text.secondary" sx={{ display: 'block' }}>
                            {[item.color, item.size].filter(Boolean).join(' · ')}
                          </Typography>
                        )}
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
                    <Typography variant="body2" sx={{ fontWeight: 500 }}>{formatCurrency(cartTotal)}</Typography>
                  </Box>
                  {goodsDiscount > 0 && (
                    <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                      <Typography variant="body2" color="success.main">Giảm giá</Typography>
                      <Typography variant="body2" color="success.main" sx={{ fontWeight: 600 }}>
                        -{formatCurrency(goodsDiscount)}
                      </Typography>
                    </Box>
                  )}
                  <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                    <Typography variant="body2" color="text.secondary">Phí vận chuyển</Typography>
                    {selectedCity ? (
                      <Typography variant="body2" sx={{ fontWeight: 600 }}>+{formatCurrency(shippingFee)}</Typography>
                    ) : (
                      <Typography variant="body2" color="text.secondary">Chọn địa chỉ giao hàng</Typography>
                    )}
                  </Box>
                  {shippingDiscount > 0 && (
                    <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                      <Typography variant="body2" color="success.main">Miễn phí vận chuyển</Typography>
                      <Typography variant="body2" color="success.main" sx={{ fontWeight: 600 }}>
                        -{formatCurrency(shippingDiscount)}
                      </Typography>
                    </Box>
                  )}
                </Stack>

                <Divider sx={{ mb: 2 }} />

                <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 3 }}>
                  <Typography sx={{ fontWeight: 700 }}>Tổng cộng</Typography>
                  <Typography color="primary.main" variant="h6" sx={{ fontWeight: 700 }}>
                    {formatCurrency(grandTotal)}
                  </Typography>
                </Box>

                <FormControlLabel
                  control={
                    <Checkbox
                      size="small"
                      checked={acceptTerms}
                      onChange={(e) => { setAcceptTerms(e.target.checked); if (e.target.checked) setTermsError(false); }}
                    />
                  }
                  label={
                    <Typography variant="caption" sx={{ lineHeight: 1.5, display: 'block' }}>
                      Tôi đồng ý với{' '}
                      <Link href="/terms-of-service" target="_blank" style={{ color: '#007AFF', fontWeight: 600 }}>Điều khoản dịch vụ</Link>
                      {' '}và{' '}
                      <Link href="/privacy-policy" target="_blank" style={{ color: '#007AFF', fontWeight: 600 }}>Chính sách bảo mật</Link>
                      {' '}(bao gồm việc xử lý thông tin giao hàng để thực hiện đơn hàng)
                    </Typography>
                  }
                  sx={{ alignItems: 'flex-start', mr: 0, mb: termsError ? 0.5 : 2, '& .MuiCheckbox-root': { pt: 0.25 } }}
                />
                {termsError && (
                  <Typography variant="caption" color="error" sx={{ display: 'block', mb: 2 }}>
                    Vui lòng đồng ý để đặt hàng
                  </Typography>
                )}

                <Button
                  type="submit" fullWidth variant="contained" size="large"
                  disabled={isSubmitting || isValidating} sx={{ py: 1.5, fontWeight: 600 }}
                >
                  {isSubmitting
                    ? <CircularProgress size={22} color="inherit" />
                    : effectivePaymentMethod === 'BANK_TRANSFER' ? 'Đặt hàng & lấy mã QR' : 'Đặt hàng'}
                </Button>
              </CardContent>
            </Card>
          </Grid>

        </Grid>
      </form>
    </Container>
  );
}

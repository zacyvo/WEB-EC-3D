'use client';

import { useCallback, useEffect, useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import toast from 'react-hot-toast';
import {
  Alert, Box, Button, Card, CardContent, Chip, CircularProgress, Container, Divider, Paper,
  Stack, Step, StepLabel, Stepper, TextField, Typography,
} from '@mui/material';
import LockOutlinedIcon from '@mui/icons-material/LockOutlined';
import RefreshOutlinedIcon from '@mui/icons-material/RefreshOutlined';
import LogoutOutlinedIcon from '@mui/icons-material/LogoutOutlined';
import { formatCurrency, formatDate, ORDER_STATUS_MAP } from '@/lib/utils';
import type { OrderStatus, PaymentMethod } from '@/types';
import BankTransferPayment from '@/components/bank-transfer/BankTransferPayment';
import {
  clearOrderSession, errMsg, forgetDeviceOrder, loadOrderSession, orderAccessHeaders, orderApi, saveOrderSession,
} from '@/lib/order-public-api';

interface OrderMeta {
  orderCode: string;
  maskedPhone: string;
}

/** Mirrors backend PublicOrderView (orders/order-public-access.service.ts). */
interface PublicOrder {
  orderCode: string;
  status: OrderStatus;
  paymentMethod?: PaymentMethod;
  items: {
    productName: string;
    productImage: string;
    productSlug: string;
    quantity: number;
    unitPrice: number;
    subtotal: number;
    color?: string;
    size?: string;
    note?: string;
  }[];
  subtotal: number;
  discountAmount: number;
  shippingFee: number;
  shippingDiscount: number;
  vatAmount: number;
  total: number;
  paidAmount: number;
  shippingInfo: {
    recipientName: string;
    phone: string;
    street: string;
    ward: string;
    district: string;
    city: string;
    note?: string;
  };
  delivery?: {
    carrierName?: string;
    trackingCode?: string;
    trackingUrl?: string;
    estimatedDeliveryDate?: string;
  };
  customerNote?: string;
  csNote?: string;
  cancelReason?: string;
  deliveredAt?: string;
  createdAt: string;
  updatedAt: string;
}

const PROGRESS: { status: OrderStatus; label: string }[] = [
  { status: 'PENDING', label: 'Chờ xác nhận' },
  { status: 'CONFIRMED', label: 'Đã xác nhận' },
  { status: 'PROCESSING', label: 'Chuẩn bị hàng' },
  { status: 'SHIPPED', label: 'Đang giao' },
  { status: 'DELIVERED', label: 'Đã giao' },
];

function Row({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: 2 }}>
      <Typography variant="body2" color="text.secondary">{label}</Typography>
      {children}
    </Box>
  );
}

export default function PublicOrderPage({ params }: { params: { token: string } }) {
  const { token } = params;

  const [mounted, setMounted] = useState(false);
  const [loadingMeta, setLoadingMeta] = useState(true);
  const [meta, setMeta] = useState<OrderMeta | null>(null);
  const [metaError, setMetaError] = useState<string | null>(null);
  const [jwt, setJwt] = useState<string | null>(null);
  const [order, setOrder] = useState<PublicOrder | null>(null);
  const [phone, setPhone] = useState('');
  const [code, setCode] = useState('');
  // "Quên mã bảo mật" → unlock with phone + delivery street instead.
  const [forgotCode, setForgotCode] = useState(false);
  const [street, setStreet] = useState('');
  const [verifying, setVerifying] = useState(false);
  const [refreshing, setRefreshing] = useState(false);

  const clearSession = useCallback(() => {
    clearOrderSession(token);
    setJwt(null);
    setOrder(null);
  }, [token]);

  // ── Load meta + phiên đã lưu (trong tab hiện tại) ──
  useEffect(() => {
    setMounted(true);
    let cancelled = false;
    (async () => {
      try {
        const res = await orderApi.get(`/orders/public/${token}/meta`);
        if (cancelled) return;
        setMeta(res.data.data);

        const savedJwt = loadOrderSession(token);
        if (savedJwt) {
          try {
            const oRes = await orderApi.get(`/orders/public/${token}`, orderAccessHeaders(savedJwt));
            if (cancelled) return;
            setJwt(savedJwt);
            setOrder(oRes.data.data);
          } catch {
            clearOrderSession(token);
          }
        }
      } catch (err) {
        if (cancelled) return;
        setMetaError(errMsg(err, 'Liên kết không hợp lệ hoặc đã hết hiệu lực'));
        // A re-issued / removed link: drop it from "Đơn đã đặt trên thiết bị này".
        if ((err as { response?: { status?: number } })?.response?.status === 404) forgetDeviceOrder(token);
      } finally {
        if (!cancelled) setLoadingMeta(false);
      }
    })();
    return () => { cancelled = true; };
  }, [token]);

  const handleVerify = async (e: React.FormEvent) => {
    e.preventDefault();
    const secret = forgotCode ? street.trim() : code.trim();
    if (!phone.trim() || !secret) return;
    setVerifying(true);
    try {
      const res = await orderApi.post(`/orders/public/${token}/verify`, {
        phone: phone.trim(),
        ...(forgotCode ? { street: secret } : { securityCode: secret }),
      });
      const { accessJwt, order: o } = res.data.data;
      saveOrderSession(token, accessJwt);
      setJwt(accessJwt);
      setOrder(o);
      setCode('');
      setStreet('');
    } catch (err) {
      toast.error(errMsg(err, 'Xác thực thất bại'));
    } finally {
      setVerifying(false);
    }
  };

  const refresh = async () => {
    if (!jwt) return;
    setRefreshing(true);
    try {
      const res = await orderApi.get(`/orders/public/${token}`, orderAccessHeaders(jwt));
      setOrder(res.data.data);
      toast.success('Đã cập nhật đơn hàng');
    } catch (err) {
      toast.error(errMsg(err, 'Phiên đã hết hạn, vui lòng xác thực lại'));
      clearSession();
    } finally {
      setRefreshing(false);
    }
  };

  // ── Render ──
  if (!mounted || loadingMeta) {
    return (
      <Container maxWidth="sm" sx={{ py: 10, textAlign: 'center' }}>
        <CircularProgress size={28} />
      </Container>
    );
  }

  if (metaError || !meta) {
    return (
      <Container maxWidth="sm" sx={{ py: 8 }}>
        <Alert severity="error" sx={{ borderRadius: 3 }}>
          {metaError || 'Liên kết không hợp lệ hoặc đã hết hiệu lực'}
        </Alert>
        <Typography variant="body2" color="text.secondary" sx={{ mt: 2 }}>
          Nếu shop vừa gửi lại link mới, vui lòng mở link mới nhất. Cần hỗ trợ? Liên hệ shop qua Zalo / Fanpage.
        </Typography>
      </Container>
    );
  }

  // ── Màn hình xác thực ──
  if (!jwt || !order) {
    return (
      <Container maxWidth="sm" sx={{ py: { xs: 5, md: 8 } }}>
        <Paper elevation={0} sx={{ p: { xs: 3, md: 4 }, borderRadius: 4, border: '1px solid', borderColor: 'grey.200' }}>
          <Stack spacing={2.5} sx={{ alignItems: 'center', textAlign: 'center' }}>
            <Box sx={{ width: 56, height: 56, borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', backgroundColor: '#EFF6FF' }}>
              <LockOutlinedIcon sx={{ color: '#2563EB' }} />
            </Box>
            <Box>
              <Typography variant="h5" sx={{ fontWeight: 700 }}>Đơn hàng #{meta.orderCode}</Typography>
              <Typography variant="body2" color="text.secondary" sx={{ mt: 0.5 }}>Luxe Glow</Typography>
            </Box>
            <Alert severity="info" sx={{ borderRadius: 3, width: '100%', textAlign: 'left' }}>
              {forgotCode ? (
                <>Nhập số điện thoại <b>{meta.maskedPhone}</b> và <b>địa chỉ nhận hàng</b> (số nhà, tên đường) đúng như lúc đặt hàng.</>
              ) : (
                <>Nhập số điện thoại <b>{meta.maskedPhone}</b> và mã bảo mật 8 ký tự (hiển thị khi đặt hàng hoặc do shop gửi) để xem đơn hàng.</>
              )}{' '}
              Không cần đăng nhập.
            </Alert>

            <Box component="form" onSubmit={handleVerify} sx={{ width: '100%' }}>
              <Stack spacing={2}>
                <TextField
                  label="Số điện thoại"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  placeholder="VD: 0909064680"
                  fullWidth
                  autoComplete="tel"
                  slotProps={{ htmlInput: { inputMode: 'tel' } }}
                />
                {forgotCode ? (
                  <TextField
                    label="Số nhà, tên đường nhận hàng"
                    value={street}
                    onChange={(e) => setStreet(e.target.value)}
                    placeholder="VD: 123 Nguyễn Huệ"
                    fullWidth
                    autoComplete="street-address"
                    helperText="Không phân biệt hoa thường, dấu và dấu câu"
                  />
                ) : (
                  <TextField
                    label="Mã bảo mật (8 ký tự)"
                    value={code}
                    onChange={(e) => setCode(e.target.value.toUpperCase())}
                    placeholder="VD: A2B3C4D5"
                    fullWidth
                    autoComplete="one-time-code"
                    slotProps={{ htmlInput: { maxLength: 8, style: { letterSpacing: 4, textTransform: 'uppercase', fontFamily: 'monospace' } } }}
                  />
                )}
                <Button
                  type="submit"
                  variant="contained"
                  size="large"
                  disabled={verifying || !phone.trim() || !(forgotCode ? street.trim() : code.trim())}
                  sx={{ borderRadius: 980, fontWeight: 600, textTransform: 'none' }}
                >
                  {verifying ? 'Đang xác thực...' : 'Xem đơn hàng'}
                </Button>
              </Stack>
            </Box>
            <Button
              variant="text"
              size="small"
              onClick={() => setForgotCode((v) => !v)}
              sx={{ textTransform: 'none', fontWeight: 600 }}
            >
              {forgotCode ? 'Dùng mã bảo mật' : 'Quên mã bảo mật? Xem bằng địa chỉ nhận hàng'}
            </Button>
            <Typography variant="caption" color="text.secondary">
              Nhập sai 5 lần liên tiếp, đơn sẽ tạm khoá 15 phút. Cần hỗ trợ? Liên hệ shop qua Zalo / Fanpage.
            </Typography>
          </Stack>
        </Paper>
      </Container>
    );
  }

  // ── Chi tiết đơn ──
  const statusInfo = ORDER_STATUS_MAP[order.status] || { label: order.status, chipSx: {} };
  const activeStep = PROGRESS.findIndex((p) => p.status === order.status);
  const due = Math.max(0, order.total - order.paidAmount);
  const d = order.delivery;

  return (
    <Container maxWidth="sm" sx={{ py: { xs: 4, md: 7 } }}>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3, gap: 2 }}>
        <Box>
          <Typography variant="h5" sx={{ fontWeight: 700 }}>Đơn #{order.orderCode}</Typography>
          <Typography variant="caption" color="text.secondary">Đặt lúc {formatDate(order.createdAt)}</Typography>
        </Box>
        <Chip label={statusInfo.label} variant="outlined" sx={statusInfo.chipSx} />
      </Box>

      {/* Tiến trình */}
      {order.status === 'CANCELLED' ? (
        <Alert severity="error" sx={{ mb: 2, borderRadius: 3 }}>
          Đơn hàng đã bị hủy.{order.cancelReason && <><br />Lý do: {order.cancelReason}</>}
        </Alert>
      ) : (
        <Card variant="outlined" sx={{ borderRadius: 3, mb: 2 }}>
          <CardContent sx={{ p: { xs: 2, sm: 3 }, overflowX: 'auto' }}>
            <Stepper activeStep={order.status === 'DELIVERED' ? PROGRESS.length : activeStep} alternativeLabel>
              {PROGRESS.map((p) => (
                <Step key={p.status}>
                  <StepLabel slotProps={{ label: { style: { fontSize: 12 } } }}>{p.label}</StepLabel>
                </Step>
              ))}
            </Stepper>
          </CardContent>
        </Card>
      )}

      {/* Sản phẩm + thanh toán */}
      <Card variant="outlined" sx={{ borderRadius: 3, mb: 2 }}>
        <CardContent sx={{ p: 3 }}>
          <Typography variant="h6" gutterBottom sx={{ fontWeight: 700 }}>Sản phẩm</Typography>
          <Stack spacing={2} sx={{ mb: 2 }}>
            {order.items.map((item, i) => (
              <Box key={i} sx={{ display: 'flex', gap: 2 }}>
                <Box sx={{ position: 'relative', width: 56, height: 56, borderRadius: 2, overflow: 'hidden', bgcolor: 'grey.50', flexShrink: 0 }}>
                  {item.productImage && <Image src={item.productImage} alt={item.productName} fill sizes="56px" style={{ objectFit: 'cover' }} />}
                </Box>
                <Box sx={{ flex: 1, minWidth: 0 }}>
                  <Typography component={Link} href={`/products/${item.productSlug}`} variant="body2" sx={{ textDecoration: 'none', color: 'text.primary', fontWeight: 500, display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical', overflow: 'hidden', '&:hover': { color: 'primary.main' } }}>
                    {item.productName}
                  </Typography>
                  {(item.color || item.size) && (
                    <Typography variant="caption" color="text.secondary" sx={{ display: 'block', mt: 0.25 }}>
                      {[item.color, item.size].filter(Boolean).join(' · ')}
                    </Typography>
                  )}
                  {item.note && (
                    <Typography variant="caption" color="text.disabled" sx={{ display: 'block' }}>Ghi chú: {item.note}</Typography>
                  )}
                  <Box sx={{ display: 'flex', justifyContent: 'space-between', mt: 0.5 }}>
                    <Typography variant="caption" color="text.disabled">{formatCurrency(item.unitPrice)} × {item.quantity}</Typography>
                    <Typography variant="body2" color="primary.main" sx={{ fontWeight: 700 }}>{formatCurrency(item.subtotal)}</Typography>
                  </Box>
                </Box>
              </Box>
            ))}
          </Stack>
          <Divider sx={{ mb: 2 }} />
          <Stack spacing={1}>
            <Row label="Tạm tính"><Typography variant="body2" sx={{ fontWeight: 600 }}>{formatCurrency(order.subtotal)}</Typography></Row>
            {order.discountAmount > 0 && (
              <Row label="Giảm giá"><Typography variant="body2" color="success.main" sx={{ fontWeight: 600 }}>-{formatCurrency(order.discountAmount)}</Typography></Row>
            )}
            {(order.shippingFee > 0 || order.shippingDiscount > 0) && (
              <Row label="Phí vận chuyển">
                <Typography variant="body2" sx={{ fontWeight: 600 }}>+{formatCurrency(order.shippingFee + order.shippingDiscount)}</Typography>
              </Row>
            )}
            {order.shippingDiscount > 0 && (
              <Row label="Miễn phí vận chuyển"><Typography variant="body2" color="success.main" sx={{ fontWeight: 600 }}>-{formatCurrency(order.shippingDiscount)}</Typography></Row>
            )}
            {order.vatAmount > 0 && (
              <Row label="VAT (hoá đơn điện tử)"><Typography variant="body2" sx={{ fontWeight: 600 }}>+{formatCurrency(order.vatAmount)}</Typography></Row>
            )}
            <Row label="Tổng đơn hàng"><Typography variant="body2" sx={{ fontWeight: 600 }}>{formatCurrency(order.total)}</Typography></Row>
            {order.paidAmount > 0 && (
              <Row label="Đã thanh toán"><Typography variant="body2" sx={{ fontWeight: 600, color: 'success.main' }}>{formatCurrency(order.paidAmount)}</Typography></Row>
            )}
            <Divider sx={{ my: 0.5 }} />
            <Row label="Cần thanh toán">
              <Typography color="primary.main" variant="h6" sx={{ fontWeight: 700 }}>{formatCurrency(order.status === 'CANCELLED' ? 0 : due)}</Typography>
            </Row>
          </Stack>
        </CardContent>
      </Card>

      {/* Chuyển khoản VietQR (đơn đặt không cần đăng nhập) */}
      {order.paymentMethod === 'BANK_TRANSFER' && (
        <BankTransferPayment orderId={token} publicAccess={{ token, jwt }} refreshKey={order.updatedAt} />
      )}

      {/* Giao hàng */}
      <Card variant="outlined" sx={{ borderRadius: 3, mb: 2 }}>
        <CardContent sx={{ p: 3 }}>
          <Typography variant="h6" gutterBottom sx={{ fontWeight: 700 }}>Thông tin giao hàng</Typography>
          <Stack spacing={0.5}>
            <Typography variant="body2" sx={{ fontWeight: 600 }}>{order.shippingInfo.recipientName}</Typography>
            <Typography variant="body2" color="text.secondary">{order.shippingInfo.phone}</Typography>
            <Typography variant="body2" color="text.secondary">
              {[order.shippingInfo.street, order.shippingInfo.ward, order.shippingInfo.district, order.shippingInfo.city].filter(Boolean).join(', ')}
            </Typography>
            {order.shippingInfo.note && <Typography variant="body2" color="text.disabled">Ghi chú: {order.shippingInfo.note}</Typography>}
          </Stack>
        </CardContent>
      </Card>

      {d && (
        <Card variant="outlined" sx={{ borderRadius: 3, mb: 2 }}>
          <CardContent sx={{ p: 3 }}>
            <Typography variant="h6" gutterBottom sx={{ fontWeight: 700 }}>Đơn vị vận chuyển</Typography>
            <Stack spacing={1}>
              {d.carrierName && <Row label="Đơn vị"><Typography variant="body2" sx={{ fontWeight: 600 }}>{d.carrierName}</Typography></Row>}
              {d.trackingCode && (
                <Row label="Mã vận chuyển">
                  <Typography variant="body2" sx={{ fontWeight: 700, fontFamily: 'monospace', letterSpacing: 0.5 }}>{d.trackingCode}</Typography>
                </Row>
              )}
              {d.estimatedDeliveryDate && (
                <Row label="Ngày giao dự kiến">
                  <Typography variant="body2" sx={{ fontWeight: 700, color: 'success.dark' }}>
                    {new Date(d.estimatedDeliveryDate).toLocaleDateString('vi-VN', { weekday: 'short', day: '2-digit', month: '2-digit', year: 'numeric' })}
                  </Typography>
                </Row>
              )}
              {d.trackingUrl && (
                <Row label="Theo dõi đơn">
                  <Typography component="a" href={d.trackingUrl} target="_blank" rel="noopener noreferrer" variant="body2" sx={{ fontWeight: 600, color: 'primary.main', textDecoration: 'underline' }}>
                    Xem tại đây
                  </Typography>
                </Row>
              )}
            </Stack>
          </CardContent>
        </Card>
      )}

      {(order.customerNote || order.csNote) && (
        <Card variant="outlined" sx={{ borderRadius: 3, mb: 2 }}>
          <CardContent sx={{ p: 3 }}>
            <Stack spacing={1.5}>
              {order.customerNote && (
                <Box>
                  <Typography variant="caption" color="text.secondary" sx={{ fontWeight: 600 }}>Ghi chú đơn hàng</Typography>
                  <Typography variant="body2" sx={{ whiteSpace: 'pre-wrap' }}>{order.customerNote}</Typography>
                </Box>
              )}
              {order.csNote && (
                <Box sx={{ p: 2, bgcolor: 'info.50', borderRadius: 2, border: '1px solid', borderColor: 'info.200' }}>
                  <Typography variant="caption" color="info.main" sx={{ fontWeight: 600 }}>Ghi chú từ shop</Typography>
                  <Typography variant="body2" color="info.dark" sx={{ mt: 0.5, whiteSpace: 'pre-wrap' }}>{order.csNote}</Typography>
                </Box>
              )}
            </Stack>
          </CardContent>
        </Card>
      )}

      <Typography variant="caption" color="text.secondary" sx={{ display: 'block', textAlign: 'center', mb: 2 }}>
        Cập nhật lần cuối {formatDate(order.updatedAt)}
      </Typography>

      <Stack direction="row" spacing={1.5}>
        <Button
          fullWidth
          variant="outlined"
          startIcon={<RefreshOutlinedIcon />}
          onClick={refresh}
          disabled={refreshing}
          sx={{ borderRadius: 980, textTransform: 'none', fontWeight: 600 }}
        >
          {refreshing ? 'Đang tải...' : 'Tải lại'}
        </Button>
        <Button
          fullWidth
          variant="text"
          color="inherit"
          startIcon={<LogoutOutlinedIcon />}
          onClick={clearSession}
          sx={{ borderRadius: 980, textTransform: 'none' }}
        >
          Thoát
        </Button>
      </Stack>
    </Container>
  );
}

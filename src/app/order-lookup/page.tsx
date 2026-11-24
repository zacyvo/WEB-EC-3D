'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import toast from 'react-hot-toast';
import {
  Alert, Box, Button, Card, CardActionArea, CardContent, Chip, Container, Paper, Stack, Tab, Tabs, TextField, Typography,
} from '@mui/material';
import SearchOutlinedIcon from '@mui/icons-material/SearchOutlined';
import ChevronRightIcon from '@mui/icons-material/ChevronRight';
import { formatCurrency, formatDate, ORDER_STATUS_MAP } from '@/lib/utils';
import { useAuthStore } from '@/lib/store/auth.store';
import {
  errMsg, loadDeviceOrders, orderApi, orderLinkPath, rememberDeviceOrder, saveOrderSession,
  type DeviceOrder, type LookedUpOrder,
} from '@/lib/order-public-api';

/**
 * "Tra cứu đơn hàng" — for orders placed without login (or created by the shop) when the customer
 * no longer has the link: phone + security code, or phone + delivery street ("Quên mã bảo mật").
 */
export default function OrderLookupPage() {
  const router = useRouter();
  const { isAuthenticated } = useAuthStore();
  const [mounted, setMounted] = useState(false);
  const [mode, setMode] = useState<'code' | 'street'>('code');
  const [phone, setPhone] = useState('');
  const [code, setCode] = useState('');
  const [street, setStreet] = useState('');
  const [searching, setSearching] = useState(false);
  const [results, setResults] = useState<LookedUpOrder[] | null>(null);
  const [deviceOrders, setDeviceOrders] = useState<DeviceOrder[]>([]);

  useEffect(() => {
    setMounted(true);
    setDeviceOrders(loadDeviceOrders());
  }, []);

  const open = (o: LookedUpOrder) => {
    saveOrderSession(o.token, o.accessJwt);
    rememberDeviceOrder({ token: o.token, orderCode: o.orderCode, total: o.total, createdAt: o.createdAt });
    router.push(orderLinkPath(o.token));
  };

  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault();
    const secret = mode === 'code' ? code.trim() : street.trim();
    if (!phone.trim() || !secret) return;
    setSearching(true);
    setResults(null);
    try {
      const res = await orderApi.post('/orders/public/lookup', {
        phone: phone.trim(),
        ...(mode === 'code' ? { securityCode: secret } : { street: secret }),
      });
      const found: LookedUpOrder[] = res.data.data.orders;
      if (found.length === 1) {
        open(found[0]);
        return;
      }
      setResults(found);
    } catch (err) {
      toast.error(errMsg(err, 'Không tìm thấy đơn hàng'));
    } finally {
      setSearching(false);
    }
  };

  const secretFilled = mode === 'code' ? code.trim() : street.trim();

  return (
    <Container maxWidth="sm" sx={{ py: { xs: 4, md: 7 } }}>
      <Paper elevation={0} sx={{ p: { xs: 3, md: 4 }, borderRadius: 4, border: '1px solid', borderColor: 'grey.200' }}>
        <Stack spacing={2.5}>
          <Box sx={{ textAlign: 'center' }}>
            <Box sx={{ width: 56, height: 56, mx: 'auto', mb: 1.5, borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', backgroundColor: '#EFF6FF' }}>
              <SearchOutlinedIcon sx={{ color: '#2563EB' }} />
            </Box>
            <Typography variant="h5" sx={{ fontWeight: 700 }}>Tra cứu đơn hàng</Typography>
            <Typography variant="body2" color="text.secondary" sx={{ mt: 0.5 }}>
              Dành cho đơn đặt không cần đăng nhập hoặc do Luxe Glow tạo cho bạn.
            </Typography>
          </Box>

          {mounted && isAuthenticated && (
            <Alert severity="info" sx={{ borderRadius: 3 }}>
              Đơn đặt khi đã đăng nhập nằm trong <Link href="/orders" style={{ color: 'inherit', fontWeight: 600 }}>Đơn hàng của tôi</Link>.
            </Alert>
          )}

          <Tabs value={mode} onChange={(_, v) => { setMode(v); setResults(null); }} variant="fullWidth">
            <Tab value="code" label="Mã bảo mật" sx={{ textTransform: 'none', fontWeight: 600 }} />
            <Tab value="street" label="Quên mã bảo mật" sx={{ textTransform: 'none', fontWeight: 600 }} />
          </Tabs>

          <Box component="form" onSubmit={handleSearch}>
            <Stack spacing={2}>
              <TextField
                label="Số điện thoại nhận hàng"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                placeholder="VD: 0909064680"
                fullWidth
                autoComplete="tel"
                slotProps={{ htmlInput: { inputMode: 'tel' } }}
              />
              {mode === 'code' ? (
                <TextField
                  label="Mã bảo mật (8 ký tự)"
                  value={code}
                  onChange={(e) => setCode(e.target.value.toUpperCase())}
                  placeholder="VD: A2B3C4D5"
                  fullWidth
                  autoComplete="one-time-code"
                  slotProps={{ htmlInput: { maxLength: 8, style: { letterSpacing: 4, textTransform: 'uppercase', fontFamily: 'monospace' } } }}
                />
              ) : (
                <TextField
                  label="Số nhà, tên đường nhận hàng"
                  value={street}
                  onChange={(e) => setStreet(e.target.value)}
                  placeholder="VD: 123 Nguyễn Huệ"
                  fullWidth
                  autoComplete="street-address"
                  helperText="Nhập như lúc đặt hàng — không phân biệt hoa thường, dấu và dấu câu"
                />
              )}
              <Button
                type="submit"
                variant="contained"
                size="large"
                disabled={searching || !phone.trim() || !secretFilled}
                sx={{ borderRadius: 980, fontWeight: 600, textTransform: 'none' }}
              >
                {searching ? 'Đang tìm...' : 'Tra cứu'}
              </Button>
            </Stack>
          </Box>
          <Typography variant="caption" color="text.secondary" sx={{ textAlign: 'center' }}>
            Nhập sai 5 lần liên tiếp, các đơn của số điện thoại này sẽ tạm khoá tra cứu 15 phút.
          </Typography>
        </Stack>
      </Paper>

      {results && results.length > 1 && (
        <Box sx={{ mt: 3 }}>
          <Typography variant="subtitle1" sx={{ fontWeight: 700, mb: 1.5 }}>Tìm thấy {results.length} đơn hàng</Typography>
          <Stack spacing={1.5}>
            {results.map((o) => {
              const st = ORDER_STATUS_MAP[o.status] || { label: o.status, chipSx: {} };
              return (
                <Card key={o.token} variant="outlined" sx={{ borderRadius: 3 }}>
                  <CardActionArea onClick={() => open(o)}>
                    <CardContent sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                      <Box sx={{ flex: 1, minWidth: 0 }}>
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, flexWrap: 'wrap' }}>
                          <Typography sx={{ fontWeight: 700 }}>#{o.orderCode}</Typography>
                          <Chip size="small" label={st.label} variant="outlined" sx={st.chipSx} />
                        </Box>
                        <Typography variant="body2" color="text.secondary" sx={{ overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                          {o.firstItemName}{o.itemCount > 1 ? ` · ${o.itemCount} sản phẩm` : ''}
                        </Typography>
                        <Typography variant="caption" color="text.disabled">{formatDate(o.createdAt)} · {formatCurrency(o.total)}</Typography>
                      </Box>
                      <ChevronRightIcon color="action" />
                    </CardContent>
                  </CardActionArea>
                </Card>
              );
            })}
          </Stack>
        </Box>
      )}

      {mounted && deviceOrders.length > 0 && (
        <Box sx={{ mt: 4 }}>
          <Typography variant="subtitle1" sx={{ fontWeight: 700 }}>Đơn đã đặt trên thiết bị này</Typography>
          <Typography variant="caption" color="text.secondary" sx={{ display: 'block', mb: 1.5 }}>
            Mở đơn rồi nhập số điện thoại + mã bảo mật (hoặc địa chỉ nhận hàng).
          </Typography>
          <Stack spacing={1}>
            {deviceOrders.map((o) => (
              <Card key={o.token} variant="outlined" sx={{ borderRadius: 3 }}>
                <CardActionArea component={Link} href={orderLinkPath(o.token)}>
                  <CardContent sx={{ display: 'flex', alignItems: 'center', gap: 2, py: 1.5 }}>
                    <Box sx={{ flex: 1 }}>
                      <Typography sx={{ fontWeight: 600 }}>#{o.orderCode}</Typography>
                      <Typography variant="caption" color="text.secondary">{formatDate(o.createdAt)} · {formatCurrency(o.total)}</Typography>
                    </Box>
                    <ChevronRightIcon color="action" />
                  </CardContent>
                </CardActionArea>
              </Card>
            ))}
          </Stack>
        </Box>
      )}
    </Container>
  );
}

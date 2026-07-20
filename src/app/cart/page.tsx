'use client';

import Image from 'next/image';
import Link from 'next/link';
import {
  Box, Container, Typography, Grid, Card, CardContent,
  IconButton, Button, Divider, Stack, alpha,
} from '@mui/material';
import ShoppingBagOutlinedIcon from '@mui/icons-material/ShoppingBagOutlined';
import DeleteOutlineIcon from '@mui/icons-material/DeleteOutlined';
import ArrowForwardIcon from '@mui/icons-material/ArrowForward';
import { useCartStore } from '@/lib/store/cart.store';
import { formatCurrency } from '@/lib/utils';
import { useAuthStore } from '@/lib/store/auth.store';
import { useRouter } from 'next/navigation';
import toast from 'react-hot-toast';

export default function CartPage() {
  const { items, updateQuantity, removeItem, total } = useCartStore();
  const { isAuthenticated } = useAuthStore();
  const router = useRouter();

  const handleCheckout = () => {
    if (!isAuthenticated) {
      toast.error('Vui lòng đăng nhập để tiếp tục');
      router.push('/auth/login?redirect=/checkout');
      return;
    }
    router.push('/checkout');
  };

  if (items.length === 0) {
    return (
      <Box sx={{ minHeight: '60vh', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: 3, px: 2 }}>
        <Box sx={{ width: 96, height: 96, borderRadius: '50%', bgcolor: 'grey.100', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <ShoppingBagOutlinedIcon sx={{ fontSize: 48, color: 'grey.300' }} />
        </Box>
        <Box sx={{ textAlign: 'center' }}>
          <Typography variant="h5" gutterBottom sx={{ fontWeight: 700 }}>Giỏ hàng trống</Typography>
          <Typography color="text.secondary" sx={{ mb: 3 }}>Hãy thêm sản phẩm vào giỏ hàng của bạn</Typography>
          <Button component={Link} href="/products" variant="contained" size="large">Khám phá sản phẩm</Button>
        </Box>
      </Box>
    );
  }

  return (
    <Container maxWidth="md" sx={{ py: { xs: 4, md: 7 } }}>
      <Typography variant="h4" sx={{ mb: 4, fontWeight: 700  }}>Giỏ hàng ({items.length})</Typography>
      <Grid container spacing={4}>
        {/* Items */}
        <Grid size={{ xs: 12, lg: 8 }}>
          <Stack spacing={2}>
            {items.map((item) => (
              <Card key={`${item.productId}-${item.color ?? ''}-${item.size ?? ''}`} variant="outlined" sx={{ borderRadius: 3 }}>
                <CardContent sx={{ p: 2.5, '&:last-child': { pb: 2.5 } }}>
                  <Box sx={{ display: 'flex', gap: 2 }}>
                    <Box sx={{ position: 'relative', width: 80, height: 80, borderRadius: 2, overflow: 'hidden', bgcolor: 'grey.50', flexShrink: 0 }}>
                      {item.productImage ? (
                        <Image src={item.productImage} alt={item.productName} fill sizes="80px" style={{ objectFit: 'cover' }} />
                      ) : (
                        <Box sx={{ width: '100%', height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'grey.300' }}>
                          <ShoppingBagOutlinedIcon />
                        </Box>
                      )}
                    </Box>
                    <Box sx={{ flex: 1, minWidth: 0 }}>
                      <Typography component={Link} href={`/products/${item.slug}`} variant="body2"
                        sx={{ display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical', overflow: 'hidden', textDecoration: 'none', color: 'text.primary', '&:hover': { color: 'primary.main' }, fontWeight: 500  }}>
                        {item.productName}
                      </Typography>
                      {(item.color || item.size) && (
                        <Typography variant="caption" color="text.secondary" sx={{ display: 'block', mt: 0.25 }}>
                          {[item.color, item.size].filter(Boolean).join(' · ')}
                        </Typography>
                      )}
                      <Typography variant="body2" color="primary.main" sx={{ mt: 0.5, fontWeight: 700  }}>{formatCurrency(item.price)}</Typography>
                      <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mt: 1.5 }}>
                        <Box sx={{ display: 'flex', alignItems: 'center', border: '1px solid', borderColor: 'divider', borderRadius: 1.5, overflow: 'hidden' }}>
                          <IconButton size="small" sx={{ borderRadius: 0, px: 1.5 }} onClick={() => updateQuantity(item.productId, item.color, item.size, item.quantity - 1)}>-</IconButton>
                          <Typography sx={{ px: 2, py: 0.5, fontWeight: 600, fontSize: 14 }}>{item.quantity}</Typography>
                          <IconButton size="small" sx={{ borderRadius: 0, px: 1.5 }} onClick={() => updateQuantity(item.productId, item.color, item.size, item.quantity + 1)}>+</IconButton>
                        </Box>
                        <IconButton onClick={() => removeItem(item.productId, item.color, item.size)} sx={{ color: 'text.disabled', '&:hover': { color: 'error.main', bgcolor: alpha('#FF3B30', 0.06) } }}>
                          <DeleteOutlineIcon fontSize="small" />
                        </IconButton>
                      </Box>
                    </Box>
                  </Box>
                </CardContent>
              </Card>
            ))}
          </Stack>
        </Grid>

        {/* Summary */}
        <Grid size={{ xs: 12, lg: 4 }}>
          <Card variant="outlined" sx={{ borderRadius: 3, position: 'sticky', top: 88 }}>
            <CardContent sx={{ p: 3 }}>
              <Typography variant="h6" gutterBottom sx={{ fontWeight: 700 }}>Tóm tắt đơn hàng</Typography>
              <Stack spacing={1.5} sx={{ mb: 2.5 }}>
                <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                  <Typography variant="body2" color="text.secondary">Tạm tính</Typography>
                  <Typography variant="body2" sx={{ fontWeight: 500 }}>{formatCurrency(total())}</Typography>
                </Box>
                <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                  <Typography variant="body2" color="text.secondary">Phí vận chuyển</Typography>
                  <Typography variant="body2" color="success.main" sx={{ fontWeight: 600 }}>Miễn phí</Typography>
                </Box>
              </Stack>
              <Divider sx={{ mb: 2 }} />
              <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 3 }}>
                <Typography sx={{ fontWeight: 700 }}>Tổng cộng</Typography>
                <Typography color="primary.main" variant="h6" sx={{ fontWeight: 700 }}>{formatCurrency(total())}</Typography>
              </Box>
              <Button fullWidth variant="contained" size="large" endIcon={<ArrowForwardIcon />} onClick={handleCheckout} sx={{ py: 1.5, fontWeight: 600 }}>Tiến hành đặt hàng</Button>
            </CardContent>
          </Card>
        </Grid>
      </Grid>
    </Container>
  );
}

'use client';

import { useQuery } from '@tanstack/react-query';
import { useAuthStore } from '@/lib/store/auth.store';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import Link from 'next/link';
import {
  Box, Container, Typography, Card, CardActionArea, CardContent,
  Chip, Skeleton, Stack,
} from '@mui/material';
import ReceiptLongOutlinedIcon from '@mui/icons-material/ReceiptLongOutlined';
import api from '@/lib/api';
import { formatCurrency, formatDate, ORDER_STATUS_MAP } from '@/lib/utils';
import type { ApiResponse, Order } from '@/types';
import { Button } from '@mui/material';

export default function OrdersPage() {
  const { isAuthenticated } = useAuthStore();
  const router = useRouter();
  const [mounted, setMounted] = useState(false);

  useEffect(() => { setMounted(true); }, []);

  useEffect(() => {
    if (!mounted) return;
    if (!isAuthenticated) router.replace('/auth/login?redirect=/orders');
  }, [mounted, isAuthenticated, router]);

  const { data, isLoading } = useQuery({
    queryKey: ['orders'],
    queryFn: async () => {
      const res = await api.get<ApiResponse<{ data: Order[] }>>('/orders');
      return res.data.data.data;
    },
    enabled: isAuthenticated,
  });

  if (!mounted) return null;
  if (!isAuthenticated) return (
    <Container maxWidth="sm" sx={{ py: 7 }}>
      <Stack spacing={2}>
        {Array.from({ length: 3 }).map((_, i) => <Skeleton key={i} variant="rounded" height={110} sx={{ borderRadius: 3 }} />)}
      </Stack>
    </Container>
  );

  if (isLoading) {
    return (
      <Container maxWidth="sm" sx={{ py: 7 }}>
        <Stack spacing={2}>
          {Array.from({ length: 3 }).map((_, i) => <Skeleton key={i} variant="rounded" height={110} sx={{ borderRadius: 3 }} />)}
        </Stack>
      </Container>
    );
  }

  if (!data?.length) {
    return (
      <Box sx={{ minHeight: '60vh', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: 3 }}>
        <Box sx={{ width: 96, height: 96, borderRadius: '50%', bgcolor: 'grey.100', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <ReceiptLongOutlinedIcon sx={{ fontSize: 48, color: 'grey.300' }} />
        </Box>
        <Box sx={{ textAlign: 'center' }}>
          <Typography variant="h5" gutterBottom sx={{ fontWeight: 700 }}>Chưa có đơn hàng</Typography>
          <Typography color="text.secondary" sx={{ mb: 3 }}>Hãy đặt hàng để trải nghiệm dịch vụ của chúng tôi</Typography>
          <Button component={Link} href="/products" variant="contained" size="large">Mua ngay</Button>
        </Box>
      </Box>
    );
  }

  return (
    <Container maxWidth="sm" sx={{ py: { xs: 4, md: 7 } }}>
      <Typography variant="h4" sx={{ mb: 4, fontWeight: 700  }}>Đơn hàng của tôi</Typography>
      <Stack spacing={2}>
        {data.map((order) => {
          const statusInfo = ORDER_STATUS_MAP[order.status] || { label: order.status, chipColor: 'default' };
          return (
            <Card key={order._id} variant="outlined" sx={{ borderRadius: 3 }}>
              <CardActionArea component={Link} href={`/orders/${order._id}`} sx={{ p: 0 }}>
                <CardContent sx={{ p: 2.5 }}>
                  <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 1.5 }}>
                    <Box>
                      <Typography variant="caption" color="text.disabled" sx={{ display: 'block' }}>#{order._id.slice(-8).toUpperCase()}</Typography>
                      <Typography variant="caption" color="text.disabled">{formatDate(order.createdAt)}</Typography>
                    </Box>
                    <Chip
                      label={statusInfo.label}
                      size="small"
                      variant="outlined"
                      sx={statusInfo.chipSx}
                    />
                  </Box>
                  <Typography variant="body2" color="text.secondary" sx={{ mb: 1.5, display: '-webkit-box', WebkitLineClamp: 1, WebkitBoxOrient: 'vertical', overflow: 'hidden' }}>
                    {order.items[0]?.productName}{order.items.length > 1 && ` và ${order.items.length - 1} sản phẩm khác`}
                  </Typography>
                  <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                    <Typography variant="body2" color="text.secondary">{order.items.length} sản phẩm</Typography>
                    <Typography variant="body2" color="primary.main" sx={{ fontWeight: 700 }}>{formatCurrency(order.total)}</Typography>
                  </Box>
                </CardContent>
              </CardActionArea>
            </Card>
          );
        })}
      </Stack>
    </Container>
  );
}

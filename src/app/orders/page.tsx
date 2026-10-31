'use client';

import { useInfiniteQuery } from '@tanstack/react-query';
import { useAuthStore } from '@/lib/store/auth.store';
import { useRouter, useSearchParams } from 'next/navigation';
import { Suspense, useEffect, useState } from 'react';
import Link from 'next/link';
import {
  Box, Container, Typography, Card, CardActionArea, CardContent,
  Chip, Skeleton, Stack, Tabs, Tab, Button, CircularProgress,
} from '@mui/material';
import ReceiptLongOutlinedIcon from '@mui/icons-material/ReceiptLongOutlined';
import api from '@/lib/api';
import { formatCurrency, formatDate, ORDER_STATUS_MAP, RETURN_STATUS_MAP } from '@/lib/utils';
import { loginHref } from '@/lib/auth-redirect';
import type { ApiResponse, Order, OrderStatus, PaginatedResponse } from '@/types';

const PAGE_SIZE = 10;

/** 'RETURN' is not an order status: it lists orders with a return/refund request (Shopee's
 * "Trả hàng/Hoàn tiền" tab). */
type OrdersTab = OrderStatus | 'ALL' | 'RETURN';

const STATUS_TABS: { value: OrdersTab; label: string }[] = [
  { value: 'ALL', label: 'Tất cả' },
  { value: 'PENDING', label: ORDER_STATUS_MAP.PENDING.label },
  { value: 'CONFIRMED', label: ORDER_STATUS_MAP.CONFIRMED.label },
  { value: 'PROCESSING', label: ORDER_STATUS_MAP.PROCESSING.label },
  { value: 'SHIPPED', label: ORDER_STATUS_MAP.SHIPPED.label },
  { value: 'DELIVERED', label: ORDER_STATUS_MAP.DELIVERED.label },
  { value: 'CANCELLED', label: ORDER_STATUS_MAP.CANCELLED.label },
  { value: 'RETURN', label: 'Trả hàng/Hoàn tiền' },
];

function parseTab(raw: string | null): OrdersTab {
  return STATUS_TABS.some((t) => t.value === raw) ? (raw as OrdersTab) : 'ALL';
}

function ListSkeleton() {
  return (
    <Stack spacing={2}>
      {Array.from({ length: 3 }).map((_, i) => <Skeleton key={i} variant="rounded" height={110} sx={{ borderRadius: 3 }} />)}
    </Stack>
  );
}

export default function OrdersPage() {
  return (
    <Suspense fallback={<Container maxWidth="sm" sx={{ py: 7 }}><ListSkeleton /></Container>}>
      <OrdersContent />
    </Suspense>
  );
}

function OrdersContent() {
  const { isAuthenticated } = useAuthStore();
  const router = useRouter();
  const searchParams = useSearchParams();
  // The tab lives in the URL so "back" from an order detail returns to the same tab.
  const status = parseTab(searchParams.get('status'));
  const [mounted, setMounted] = useState(false);

  useEffect(() => { setMounted(true); }, []);

  useEffect(() => {
    if (!mounted) return;
    if (!isAuthenticated) router.replace(loginHref(status === 'ALL' ? '/orders' : `/orders?status=${status}`));
  }, [mounted, isAuthenticated, router, status]);

  const {
    data, isLoading, isError, refetch, fetchNextPage, hasNextPage, isFetchingNextPage,
  } = useInfiniteQuery({
    queryKey: ['orders', status],
    queryFn: async ({ pageParam }) => {
      const res = await api.get<ApiResponse<PaginatedResponse<Order>>>('/orders', {
        params: {
          page: pageParam,
          limit: PAGE_SIZE,
          ...(status === 'ALL' ? {} : status === 'RETURN' ? { hasReturn: 'true' } : { status }),
        },
      });
      return res.data.data;
    },
    initialPageParam: 1,
    getNextPageParam: (last) => (last.page * last.limit < last.total ? last.page + 1 : undefined),
    enabled: isAuthenticated,
  });

  // Offset paging can repeat a row if an order changes status between two page loads.
  const orders = (data?.pages.flatMap((p) => p.data) ?? [])
    .filter((o, i, all) => all.findIndex((x) => x._id === o._id) === i);
  const total = data?.pages[0]?.total ?? 0;

  const changeTab = (value: OrdersTab) => {
    router.replace(value === 'ALL' ? '/orders' : `/orders?status=${value}`, { scroll: false });
  };

  if (!mounted) return null;

  // No order at all → the original "start shopping" screen, without tabs.
  if (isAuthenticated && !isLoading && !isError && status === 'ALL' && !orders.length) {
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
      <Typography variant="h4" sx={{ mb: 2, fontWeight: 700 }}>Đơn hàng của tôi</Typography>

      <Tabs
        value={status}
        onChange={(_, v) => changeTab(v)}
        variant="scrollable"
        scrollButtons="auto"
        allowScrollButtonsMobile
        sx={{ mb: 3, borderBottom: 1, borderColor: 'divider', '& .MuiTab-root': { textTransform: 'none', fontWeight: 600, minWidth: 0, px: 2 } }}
      >
        {STATUS_TABS.map((t) => <Tab key={t.value} value={t.value} label={t.label} />)}
      </Tabs>

      {!isAuthenticated || isLoading ? (
        <ListSkeleton />
      ) : isError ? (
        <Box sx={{ textAlign: 'center', py: 6 }}>
          <Typography color="text.secondary" sx={{ mb: 2 }}>Không tải được danh sách đơn hàng</Typography>
          <Button variant="outlined" onClick={() => refetch()}>Thử lại</Button>
        </Box>
      ) : !orders.length ? (
        <Box sx={{ textAlign: 'center', py: 8 }}>
          <ReceiptLongOutlinedIcon sx={{ fontSize: 48, color: 'grey.300', mb: 1 }} />
          <Typography color="text.secondary">Không có đơn hàng nào ở trạng thái này</Typography>
        </Box>
      ) : (
        <>
          <Stack spacing={2}>
            {orders.map((order) => <OrderCard key={order._id} order={order} />)}
          </Stack>

          {hasNextPage ? (
            <Box sx={{ display: 'flex', justifyContent: 'center', mt: 3 }}>
              <Button
                variant="outlined"
                onClick={() => fetchNextPage()}
                disabled={isFetchingNextPage}
                startIcon={isFetchingNextPage ? <CircularProgress size={16} /> : undefined}
                sx={{ borderRadius: 980, px: 4 }}
              >
                {isFetchingNextPage ? 'Đang tải...' : `Xem thêm (${total - orders.length})`}
              </Button>
            </Box>
          ) : orders.length > PAGE_SIZE ? (
            <Typography variant="caption" color="text.disabled" sx={{ display: 'block', textAlign: 'center', mt: 3 }}>
              Đã hiển thị tất cả {total} đơn hàng
            </Typography>
          ) : null}
        </>
      )}
    </Container>
  );
}

function OrderCard({ order }: { order: Order }) {
  const statusInfo = ORDER_STATUS_MAP[order.status] || { label: order.status, chipSx: {} };
  const cancelRequested = !!order.cancelRequest && (order.status === 'CONFIRMED' || order.status === 'PROCESSING');
  return (
    <Card variant="outlined" sx={{ borderRadius: 3 }}>
      <CardActionArea component={Link} href={`/orders/${order._id}`} sx={{ p: 0 }}>
        <CardContent sx={{ p: 2.5 }}>
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 1.5 }}>
            <Box>
              <Typography variant="caption" color="text.disabled" sx={{ display: 'block' }}>#{order._id.slice(-8).toUpperCase()}</Typography>
              <Typography variant="caption" color="text.disabled">{formatDate(order.createdAt)}</Typography>
            </Box>
            <Stack direction="row" spacing={0.75} sx={{ flexWrap: 'wrap', justifyContent: 'flex-end' }}>
              {order.returnRequest && (
                <Chip
                  label={`Trả hàng: ${RETURN_STATUS_MAP[order.returnRequest.status]?.label ?? order.returnRequest.status}`}
                  size="small"
                  variant="outlined"
                  sx={RETURN_STATUS_MAP[order.returnRequest.status]?.chipSx}
                />
              )}
              {cancelRequested && (
                <Chip label="Đã yêu cầu hủy" size="small" variant="outlined" color="warning" sx={{ fontWeight: 600 }} />
              )}
              <Chip label={statusInfo.label} size="small" variant="outlined" sx={statusInfo.chipSx} />
            </Stack>
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
}

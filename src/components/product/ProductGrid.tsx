'use client';

import { useQuery } from '@tanstack/react-query';
import { useSearchParams, useRouter, usePathname } from 'next/navigation';
import Link from 'next/link';
import { Grid, Box, Typography, Skeleton, Pagination, Stack, Button } from '@mui/material';
import ArrowForwardIcon from '@mui/icons-material/ArrowForward';
import api from '@/lib/api';
import { ProductCard } from './ProductCard';
import type { Product, ApiResponse } from '@/types';

const PAGE_SIZE = 12;
const PREVIEW_SIZE = 8;

export function ProductGrid({ variant = 'full' }: { variant?: 'full' | 'preview' }) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const category = searchParams.get('category') || '';
  const search = searchParams.get('q') || '';
  const page = variant === 'preview' ? 1 : Number(searchParams.get('page') || 1);
  const sort = searchParams.get('sort') || '';
  const limit = variant === 'preview' ? PREVIEW_SIZE : PAGE_SIZE;

  const { data, isLoading, isError } = useQuery({
    queryKey: ['products', { category, search, page, sort, variant }],
    queryFn: async () => {
      const params = new URLSearchParams();
      if (category) params.set('category', category);
      if (search) params.set('search', search);
      params.set('page', String(page));
      params.set('limit', String(limit));
      if (sort === 'price_asc') { params.set('sortBy', 'finalPrice'); params.set('sortOrder', 'asc'); }
      if (sort === 'price_desc') { params.set('sortBy', 'finalPrice'); params.set('sortOrder', 'desc'); }
      const res = await api.get<ApiResponse<{ data: Product[]; total: number; totalPages: number }>>(`/products?${params}`);
      return res.data.data;
    },
  });

  const handlePageChange = (_: unknown, value: number) => {
    const params = new URLSearchParams(searchParams.toString());
    if (value > 1) params.set('page', String(value));
    else params.delete('page');
    router.push(`${pathname}?${params.toString()}`);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  if (isLoading) {
    return (
      <Grid container spacing={2.5}>
        {Array.from({ length: 8 }).map((_, i) => (
          <Grid key={i} size={{ xs: 6, md: 4, lg: 3 }}>
            <Skeleton variant="rounded" sx={{ aspectRatio: '1/1', width: '100%' }} />
            <Skeleton variant="text" sx={{ mt: 1 }} />
            <Skeleton variant="text" width="60%" />
          </Grid>
        ))}
      </Grid>
    );
  }

  if (isError || !data?.data?.length) {
    return (
      <Box sx={{ textAlign: 'center', py: 12 }}>
        <Typography color="text.secondary" variant="h6">
          {isError ? 'Không thể tải sản phẩm. Vui lòng thử lại.' : 'Không có sản phẩm nào.'}
        </Typography>
      </Box>
    );
  }

  const totalPages = data.totalPages;

  return (
    <>
      <Grid container spacing={2.5}>
        {data.data.map((product) => (
          <Grid key={product._id} size={{ xs: 6, md: 4, lg: 3 }}>
            <ProductCard product={product} />
          </Grid>
        ))}
      </Grid>
      {variant === 'preview' ? (
        <Stack sx={{ mt: 5, alignItems: 'center' }}>
          <Button component={Link} href="/products" variant="outlined" size="large" endIcon={<ArrowForwardIcon />} sx={{ px: 4, py: 1.25 }}>
            Xem thêm sản phẩm
          </Button>
        </Stack>
      ) : totalPages > 1 && (
        <Stack sx={{ mt: 5, alignItems: 'center' }}>
          <Pagination
            count={totalPages}
            page={Math.min(page, totalPages)}
            onChange={handlePageChange}
            color="primary"
            shape="rounded"
          />
        </Stack>
      )}
    </>
  );
}

'use client';

import { useQuery } from '@tanstack/react-query';
import { useSearchParams } from 'next/navigation';
import { Grid, Box, Typography, Skeleton } from '@mui/material';
import api from '@/lib/api';
import { ProductCard } from './ProductCard';
import type { Product, ApiResponse } from '@/types';

export function ProductGrid() {
  const searchParams = useSearchParams();
  const category = searchParams.get('category') || '';
  const search = searchParams.get('q') || '';
  const page = Number(searchParams.get('page') || 1);
  const sort = searchParams.get('sort') || '';

  const { data, isLoading, isError } = useQuery({
    queryKey: ['products', { category, search, page, sort }],
    queryFn: async () => {
      const params = new URLSearchParams();
      if (category) params.set('category', category);
      if (search) params.set('search', search);
      params.set('page', String(page));
      params.set('limit', '12');
      if (sort === 'price_asc') { params.set('sortBy', 'finalPrice'); params.set('sortOrder', 'asc'); }
      if (sort === 'price_desc') { params.set('sortBy', 'finalPrice'); params.set('sortOrder', 'desc'); }
      const res = await api.get<ApiResponse<{ data: Product[]; total: number }>>(`/products?${params}`);
      return res.data.data;
    },
  });

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

  return (
    <Grid container spacing={2.5}>
      {data.data.map((product) => (
        <Grid key={product._id} size={{ xs: 6, md: 4, lg: 3 }}>
          <ProductCard product={product} />
        </Grid>
      ))}
    </Grid>
  );
}

'use client';

import { useQuery } from '@tanstack/react-query';
import { useSearchParams, useRouter, usePathname } from 'next/navigation';
import { Box, Chip, Skeleton } from '@mui/material';
import api from '@/lib/api';
import type { ApiResponse, Category } from '@/types';

export function CategoryFilter() {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const activeCategory = searchParams.get('category') || '';

  const { data, isLoading } = useQuery({
    queryKey: ['categories'],
    queryFn: async () => {
      const res = await api.get<ApiResponse<Category[]>>('/categories');
      return res.data.data;
    },
    staleTime: 5 * 60 * 1000,
  });

  const setCategory = (slug: string) => {
    const params = new URLSearchParams(searchParams.toString());
    if (slug) params.set('category', slug);
    else params.delete('category');
    params.delete('page');
    router.push(`${pathname}?${params.toString()}`);
  };

  return (
    <Box sx={{ display: 'flex', gap: 1, mb: 4, overflowX: 'auto', pb: 0.5, '&::-webkit-scrollbar': { display: 'none' } }}>
      {isLoading ? (
        Array.from({ length: 5 }).map((_, i) => <Skeleton key={i} variant="rounded" width={80} height={32} sx={{ borderRadius: 980, flexShrink: 0 }} />)
      ) : (
        <>
          <Chip
            label="Tất cả"
            onClick={() => setCategory('')}
            color={!activeCategory ? 'primary' : 'default'}
            variant={!activeCategory ? 'filled' : 'outlined'}
            sx={{ flexShrink: 0, fontWeight: !activeCategory ? 600 : 400 }}
          />
          {(data || []).map((cat) => (
            <Chip
              key={cat._id}
              label={cat.name}
              onClick={() => setCategory(cat.slug)}
              color={activeCategory === cat.slug ? 'primary' : 'default'}
              variant={activeCategory === cat.slug ? 'filled' : 'outlined'}
              sx={{ flexShrink: 0, fontWeight: activeCategory === cat.slug ? 600 : 400 }}
            />
          ))}
        </>
      )}
    </Box>
  );
}


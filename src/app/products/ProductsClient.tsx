'use client';
import { Suspense } from 'react';
import { Container, Box, Typography, Grid, Skeleton } from '@mui/material';
import { ProductGrid } from '@/components/product/ProductGrid';
import { CategoryFilter } from '@/components/product/CategoryFilter';
import { SearchBar } from '@/components/product/SearchBar';

export default function ProductsClient() {
  return (
    <Container maxWidth="lg" sx={{ py: { xs: 5, md: 7 } }}>
      <Box sx={{ mb: 4 }}>
        <Typography variant="h4" gutterBottom sx={{ fontWeight: 700 }}>Tất cả sản phẩm</Typography>
        <Typography variant="body1" color="text.secondary">Khám phá bộ sưu tập đèn in 3D của chúng tôi</Typography>
      </Box>
      <Suspense fallback={null}><SearchBar /></Suspense>
      <Suspense fallback={null}><CategoryFilter /></Suspense>
      <Suspense fallback={
        <Grid container spacing={2.5}>
          {Array.from({ length: 8 }).map((_, i) => (
            <Grid key={i} size={{ xs: 6, md: 4, lg: 3 }}>
              <Skeleton variant="rounded" sx={{ aspectRatio: '1/1', width: '100%' }} />
              <Skeleton variant="text" sx={{ mt: 1 }} />
              <Skeleton variant="text" width="60%" />
            </Grid>
          ))}
        </Grid>
      }>
        <ProductGrid />
      </Suspense>
    </Container>
  );
}

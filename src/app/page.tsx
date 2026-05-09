'use client';
import { Suspense } from 'react';
import { Container, Box, Typography, Grid, Skeleton } from '@mui/material';
import { HeroSection } from '@/components/layout/HeroSection';
import { ProductGrid } from '@/components/product/ProductGrid';
import { CategoryFilter } from '@/components/product/CategoryFilter';
import { FeaturesSection } from '@/components/layout/FeaturesSection';

export default function HomePage() {
  return (
    <>
      <HeroSection />

      <Container maxWidth="lg" sx={{ py: { xs: 6, md: 10 } }}>
        <Box sx={{ mb: 4 }}>
          <Typography variant="h4" gutterBottom sx={{ fontWeight: 700 }}>Sản phẩm nổi bật</Typography>
          <Typography variant="body1" color="text.secondary">Khám phá bộ sưu tập đèn in 3D handcraft của chúng tôi</Typography>
        </Box>
        <Suspense fallback={<CategoryFilterSkeleton />}>
          <CategoryFilter />
        </Suspense>
        <Suspense fallback={<ProductGridSkeleton />}>
          <ProductGrid />
        </Suspense>
      </Container>

      <FeaturesSection />
    </>
  );
}

function CategoryFilterSkeleton() {
  return (
    <Box sx={{ display: 'flex', gap: 1, mb: 4 }}>
      {Array.from({ length: 5 }).map((_, i) => <Skeleton key={i} variant="rounded" width={80} height={32} sx={{ borderRadius: 980, flexShrink: 0 }} />)}
    </Box>
  );
}

function ProductGridSkeleton() {
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

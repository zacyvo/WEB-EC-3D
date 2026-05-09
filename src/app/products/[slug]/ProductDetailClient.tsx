'use client';

import Image from 'next/image';
import { useState } from 'react';
import {
  Box, Container, Grid, Typography, Button, IconButton,
  Chip, Breadcrumbs, Divider, Stack, alpha,
} from '@mui/material';
import Link from 'next/link';
import ShoppingBagOutlinedIcon from '@mui/icons-material/ShoppingBagOutlined';
import ChevronLeftIcon from '@mui/icons-material/ChevronLeft';
import ChevronRightIcon from '@mui/icons-material/ChevronRight';
import InventoryOutlinedIcon from '@mui/icons-material/InventoryOutlined';
import { useCartStore } from '@/lib/store/cart.store';
import { formatCurrency } from '@/lib/utils';
import type { Product } from '@/types';
import toast from 'react-hot-toast';

export function ProductDetailClient({ product }: { product: Product }) {
  const [selectedImage, setSelectedImage] = useState(0);
  const [quantity, setQuantity] = useState(1);
  const addItem = useCartStore((s) => s.addItem);

  const handleAddToCart = () => {
    if (product.stock === 0) return;
    addItem({ productId: product._id, productName: product.name, productImage: product.images[0] || '', quantity, price: product.finalPrice, slug: product.slug });
    toast.success(`Đã thêm ${quantity} sản phẩm vào giỏ`);
  };

  const outOfStock = product.stock === 0;
  const hasDiscount = product.discountPercent > 0;

  return (
    <Container maxWidth="lg" sx={{ py: { xs: 4, md: 7 } }}>
      <Breadcrumbs sx={{ mb: 4, fontSize: 14 }}>
        <Link href="/" style={{ textDecoration: 'none', color: 'inherit' }}>Trang chủ</Link>
        <Link href="/products" style={{ textDecoration: 'none', color: 'inherit' }}>Sản phẩm</Link>
        <Typography variant="body2" color="text.primary" sx={{ maxWidth: 240, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{product.name}</Typography>
      </Breadcrumbs>

      <Grid container spacing={{ xs: 4, md: 8 }}>
        {/* Images */}
        <Grid size={{ xs: 12, lg: 6 }}>
          <Box sx={{ position: 'relative', aspectRatio: '1/1', borderRadius: 4, overflow: 'hidden', bgcolor: 'grey.50', mb: 2 }}>
            {product.images[selectedImage] ? (
              <Image src={product.images[selectedImage]} alt={product.name} fill priority
                sizes="(max-width: 1024px) 100vw, 50vw" style={{ objectFit: 'cover' }} />
            ) : (
              <Box sx={{ width: '100%', height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'grey.300' }}>
                <InventoryOutlinedIcon sx={{ fontSize: 80 }} />
              </Box>
            )}
            {product.images.length > 1 && (
              <>
                <IconButton size="small" onClick={() => setSelectedImage((p) => Math.max(0, p - 1))} disabled={selectedImage === 0}
                  sx={{ position: 'absolute', left: 12, top: '50%', transform: 'translateY(-50%)', bgcolor: 'rgba(255,255,255,0.85)', backdropFilter: 'blur(8px)', '&:disabled': { opacity: 0.3 } }}>
                  <ChevronLeftIcon />
                </IconButton>
                <IconButton size="small" onClick={() => setSelectedImage((p) => Math.min(product.images.length - 1, p + 1))} disabled={selectedImage === product.images.length - 1}
                  sx={{ position: 'absolute', right: 12, top: '50%', transform: 'translateY(-50%)', bgcolor: 'rgba(255,255,255,0.85)', backdropFilter: 'blur(8px)', '&:disabled': { opacity: 0.3 } }}>
                  <ChevronRightIcon />
                </IconButton>
              </>
            )}
          </Box>
          {product.images.length > 1 && (
            <Box sx={{ display: 'flex', gap: 1, overflowX: 'auto', '&::-webkit-scrollbar': { display: 'none' } }}>
              {product.images.map((img, i) => (
                <Box key={i} onClick={() => setSelectedImage(i)} sx={{ flexShrink: 0, width: 64, height: 64, borderRadius: 2, overflow: 'hidden', border: '2px solid', borderColor: i === selectedImage ? 'primary.main' : 'transparent', opacity: i === selectedImage ? 1 : 0.5, cursor: 'pointer', '&:hover': { opacity: 1 }, transition: 'all 0.15s' }}>
                  <Image src={img} alt="" width={64} height={64} style={{ objectFit: 'cover', width: '100%', height: '100%' }} />
                </Box>
              ))}
            </Box>
          )}
        </Grid>

        {/* Info */}
        <Grid size={{ xs: 12, lg: 6 }}>
          {typeof product.category === 'object' && (
            <Typography variant="body2" color="primary.main" gutterBottom sx={{ fontWeight: 600 }}>{product.category.name}</Typography>
          )}
          <Typography variant="h4" sx={{ lineHeight: 1.2, mb: 2, fontWeight: 700  }}>{product.name}</Typography>
          {product.shortDescription && (
            <Typography variant="body1" color="text.secondary" sx={{ mb: 3, lineHeight: 1.7 }}>{product.shortDescription}</Typography>
          )}

          <Stack direction="row" spacing={2} sx={{ mb: 1, alignItems: 'baseline'  }}>
            <Typography variant="h4" color="primary.main" sx={{ fontWeight: 700 }}>{formatCurrency(product.finalPrice)}</Typography>
            {hasDiscount && <Typography variant="h6" color="text.disabled" sx={{ textDecoration: 'line-through' }}>{formatCurrency(product.sellingPrice)}</Typography>}
          </Stack>
          {hasDiscount && <Typography variant="body2" color="success.main" sx={{ mb: 3, fontWeight: 600  }}>Tiết kiệm {product.discountPercent}% · {formatCurrency(product.sellingPrice - product.finalPrice)}</Typography>}

          <Stack direction="row" spacing={1.5} sx={{ mb: 4, alignItems: 'center'  }}>
            <Chip
              label={outOfStock ? 'Hết hàng' : product.stock <= 5 ? `Còn ${product.stock} sản phẩm` : 'Còn hàng'}
              size="small"
              color={outOfStock ? 'error' : product.stock <= 5 ? 'warning' : 'success'}
              variant="outlined"
            />
            {product.eta && !outOfStock && <Typography variant="body2" color="text.secondary">🚚 Giao trong {product.eta}</Typography>}
          </Stack>

          {!outOfStock && (
            <Stack direction="row" spacing={2} sx={{ mb: 3, alignItems: 'center'  }}>
              <Typography variant="body2" sx={{ fontWeight: 600 }}>Số lượng</Typography>
              <Box sx={{ display: 'flex', alignItems: 'center', border: '1px solid', borderColor: 'divider', borderRadius: 2, overflow: 'hidden' }}>
                <IconButton size="small" onClick={() => setQuantity((q) => Math.max(1, q - 1))} sx={{ borderRadius: 0 }}>-</IconButton>
                <Typography sx={{ px: 2.5, py: 0.75, minWidth: 40, textAlign: 'center', fontWeight: 600 }}>{quantity}</Typography>
                <IconButton size="small" onClick={() => setQuantity((q) => Math.min(product.stock, q + 1))} sx={{ borderRadius: 0 }}>+</IconButton>
              </Box>
            </Stack>
          )}

          <Button
            fullWidth variant="contained" size="large"
            onClick={handleAddToCart}
            disabled={outOfStock}
            startIcon={<ShoppingBagOutlinedIcon />}
            sx={{ py: 1.75, fontSize: '1rem', fontWeight: 600, mb: 2 }}
          >
            {outOfStock ? 'Hết hàng' : 'Thêm vào giỏ hàng'}
          </Button>

          {product.description && (
            <Box sx={{ mt: 4, pt: 4, borderTop: '1px solid', borderColor: 'divider' }}>
              <Typography variant="h6" gutterBottom sx={{ fontWeight: 700 }}>Mô tả sản phẩm</Typography>
              <Typography variant="body2" color="text.secondary" component="div" sx={{ lineHeight: 1.8 }}
                dangerouslySetInnerHTML={{ __html: product.description }} />
            </Box>
          )}
        </Grid>
      </Grid>
    </Container>
  );
}

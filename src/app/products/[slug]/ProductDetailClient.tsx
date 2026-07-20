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
  const hasColors = product.colors.length > 0;
  const hasSizes = product.sizes.length > 0;

  const [selectedImage, setSelectedImage] = useState(0);
  const [quantity, setQuantity] = useState(1);
  // Default-select the first option so a single-variant product needs no extra click
  const [selectedColorIdx, setSelectedColorIdx] = useState<number | null>(hasColors ? 0 : null);
  const [selectedSize, setSelectedSize] = useState<string | null>(hasSizes ? product.sizes[0] : null);
  const addItem = useCartStore((s) => s.addItem);

  const selectedColor = selectedColorIdx !== null ? product.colors[selectedColorIdx] : undefined;
  // Selecting a color swaps the gallery to that color's photos; falls back to the default images
  const activeImages = selectedColor?.images.length ? selectedColor.images : product.images;

  const handleSelectColor = (idx: number) => {
    setSelectedColorIdx(idx);
    setSelectedImage(0);
  };

  const handleAddToCart = () => {
    if (product.stock === 0) return;
    if (hasColors && !selectedColor) { toast.error('Vui lòng chọn màu'); return; }
    if (hasSizes && !selectedSize) { toast.error('Vui lòng chọn size'); return; }
    addItem({
      productId: product._id,
      productName: product.name,
      productImage: activeImages[0] || '',
      quantity,
      price: product.finalPrice,
      slug: product.slug,
      ...(selectedColor ? { color: selectedColor.name } : {}),
      ...(selectedSize ? { size: selectedSize } : {}),
    });
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
            {activeImages[selectedImage] ? (
              <Image src={activeImages[selectedImage]} alt={product.name} fill priority
                sizes="(max-width: 1024px) 100vw, 50vw" style={{ objectFit: 'cover' }} />
            ) : (
              <Box sx={{ width: '100%', height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'grey.300' }}>
                <InventoryOutlinedIcon sx={{ fontSize: 80 }} />
              </Box>
            )}
            {activeImages.length > 1 && (
              <>
                <IconButton size="small" onClick={() => setSelectedImage((p) => Math.max(0, p - 1))} disabled={selectedImage === 0}
                  sx={{ position: 'absolute', left: 12, top: '50%', transform: 'translateY(-50%)', bgcolor: 'rgba(255,255,255,0.85)', backdropFilter: 'blur(8px)', '&:disabled': { opacity: 0.3 } }}>
                  <ChevronLeftIcon />
                </IconButton>
                <IconButton size="small" onClick={() => setSelectedImage((p) => Math.min(activeImages.length - 1, p + 1))} disabled={selectedImage === activeImages.length - 1}
                  sx={{ position: 'absolute', right: 12, top: '50%', transform: 'translateY(-50%)', bgcolor: 'rgba(255,255,255,0.85)', backdropFilter: 'blur(8px)', '&:disabled': { opacity: 0.3 } }}>
                  <ChevronRightIcon />
                </IconButton>
              </>
            )}
          </Box>
          {activeImages.length > 1 && (
            <Box sx={{ display: 'flex', gap: 1, overflowX: 'auto', '&::-webkit-scrollbar': { display: 'none' } }}>
              {activeImages.map((img, i) => (
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

          {hasColors && (
            <Box sx={{ mb: 3 }}>
              <Typography variant="body2" sx={{ fontWeight: 600, mb: 1 }}>
                Màu sắc{selectedColor && <Box component="span" sx={{ color: 'text.secondary', fontWeight: 400 }}> · {selectedColor.name}</Box>}
              </Typography>
              <Stack direction="row" spacing={1.25} sx={{ flexWrap: 'wrap', rowGap: 1.25 }}>
                {product.colors.map((color, idx) => (
                  <Box
                    key={color.name}
                    onClick={() => handleSelectColor(idx)}
                    title={color.name}
                    sx={{
                      width: 36, height: 36, borderRadius: '50%', cursor: 'pointer',
                      bgcolor: color.hexCode || 'grey.200',
                      border: '2px solid', borderColor: idx === selectedColorIdx ? 'primary.main' : 'divider',
                      outline: idx === selectedColorIdx ? '2px solid' : 'none',
                      outlineColor: 'primary.main', outlineOffset: '2px',
                      display: 'flex', alignItems: 'center', justifyContent: 'center',
                      transition: 'transform 0.15s', '&:hover': { transform: 'scale(1.08)' },
                    }}
                  >
                    {!color.hexCode && (
                      <Typography variant="caption" sx={{ fontSize: 9, fontWeight: 700, color: 'text.secondary' }}>
                        {color.name.slice(0, 2).toUpperCase()}
                      </Typography>
                    )}
                  </Box>
                ))}
              </Stack>
            </Box>
          )}

          {hasSizes && (
            <Box sx={{ mb: 3 }}>
              <Typography variant="body2" sx={{ fontWeight: 600, mb: 1 }}>Size</Typography>
              <Stack direction="row" spacing={1} sx={{ flexWrap: 'wrap', rowGap: 1 }}>
                {product.sizes.map((size) => (
                  <Box
                    key={size}
                    onClick={() => setSelectedSize(size)}
                    sx={{
                      px: 2, py: 0.75, borderRadius: 2, cursor: 'pointer', fontSize: 14, fontWeight: 600,
                      border: '1.5px solid', borderColor: size === selectedSize ? 'primary.main' : 'divider',
                      color: size === selectedSize ? 'primary.main' : 'text.primary',
                      bgcolor: size === selectedSize ? alpha('#0071E3', 0.06) : 'transparent',
                      transition: 'all 0.15s',
                    }}
                  >
                    {size}
                  </Box>
                ))}
              </Stack>
            </Box>
          )}

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

'use client';

import Image from 'next/image';
import { useState } from 'react';
import {
  Box, Container, Grid, Typography, Button, IconButton,
  Chip, Breadcrumbs, Divider, Stack, Tooltip, SvgIcon, alpha,
} from '@mui/material';
import type { SvgIconProps } from '@mui/material';
import Link from 'next/link';
import ShoppingBagOutlinedIcon from '@mui/icons-material/ShoppingBagOutlined';
import ShoppingBagIcon from '@mui/icons-material/ShoppingBag';
import FacebookIcon from '@mui/icons-material/Facebook';
import InsertLinkIcon from '@mui/icons-material/InsertLink';
import ChevronLeftIcon from '@mui/icons-material/ChevronLeft';
import ChevronRightIcon from '@mui/icons-material/ChevronRight';
import InventoryOutlinedIcon from '@mui/icons-material/InventoryOutlined';
import { useCartStore } from '@/lib/store/cart.store';
import { formatCurrency } from '@/lib/utils';
import type { Product } from '@/types';
import toast from 'react-hot-toast';

function TikTokIcon(props: SvgIconProps) {
  return (
    <SvgIcon {...props} viewBox="0 0 24 24">
      <path d="M12.53.02C13.84 0 15.14.01 16.44 0c.08 1.53.63 3.09 1.75 4.17 1.12 1.11 2.7 1.62 4.24 1.79v4.03c-1.44-.05-2.89-.35-4.2-.97-.57-.26-1.1-.59-1.62-.93-.01 2.92.01 5.84-.02 8.75-.08 1.4-.54 2.79-1.35 3.94-1.31 1.92-3.58 3.17-5.91 3.21-1.43.08-2.86-.31-4.08-1.03-2.02-1.19-3.44-3.37-3.65-5.71-.02-.5-.03-1-.01-1.49.18-1.9 1.12-3.72 2.58-4.96 1.66-1.44 3.98-2.13 6.15-1.72.02 1.48-.04 2.96-.04 4.44-.99-.32-2.15-.23-3.02.37-.63.41-1.11 1.04-1.36 1.75-.21.51-.15 1.07-.14 1.61.24 1.64 1.82 3.02 3.5 2.87 1.12-.01 2.19-.66 2.77-1.61.19-.33.4-.67.41-1.06.1-1.79.06-3.57.07-5.36.01-4.03-.01-8.05.02-12.07z" />
    </SvgIcon>
  );
}

function ThreadsIcon(props: SvgIconProps) {
  return (
    <SvgIcon {...props} viewBox="0 0 24 24">
      <path d="M12.186 24h-.007c-3.581-.024-6.334-1.205-8.184-3.509C2.35 18.44 1.5 15.586 1.472 12.01v-.017c.03-3.579.879-6.43 2.525-8.482C5.845 1.205 8.6.024 12.181 0h.014c2.746.02 5.043.725 6.826 2.098 1.677 1.29 2.858 3.13 3.509 5.467l-2.04.569c-1.104-3.96-3.898-5.984-8.304-6.015-2.91.022-5.11.936-6.54 2.717C4.307 6.504 3.616 8.914 3.589 12c.027 3.086.718 5.496 2.057 7.164 1.43 1.781 3.63 2.695 6.54 2.717 2.623-.02 4.358-.631 5.8-2.045 1.647-1.613 1.618-3.593 1.09-4.798-.31-.71-.873-1.3-1.634-1.75-.192 1.352-.622 2.446-1.284 3.272-.886 1.102-2.14 1.704-3.73 1.79-1.202.065-2.361-.218-3.259-.801-1.063-.689-1.685-1.74-1.75-2.964-.065-1.19.408-2.285 1.33-3.082.885-.764 2.13-1.222 3.607-1.325a13.2 13.2 0 0 1 3.02.088c-.122-.74-.375-1.32-.75-1.727-.514-.557-1.284-.84-2.284-.84h-.028c-.807.007-1.874.223-2.56 1.284l-1.83-1.243c.92-1.398 2.404-2.168 4.383-2.176h.038c3.16 0 5.043 1.945 5.235 5.337.11.036.219.075.328.114 1.526.549 2.647 1.394 3.331 2.51.943 1.544 1.03 4.06-1.075 6.145-1.83 1.816-4.05 2.638-7.198 2.66zm1.144-11.5c-.115 0-.232.003-.35.01-1.741.099-2.828.9-2.77 2.04.06 1.185 1.353 1.732 2.597 1.665 1.147-.062 2.559-.542 2.797-3.278a8.9 8.9 0 0 0-2.274-.437" />
    </SvgIcon>
  );
}

const SOCIAL_META: Record<string, { label: string; icon: React.ReactNode; bg: string }> = {
  SHOPEE: { label: 'Shopee', icon: <ShoppingBagIcon sx={{ fontSize: 19 }} />, bg: '#EE4D2D' },
  FACEBOOK: { label: 'Facebook', icon: <FacebookIcon sx={{ fontSize: 20 }} />, bg: '#1877F2' },
  TIKTOK: { label: 'TikTok', icon: <TikTokIcon sx={{ fontSize: 17 }} />, bg: '#010101' },
  THREADS: { label: 'Threads', icon: <ThreadsIcon sx={{ fontSize: 17 }} />, bg: '#000000' },
  OTHER: { label: 'Khác', icon: <InsertLinkIcon sx={{ fontSize: 19 }} />, bg: '#8E8E93' },
};

export function ProductDetailClient({ product }: { product: Product }) {
  // Products saved before variants existed may lack these fields entirely
  const colors = product.colors ?? [];
  const sizes = product.sizes ?? [];
  const socials = product.socials ?? [];
  const hasColors = colors.length > 0;
  const hasSizes = sizes.length > 0;
  const hasSocials = socials.length > 0;

  const [selectedImage, setSelectedImage] = useState(0);
  const [quantity, setQuantity] = useState(1);
  // Default-select the first option so a single-variant product needs no extra click
  const [selectedColorIdx, setSelectedColorIdx] = useState<number | null>(hasColors ? 0 : null);
  const [selectedSize, setSelectedSize] = useState<string | null>(hasSizes ? sizes[0] : null);
  const addItem = useCartStore((s) => s.addItem);

  const selectedColor = selectedColorIdx !== null ? colors[selectedColorIdx] : undefined;
  // Selecting a color swaps the gallery to that color's photos; falls back to the default images
  const activeImages = selectedColor?.images.length ? selectedColor.images : (product.images ?? []);

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

          {product.video && (
            <Box sx={{ mt: 2, borderRadius: 4, overflow: 'hidden', bgcolor: 'common.black' }}>
              <Box
                component="video"
                src={product.video}
                controls
                playsInline
                preload="metadata"
                sx={{ width: '100%', maxHeight: 480, display: 'block' }}
              />
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
                {colors.map((color, idx) => (
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
                {sizes.map((size) => (
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

          {hasSocials && (
            <Stack direction="row" spacing={1.25} sx={{ mb: 2, flexWrap: 'wrap', rowGap: 1.25 }}>
              {socials.map((social, idx) => {
                const meta = SOCIAL_META[social.name] || SOCIAL_META.OTHER;
                return (
                  <Tooltip key={idx} title={meta.label} arrow>
                    <Box
                      component={social.link ? 'a' : 'div'}
                      {...(social.link ? { href: social.link, target: '_blank', rel: 'noopener noreferrer' } : {})}
                      aria-label={meta.label}
                      sx={{
                        width: 40, height: 40, borderRadius: '50%', bgcolor: meta.bg, color: '#fff',
                        display: 'flex', alignItems: 'center', justifyContent: 'center',
                        cursor: social.link ? 'pointer' : 'default',
                        opacity: social.link ? 1 : 0.4,
                        transition: 'transform 0.15s',
                        '&:hover': social.link ? { transform: 'scale(1.08)' } : {},
                      }}
                    >
                      {meta.icon}
                    </Box>
                  </Tooltip>
                );
              })}
            </Stack>
          )}

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
